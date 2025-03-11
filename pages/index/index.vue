<template>
  <view class="content">
    <!-- 顶部工具栏 -->
    <view class="toolbar">
      <view class="toolbar-icons">
        <view class="icon-item" @click="chooseImage"> <uni-icons type="camera" size="24" color="#fff" /></view>
        <view class="icon-item"><uni-icons type="color" size="24" color="#fff" /></view>
        <view class="icon-item"><uni-icons type="refresh" size="24" color="#fff" /></view>
        <view class="icon-item"><uni-icons type="filter" size="24" color="#fff" /></view>
        <view class="icon-item"><uni-icons type="more-filled" size="24" color="#fff" /></view>
      </view>
    </view>

    <!-- 图片区域 -->
    <view class="image-container" v-if="imagePath">
      <view class="grid-background"></view>
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
      <text class="color-name" :style="{ color: getContrastColor() }">{{ selectedColor.name }}</text>
      <text class="color-hex" :style="{ color: getContrastColor() }">{{ selectedColor.hex }}</text>
      <view class="details-button" :style="{ backgroundColor: getContrastBackgroundColor() }" @click="showDetails = !showDetails">        <text :style="{ color: getContrastColor() }">{{ showDetails ? '隐藏详情' : '显示详情' }}</text>
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
            <view class="gradient-bar temperature-gradient" :style="getTemperatureGradientStyle()"></view>
            <view class="temperature-indicator" :style="{ left: calculateTemperaturePosition() + '%' }"></view>
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
            <view class="gradient-bar wavelength-gradient" :style="getWavelengthGradientStyle()"></view>
            <view class="wavelength-indicator" :style="{ left: calculateWavelengthPosition() + '%' }"></view>
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
            <view class="progress-bar luminance-background">
              <view class="progress-fill luminance-fill" :style="{ width: selectedColor.luminance + '%' }"></view>
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
  <canvas canvas-id="colorPickerCanvas"
    :style="{ position: 'absolute', width: canvasWidth + 'px', height: canvasHeight + 'px', left: '-999px' }"></canvas>

  <!-- 颜色命名弹窗 -->
  <view class="dialog-mask" v-if="showNameDialog" @click="cancelSaveColor">
    <view class="dialog-container" @click.stop>
      <view class="dialog-header">
        <text>保存颜色</text>
      </view>
      <view class="dialog-content">
        <view class="color-preview" :style="{ backgroundColor: selectedColor ? selectedColor.hex : '#000' }"></view>
        <input class="name-input" v-model="colorNameInput" placeholder="请输入颜色名称" />
      </view>
      <view class="dialog-footer">
        <button class="dialog-btn cancel-btn" @click="cancelSaveColor">取消</button>
        <button class="dialog-btn confirm-btn" @click="confirmSaveColor">确认</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      imagePath: '',
      selectedColor: null,
      showDetails: false,
      indicatorPosition: { x: 0, y: 0 },
      colorHistory: [],
      canvasWidth: 100,
      canvasHeight: 100,
      // 新增变量
      showNameDialog: false,
      colorNameInput: '',
    }
  },
  onLoad() {
    // 设置默认图片
    this.imagePath = '/static/bg/girl.jpg';
    
    // 从本地存储加载历史记录
    try {
      const history = uni.getStorageSync('colorHistory');
      if (history) {
        this.colorHistory = JSON.parse(history);
      }
    } catch (e) {
      console.error('读取历史记录失败', e);
    }
    
    // 等待组件渲染完成后触发颜色提取
    setTimeout(() => {
      // 模拟点击中心位置
      const centerX = this.canvasWidth / 2;
      const centerY = this.canvasHeight / 2;
      this.indicatorPosition = { x: centerX, y: centerY };
      this.extractColorFromImage(centerX, centerY);
    }, 500);
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

      // 获取图片容器位置信息
      const query = uni.createSelectorQuery().in(this);
      query.select('.image-container').boundingClientRect(data => {
        if (!data) {
          console.log('未找到图片容器元素');
          return;
        }

        // 计算相对于图片容器的位置
        const x = touch.pageX - data.left;
        const y = touch.pageY - data.top;

        // 更新指示器位置
        this.indicatorPosition = { x, y };

        // 使用canvas获取图片像素颜色
        this.extractColorFromImage(x, y);
      }).exec();
    },

    // 从图片提取颜色
    extractColorFromImage(x, y) {
      // 转换到正中心的位置
      // x += 10;
      // y += 10;
      console.log('点击提取的位置为：', x, y);
      // 获取图片元素位置信息
      const query = uni.createSelectorQuery().in(this);
      query.select('.image-container img').boundingClientRect(data => {
        if (!data) {
          console.log('未找到图片元素');
          return;
        }

        const imgRect = data;

        // 计算相对于图片的位置
        const relativeX = x - imgRect.left;
        const relativeY = y - imgRect.top;

        // 确保坐标在图片范围内
        console.log('相对位置：', relativeX, relativeY, imgRect);
        if (relativeX < 0 || relativeX > imgRect.width || relativeY < 0 || relativeY > imgRect.height) {
          console.log('点击位置不在图片内');
          return;
        }

        // 获取图片信息
        uni.getImageInfo({
          src: this.imagePath,
          success: imgInfo => {
            // 设置固定的canvas尺寸
            this.canvasWidth = 100;
            this.canvasHeight = 100;

            // 创建临时canvas
            const canvasId = 'colorPickerCanvas';
            const ctx = uni.createCanvasContext(canvasId, this);

            // 计算图片在容器中的实际显示尺寸和位置
            // 由于mode="aspectFit"，需要计算图片的实际显示区域
            let displayWidth, displayHeight, offsetX = 0, offsetY = 0;
            const containerRatio = imgRect.width / imgRect.height;
            const imageRatio = imgInfo.width / imgInfo.height;
            console.log('图片信息：', imgInfo, containerRatio, imageRatio);

            if (imageRatio > containerRatio) {
              console.log('宽图流程!')
              // 图片较宽，宽度撑满容器
              displayWidth = imgRect.width;
              displayHeight = displayWidth / imageRatio;
              offsetY = (imgRect.height - displayHeight) / 2;
            } else {
              console.log('高图流程!')
              // 图片较高，高度撑满容器
              displayHeight = imgRect.height;
              displayWidth = displayHeight * imageRatio;
              offsetX = (imgRect.width - displayWidth) / 2;
            }
            console.log('点击图片显示区域:', x, y, offsetX, offsetY, 'dw=', displayWidth, 'dh=', displayHeight);

            // 修正：计算点击位置相对于图片左上角的偏移
            // 需要考虑图片在容器中的偏移量
            const adjustedX = x - offsetX;
            const adjustedY = y - offsetY;

            // 检查点击位置是否在图片显示区域内
            if (adjustedX < 0 || adjustedX > displayWidth ||
              adjustedY < 0 || adjustedY > displayHeight) {
              console.log('点击位置不在图片显示区域内', adjustedX, adjustedY, displayWidth, displayHeight);
              return;
            }

            // 计算点击位置在原始图片中的坐标
            const normalizedX = adjustedX / displayWidth;
            const normalizedY = adjustedY / displayHeight;
            const originalX = Math.floor(normalizedX * imgInfo.width);
            const originalY = Math.floor(normalizedY * imgInfo.height);

            // 1220, 1784
            console.log('点击(normalizedX, normalizedY) = ', normalizedX, normalizedY);
            console.log('调整后的点击位置:', relativeX, relativeY);
            console.log('点击位置在图片中的坐标:', originalX, originalY);

            // 在canvas上绘制图片的对应区域
            // 为了提高精度，我们只绘制点击位置附近的区域
            const sampleSize = 10; // 采样区域大小
            const sampleX = Math.max(0, originalX - sampleSize / 2);
            const sampleY = Math.max(0, originalY - sampleSize / 2);
            const sampleWidth = Math.min(sampleSize, imgInfo.width - sampleX);
            const sampleHeight = Math.min(sampleSize, imgInfo.height - sampleY);

            // 清空canvas
            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

            // 绘制采样区域到canvas中心
            ctx.drawImage(
              this.imagePath,
              sampleX, sampleY, sampleWidth, sampleHeight, // 源图像裁剪区域
              0, 0, this.canvasWidth, this.canvasHeight // 目标区域
            );

            ctx.draw(false, () => {
              // 延迟一下确保绘制完成
              setTimeout(() => {
                // 获取像素数据 - 从canvas中心点获取颜色
                uni.canvasGetImageData({
                  canvasId: canvasId,
                  x: Math.floor(this.canvasWidth / 2),
                  y: Math.floor(this.canvasHeight / 2),
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

    // 获取颜色名称 (增强版)
    getColorName(r, g, b) {
      // 计算HSL值用于更精确的颜色判断
      const hsl = this.rgbToHsl(r, g, b);
      const h = hsl.h; // 色相
      const s = hsl.s; // 饱和度
      const l = hsl.l; // 亮度

      // 灰度系列
      if (s < 10) {
        if (l < 15) return '黑色 (Black)';
        if (l < 30) return '深灰 (Dark Gray)';
        if (l < 50) return '灰色 (Gray)';
        if (l < 70) return '浅灰 (Light Gray)';
        if (l < 85) return '银色 (Silver)';
        return '白色 (White)';
      }

      // 根据色相判断基本颜色
      if (h >= 0 && h < 15 || h >= 345 && h <= 360) {
        if (l < 20) return '深红 (Dark Red)';
        if (l < 40) return '红色 (Red)';
        if (l < 60) return '鲜红 (Bright Red)';
        return '浅红 (Light Red)';
      }

      if (h >= 15 && h < 40) {
        if (l < 30) return '棕色 (Brown)';
        if (l < 50) return '橙色 (Orange)';
        if (s > 80) return '金色 (Gold)';
        return '橘黄 (Orange Yellow)';
      }

      if (h >= 40 && h < 70) {
        if (l < 30) return '橄榄 (Olive)';
        if (l < 50) return '黄色 (Yellow)';
        if (l < 70) return '鲜黄 (Bright Yellow)';
        return '浅黄 (Light Yellow)';
      }

      if (h >= 70 && h < 150) {
        if (l < 20) return '深绿 (Dark Green)';
        if (l < 40) return '绿色 (Green)';
        if (h < 100) return '黄绿 (Yellow Green)';
        if (h > 120) return '青绿 (Teal)';
        return '鲜绿 (Bright Green)';
      }

      if (h >= 150 && h < 200) {
        if (l < 20) return '深青 (Dark Cyan)';
        if (l < 40) return '青色 (Cyan)';
        if (l < 60) return '湖蓝 (Turquoise)';
        return '浅青 (Light Cyan)';
      }

      if (h >= 200 && h < 260) {
        if (l < 20) return '深蓝 (Dark Blue)';
        if (l < 40) return '蓝色 (Blue)';
        if (l < 60) return '天蓝 (Sky Blue)';
        return '浅蓝 (Light Blue)';
      }

      if (h >= 260 && h < 285) {
        if (l < 20) return '深紫 (Dark Purple)';
        if (l < 40) return '紫色 (Purple)';
        if (l < 60) return '鲜紫 (Bright Purple)';
        return '浅紫 (Light Purple)';
      }

      if (h >= 285 && h < 345) {
        if (l < 20) return '深粉 (Dark Pink)';
        if (l < 40) return '品红 (Magenta)';
        if (l < 60) return '粉红 (Pink)';
        return '浅粉 (Light Pink)';
      }

      // 特殊颜色判断
      if (r > 150 && g > 100 && b > 50 && r > g && g > b) {
        if (l < 40) return '铜色 (Copper)';
        return '古铜 (Bronze)';
      }

      if (Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && Math.abs(r - b) < 10) {
        return '中性灰 (Neutral Gray)';
      }

      // 默认返回
      return '未知 (Unknown)';
    },

    // 保存颜色到历史记录
    saveColor() {
      if (!this.selectedColor) return;
      // 显示命名弹窗
      this.colorNameInput = this.selectedColor.name || '';
      // 默认使用当前颜色名称
      this.showNameDialog = true;
    },

    // 确认保存颜色
    confirmSaveColor() {
      if (!this.selectedColor) return;

      // 创建历史记录项
      const historyItem = {
        ...this.selectedColor,
        name: this.colorNameInput || this.selectedColor.name, // 使用用户输入的名称
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

      // 关闭弹窗
      this.showNameDialog = false;
    },

    // 取消保存
    cancelSaveColor() {
      this.showNameDialog = false;
    },

    // 跳转到历史记录页面
    goToHistory() {
      uni.navigateTo({
        url: '/pages/history/history'
      });
    },
    // 计算色温指示器位置
    calculateTemperaturePosition() {
      if (!this.selectedColor) return 0;

      // 色温范围从2000K到10000K
      const minTemp = 2000;
      const maxTemp = 10000;
      const temp = this.selectedColor.temperature;

      // 将色温值映射到0-100的范围
      let position = ((temp - minTemp) / (maxTemp - minTemp)) * 100;

      // 限制在0-100范围内
      position = Math.max(0, Math.min(100, position));

      return position;
    },
    // 计算波长指示器位置
    calculateWavelengthPosition() {
      if (!this.selectedColor) return 0;

      // 可见光波长范围约为380nm到780nm
      const minWavelength = 380;
      const maxWavelength = 780;
      const wavelength = this.selectedColor.wavelength;

      // 将波长值映射到0-100的范围
      let position = ((wavelength - minWavelength) / (maxWavelength - minWavelength)) * 100;

      // 限制在0-100范围内
      position = Math.max(0, Math.min(100, position));

      return position;
    },
    // 获取色温渐变样式
    getTemperatureGradientStyle() {
      if (!this.selectedColor) return {};

      // 根据当前颜色调整色温渐变
      const { r, g, b } = this.selectedColor.rgb;
      const warmColor = `rgb(${Math.min(r + 50, 255)}, ${Math.min(g + 30, 255)}, ${Math.max(b - 50, 0)})`;
      const coolColor = `rgb(${Math.max(r - 50, 0)}, ${Math.max(g - 20, 0)}, ${Math.min(b + 50, 255)})`;

      return {
        background: `linear-gradient(to right, ${warmColor}, #ffff00, #ffffff, ${coolColor})`
      };
    },

    // 获取波长渐变样式
    getWavelengthGradientStyle() {
      if (!this.selectedColor) return {};

      // 根据当前颜色调整波长渐变
      const { r, g, b } = this.selectedColor.rgb;
      const dominantColor = this.selectedColor.hex;

      // 根据主波长位置确定渐变
      const position = this.calculateWavelengthPosition();
      let gradientColors;

      if (position < 33) {
        // 偏紫蓝色区域
        gradientColors = `#9900ff, #0000ff, ${dominantColor}, #00ff00, #ffff00, #ff0000`;
      } else if (position < 66) {
        // 偏绿黄色区域
        gradientColors = `#9900ff, #0000ff, #00ff00, ${dominantColor}, #ffff00, #ff0000`;
      } else {
        // 偏红色区域
        gradientColors = `#9900ff, #0000ff, #00ff00, #ffff00, ${dominantColor}, #ff0000`;
      }

      return {
        background: `linear-gradient(to right, ${gradientColors})`
      };
    },
    // 获取与背景色对比的文字颜色
    getContrastColor() {
      if (!this.selectedColor) return '#000000';

      const { r, g, b } = this.selectedColor.rgb;
      // 计算亮度 (基于人眼对不同颜色的感知)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // 亮度阈值，低于此值使用白色文字，高于此值使用黑色文字
      return luminance > 0.5 ? '#000000' : '#ffffff';
    },

    // 获取与背景色对比的半透明背景色
    getContrastBackgroundColor() {
      if (!this.selectedColor) return 'rgba(255, 255, 255, 0.2)';

      const { r, g, b } = this.selectedColor.rgb;
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // 根据背景亮度选择半透明的黑色或白色
      return luminance > 0.5 ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)';
    },
  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  height: 88vh;
  overflow: hidden;
  /* 防止整体滚动 */
}

.toolbar {
  background-color: #333;
  padding: 10px;
  flex-shrink: 0;
  /* 防止工具栏被压缩 */
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
  min-height: 0;
  /* 允许容器缩小 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  margin: 10px;
  border-radius: 8px;
}


.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: 20px 20px;
  background-image:
    linear-gradient(to right, rgba(200, 200, 200, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(200, 200, 200, 0.1) 1px, transparent 1px);
  pointer-events: none;
  /* 确保点击事件可以穿透到图片 */
  z-index: 1;
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
  min-height: 0;
  /* 允许容器缩小 */
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.color-picker-indicator::before,
.color-picker-indicator::after {
  content: '';
  position: absolute;
  background-color: white;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

.color-picker-indicator::before {
  width: 8px;
  height: 2px;
}

.color-picker-indicator::after {
  width: 2px;
  height: 8px;
}

.color-display {
  position: fixed;
  bottom: calc(24rpx + constant(safe-area-inset-bottom));
  bottom: calc(24rpx + env(safe-area-inset-bottom));
  height: 6rem;
  left: 0;
  right: 0;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.details-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 5px 15px;
  border-radius: 20px;
}

.color-details-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(24rpx + constant(safe-area-inset-bottom) + 6rem);
  bottom: calc(24rpx + env(safe-area-inset-bottom) + 6rem);
  max-width: 70vw;
  max-height: calc(100vh - 280px);
  z-index: 99;
}

.color-details {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 15px;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
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

.temperature-bar {
  position: relative;
  margin-top: 5px;
}

.temperature-indicator {
  position: absolute;
  top: -5px;
  width: 3px;
  height: 15px;
  background-color: #fff;
  border-radius: 1px;
  transform: translateX(-50%);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
}

.temperature-gradient {
  background: linear-gradient(to right, #ff0000, #ffff00, #ffffff, #aaaaff);
}

.wavelength-bar {
  position: relative;
  margin-top: 5px;
  display: flex;
  align-items: center;
}

.wavelength-label {
  color: white;
  font-size: 12px;
  margin: 0 5px;
}

.wavelength-label.left {
  float: left;
}

.wavelength-label.right {
  float: right;
}

.gradient-bar {
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  flex: 1;
}

.wavelength-gradient {
  background: linear-gradient(to right, #9900ff, #0000ff, #00ff00, #ffff00, #ff0000);
  width: 100%;
}

.wavelength-indicator {
  position: absolute;
  width: 3px;
  height: 15px;
  background-color: #fff;
  border-radius: 1px;
  transform: translateX(-50%);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.luminance-bar {
  position: relative;
  margin-top: 5px;
}

.luminance-background {
  background: linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(255, 255, 255, 0.2));
  height: 12px;
}

.luminance-fill {
  background: linear-gradient(to right, rgba(100, 100, 100, 0.9), rgba(255, 255, 255, 0.9));
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  height: 100%;
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

/* 弹窗样式 */
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-container {
  width: 80%;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.dialog-header {
  padding: 15px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}

.dialog-content {
  padding: 20px;
}

.color-preview {
  width: 100%;
  height: 60px;
  border-radius: 5px;
  margin-bottom: 15px;
}

.name-input {
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0 10px;
  box-sizing: border-box;
}

.dialog-footer {
  display: flex;
  border-top: 1px solid #eee;
}

.dialog-btn {
  flex: 1;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
}

.cancel-btn {
  color: #666;
  border-right: 1px solid #eee;
}

.confirm-btn {
  color: #2196F3;
}
</style>
