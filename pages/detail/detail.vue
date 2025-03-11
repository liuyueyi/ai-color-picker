<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="navbar" :style="{ backgroundColor: color.hex, color: getContrastColor() }">
      <view class="navbar-left" @click="goBack">
        <uni-icons type="left" size="20" :color="getContrastColor()" />
      </view>
      <view class="navbar-title"> {{ color.name  }}</view>
      <view class="navbar-right">
        <uni-icons type="share" size="20" style="margin-left: 15px;" />
        <uni-icons type="file" size="20" style="margin-left: 15px;" />
      </view>
    </view>

    <!-- 颜色展示区域 -->
    <view class="color-display" :class="{ 'fullscreen': isFullscreen }" :style="{ backgroundColor: color.hex }"
      @click="toggleFullscreen">
      <view class="fullscreen-icon" v-if="!isFullscreen">
        <uni-icons type="arrow-up" size="20" color="#fff" />
      </view>
    </view>

    <!-- 颜色信息 -->
    <view class="color-info" v-if="!isFullscreen">
      <view class="color-title">
        <text>{{ percentValue }}% {{ color.name }}</text>
      </view>
      <view class="color-category">{{ color.category }}</view>

      <view class="divider"></view>

      <!-- RGB滑块 -->
      <view class="color-sliders">
        <view class="slider-item">
          <view class="slider-label">
            <text>Red</text>
            <text>{{ color.rgb.r }}</text>
          </view>
          <slider :value="color.rgb.r" min="0" max="255" activeColor="#ff0000" backgroundColor="#e0e0e0" block-size="12"
            @change="updateRed" />
        </view>
        <view class="slider-item">
          <view class="slider-label">
            <text>Green</text>
            <text>{{ color.rgb.g }}</text>
          </view>
          <slider :value="color.rgb.g" min="0" max="255" activeColor="#00ff00" backgroundColor="#e0e0e0" block-size="12"
            @change="updateGreen" />
        </view>
        <view class="slider-item">
          <view class="slider-label">
            <text>Blue</text>
            <text>{{ color.rgb.b }}</text>
          </view>
          <slider :value="color.rgb.b" min="0" max="255" activeColor="#0000ff" backgroundColor="#e0e0e0" block-size="12"
            @change="updateBlue" />
        </view>
      </view>

      <view class="divider"></view>

      <!-- 详细信息 -->
      <view class="details-section">
        <view class="details-header" @click="toggleDetails">
          <text>Details</text>
          <uni-icons :type="showDetails ? 'arrow-down' : 'arrow-right'" size="16" color="#666" />
        </view>

        <view class="details-content" v-if="showDetails">
          <view class="detail-item">
            <text>HEX:</text>
            <text>{{ color.hex }}</text>
          </view>
          <view class="detail-item">
            <text>RGB:</text>
            <text>({{ color.rgb.r }}, {{ color.rgb.g }}, {{ color.rgb.b }})</text>
          </view>
          <view class="detail-item">
            <text>HSL:</text>
            <text>({{ color.hsl.h }}°, {{ color.hsl.s }}%, {{ color.hsl.l }}%)</text>
          </view>
          <view class="detail-item">
            <text>CMYK:</text>
            <text>({{ color.cmyk.c }}%, {{ color.cmyk.m }}%, {{ color.cmyk.y }}%, {{ color.cmyk.k }}%)</text>
          </view>
          <view class="detail-item">
            <text>Temperature:</text>
            <text>{{ color.temperature }} K</text>
          </view>
          <view class="detail-item">
            <text>Wavelength:</text>
            <text>{{ color.wavelength }} nm</text>
          </view>
          <view class="detail-item">
            <text>Luminance:</text>
            <text>{{ color.luminance }}%</text>
          </view>
        </view>
      </view>

      <view class="divider"></view>

      <!-- 相似颜色 -->
      <view class="similar-colors">
        <view class="section-title">Similar colors</view>
        <view class="similar-color-list">
          <view class="similar-color-item" v-for="(item, index) in similarColors" :key="index">
            <view class="similar-color-circle" :style="{ backgroundColor: item.hex }"></view>
            <view class="similar-color-info">
              <view class="similar-color-name">{{ item.name }}</view>
              <view class="similar-color-hex">{{ item.hex }}</view>
              <view class="similar-color-category">{{ item.category }}</view>
            </view>
            <view class="similar-color-percent">{{ item.percent }}%</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      color: {
        name: '',
        hex: '#000000',
        rgb: { r: 0, g: 0, b: 0 },
        cmyk: { c: 0, m: 0, y: 0, k: 0 },
        hsl: { h: 0, s: 0, l: 0 },
        temperature: 0,
        wavelength: 0,
        luminance: 0,
        category: 'Common colors'
      },
      isFullscreen: false,
      showDetails: false,
      percentValue: 100,
      similarColors: []
    }
  },
  onLoad(options) {
    // 从参数中获取颜色信息
    if (options.color) {
      try {
        this.color = JSON.parse(decodeURIComponent(options.color));
        // 生成相似颜色
        this.generateSimilarColors();
      } catch (e) {
        console.error('解析颜色数据失败', e);
        uni.showToast({
          title: '加载颜色失败',
          icon: 'none'
        });
      }
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },

    // 切换全屏显示
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
    },

    // 切换详情显示
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },

    // 更新红色值
    updateRed(e) {
      this.color.rgb.r = e.detail.value;
      this.updateColorFromRgb();
    },

    // 更新绿色值
    updateGreen(e) {
      this.color.rgb.g = e.detail.value;
      this.updateColorFromRgb();
    },

    // 更新蓝色值
    updateBlue(e) {
      this.color.rgb.b = e.detail.value;
      this.updateColorFromRgb();
    },

    // 根据RGB更新其他颜色值
    updateColorFromRgb() {
      const { r, g, b } = this.color.rgb;

      // 更新HEX
      this.color.hex = this.rgbToHex(r, g, b);

      // 更新CMYK
      this.color.cmyk = this.rgbToCmyk(r, g, b);

      // 更新HSL
      this.color.hsl = this.rgbToHsl(r, g, b);

      // 更新亮度
      this.color.luminance = Math.floor((r * 0.299 + g * 0.587 + b * 0.114) / 255 * 100);
    },

    // RGB转HEX
    rgbToHex(r, g, b) {
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    },

    // RGB转CMYK
    rgbToCmyk(r, g, b) {
      let c = 1 - (r / 255);
      let m = 1 - (g / 255);
      let y = 1 - (b / 255);
      let k = Math.min(c, m, y);

      if (k === 1) {
        return { c: 0, m: 0, y: 0, k: 100 };
      }

      c = Math.round(((c - k) / (1 - k)) * 100);
      m = Math.round(((m - k) / (1 - k)) * 100);
      y = Math.round(((y - k) / (1 - k)) * 100);
      k = Math.round(k * 100);

      return { c, m, y, k };
    },

    // RGB转HSL
    rgbToHsl(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
      }

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    },

    // 生成相似颜色
    generateSimilarColors() {
      const { r, g, b } = this.color.rgb;

      // 生成相似颜色的算法（简化版）
      this.similarColors = [
        {
          name: this.color.name,
          hex: this.shiftColor(r, g, b, 10, 5, 0),
          category: 'Common colors',
          percent: 97
        },
        {
          name: this.color.name,
          hex: this.shiftColor(r, g, b, -10, -5, 5),
          category: 'Common colors',
          percent: 93
        },
        {
          name: this.color.name,
          hex: this.shiftColor(r, g, b, 15, 10, -5),
          category: 'Common colors',
          percent: 90
        }
      ];
    },

    // 生成相似颜色的辅助函数
    shiftColor(r, g, b, dr, dg, db) {
      const newR = Math.max(0, Math.min(255, r + dr));
      const newG = Math.max(0, Math.min(255, g + dg));
      const newB = Math.max(0, Math.min(255, b + db));
      return this.rgbToHex(newR, newG, newB);
    },

    // 获取与背景色对比的文字颜色
    getContrastColor() {
      const { r, g, b } = this.color.rgb;
      // 计算亮度 (基于人眼对不同颜色的感知)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // 亮度阈值，低于此值使用白色文字，高于此值使用黑色文字
      return luminance > 0.5 ? '#000000' : '#ffffff';
    },
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--status-bar-height));
  background-color: #f5f5f5;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-hex);
  color: white;
  padding: 10px 15px;
  height: 50px;
}

.navbar-left,
.navbar-right {
  display: flex;
  align-items: center;
}

.navbar-title {
  font-size: 18px;
  font-weight: bold;
}

.color-display {
  height: 200px;
  position: relative;
}

.color-display.fullscreen {
  height: calc(100vh - var(--status-bar-height) - 50px);
}

.fullscreen-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.color-info {
  flex: 1;
  padding: 15px;
  background-color: white;
}

.color-title {
  font-size: 18px;
  font-weight: bold;
}

.color-category {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 15px 0;
}

.color-sliders {
  margin-top: 10px;
}

.slider-item {
  margin-bottom: 15px;
}

.slider-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.details-section {
  margin-top: 10px;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}

.details-content {
  margin-top: 10px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.similar-color-list {
  margin-top: 10px;
}

.similar-color-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.similar-color-circle {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 15px;
}

.similar-color-info {
  flex: 1;
}

.similar-color-name {
  font-size: 14px;
  font-weight: bold;
}

.similar-color-hex {
  font-size: 12px;
  color: #666;
}

.similar-color-category {
  font-size: 12px;
  color: #999;
}

.similar-color-percent {
  font-size: 14px;
  color: #666;
}
</style>