<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-left"></view>
      <view class="navbar-title">Favorite Color</view>
      <view class="navbar-right">
        <!-- <uni-icons type="more-filled" size="20" color="#fff" /> -->
      </view>
    </view>

    <!-- 颜色卡片网格 -->
    <scroll-view class="color-grid" scroll-y>
      <view class="grid-container" v-if="favoriteColors.length > 0">
        <view
          class="color-card"
          v-for="(color, index) in favoriteColors"
          :key="index"
          @click="goToColorDetail(color)"
        >
          <view class="color-preview" :style="{ backgroundColor: color.hex }">
            <text class="color-name" :style="{ color: getContrastColor(color.hex) }">
              {{ color.name }}
            </text>
          </view>
          <view class="color-info">
            <view class="info-row">
              <text class="label">HEX</text>
              <text class="value">{{ color.hex }}</text>
            </view>
            <view class="info-row">
              <text class="label">RGB</text>
              <text class="value">({{ color.rgb.r }}, {{ color.rgb.g }}, {{ color.rgb.b }})</text>
            </view>
            <view class="info-row">
              <text class="label">CMYK</text>
              <text class="value">({{ color.cmyk.c }}%, {{ color.cmyk.m }}%, {{ color.cmyk.y }}%, {{ color.cmyk.k }}%)</text>
            </view>
          </view>
        </view>
      </view>
      <!-- 空状态提示 -->
      <view class="empty-state" v-else>
        <uni-icons type="star" size="64" color="#ccc" />
        <text class="empty-text">暂无收藏的颜色</text>
        <text class="empty-subtext">您可以在浏览颜色时点击星标收藏喜欢的颜色</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      favoriteColors: []
    }
  },

  onLoad() {
    this.loadFavoriteColors()
  },

  methods: {
    // 加载收藏的颜色
    loadFavoriteColors() {
      try {
        const favorites = uni.getStorageSync('favoriteColors')
        if (favorites) {
          this.favoriteColors = JSON.parse(favorites)
        }
      } catch (e) {
        console.error('加载收藏颜色失败', e)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },

    // 获取对比色用于文字显示
    getContrastColor(hex) {
      // 将hex转换为rgb
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      // 计算亮度
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness > 128 ? '#000' : '#fff'
    },

    // 跳转到颜色详情页
    goToColorDetail(color) {
      const colorStr = encodeURIComponent(JSON.stringify(color))
      uni.navigateTo({
        url: `/pages/detail/detail?color=${colorStr}`
      })
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--window-bottom));
  background-color: #f5f5f5;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #333;
  color: white;
  padding: 10px 15px;
  height: 50px;
}

.navbar-title {
  font-size: 18px;
  font-weight: bold;
}

.color-grid {
  flex: 1;
  padding: 15px;
}

.grid-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.color-card {
  width: calc(50% - 7.5px);
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-preview {
  height: 120px;
  display: flex;
  align-items: flex-end;
  padding: 10px;
}

.color-name {
  font-size: 14px;
  font-weight: bold;
}

.color-info {
  padding: 10px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
}

.label {
  color: #666;
}

.value {
  color: #333;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
}

.empty-text {
  margin-top: 20px;
  font-size: 16px;
  color: #666;
  font-weight: bold;
}

.empty-subtext {
  margin-top: 10px;
  font-size: 14px;
  color: #999;
  text-align: center;
}
</style>