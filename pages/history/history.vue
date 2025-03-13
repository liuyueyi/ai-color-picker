<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <!-- <uni-icons type="left" size="20" color="#fff" /> -->
      </view>
      <view class="navbar-title">History</view>
      <view class="navbar-right">
        <uni-icons type="trash" size="20" color="#333" @click="showDeleteConfirm" />
        <!-- 待添加一个分组检索功能 -->
        <!-- <uni-icons type="more-filled" size="20" color="#fff" style="margin-left: 15px;" /> -->
      </view>
    </view>
    
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-icons type="search" size="16" color="#666"/>
      <input 
        type="text" 
        v-model="searchKeyword"
        placeholder="搜索颜色名称"
        placeholder-class="search-placeholder"
      />
    </view>

    <!-- 历史记录列表 -->
    <view class="history-list" scroll-y>
      <view 
        class="history-item-wrapper" 
        v-for="(item, index) in filteredHistory" 
        :key="index"
        @touchstart="touchStart($event, index)"
        @touchmove="touchMove($event, index)"
        @touchend="touchEnd($event, index)"
      >
        <view class="history-item" :style="{ transform: `translateX(${item.offset || 0}px)` }" @click="goToColorDetail(item)">
          <view class="color-circle" :style="{ backgroundColor: item.hex }"></view>
          <view class="color-info">
            <view class="color-name">{{ item.name }}</view>
            <view class="color-hex">{{ item.hex }}</view>
            <view class="color-category">{{ item.category }}</view>
          </view>
          <view class="color-time">{{ formatDate(item.timestamp) }}</view>
          <view class="favorite-btn" @click.stop="toggleFavorite(item)">
            <uni-icons :type="isFavorite(item) ? 'star-filled' : 'star'" size="20" :color="isFavorite(item) ? '#FFD700' : '#999'" />
          </view>
        </view>
        <view class="delete-btn" @click="deleteHistoryItem(index)">
          <uni-icons type="trash" size="20" color="#fff" />
        </view>
      </view>
      
      <view class="empty-history" v-if="colorHistory.length === 0">
        <uni-icons type="info" size="64" color="#ccc" />
        <text>{{ searchKeyword ? 'No records found(未找到相關記錄)' : 'No History Records(暫無歷史記錄)' }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      colorHistory: [],
      favoriteColors: [],
      touchStartX: 0,
      touchStartY: 0,
      currentIndex: -1,
      deleteButtonWidth: 80,
      searchKeyword: '' // 添加搜索关键字
    }
  },
  onLoad() {
    this.loadHistory();
    this.loadFavoriteColors();
  },
  onShow() {
    // 每次显示页面时重新加载历史记录
    this.loadHistory();
    this.loadFavoriteColors();
  },
  computed: {
    filteredHistory() {
      if (!this.searchKeyword) return this.colorHistory;
      const keyword = this.searchKeyword.toLowerCase();
      return this.colorHistory.filter(item => 
        item.name.toLowerCase().includes(keyword)
      );
    }
  },
  methods: {
    // 加载历史记录
    loadHistory() {
      try {
        const history = uni.getStorageSync('colorHistory');
        if (history) {
          this.colorHistory = JSON.parse(history);
        }
      } catch (e) {
        console.error('读取历史记录失败', e);
        uni.showToast({
          title: '读取历史记录失败',
          icon: 'none'
        });
      }
    },
    
    // 加载收藏的颜色
    loadFavoriteColors() {
      try {
        const favorites = uni.getStorageSync('favoriteColors');
        if (favorites) {
          this.favoriteColors = JSON.parse(favorites);
        }
      } catch (e) {
        console.error('读取收藏颜色失败', e);
      }
    },
    
    // 检查颜色是否已收藏
    isFavorite(color) {
      return this.favoriteColors.some(item => item.hex === color.hex);
    },
    
    // 切换收藏状态
    toggleFavorite(color) {
      const index = this.favoriteColors.findIndex(item => item.hex === color.hex);
      if (index === -1) {
        // 添加到收藏
        this.favoriteColors.push(color);
        uni.showToast({
          title: '已添加到收藏',
          icon: 'success'
        });
      } else {
        // 取消收藏
        this.favoriteColors.splice(index, 1);
        uni.showToast({
          title: '已取消收藏',
          icon: 'none'
        });
      }
      // 保存到本地存储
      try {
        uni.setStorageSync('favoriteColors', JSON.stringify(this.favoriteColors));
      } catch (e) {
        console.error('保存收藏失败', e);
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        });
      }
    },
    
    // 格式化日期
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day} ${month} ${year} ${hours}:${minutes}`;
    },
    
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    
    // 显示删除确认对话框
    showDeleteConfirm() {
      uni.showModal({
        title: '清空历史记录',
        content: '确定要清空所有历史记录吗？',
        success: (res) => {
          if (res.confirm) {
            this.clearHistory();
          }
        }
      });
    },
    
    // 清空历史记录
    clearHistory() {
      try {
        uni.removeStorageSync('colorHistory');
        this.colorHistory = [];
        uni.showToast({
          title: '历史记录已清空',
          icon: 'success'
        });
      } catch (e) {
        console.error('清空历史记录失败', e);
        uni.showToast({
          title: '清空失败',
          icon: 'none'
        });
      }
    },

    // 触摸开始
    touchStart(event, index) {
      const touch = event.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.currentIndex = index;
    },

    // 触摸移动
    touchMove(event, index) {
      if (this.currentIndex !== index) return;
      
      const touch = event.touches[0];
      const moveX = touch.clientX - this.touchStartX;
      const moveY = touch.clientY - this.touchStartY;

      // 如果垂直移动距离大于水平移动距离，则不处理
      if (Math.abs(moveY) > Math.abs(moveX)) return;

      // 限制只能左滑
      if (moveX > 0) {
        this.$set(this.colorHistory[index], 'offset', 0);
        // const deleteBtn = event.currentTarget.querySelector('.delete-btn');
        // if (deleteBtn) {
        //   deleteBtn.style.transform = `translateX(${this.deleteButtonWidth}px)`;
        // }
        return;
      }

      // 限制最大滑动距离
      const offset = Math.max(-this.deleteButtonWidth, Math.min(0, moveX));
      this.$set(this.colorHistory[index], 'offset', offset);

      // // 同步更新删除按钮的位置
      // const deleteBtn = event.currentTarget.querySelector('.delete-btn');
      // if (deleteBtn) {
      //   deleteBtn.style.transform = `translateX(${this.deleteButtonWidth + offset}px)`;
      // }
    },

    // 触摸结束
    touchEnd(event, index) {
      if (this.currentIndex !== index) return;
      
      // const item = this.colorHistory[index];
      // const offset = item.offset || 0;
      
      // // 根据滑动距离决定是否显示删除按钮
      // if (Math.abs(offset) > this.deleteButtonWidth / 2) {
      //   this.$set(this.colorHistory[index], 'offset', -this.deleteButtonWidth);
      //   const deleteBtn = event.currentTarget.querySelector('.delete-btn');
      //   if (deleteBtn) {
      //     deleteBtn.style.transform = `translateX(0)`;
      //   }
      // } else {
      //   this.$set(this.colorHistory[index], 'offset', 0);
      //   const deleteBtn = event.currentTarget.querySelector('.delete-btn');
      //   if (deleteBtn) {
      //     deleteBtn.style.transform = `translateX(${this.deleteButtonWidth}px)`;
      //   }
      // }
      
      // this.currentIndex = -1;
    },

    // 删除单个历史记录
    deleteHistoryItem(index) {
      this.colorHistory.splice(index, 1);
      try {
        uni.setStorageSync('colorHistory', JSON.stringify(this.colorHistory));
        uni.showToast({
          title: '已删除',
          icon: 'success'
        });
      } catch (e) {
        console.error('删除历史记录失败', e);
        uni.showToast({
          title: '删除失败',
          icon: 'none'
        });
      }
    },
    
    // 跳转到颜色详情页
    goToColorDetail(color) {
      // 将颜色对象转为字符串传递
      const colorStr = encodeURIComponent(JSON.stringify(color));
      uni.navigateTo({
        url: `/pages/detail/detail?color=${colorStr}`
      });
    }
  }
}
</script>

<style>
@import './history.css';
</style>