<template>
  <view class="content">
    <!-- 顶部工具栏 -->
    <view class="toolbar">
      <view class="toolbar-icons">
        <view class="icon-item" @click="chooseImage"><uni-icons type="camera" size="24" color="#fff" /></view>
        <view class="icon-item"><uni-icons type="color" size="24" color="#fff" /></view>
        <view class="icon-item"><uni-icons type="refresh" size="24" color="#fff" /></view>
        <view class="icon-item"><uni-icons type="filter" size="24" color="#fff" /></view>
        <view class="icon-item"><uni-icons type="more-filled" size="24" color="#fff" /></view>
      </view>
    </view>

    <!-- 图片区域 -->
    <view class="image-container" v-if="imagePath">
      <image :src="imagePath" mode="aspectFit" @touchstart="pickColor" @touchmove="pickColor"></image>
      <view class="color-picker-indicator"
        :style="{ left: indicatorPosition.x + 'px', top: indicatorPosition.y + 'px' }"></view>
    </view>
    <view class="empty-container" v-else @click="chooseImage">
      <uni-icons type="image" size="64" color="#ccc" />
      <text class="empty-text">点击选择图片</text>
    </view>

    <!-- 颜色显示区域 -->
    <view class="color-display" v-if="selectedColor" :style="{ backgroundColor: selectedColor.hex }">
      <text class="color-name">{{ selectedColor.name }}</text>
      <text class="color-hex">{{ selectedColor.hex }}</text>
      <view class="details-button" @click="showDetails = !showDetails">
        <text>{{ showDetails ? '隐藏详情' : '显示详情' }}</text>
      </view>
    </view>

    <!-- 颜色详情区域 -->
    <view class="color-details-container" v-if="showDetails && selectedColor">
      <scroll-view scroll-y class="color-details">
        <!-- 颜色温度 -->
        <view class="detail-item">
          <view class="detail-header">
            <text>Color temperature: {{ selectedColor.temperature }} K</text>
            <uni-icons type="arrow-up" size="16" color="#fff" />
          </view>
          <view class="temperature-bar">
            <view class="gradient-bar temperature-gradient"></view>
          </view>
        </view>

        <!-- 主波长 -->
        <view class="detail-item">
          <view class="detail-header">
            <text>Dominant wavelength: {{ selectedColor.wavelength }} nm</text>
            <uni-icons type="arrow-up" size="16" color="#fff" />
          </view>
          <view class="wavelength-bar">
            <text class="wavelength-label left">UV</text>
            <view class="gradient-bar wavelength-gradient"></view>
            <text class="wavelength-label right">IR</text>
          </view>
        </view>

        <!-- 亮度 -->
        <view class="detail-item">
          <view class="detail-header">
            <text>Luminance: {{ selectedColor.luminance }}%</text>
            <uni-icons type="arrow-up" size="16" color="#fff" />
          </view>
          <view class="luminance-bar">
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: selectedColor.luminance + '%' }"></view>
            </view>
          </view>
          <uni-icons type="arrow-up" size="16" color="#fff" />
        </view>

        <!-- RGB值 -->
        <view class="detail-item">
          <view class="detail-header">
            <text>RGB ({{ selectedColor.rgb.r }}, {{ selectedColor.rgb.g }}, {{ selectedColor.rgb.b }})</text>
            <uni-icons type="arrow-up" size="16" color="#fff" />
          </view>
          <view class="rgb-bars">
            <view class="color-bar">
              <text>R</text>
              <view class="progress-bar">
                <view class="progress-fill red" :style="{ width: (selectedColor.rgb.r / 255 * 100) + '%' }"></view>
              </view>
              <text>{{ Math.round(selectedColor.rgb.r / 255 * 100) }}%</text>
            </view>
            <view class="color-bar">
              <text>G</text>
              <view class="progress-bar">
                <view class="progress-fill green" :style="{ width: (selectedColor.rgb.g / 255 * 100) + '%' }"></view>
              </view>
              <text>{{ Math.round(selectedColor.rgb.g / 255 * 100) }}%</text>
            </view>
            <view class="color-bar">
              <text>B</text>
              <view class="progress-bar">
                <view class="progress-fill blue" :style="{ width: (selectedColor.rgb.b / 255 * 100) + '%' }"></view>
              </view>
              <text>{{ Math.round(selectedColor.rgb.b / 255 * 100) }}%</text>
            </view>
          </view>
        </view>

        <!-- CMYK值 -->
        <view class="detail-item">
          <view class="detail-header">
            <text>CMYK ({{ selectedColor.cmyk.c }}%, {{ selectedColor.cmyk.m }}%, {{ selectedColor.cmyk.y }}%, {{
            selectedColor.cmyk.k }}%)</text>
            <uni-icons type="arrow-up" size="16" color="#fff" />
          </view>
          <view class="cmyk-bars">
            <view class="color-bar">
              <text>C</text>
              <view class="progress-bar">
                <view class="progress-fill cyan" :style="{ width: selectedColor.cmyk.c + '%' }"></view>
              </view>
              <text>{{ selectedColor.cmyk.c }}%</text>
            </view>
            <view class="color-bar">
              <text>M</text>
              <view class="progress-bar">
                <view class="progress-fill magenta" :style="{ width: selectedColor.cmyk.m + '%' }"></view>
              </view>
              <text>{{ selectedColor.cmyk.m }}%</text>
            </view>
            <view class="color-bar">
              <text>Y</text>
              <view class="progress-bar">
                <view class="progress-fill yellow" :style="{ width: selectedColor.cmyk.y + '%' }"></view>
              </view>
              <text>{{ selectedColor.cmyk.y }}%</text>
            </view>
            <view class="color-bar">
              <text>K</text>
              <view class="progress-bar">
                <view class="progress-fill black" :style="{ width: selectedColor.cmyk.k + '%' }"></view>
              </view>
              <text>{{ selectedColor.cmyk.k }}%</text>
            </view>
          </view>
        </view>

        <!-- HSL值 -->
        <view class="detail-item">
          <view class="detail-header">
            <text>HSL ({{ selectedColor.hsl.h }}°, {{ selectedColor.hsl.s }}%, {{ selectedColor.hsl.l }}%)</text>
            <uni-icons type="arrow-up" size="16" color="#fff" />
          </view>
          <view class="hsl-bars">
            <view class="progress-bar">
              <view class="progress-fill hue-gradient"></view>
            </view>
            <uni-icons type="arrow-up" size="16" color="#fff" />
            <view class="progress-bar">
              <view class="progress-fill saturation-gradient"></view>
            </view>
            <uni-icons type="arrow-up" size="16" color="#fff" />
          </view>
        </view>

        <!-- 保存按钮 -->
        <view class="save-button" @click="saveColor">
          <text>保存颜色</text>
        </view>
      </scroll-view>
    </view>
  </view>
  <!-- 隐藏的canvas用于颜色提取 -->
  <canvas canvas-id="colorPickerCanvas" style="position:absolute; width:100px; height:100px; left:-999px;"></canvas>
</template>

<script>
export default {
  data() {
    return {
      imagePath: '',
      selectedColor: null,
      showDetails: false,
      indicatorPosition: { x: 0, y: 0 },
      colorHistory: []
    }
  },
  onLoad() {
    // 从本地存储加载历史记录
    try {
      const history = uni.getStorageSync('colorHistory');
      if (history) {
        this.colorHistory = JSON.parse(history);
      }
    } catch (e) {
      console.error('读取历史记录失败', e);
    }
  },
  methods: {
    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.imagePath = res.tempFilePaths[0];
        }
      });
    },

    // 提取颜色
    pickColor(e) {
      // 获取触摸位置
      const touch = e.touches[0];
      const x = touch.pageX;
      const y = touch.pageY;

      // 更新指示器位置
      this.indicatorPosition = { x, y };

      // 使用canvas获取图片像素颜色
      this.extractColorFromImage(x, y);
    },

    // 从图片提取颜色
    extractColorFromImage(x, y) {
      // 获取图片元素位置信息
      const query = uni.createSelectorQuery().in(this);
      query.select('.image-container img').boundingClientRect(data => {
        if (!data) {
          console.log('未找到图片元素');
          this.useRandomColor(); // 找不到图片元素时使用随机颜色
          return;
        }

        const imgRect = data;

        // 计算相对于图片的位置
        const relativeX = x - imgRect.left;
        const relativeY = y - imgRect.top;

        // 确保坐标在图片范围内
        if (relativeX < 0 || relativeX > imgRect.width || relativeY < 0 || relativeY > imgRect.height) {
          console.log('点击位置不在图片内');
          return;
        }

        // 获取图片信息
        uni.getImageInfo({
          src: this.imagePath,
          success: imgInfo => {
            // 计算图片在canvas中的缩放比例
            const scaleX = imgInfo.width / imgRect.width;
            const scaleY = imgInfo.height / imgRect.height;

            // 计算实际像素位置
            const pixelX = Math.floor(relativeX * scaleX);
            const pixelY = Math.floor(relativeY * scaleY);

            // 创建临时canvas
            const canvasId = 'colorPickerCanvas';
            const ctx = uni.createCanvasContext(canvasId, this);

            // 绘制图片到canvas
            ctx.drawImage(this.imagePath, 0, 0, 100, 100);
            ctx.draw(false, () => {
              // 延迟一下确保绘制完成
              setTimeout(() => {
                // 获取像素数据
                uni.canvasGetImageData({
                  canvasId: canvasId,
                  x: Math.min(50, Math.max(0, Math.floor(pixelX * 100 / imgInfo.width))),
                  y: Math.min(50, Math.max(0, Math.floor(pixelY * 100 / imgInfo.height))),
                  width: 1,
                  height: 1,
                  success: res => {
                    // 获取RGB值
                    const r = res.data[0];
                    const g = res.data[1];
                    const b = res.data[2];

                    console.log('提取到的颜色:', r, g, b);

                    // 计算颜色值
                    const hex = this.rgbToHex(r, g, b);
                    const cmyk = this.rgbToCmyk(r, g, b);
                    const hsl = this.rgbToHsl(r, g, b);

                    // 根据颜色值确定颜色名称
                    const name = this.getColorName(r, g, b);

                    // 更新选中的颜色
                    this.selectedColor = {
                      name,
                      hex,
                      rgb: { r, g, b },
                      cmyk,
                      hsl,
                      temperature: this.calculateColorTemperature(r, g, b),
                      wavelength: this.calculateDominantWavelength(r, g, b),
                      luminance: Math.floor((r * 0.299 + g * 0.587 + b * 0.114) / 255 * 100)
                    };
                  },
                  fail: err => {
                    console.error('获取像素颜色失败:', err);
                    this.useRandomColor(); // 获取像素失败时使用随机颜色
                  }
                });
              }, 200);
            });
          },
          fail: err => {
            console.error('获取图片信息失败:', err);
            this.useRandomColor(); // 获取图片信息失败时使用随机颜色
          }
        });
      }).exec();
    },

    // 使用随机颜色（作为备选方案）
    useRandomColor() {
      const r = Math.floor(Math.random() * 200 + 55);
      const g = Math.floor(Math.random() * 150 + 50);
      const b = Math.floor(Math.random() * 100);

      // 计算颜色值
      const hex = this.rgbToHex(r, g, b);
      const cmyk = this.rgbToCmyk(r, g, b);
      const hsl = this.rgbToHsl(r, g, b);

      // 根据颜色值确定颜色名称
      const name = this.getColorName(r, g, b);

      // 更新选中的颜色
      this.selectedColor = {
        name,
        hex,
        rgb: { r, g, b },
        cmyk,
        hsl,
        temperature: this.calculateColorTemperature(r, g, b),
        wavelength: this.calculateDominantWavelength(r, g, b),
        luminance: Math.floor((r * 0.299 + g * 0.587 + b * 0.114) / 255 * 100)
      };
    },

    // 计算色温（简化版）
    calculateColorTemperature(r, g, b) {
      // 简化的色温计算，基于RGB值
      // 实际应用中可能需要更复杂的算法
      const ratio = r / (b || 1); // 避免除以0

      if (ratio > 1.5) {
        return Math.floor(2000 + ratio * 500); // 偏暖色
      } else if (ratio < 0.8) {
        return Math.floor(6500 + (1 - ratio) * 3000); // 偏冷色
      } else {
        return 6500; // 中性色温
      }
    },

    // 计算主波长（简化版）
    calculateDominantWavelength(r, g, b) {
      // 简化的主波长计算
      // 实际应用中可能需要更复杂的算法
      const max = Math.max(r, g, b);

      if (r === max) {
        return Math.floor(620 - (g / 255) * 40); // 红色区域: 580-620nm
      } else if (g === max) {
        return Math.floor(565 - (b / 255) * 65); // 绿色区域: 500-565nm
      } else {
        return Math.floor(450 + (r / 255) * 30); // 蓝色区域: 450-480nm
      }
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

    // 获取颜色名称 (简化版)
    getColorName(r, g, b) {
      // 简化的颜色名称判断
      if (r > 150 && g < 100 && b < 100) return 'Red';
      if (r > 150 && g > 100 && b < 100) return 'Orange';
      if (r > 150 && g > 150 && b < 100) return 'Yellow';
      if (r < 100 && g > 150 && b < 100) return 'Green';
      if (r < 100 && g < 100 && b > 150) return 'Blue';
      if (r > 150 && g < 100 && b > 150) return 'Purple';
      if (r > 150 && g > 100 && b > 50 && r > g && g > b) return 'Copper';
      if (r > 200 && g > 200 && b > 200) return 'White';
      if (r < 50 && g < 50 && b < 50) return 'Black';
      return 'Unknown';
    },

    // 保存颜色到历史记录
    saveColor() {
      if (!this.selectedColor) return;

      // 创建历史记录项
      const historyItem = {
        ...this.selectedColor,
        category: 'Common colors',
        timestamp: new Date().toISOString()
      };

      // 添加到历史记录
      this.colorHistory.unshift(historyItem);

      // 限制历史记录数量
      if (this.colorHistory.length > 50) {
        this.colorHistory.pop();
      }

      // 保存到本地存储
      try {
        uni.setStorageSync('colorHistory', JSON.stringify(this.colorHistory));
        uni.showToast({
          title: '颜色已保存',
          icon: 'success'
        });
      } catch (e) {
        console.error('保存历史记录失败', e);
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    },

    // 跳转到历史记录页面
    goToHistory() {
      uni.navigateTo({
        url: '/pages/history/history'
      });
    }
  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; /* 防止整体滚动 */
}

.toolbar {
  background-color: #333;
  padding: 10px;
  flex-shrink: 0; /* 防止工具栏被压缩 */
}

.toolbar-icons {
  display: flex;
  justify-content: space-around;
}

.icon-item {
  padding: 5px;
}

.image-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0; /* 允许容器缩小 */
}

.image-container image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.empty-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  min-height: 0; /* 允许容器缩小 */
}

.empty-text {
  margin-top: 20px;
  color: #999;
  font-size: 16px;
}

.color-picker-indicator {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.color-display {
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  flex-shrink: 0; /* 防止被压缩 */
}

.color-name {
  font-size: 20px;
  font-weight: bold;
}

.color-hex {
  font-size: 16px;
  margin-top: 5px;
}

.details-button {
  margin-top: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 5px 15px;
  border-radius: 20px;
}

.color-details-container {
  flex: 1;
  min-height: 0; /* 允许容器缩小 */
  max-height: 40vh; /* 限制最大高度 */
  overflow: hidden;
}

.color-details {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 15px;
  height: 100%;
}

.detail-item {
  margin-bottom: 15px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  color: white;
  margin-bottom: 5px;
}

.gradient-bar {
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
}

.temperature-gradient {
  background: linear-gradient(to right, #ff0000, #ffff00, #ffffff, #aaaaff);
}

.wavelength-gradient {
  background: linear-gradient(to right, #9900ff, #0000ff, #00ff00, #ffff00, #ff0000);
}

.wavelength-label {
  color: white;
  font-size: 12px;
}

.wavelength-label.left {
  float: left;
}

.wavelength-label.right {
  float: right;
}

.progress-bar {
  height: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  overflow: hidden;
  margin: 5px 0;
}

.progress-fill {
  height: 100%;
  border-radius: 5px;
}

.red {
  background-color: #ff0000;
}

.green {
  background-color: #00ff00;
}

.blue {
  background-color: #0000ff;
}

.cyan {
  background-color: #00ffff;
}

.magenta {
  background-color: #00ff00;
}

.yellow {
  background-color: #ffff00;
}

.black {
  background-color: #ffffff;
}

.hue-gradient {
  background: linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
  width: 100%;
}

.saturation-gradient {
  background: linear-gradient(to right, #808080, #ff0000);
  width: 100%;
}

.color-bar {
  display: flex;
  align-items: center;
  color: white;
  margin-bottom: 5px;
}

.color-bar text {
  width: 30px;
}

.color-bar .progress-bar {
  flex: 1;
  margin: 0 10px;
}

.rgb-bars,
.cmyk-bars,
.hsl-bars {
  margin-top: 5px;
}

.save-button {
  background-color: #2196F3;
  color: white;
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
  margin-bottom: 10px;
}
</style>