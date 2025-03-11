<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <uni-icons type="left" size="20" color="#fff" />
      </view>
      <view class="navbar-title">History</view>
      <view class="navbar-right">
        <uni-icons type="trash" size="20" color="#fff" @click="showDeleteConfirm" />
        <uni-icons type="more-filled" size="20" color="#fff" style="margin-left: 15px;" />
      </view>
    </view>
    
    <!-- 历史记录列表 -->
    <view class="history-list">
      <view 
        class="history-item" 
        v-for="(item, index) in colorHistory" 
        :key="index"
        @click="goToColorDetail(item)"
      >
        <view class="color-circle" :style="{ backgroundColor: item.hex }"></view>
        <view class="color-info">
          <view class="color-name">{{ item.name }}</view>
          <view class="color-hex">{{ item.hex }}</view>
          <view class="color-category">{{ item.category }}</view>
        </view>
        <view class="color-time">{{ formatDate(item.timestamp) }}</view>
      </view>
      
      <view class="empty-history" v-if="colorHistory.length === 0">
        <uni-icons type="info" size="64" color="#ccc" />
        <text>暂无历史记录</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      colorHistory: []
    }
  },
  onLoad() {
    this.loadHistory();
  },
  onShow() {
    // 每次显示页面时重新加载历史记录
    this.loadHistory();
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
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2196F3;
  color: white;
  padding: 10px 15px;
  height: 50px;
}

.navbar-left, .navbar-right {
  display: flex;
  align-items: center;
}

.navbar-title {
  font-size: 18px;
  font-weight: bold;
}

.history-list {
  flex: 1;
  padding: 10px;
}

.history-item {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.color-circle {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 15px;
}

.color-info {
  flex: 1;
}

.color-name {
  font-size: 16px;
  font-weight: bold;
}

.color-hex {
  font-size: 14px;
  color: #666;
  margin-top: 2px;
}

.color-category {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.color-time {
  font-size: 12px;
  color: #999;
}

.empty-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}
</style>