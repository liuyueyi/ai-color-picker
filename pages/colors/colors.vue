<template>
    <view class="container">
      <!-- 顶部导航栏 -->
      <view class="navbar">
        <view class="navbar-left" @click="goBack">
          <uni-icons type="left" size="20" />
        </view>
        <view class="navbar-title">{{ pageTitle }}</view>
        <view class="navbar-right">
          <uni-icons type="home" size="20" style="margin-left: 15px;" @click="goHome" />
        </view>
      </view>

      <!-- 搜索框 -->
      <view class="search-box">
        <view class="search-input-wrapper">
          <uni-icons type="search" size="16" color="#666" />
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索颜色名称或十六进制值"
            class="search-input"
            @input="handleSearch"
          />
          <uni-icons
            v-if="searchQuery"
            type="clear"
            size="16"
            color="#666"
            @click="clearSearch"
          />
        </view>
      </view>
  
      <!-- 颜色卡片网格 -->
      <scroll-view class="color-grid" scroll-y @scroll="handleScroll" :scroll-top="scrollTop" scroll-with-animation>
        <view class="grid-container" v-if="filteredColors.length > 0">
          <view class="color-card" v-for="(color, index) in filteredColors" :key="index" @click="goToColorDetail(color)">
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
                <text class="value">({{ color.RGB[0] }}, {{ color.RGB[1] }}, {{ color.RGB[2] }})</text>
              </view>
              <view class="info-row">
                <text class="label">CMYK</text>
                <text class="value">({{ color.CMYK[0] }}%, {{ color.CMYK[1] }}%, {{ color.CMYK[2] }}%, {{ color.CMYK[3] }}%)</text>
              </view>
            </view>
          </view>
        </view>
        <!-- 空状态提示 -->
        <view class="empty-state" v-else>
          <uni-icons type="search" size="64" color="#ccc" />
          <text class="empty-text" v-if="searchQuery">未找到相关颜色</text>
          <text class="empty-text" v-else>暂无颜色数据</text>
          <text class="empty-subtext" v-if="searchQuery">请尝试其他搜索关键词</text>
          <text class="empty-subtext" v-else>系统错误，请稍后重试</text>
        </view>
      </scroll-view>

      <!-- 返回顶部按钮 -->
      <view class="back-to-top" :class="{ show: showBackToTop }" @click="scrollToTop">
        <uni-icons type="top" size="20" color="#fff" />
      </view>
    </view>
  </template>
  
  <script>
  import chinaColors from '../../utils/china_color.js'
  import japaneseColors from '../../utils/janpan_color.js'
  import ColorUtil from '../../utils/colorUtils.js'
import ColorUtils from '../../utils/colorUtils.js'

  export default {
    data() {
      return {
        colors: [],
        pageTitle: '',
        searchQuery: '',
        searchTimeout: null,
        showBackToTop: false,
        scrollTop: 0
      }
    },
  
    computed: {
      filteredColors() {
        const query = this.searchQuery.toLowerCase().trim()
        if (!query) return this.colors
        
        return this.colors.filter(color => {
          const name = color.name.toLowerCase()
          const hex = color.hex.toLowerCase()
          return name.includes(query) || hex.includes(query)
        })
      }
    },

    onLoad(options) {
      const { type } = options
      this.loadColors(type)
    },
  
    methods: {
      // 返回上一页
      goBack() {
        uni.navigateBack()
      },

      goHome() {
        uni.reLaunch({
          url: '/pages/index/index',
          success: () => {
            console.log('成功返回主页')
          },
          fail: (err) => {
            console.error('返回主页失败', err)
            uni.showToast({
              title: '返回主页失败',
              icon: 'none'
            })
          }
        })
      },

      // 处理搜索输入（带防抖）
      handleSearch() {
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout)
        }
        this.searchTimeout = setTimeout(() => {
          // 搜索逻辑已通过计算属性实现
          this.searchTimeout = null
        }, 300)
      },

      // 清除搜索
      clearSearch() {
        this.searchQuery = ''
      },

      // 加载颜色数据
      loadColors(type) {
        try {
          if (type === 'chinese') {
            this.colors = chinaColors
            this.pageTitle = '中国传统色'
          } else if (type === 'japanese') {
            this.colors = japaneseColors
            this.pageTitle = '日本传统色'
          } else {
            throw new Error('无效的颜色类型')
          }
        } catch (e) {
          console.error('加载颜色数据失败', e)
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
        const r = color.RGB[0], g = color.RGB[1], b = color.RGB[2];
        const colorStr = encodeURIComponent(JSON.stringify({
          hex: color.hex,
          name: color.name,
          rgb: {
            r: r,
            g: g,
            b: b
          },
          cmyk: {
            c: color.CMYK[0],
            m: color.CMYK[1],
            y: color.CMYK[2],
            k: color.CMYK[3]
          }
        }))
        uni.navigateTo({
          url: `/pages/detail/detail?color=${colorStr}`
        })
      },

      // 处理滚动事件
      handleScroll(e) {
        this.showBackToTop = e.detail.scrollTop > 200;
      },

      // 滚动到顶部
      scrollToTop() {
        this.scrollTop = 1
        setTimeout(() => {
          this.scrollTop = 0
        }, 0)
      }
    }
  }
  </script>
  
  <style>
  @import './colors.css';
  </style>