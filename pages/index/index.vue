<template>
  <view class="content">
    <!-- 顶部工具栏 -->
    <view class="toolbar">
      <view class="toolbar-icons">
        <view class="icon-item" @click="chooseImage"> <uni-icons type="camera" size="24" color="#333" /></view>
        <view class="icon-item" @click="resetImage"><uni-icons type="refresh" size="24" color="#333" /></view>
        <view class="icon-item" @click="loadDemoImage"><uni-icons type="help" size="24" color="#333" /></view>
      </view>
    </view>

    <!-- 图片区域 -->
    <view class="image-container" v-if="imagePath" :style="{ backgroundColor: selectedColor ? selectedColor.hex : '' }">
      <view class="grid-background"></view>
      <image :src="imagePath" mode="aspectFit" @touchstart="pickColor" @touchmove="pickColor" @click="pickColor"></image>
      <view class="color-picker-indicator"
        :style="{ left: indicatorPosition.x + 'px', top: indicatorPosition.y + 'px' }"></view>
    </view>
    <view class="empty-container" v-else @click="chooseImage">
      <uni-icons type="image" size="64" color="#ccc" />
      <text class="empty-text">{{ LocaleUtils.getText('index.selectImage') }}</text>
    </view>
    <!-- 颜色显示区域 -->
    <view class="color-display" v-if="selectedColor" :style="{ backgroundColor: selectedColor.hex }">
      <view class="details-save-button" :style="{ backgroundColor: getContrastBackgroundColor() }" @click="saveColor">
        <text :style="{ color: getContrastColor() }">{{ LocaleUtils.getText('index.save') }}</text>
      </view>
      <text class="color-name" :style="{ color: getContrastColor() }">{{ selectedColor.name }}</text>
      <text class="color-hex" :style="{ color: getContrastColor() }">{{ selectedColor.hex }}</text>
      <view class="details-button" :style="{ backgroundColor: getContrastBackgroundColor() }"
        @click="showDetails = !showDetails"> <text :style="{ color: getContrastColor() }">{{ showDetails ?
          LocaleUtils.getText('index.hideDetails') :
          LocaleUtils.getText('index.showDetails') }}</text>
      </view>
    </view>

    <!-- 颜色详情区域 -->
    <view class="color-details-container" v-if="showDetails && selectedColor">
      <scroll-view scroll-y class="color-details" :style="{ maxHeight: detailsMaxHeight + 'px' }">
        <!-- 颜色温度 -->
        <view class="detail-item">
          <view class="detail-header">
            <text>{{ LocaleUtils.getText('index.colorTemperature') }}: {{ selectedColor.temperature }} K</text>
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
            <text>{{ LocaleUtils.getText('index.dominantWavelength') }}: {{ selectedColor.wavelength }} nm</text>
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
            <text>{{ LocaleUtils.getText('index.luminance') }}: {{ selectedColor.luminance }}%</text>
            <uni-icons type="arrow-up" size="16" color="#fff" />
          </view>
          <view class="luminance-bar">
            <view class="progress-bar luminance-background">
              <view class="progress-fill luminance-fill" :style="{ width: selectedColor.luminance + '%' }"></view>
            </view>
          </view>
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
              <view class="hsl-indicator" :style="{ left: (selectedColor.hsl.h / 3.60) + '%' }"></view>
            </view>
            <view class="progress-bar">
              <view class="progress-fill saturation-gradient"></view>
              <view class="hsl-indicator" :style="{ left: selectedColor.hsl.s + '%' }"></view>
            </view>
            <view class="progress-bar">
              <view class="progress-fill lightness-gradient"
                :style="{ background: `linear-gradient(to right, #000000, #ffffff)`, width: '100%' }"></view>
              <view class="hsl-indicator" :style="{ left: selectedColor.hsl.l + '%' }"></view>
            </view>
          </view>
        </view>

        <!-- HLV值 -->
        <view class="detail-item">
          <view class="detail-header">
            <text>HLV ({{ selectedColor.hlv.h }}°, {{ selectedColor.hlv.l }}%, {{ selectedColor.hlv.v }}%)</text>
            <uni-icons type="arrow-up" size="16" color="#fff" />
          </view>
          <view class="hlv-bars">
            <view class="progress-bar">
              <view class="progress-fill hue-gradient"></view>
              <view class="hlv-indicator" :style="{ left: (selectedColor.hlv.h / 3.60) + '%' }"></view>
            </view>
            <view class="progress-bar">
              <view class="progress-fill luminance-gradient"
                :style="{ background: `linear-gradient(to right, #000000, #ffffff)` }"></view>
              <view class="hlv-indicator" :style="{ left: selectedColor.hlv.l + '%' }"></view>
            </view>
            <view class="progress-bar">
              <view class="progress-fill value-gradient"
                :style="{ background: `linear-gradient(to right, #000000, rgb(250, 190, 144))` }"></view>
              <view class="hlv-indicator" :style="{ left: selectedColor.hlv.v + '%' }">
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
  <!-- 隐藏的canvas用于颜色提取 -->
  <canvas canvas-id="colorPickerCanvas"
    :style="{ position: 'absolute', width: canvasWidth + 'px', height: canvasHeight + 'px', left: '-999px' }"></canvas>


  <!-- 提示信息区域 -->
  <view class="tip-dialog-mask" v-if="showTips" @click="showTips = false">
    <view class="tip-dialog" @click.stop>
      <view class="close-btn" @click="showTips = false">
        <uni-icons type="close" size="20" color="#666" />
      </view>
      <text class="tips-title">{{ LocaleUtils.getText('index.tips.title') }}</text>
      <view class="tips-content">
        <text>{{ LocaleUtils.getText('index.tips.description') }}</text>
        <text>{{ LocaleUtils.getText('index.tips.colorIdentification') }}</text>
        <text>{{ LocaleUtils.getText('index.tips.dynamicRange') }}</text>
        <text>{{ LocaleUtils.getText('index.tips.scientificData') }}</text>
        <text>{{ LocaleUtils.getText('index.tips.imageColor') }}</text>
        <text>{{ LocaleUtils.getText('index.tips.savedColors') }}</text>
        <text>{{ LocaleUtils.getText('index.tips.searchColors') }}</text>
        <text class="disclaimer">{{ LocaleUtils.getText('index.tips.disclaimer') }}</text>
        <text class="ai-notice">{{ LocaleUtils.getText('index.tips.aiNotice') }}</text>
      </view>
    </view>
  </view>

  <!-- 颜色命名弹窗 -->
  <view class="dialog-mask" v-if="showNameDialog" @click="cancelSaveColor">
    <view class="dialog-container" @click.stop>
      <view class="dialog-header">
        <text>{{ LocaleUtils.getText('index.saveColor') }}</text>
      </view>
      <view class="dialog-content">
        <view class="color-preview" :style="{ backgroundColor: selectedColor ? selectedColor.hex : '#000' }"></view>
        <input class="name-input" v-model="colorNameInput" :placeholder="LocaleUtils.getText('index.enterColorName')" />
        <picker @change="onGroupChange" :value="selectedGroup" :range="colorGroups" range-key="name"
          class="group-picker">
          <view class="picker-value">{{ selectedGroup ? selectedGroup : LocaleUtils.getText('index.selectGroup') }}
          </view>
        </picker>
      </view>
      <view class="dialog-footer">
        <button class="dialog-btn cancel-btn" @click="cancelSaveColor">{{ LocaleUtils.getText('common.cancel')
          }}</button>
        <button class="dialog-btn confirm-btn" @click="confirmSaveColor">{{ LocaleUtils.getText('common.confirm')
          }}</button>
      </view>
    </view>
  </view>
</template>

<script>
import LocaleUtils from '../../utils/LocaleUtils.js'
import ColorUtils from '../../utils/colorUtils.js';
import AdsUtils from '../../utils/AdsUtils.js';
import GroupUtils from '../../utils/GroupUtils.js';

export default {
  data() {
    return {
      LocaleUtils,
      imagePath: '',
      selectedColor: null,
      showDetails: false,
      indicatorPosition: { x: 0, y: 0 },
      colorHistory: [],
      canvasWidth: 100,
      canvasHeight: 100,
      showNameDialog: false,
      colorNameInput: '',
      detailsMaxHeight: 600,
      colorGroups: [],
      selectedGroup: '',
      showTips: false, // 新增：控制提示信息显示
    }
  },
  onShow() {
    LocaleUtils.updateTabBar();
  },
  onLoad() {
    try {
      const loadTag = uni.getStorageSync("firstLoadTime");
      if (!loadTag) {
        // 设置默认图片
        this.imagePath = '/static/bg/girl.jpg';
        uni.setStorageSync('firstLoadTime', new Date().getTime());
      }
    } catch (e) {
      // 默认的示例图片
      this.imagePath = '/static/bg/girl.jpg';
    }


    // 从本地存储加载历史记录
    try {
      const history = uni.getStorageSync('colorHistory');
      if (history) {
        this.colorHistory = JSON.parse(history);
      }
    } catch (e) {
      console.error('读取历史记录失败', e);
    }

    // 计算详情区域最大高度
    this.calculateDetailsMaxHeight();

    // 等待组件渲染完成后触发颜色提取
    this.mockClicked();
  },
  methods: {
    loadDemoImage() {
      if (!this.imagePath) {
        this.imagePath = '/static/bg/girl.jpg';
        this.mockClicked();
      }
      // 显示提示信息
      this.showTips = true;
      // // 3秒后自动隐藏
      // setTimeout(() => {
      //   this.showTips = false;
      // }, 3000);
    },
    mockClicked() {
      // 等待图片加载完成后触发颜色提取
      setTimeout(() => {
        // 获取屏幕尺寸
        const systemInfo = uni.getSystemInfoSync();
        // 使用屏幕中心坐标
        const centerX = systemInfo.windowWidth / 2;
        const centerY = systemInfo.windowHeight / 2;
        this.indicatorPosition = { x: centerX, y: centerY };
        this.extractColorFromImage(centerX, centerY);
      }, 500);
    },
    // 计算详情区域最大高度
    calculateDetailsMaxHeight() {
      const systemInfo = uni.getSystemInfoSync();
      const windowHeight = systemInfo.windowHeight;
      // 预留底部颜色显示区域的高度（约6rem）和顶部工具栏高度
      this.detailsMaxHeight = windowHeight - 180; // 根据实际情况调整
    },
    // 选择图片
    chooseImage() {
      // #ifdef APP-PLUS
      // 检查相机权限
      const checkPermission = () => {
        const permission = plus.android.importClass("android.Manifest");
        const main = plus.android.runtimeMainActivity();
        const pkName = main.getPackageName();
        const checkMethod = plus.android.importClass("android.content.pm.PackageManager");
        const hasPermission = main.checkSelfPermission(permission.permission.CAMERA);
        return hasPermission === checkMethod.PERMISSION_GRANTED;
      };

      if (!checkPermission()) {
        plus.android.requestPermissions(
          ["android.permission.CAMERA"],
          function (resultObj) {
            if (resultObj.granted.length > 0) {
              // 用户同意了权限
              this.showImagePicker();
            } else {
              // 用户拒绝了权限
              uni.showToast({
                title: LocaleUtils.getText('index.cameraPermissionRequired'),
                icon: 'none'
              });
            }
          },
          function (error) {
            console.error('权限请求失败', error);
          }
        );
      } else {
        this.showImagePicker();
      }
      // #endif

      // #ifndef APP-PLUS
      this.showImagePicker();
      // #endif
    },
    // 显示图片选择器
    showImagePicker() {
      uni.chooseImage({
        count: 1,
        sourceType: ['camera', 'album'],
        success: (res) => {
          this.imagePath = res.tempFilePaths[0];
        },
        fail: (err) => {
          console.error('选择图片失败:', err);
          uni.showToast({
            title: LocaleUtils.getText('index.selectImageFailed'),
            icon: 'none'
          });
        }
      });
    },
    // 提取颜色
    pickColor(e) {
      // 获取事件位置，兼容触摸和鼠标事件
      const position = e.touches ? e.touches[0] : e;
      const pageX = position.pageX || position.clientX;
      const pageY = position.pageY || position.clientY;

      // 获取图片容器位置信息
      const query = uni.createSelectorQuery().in(this);
      query.select('.image-container').boundingClientRect(data => {
        if (!data) {
          console.log('未找到图片容器元素');
          return;
        }

        // 计算相对于图片容器的位置
        const x = pageX - data.left;
        const y = pageY - data.top;

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
            // console.log('图片信息：', imgInfo, containerRatio, imageRatio);

            if (imageRatio > containerRatio) {
              // 图片较宽，宽度撑满容器
              displayWidth = imgRect.width;
              displayHeight = displayWidth / imageRatio;
              offsetY = (imgRect.height - displayHeight) / 2;
            } else {
              // 图片较高，高度撑满容器
              displayHeight = imgRect.height;
              displayWidth = displayHeight * imageRatio;
              offsetX = (imgRect.width - displayWidth) / 2;
            }
            // console.log('点击图片显示区域:', x, y, offsetX, offsetY, 'dw=', displayWidth, 'dh=', displayHeight);

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
            // console.log('点击(normalizedX, normalizedY) = ', normalizedX, normalizedY);
            // console.log('调整后的点击位置:', relativeX, relativeY);
            // console.log('点击位置在图片中的坐标:', originalX, originalY);

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

                    // console.log('提取到的颜色:', r, g, b);

                    // 计算颜色值
                    const hex = this.rgbToHex(r, g, b);
                    const cmyk = this.rgbToCmyk(r, g, b);
                    const hsl = this.rgbToHsl(r, g, b);
                    const hlv = this.rgbToHlv(r, g, b);

                    // 根据颜色值确定颜色名称
                    const name = this.getColorName(r, g, b);

                    // 更新选中的颜色
                    this.selectedColor = {
                      name,
                      hex,
                      rgb: { r, g, b },
                      cmyk,
                      hsl,
                      hlv,
                      temperature: this.calculateColorTemperature(r, g, b),
                      wavelength: this.calculateDominantWavelength(r, g, b),
                      luminance: Math.floor((r * 0.299 + g * 0.587 + b * 0.114) / 255 * 100)
                    };
                  },
                  fail: err => {
                    console.error('获取像素颜色失败:', err);
                    uni.showToast({
                      title: LocaleUtils.getText('index.colorExtractionFailed'),
                      icon: 'error'
                    });
                  }
                });
              }, 200);
            });
          },
          fail: err => {
            uni.showToast({
              title: LocaleUtils.getText('index.colorExtractionFailed'),
              icon: 'error'
            });
          }
        });
      }).exec();
    },

    // 计算色温（简化版）
    calculateColorTemperature(r, g, b) {
      return ColorUtils.calculateColorTemperature(r, g, b);
    },

    // 计算主波长（简化版）
    calculateDominantWavelength(r, g, b) {
      return ColorUtils.calculateDominantWavelength(r, g, b);
    },

    // RGB转HEX
    rgbToHex(r, g, b) {
      return ColorUtils.rgbToHex(r, g, b);
    },

    // RGB转CMYK
    rgbToCmyk(r, g, b) {
      return ColorUtils.rgbToCmyk(r, g, b);
    },

    // RGB转HSL
    rgbToHsl(r, g, b) {
      return ColorUtils.rgbToHsl(r, g, b);
    },

    rgbToHlv(r, g, b) {
      return ColorUtils.rgbToHlv(r, g, b);
    },

    // 获取颜色名称 (增强版)
    getColorName(r, g, b) {
      return ColorUtils.getColorName(r, g, b);
    },

    // 保存颜色到历史记录
    // 加载颜色分组
    loadColorGroups() {
      this.colorGroups = GroupUtils.getGroups();
    },

    // 分组选择改变
    onGroupChange(e) {
      const index = e.detail.value;
      this.selectedGroup = this.colorGroups[index].name;
    },

    // 保存颜色
    saveColor() {
      // 尝试调用android的方法
      AdsUtils.showAds();

      if (!this.selectedColor) return;
      // 显示命名弹窗
      this.colorNameInput = this.selectedColor.name || '';
      // 加载颜色分组
      this.loadColorGroups();
      // 默认使用当前颜色名称
      this.showNameDialog = true;
    },

    // 确认保存颜色
    confirmSaveColor() {
      if (!this.selectedColor) return;

      if (!this.colorNameInput.trim()) {
        uni.showToast({
          title: LocaleUtils.getText('index.pleaseEnterColorName'),
          icon: 'none'
        });
        return;
      }

      // 创建历史记录项
      const historyItem = {
        ...this.selectedColor,
        name: this.colorNameInput || this.selectedColor.name, // 使用用户输入的名称
        category: this.selectedGroup ? this.selectedGroup : 'Common',
        timestamp: new Date().toISOString()
      };

      // 添加到历史记录
      this.colorHistory.unshift(historyItem);

      // 限制历史记录数量
      if (this.colorHistory.length > 2000) {
        this.colorHistory.pop();
      }

      // 保存到本地存储
      try {
        uni.setStorageSync('colorHistory', JSON.stringify(this.colorHistory));

        // 保存到分组
        if (this.selectedGroup) {
          const group = this.colorGroups.find(g => g.name === this.selectedGroup);
          if (group) {
            const result = GroupUtils.addColorToGroup(group.id, historyItem);
            if (!result.success) {
              uni.showToast({
                title: result.message,
                icon: 'none'
              });
              return;
            }
          }
        }

        uni.showToast({
          title: LocaleUtils.getText('index.colorSaved'),
          icon: 'success'
        });
      } catch (e) {
        console.error('保存历史记录失败', e);
        uni.showToast({
          title: LocaleUtils.getText('index.saveFailed'),
          icon: 'none'
        });
      }

      // 关闭弹窗
      this.showNameDialog = false;
      this.selectedGroup = '';
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
      return ColorUtils.calculateTemperaturePosition(this.selectedColor.temperature)
    },
    // 计算波长指示器位置
    calculateWavelengthPosition() {
      if (!this.selectedColor) return 0;
      return ColorUtils.calculateWavelengthPosition(this.selectedColor.wavelength)
    },
    // 获取色温渐变样式
    getTemperatureGradientStyle() {
      if (!this.selectedColor) return {};

      // 根据当前颜色调整色温渐变
      const { r, g, b } = this.selectedColor.rgb;
      return ColorUtils.getTemperatureGradientStyle(r, g, b)
    },

    // 获取波长渐变样式
    getWavelengthGradientStyle() {
      if (!this.selectedColor) return {};
      return ColorUtils.getWavelengthGradientStyle(this.selectedColor.hex, this.selectedColor.wavelength)
    },
    // 获取与背景色对比的文字颜色
    getContrastColor() {
      if (!this.selectedColor) return '#000000';
      const { r, g, b } = this.selectedColor.rgb;
      return ColorUtils.getContrastColor(r, g, b)
    },

    // 获取与背景色对比的半透明背景色
    getContrastBackgroundColor() {
      if (!this.selectedColor) return 'rgba(255, 255, 255, 0.2)';
      const { r, g, b } = this.selectedColor.rgb;
      return ColorUtils.getContrastBackgroundColor(r, g, b)
    },

    // 重置图片
    resetImage() {
      this.imagePath = '';
      this.selectedColor = null;
      this.indicatorPosition = { x: 0, y: 0 };
      this.showDetails = false;
      this.showNameDialog = false;
      this.colorNameInput = '';
    },

  }
}
</script>

<style>
@import './index.css';
</style>
