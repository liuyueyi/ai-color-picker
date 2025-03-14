<template>
    <view class="container">
        <!-- 顶部导航栏 -->
        <view class="navbar">
            <view class="navbar-left" @click="goBack">
                <uni-icons type="left" size="20" />
            </view>
            <view class="navbar-title">{{ groupName }}</view>
            <view class="navbar-right">
                <uni-icons type="home" size="20" style="margin-left: 15px;" @click="goHome" />
            </view>
        </view>

        <!-- 颜色卡片网格 -->
        <scroll-view class="color-grid" scroll-y>
            <view class="grid-container" v-if="colors.length > 0">
                <view class="color-card" v-for="(color, index) in colors" :key="index" @click="goToColorDetail(color)">
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
                            <text class="value">({{ color.cmyk.c }}%, {{ color.cmyk.m }}%, {{ color.cmyk.y }}%, {{
                color.cmyk.k }}%)</text>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 空状态提示 -->
            <view class="empty-state" v-else>
                <uni-icons type="star" size="64" color="#ccc" />
                <text class="empty-text">{{ LocaleUtils.getText('favorite.groups.noColors') }}</text>
                <text class="empty-subtext">{{ LocaleUtils.getText('favorite.groups.addColors') }}</text>
            </view>
        </scroll-view>
    </view>
</template>

<script>
import GroupUtils from '../../utils/GroupUtils.js'
import LocaleUtils from '../../utils/LocaleUtils.js'

export default {
    data() {
        return {
            LocaleUtils,
            colors: [],
            groupId: null,
            groupName: ''
        }
    },

    onLoad(options) {
        this.groupId = parseInt(options.id)
        this.loadColors()
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
                        title: LocaleUtils.getText('common.backHomeError'),
                        icon: 'none'
                    })
                }
            })
        },

        // 加载颜色数据
        loadColors() {
            try {
                const group = GroupUtils.getGroupById(this.groupId)
                if (group) {
                    this.colors = group.colors
                    this.groupName = group.name
                    console.log('colors', this.colors);
                } else {
                    uni.showToast({
                        title: LocaleUtils.getText('favorite.groups.groupNotExist'),
                        icon: 'none'
                    })
                }
            } catch (e) {
                console.error('加载颜色数据失败', e)
                uni.showToast({
                    title: LocaleUtils.getText('common.loadFailed'),
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
            console.log('colorStr', color);
            uni.navigateTo({
                url: `/pages/detail/detail?color=${colorStr}`
            })
        }
    }
}
</script>

<style>
@import './favorite.css';
</style>