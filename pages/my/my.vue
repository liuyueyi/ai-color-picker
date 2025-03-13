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
                        <uni-icons type="heart-filled" color="#666" />
                        <text style="padding-left: 0.2rem;font-size: 1.1rem;">收藏</text>
                    </view>
                    <!-- <view class="category-item" @click="navigateToGroups">
                        <text>分组</text>
                    </view> -->
                    <view class="category-item add-group" @click="showAddGroupDialog">
                        <uni-icons type="plus" size="20" color="#666" />
                    </view>
                </view>
                <!-- 分组列表 -->
                <view class="group-list" v-if="groups.length > 0">
                    <view class="group-item" v-for="group in groups" :key="group.id"
                        @click="handleGroupItemClick($event, group.id)">
                        <view class="group-info">
                            <text class="group-name">{{ group.name }}</text>
                            <text class="color-count">{{ group.colors.length }}个颜色</text>
                        </view>
                        <view class="group-actions">
                            <uni-icons type="trash" size="25" color="#666" data-action="delete" />
                            <uni-icons type="compose" size="25" color="#666" data-action="edit"
                                style="margin-left: 15px;" />
                        </view>
                    </view>
                </view>
                <view class="empty-hint" v-else>
                    <text>暂无分组，点击上方加号创建新分组</text>
                </view>
            </view>
        </view>
        <!-- 添加分组对话框 -->
        <view class="add-group-dialog" v-if="showAddGroup">
            <view class="dialog-overlay" @click="showAddGroup = false"></view>
            <view class="dialog-content">
                <view class="dialog-header">
                    <text>新建分组</text>
                </view>
                <view class="dialog-body">
                    <input type="text" v-model="newGroupName" placeholder="请输入分组名称"
                        @keypress.enter="handleEnterPress"
                        class="group-input" focus />
                </view>
                <view class="dialog-footer">
                    <button @click="showAddGroup = false">取消</button>
                    <button @click="handleConfirm" type="primary">确定</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { GroupUtils } from '../../utils/GroupUtils.js'

export default {
    data() {
        return {
            showAddGroup: false,
            newGroupName: '',
            groups: []
        }
    },
    onLoad() {
        this.loadGroups()
    },
    // 添加 onShow 生命周期函数
    onShow() {
        // 每次页面显示时重新加载收藏列表
        this.loadGroups()
    },
    methods: {
        loadGroups() {
            this.groups = GroupUtils.getGroups()
        },
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
        navigateToGroup(groupId) {
            // 导航到具体分组页面
            uni.navigateTo({
                url: `/pages/favorite/groups?id=${groupId}`
            })
        },
        handleGroupItemClick(event, groupId) {
            const target = event.target;
            if (target.dataset && target.dataset.action) {
                const action = target.dataset.action;
                if (action === 'delete') {
                    this.deleteGroup(groupId);
                } else if (action === 'edit') {
                    const group = this.groups.find(g => g.id === groupId);
                    if (group) {
                        this.editGroup(group);
                    }
                }
            } else {
                this.navigateToGroup(groupId);
            }
        },
        showAddGroupDialog() {
            this.showAddGroup = true
            this.newGroupName = ''
        },
        handleEnterPress() {
            if (this.newGroupName.trim()) {
                this.handleConfirm()
            }
        },
        handleConfirm() {
            const groupName = this.newGroupName.trim()
            if (groupName) {
                this.createNewGroup(groupName)
                this.showAddGroup = false
            } else {
                uni.showToast({
                    title: '分组名称不能为空',
                    icon: 'none'
                })
            }
        },
        createNewGroup(groupName) {
            const result = GroupUtils.createGroup(groupName)
            if (result.success) {
                this.loadGroups()
                uni.showToast({
                    title: result.message,
                    icon: 'success'
                })
            } else {
                uni.showToast({
                    title: result.message,
                    icon: 'none'
                })
            }
        },
        deleteGroup(groupId) {
            uni.showModal({
                title: '删除分组',
                content: '确定要删除这个分组吗？',
                success: (res) => {
                    if (res.confirm) {
                        const result = GroupUtils.deleteGroup(groupId)
                        if (result.success) {
                            this.loadGroups()
                            uni.showToast({
                                title: result.message,
                                icon: 'success'
                            })
                        } else {
                            uni.showToast({
                                title: result.message,
                                icon: 'none'
                            })
                        }
                    }
                }
            })
        },
        editGroup(group) {
            uni.showModal({
                title: '编辑分组',
                editable: true,
                content: group.name,
                placeholderText: '请输入新的分组名称',
                success: (res) => {
                    if (res.confirm && res.content) {
                        const result = GroupUtils.renameGroup(group.id, res.content)
                        if (result.success) {
                            this.loadGroups()
                            uni.showToast({
                                title: result.message,
                                icon: 'success'
                            })
                        } else {
                            uni.showToast({
                                title: result.message,
                                icon: 'none'
                            })
                        }
                    }
                }
            })
        }
    }
}
</script>

<style>
@import './my.css';
</style>