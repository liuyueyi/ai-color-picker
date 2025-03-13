<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="navbar" :style="{ backgroundColor: color.hex, color: getContrastColor() }" v-if="!isFullscreen">
      <view class="navbar-left" @click="goBack">
        <uni-icons type="left" size="20" :color="getContrastColor()" />
      </view>
      <view class="navbar-title"> {{ color.name }}</view>
      <view class="navbar-right">
        <uni-icons type="share" size="20" style="margin-left: 15px;" />
        <uni-icons type="home" size="20" :color="getContrastColor()" style="margin-left: 15px;" @click="goHome" />
      </view>
    </view>

    <!-- 颜色展示区域 -->
    <view class="color-display" :class="{ 'fullscreen': isFullscreen }"
      :style="{ backgroundColor: color.hex, boxShadow: isFullscreen ? 'inset 0 0 50px rgba(255, 255, 255, 0.2)' : 'none' }"
      @click="toggleFullscreen">
      <view class="fullscreen-icon" v-if="!isFullscreen">
        <uni-icons type="arrow-up" size="20" color="#fff" />
      </view>

    </view>

    <!-- 颜色信息 -->
    <view class="color-info" v-if="!isFullscreen">
      <view class="color-title">
        <text>{{ color.hex }} - {{ color.name }}</text>
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
          <text style="font-weight: bold;">Details</text>
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
            <text>HLV:</text>
            <text>({{ color.hlv.h }}°, {{ color.hlv.l }}%, {{ color.hlv.v }}%)</text>
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

    <view class="float-btns">
      <view class="palette-float-btn" @click="doShowColorPicker" :style="{ backgroundColor: color.hex }">
        <uni-icons type="color" size="24" :color="getContrastColor()" />
      </view>
      <view class="favorite-float-btn" @click="toggleFavorite" :style="{ backgroundColor: color.hex }">
        <uni-icons :type="isFavorite ? 'star-filled' : 'star'" size="24" :color="getContrastColor()" />
      </view>
      <view class="tag-float-btn" @click="showGroupSelector = true" :style="{ backgroundColor: color.hex }">
        <uni-icons type="folder-add" size="24" :color="getContrastColor()" />
      </view>
      <view v-if="showSaveButton" class="save-float-btn" @click="showSavePopup = true"
        :style="{ backgroundColor: color.hex }">
        <uni-icons type="plus" size="24" :color="getContrastColor()" />
      </view>
    </view>

    <!-- 调色盘弹窗 -->
    <view class="color-picker-popup-mask" v-if="showColorPicker" @click="showColorPicker = false">
      <view class="color-picker-popup" @click.stop>
        <view class="popup-header">
          <text class="popup-title">调色盘</text>
          <view class="popup-close" @click="showColorPicker = false">
            <uni-icons type="close" size="20" color="#666" />
          </view>
        </view>
        <view class="color-picker-content">
          <canvas class="color-wheel" canvas-id="colorWheel" @touchstart="onColorWheelTouch"
            @touchmove="onColorWheelTouch"></canvas>
          <view class="selected-color-preview" :style="{ backgroundColor: color.hex }"></view>
        </view>
      </view>
    </view>

    <!-- 分组选择弹窗 -->
    <view class="group-popup-mask" v-if="showGroupSelector" @click="showGroupSelector = false">
      <view class="group-popup" @click.stop>
        <view class="popup-header">
          <text class="popup-title">选择分组</text>
          <view class="popup-close" @click="showGroupSelector = false">
            <uni-icons type="close" size="20" color="#666" />
          </view>
        </view>
        <scroll-view class="group-list" scroll-y>
          <view class="group-item" v-for="(group, index) in colorGroups" :key="index" @click="addToGroup(group.name)"
            :class="{ 'active': group.name === color.category }"
            :style="{ 'background-color': group.name === color.category ? color.hex + '20' : 'transparent' }">
            <text class="group-name">{{ group.name }}</text>
            <text class="group-count">({{ group.colors ? group.colors.length : 0 }})</text>
          </view>
        </scroll-view>
        <view class="add-group">
          <input type="text" v-model="newGroupName" placeholder="新建分组" class="group-input" />
          <button class="add-btn" @click="createNewGroup">添加</button>
        </view>
      </view>
    </view>
    <!-- 保存颜色弹窗 -->
    <view class="save-popup-mask" v-if="showSavePopup" @click="showSavePopup = false">
      <view class="save-popup" @click.stop>
        <view class="popup-header">
          <text class="popup-title">保存颜色</text>
          <view class="popup-close" @click="showSavePopup = false">
            <uni-icons type="close" size="20" color="#666" />
          </view>
        </view>
        <view class="popup-content">
          <input type="text" v-model="colorName" placeholder="请输入颜色名称" class="color-input" />
          <picker @change="onGroupChange" :value="selectedGroup" :range="colorGroups" range-key="name"
            class="group-picker">
            <view class="picker-value">{{ selectedGroup ? selectedGroup : '请选择分组' }}</view>
          </picker>
        </view>
        <view class="popup-footer">
          <button class="cancel-btn" @click="showSavePopup = false">取消</button>
          <button class="save-btn" @click="saveColor">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import ColorUtils from '../../utils/colorUtils.js';
import AdsUtils from '../../utils/AdsUtils.js';
import GroupUtils from '../../utils/GroupUtils.js';

export default {
  data() {
    return {
      color: {
        name: '',
        hex: '#000000',
        rgb: { r: 0, g: 0, b: 0 },
        cmyk: { c: 0, m: 0, y: 0, k: 0 },
        hsl: { h: 0, s: 0, l: 0 },
        hlv: { h: 0, l: 0, v: 0 },
        temperature: 0,
        wavelength: 0,
        luminance: 0,
        category: 'Common colors'
      },
      isFullscreen: false,
      showDetails: false,
      percentValue: 100,
      similarColors: [],
      isFavorite: false,
      favoriteColors: [],
      colorGroups: [],
      newGroupName: '',
      showGroupSelector: false,
      showSaveButton: false,
      showSavePopup: false,
      selectedGroup: '',
      colorName: '',
      showColorPicker: false,
      isColorWheelInitialized: false,
      colorWheelContext: null,
    }
  },
  onLoad(options) {
    // 从参数中获取颜色信息
    if (options.color) {
      try {
        this.color = JSON.parse(decodeURIComponent(options.color));
        if (!this.color.rgb) {
          this.color.rgb = ColorUtils.hexToRgb(this.color.hex);
        }

        // 自动计算补齐相关信息
        this.updateColorFromRgb();
        console.log('获取到的颜色:', this.color);
        // 生成相似颜色
        this.generateSimilarColors();
        // 加载收藏状态
        this.loadFavoriteColors();
        // 加载颜色分组
        this.loadColorGroups();
      } catch (e) {
        console.error('解析颜色数据失败', e);
        uni.showToast({
          title: '加载颜色失败',
          icon: 'none'
        });
      }

      this.hideNav();
    }
  },
  onUnload() {
    this.showNav();
  },
  onReady() {
    this.hideNav();
  },
  watch: {
    showColorPicker(newVal) {
      if (newVal && this.colorWheelContext) {
        this.$nextTick(() => {
          const { width, height } = this.colorWheelContext.canvas;
          this.drawColorWheel(this.colorWheelContext, width, height);
          this.colorWheelContext.draw();
        });
      }
    }
  },
  methods: {
    doShowColorPicker() {
      this.showColorPicker = true;
      if (!this.isColorWheelInitialized) {
        this.$nextTick(() => {
          this.initColorWheel();
          this.isColorWheelInitialized = true;
        });
      }
    },
    // 初始化调色盘
    initColorWheel() {
      try {
        const query = uni.createSelectorQuery().in(this);
        query.select('.color-wheel').fields({
          node: true,
          size: true
        }).exec((res) => {
          if (!res || !res[0]) {
            console.error('获取canvas节点失败');
            uni.showToast({
              title: '初始化调色盘失败',
              icon: 'none'
            });
            return;
          }

          const data = res[0];
          const width = data.width || 200;
          const height = data.height || 200;
          const ctx = uni.createCanvasContext('colorWheel', this);

          // 设置canvas尺寸
          ctx.canvas = { width, height };
          this.colorWheelContext = ctx;

          // 清空画布并设置背景
          ctx.fillStyle = '#f5f5f5';
          ctx.fillRect(0, 0, width, height);

          console.log('准备绘制调色盘...');

          this.drawColorWheel(ctx, width, height);
          ctx.draw();
        });
      } catch (error) {
        console.error('初始化调色盘失败:', error);
        uni.showToast({
          title: '初始化调色盘失败',
          icon: 'none'
        });
      }
    },

    // 绘制调色盘
    drawColorWheel(ctx, width, height) {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 10;

      try {
        // 绘制外圈边框
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ddd';
        ctx.stroke();

        console.log('绘制调色盘...', height, width);
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= radius) {
              const hue = (Math.atan2(dy, dx) * 180 / Math.PI + 180) % 360;
              const saturation = Math.min(100, (distance / radius) * 100);
              const [r, g, b] = ColorUtils.hslToRgb(hue, saturation, 50);
              ctx.fillStyle = `rgb(${r},${g},${b})`;
              ctx.fillRect(x, y, 1, 1);
            }
          }
        }
      } catch (error) {
        console.error('绘制调色盘失败:', error);
        uni.showToast({
          title: '初始化调色盘失败',
          icon: 'none'
        });
      }
    },

    // 处理调色盘触摸事件
    onColorWheelTouch(e) {
      const touch = e.touches[0];
      const query = uni.createSelectorQuery().in(this);

      query.select('.color-wheel').boundingClientRect(data => {
        if (!data) {
          uni.showToast({
            title: '颜色选择失败~',
            icon: 'none'
          });
          return;
        }

        const rect = data;
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        // 计算相对于圆心的位置
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const dx = x - centerX;
        const dy = y - centerY;

        // 计算距离和角度
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = Math.min(rect.width, rect.height) / 2 - 10;

        // 确保点击在圆形范围内
        if (distance <= radius) {
          // 计算HSL值
          const hue = (Math.atan2(dy, dx) * 180 / Math.PI + 180) % 360;
          const saturation = Math.min(100, (distance / radius) * 100);
          const lightness = 50; // 固定亮度值

          // 转换为RGB
          const [r, g, b] = ColorUtils.hslToRgb(hue, saturation, lightness);

          // 更新颜色
          this.color.rgb = { r, g, b };
          this.color.hex = ColorUtils.rgbToHex(r, g, b);
          this.updateColorFromRgb();
          this.showSaveButton = true;
        }
      }).exec();
    },

    // 更新颜色数据
    updateColorFromImageData(data) {
      this.color.rgb.r = data[0];
      this.color.rgb.g = data[1];
      this.color.rgb.b = data[2];
      this.updateColorFromRgb();
      this.showSaveButton = true;
    },
    hideNav() {
      // #ifdef APP-PLUS
      plus.navigator.setFullscreen(true); // 隐藏状态栏
      plus.navigator.hideSystemNavigation(); // 隐藏虚拟按键
      plus.navigator.setStatusBarBackground(this.color.hex); // 设置状态栏背景色
      plus.navigator.setNavigationBarColor(this.color.hex); // 设置导航栏背景色
      plus.navigator.setFullscreenNavigationBarColor(this.color.hex); // 设置底部手势区域颜色
      // #endif
    },
    showNav() {
      // #ifdef APP-PLUS
      plus.navigator.setFullscreen(false); // 隐藏状态栏
      plus.navigator.showSystemNavigation(); // 隐藏虚拟按键
      plus.navigator.setStatusBarBackground(this.color.hex); // 恢复状态栏背景色
      plus.navigator.setNavigationBarColor(this.color.hex); // 恢复导航栏背景色
      plus.navigator.setFullscreenNavigationBarColor(this.color.hex); // 恢复底部手势区域颜色
      // #endif
    },
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    goHome() {
      // 返回主页
      // 返回主页
      uni.reLaunch({
        url: '/pages/index/index',
        success: () => {
          console.log('成功返回主页');
        },
        fail: (err) => {
          console.error('返回主页失败', err);
          uni.showToast({
            title: '返回主页失败',
            icon: 'none'
          });
        }
      });
    },

    // 切换全屏显示
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
      if (this.isFullscreen) {
        AdsUtils.showAds();
        this.hideNav()
      } else {
        this.showNav()
      }
    },

    // 切换详情显示
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },

    // 更新红色值
    updateRed(e) {
      this.showSaveButton = true;

      this.color.rgb.r = e.detail.value;
      this.updateColorFromRgb();
    },

    // 更新绿色值
    updateGreen(e) {
      this.showSaveButton = true;

      this.color.rgb.g = e.detail.value;
      this.updateColorFromRgb();
    },

    // 更新蓝色值
    updateBlue(e) {
      this.showSaveButton = true;

      this.color.rgb.b = e.detail.value;
      this.updateColorFromRgb();
    },

    // 根据RGB更新其他颜色值
    updateColorFromRgb() {
      const { r, g, b } = this.color.rgb;

      // 更新HEX
      this.color.hex = ColorUtils.rgbToHex(r, g, b);

      // 更新CMYK
      this.color.cmyk = ColorUtils.rgbToCmyk(r, g, b);

      // 更新HSL
      this.color.hsl = ColorUtils.rgbToHsl(r, g, b);

      // 更新HLV
      this.color.hlv = ColorUtils.rgbToHlv(r, g, b);

      // 更新亮度
      this.color.luminance = Math.floor((r * 0.299 + g * 0.587 + b * 0.114) / 255 * 100);

      // 计算色温
      this.color.temperature = ColorUtils.calculateColorTemperature(r, g, b);
      this.color.wavelength = ColorUtils.calculateDominantWavelength(r, g, b);
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
      return ColorUtils.rgbToHex(newR, newG, newB);
    },

    // 获取与背景色对比的文字颜色
    getContrastColor() {
      const { r, g, b } = this.color.rgb;
      // 计算亮度 (基于人眼对不同颜色的感知)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // 亮度阈值，低于此值使用白色文字，高于此值使用黑色文字
      return luminance > 0.5 ? '#000000' : '#ffffff';
    },

    // 加载收藏的颜色
    loadFavoriteColors() {
      try {
        const favorites = uni.getStorageSync('favoriteColors');
        if (favorites) {
          this.favoriteColors = JSON.parse(favorites);
          this.isFavorite = this.favoriteColors.some(item => item.hex === this.color.hex);
        }
      } catch (e) {
        console.error('读取收藏颜色失败', e);
      }
    },

    // 切换收藏状态
    toggleFavorite() {
      if (this.isFavorite) {
        // 取消收藏
        const index = this.favoriteColors.findIndex(item => item.hex === this.color.hex);
        if (index !== -1) {
          this.favoriteColors.splice(index, 1);
        }
        uni.showToast({
          title: '已取消收藏',
          icon: 'none'
        });
      } else {
        // 添加到收藏
        this.favoriteColors.push(this.color);
        uni.showToast({
          title: '已添加到收藏',
          icon: 'success'
        });
      }

      // 更新收藏状态
      this.isFavorite = !this.isFavorite;

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
    // 获取与背景色对比的文字颜色
    getContrastColor() {
      const { r, g, b } = this.color.rgb;
      return ColorUtils.getContrastColor(r, g, b);
    },

    // 获取光阴效果的颜色
    getGlowColor() {
      const { r, g, b } = this.color.rgb;
      return ColorUtils.getGlowColor(r, g, b);
    },

    // 加载颜色分组
    loadColorGroups() {
      this.colorGroups = GroupUtils.getGroups();
    },

    // 创建新分组
    createNewGroup() {
      if (!this.newGroupName.trim()) {
        uni.showToast({
          title: '分组名称不能为空',
          icon: 'none'
        });
        return;
      }

      const result = GroupUtils.createGroup(this.newGroupName);
      if (result.success) {
        this.colorGroups = GroupUtils.getGroups();
        this.newGroupName = '';
        uni.showToast({
          title: result.message,
          icon: 'success'
        });
      } else {
        uni.showToast({
          title: result.message,
          icon: 'none'
        });
      }
    },

    // 添加颜色到分组
    addToGroup(groupName) {
      const group = this.colorGroups.find(g => g.name === groupName);
      if (!group) return;

      if (this.color.category === groupName) {
        // 如果颜色已在该分组中，则移除
        const result = GroupUtils.removeColorFromGroup(group.id, this.color.hex);
        if (result.success) {
          this.colorGroups = GroupUtils.getGroups();
          this.showGroupSelector = false;
          // 重置分组为默认值
          this.color.category = 'Common';
          uni.showToast({
            title: '已从分组移除',
            icon: 'success'
          });
        } else {
          uni.showToast({
            title: result.message,
            icon: 'none'
          });
        }
        return;
      }

      const result = GroupUtils.addColorToGroup(group.id, this.color);
      if (result.success) {
        this.colorGroups = GroupUtils.getGroups();
        this.showGroupSelector = false;

        // 更新当前颜色的分组
        this.color.category = groupName;
        uni.showToast({
          title: result.message,
          icon: 'success'
        });
      } else {
        uni.showToast({
          title: result.message,
          icon: 'none'
        });
      }
    },

    // 保存颜色分组
    saveColorGroups() {
      try {
        uni.setStorageSync('colorGroups', JSON.stringify(this.colorGroups));
      } catch (e) {
        console.error('保存颜色分组失败', e);
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        });
      }
    },

    // 分组选择改变
    onGroupChange(e) {
      const index = e.detail.value;
      this.selectedGroup = this.colorGroups[index].name;
    },

    // 保存颜色
    saveColor() {
      if (!this.colorName.trim()) {
        uni.showToast({
          title: '请输入颜色名称',
          icon: 'none'
        });
        return;
      }

      if (!this.selectedGroup) {
        uni.showToast({
          title: '请选择分组',
          icon: 'none'
        });
        return;
      }

      const newColor = {
        ...this.color,
        name: this.colorName,
        category: this.selectedGroup
      };

      const group = this.colorGroups.find(g => g.name === this.selectedGroup);
      if (!group) return;

      const result = GroupUtils.addColorToGroup(group.id, newColor);
      if (result.success) {
        this.colorGroups = GroupUtils.getGroups();
        this.showSavePopup = false;
        this.showSaveButton = false;
        this.colorName = '';
        this.selectedGroup = '';

        // 更新当前颜色信息
        this.color = newColor;
        // 取消收藏
        if (this.isFavorite) {
          this.isFavorite = false;
          const index = this.favoriteColors.findIndex(item => item.hex === this.color.hex);
          if (index !== -1) {
            this.favoriteColors.splice(index, 1);
          }
        }

        uni.showToast({
          title: '保存成功',
          icon: 'success'
        });
      } else {
        uni.showToast({
          title: result.message,
          icon: 'none'
        });
      }
    }
  }
}
</script>

<style>
@import './detail.css';


.color-picker-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-picker-popup {
  background-color: #fff;
  border-radius: 12px;
  width: 80%;
  max-width: 300px;
  padding: 20px;
}

.color-picker-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.color-wheel {
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
}

.selected-color-preview {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  border: 2px solid #eee;
}
</style>