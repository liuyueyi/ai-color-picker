<template>
    <view class="container">
        <!-- 顶部导航栏 -->
        <view class="navbar">
            <view class="navbar-left"></view>
            <view class="navbar-title">My</view>
            <view class="navbar-right">
            </view>
        </view>

        <view class="my-content">
            <!-- 系统色 -->
            <view class="system-colors">
                <view class="section-header">
                    <text>系统色</text>
                    <uni-icons type="right" size="16" color="#666" />
                </view>
                <view class="color-categories">
                    <view class="category-item" @click="navigateToCategory('chinese')">
                        <text>中国传统色</text>
                    </view>
                    <view class="category-item" @click="navigateToCategory('japanese')">
                        <text>日本传统色</text>
                    </view>
                </view>
            </view>

            <!-- 我的 -->
            <view class="my-section">
                <view class="section-header">
                    <text>我的</text>
                    <uni-icons type="right" size="16" color="#666" />
                </view>
                <view class="my-categories">
                    <view class="category-item" @click="navigateToFavorites">
                        <text>收藏</text>
                    </view>
                    <view class="category-item" @click="navigateToGroups">
                        <text>分组</text>
                    </view>
                    <view class="category-item add-group" @click="showAddGroupDialog">
                        <uni-icons type="plus" size="20" color="#666" />
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
            showAddGroup: false
        }
    },
    methods: {
        navigateToCategory(type) {
            // 导航到对应的传统色页面
            uni.navigateTo({
                url: `/pages/colors/colors?type=${type}`
            })
        },
        navigateToFavorites() {
            // 导航到收藏页面
            uni.navigateTo({
                url: '/pages/favorite/favorite'
            })
        },
        navigateToGroups() {
            // 导航到分组页面
            uni.navigateTo({
                url: '/pages/groups/groups'
            })
        },
        showAddGroupDialog() {
            // 显示添加分组对话框
            uni.showModal({
                title: '新建分组',
                editable: true,
                placeholderText: '请输入分组名称',
                success: (res) => {
                    if (res.confirm && res.content) {
                        this.createNewGroup(res.content)
                    }
                }
            })
        },
        createNewGroup(groupName) {
            // 创建新分组
            try {
                const groups = uni.getStorageSync('colorGroups') || []
                groups.push({
                    id: Date.now(),
                    name: groupName,
                    colors: []
                })
                uni.setStorageSync('colorGroups', groups)
                uni.showToast({
                    title: '创建成功',
                    icon: 'success'
                })
            } catch (e) {
                uni.showToast({
                    title: '创建失败',
                    icon: 'none'
                })
            }
        }
    }
}
</script>

<style>
@import './my.css';
</style>