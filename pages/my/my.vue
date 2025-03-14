<template>
    <view class="container">
        <!-- 顶部导航栏 -->
        <view class="navbar">
            <view class="navbar-left"></view>
            <view class="navbar-title">{{ LocaleUtils.getText('common.my') }}</view>
            <view class="navbar-right">
                <uni-icons type="gear" size="20" color="#666" @click="showLanguagePanel = true" />
            </view>
        </view>

        <view class="my-content">
            <!-- 系统色 -->
            <view class="system-colors">
                <view class="section-header">
                    <text>{{ LocaleUtils.getText('my.systemColors') }}</text>
                    <uni-icons type="right" size="16" color="#666" />
                </view>
                <view class="color-categories">
                    <view class="category-item" @click="navigateToCategory('chinese')">
                        <text>{{ LocaleUtils.getText('my.chineseColors') }}</text>
                    </view>
                    <view class="category-item" @click="navigateToCategory('japanese')">
                        <text>{{ LocaleUtils.getText('my.japaneseColors') }}</text>
                    </view>
                    <view class="category-item" @click="navigateToCategory('uk')">
                        <text>{{ LocaleUtils.getText('my.ukColors') }}</text>
                    </view>
                    <view class="category-item" @click="navigateToCategory('usa')">
                        <text>{{ LocaleUtils.getText('my.usaColors') }}</text>
                    </view>
                    <view class="category-item" @click="navigateToCategory('france')">
                        <text>{{ LocaleUtils.getText('my.franceColors') }}</text>
                    </view>
                </view>
            </view>

            <!-- 我的 -->
            <view class="my-section">
                <view class="section-header">
                    <text>{{ LocaleUtils.getText('my.title') }}</text>
                    <uni-icons type="right" size="16" color="#666" />
                </view>
                <view class="my-categories">
                    <view class="category-item" @click="navigateToFavorites">
                        <uni-icons type="heart-filled" color="#666" />
                        <text style="padding-left: 0.2rem;font-size: 1.1rem;">{{ LocaleUtils.getText('common.favorite') }}</text>
                    </view>
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
                            <text class="color-count">{{ group.colors.length }}{{ LocaleUtils.getText('my.colorCount') }}</text>
                        </view>
                        <view class="group-actions">
                            <uni-icons type="trash" size="25" color="#666" data-action="delete" />
                            <uni-icons type="compose" size="25" color="#666" data-action="edit"
                                style="margin-left: 15px;" />
                        </view>
                    </view>
                </view>
                <view class="empty-hint" v-else>
                    <text>{{ LocaleUtils.getText('my.noGroups') }}</text>
                </view>
            </view>
        </view>

        <!-- 添加分组对话框 -->
        <view class="add-group-dialog" v-if="showAddGroup">
            <view class="dialog-overlay" @click="showAddGroup = false"></view>
            <view class="dialog-content">
                <view class="dialog-header">
                    <text>{{ LocaleUtils.getText('favorite.createGroup') }}</text>
                </view>
                <view class="dialog-body">
                    <input type="text" v-model="newGroupName" :placeholder="LocaleUtils.getText('favorite.groupName')"
                        @keypress.enter="handleEnterPress" class="group-input" focus />
                </view>
                <view class="dialog-footer">
                    <button @click="showAddGroup = false">{{ LocaleUtils.getText('common.cancel') }}</button>
                    <button @click="handleConfirm" type="primary">{{ LocaleUtils.getText('common.confirm') }}</button>
                </view>
            </view>
        </view>

        <!-- 语言选择面板 -->
        <view class="language-panel" v-if="showLanguagePanel">
            <view class="panel-overlay" @click="showLanguagePanel = false"></view>
            <view class="panel-content">
                <view class="panel-header">
                    <text>{{ LocaleUtils.getText('my.language') }}</text>
                </view>
                <view class="panel-body">
                    <view class="language-option" :class="{ active: currentLanguage === 'zh-CN' }" @click="changeLanguage('zh-CN')">
                        <text>简体中文</text>
                        <uni-icons v-if="currentLanguage === 'zh-CN'" type="checkmarkempty" size="20" color="#007AFF" />
                    </view>
                    <view class="language-option" :class="{ active: currentLanguage === 'en-US' }" @click="changeLanguage('en-US')">
                        <text>English</text>
                        <uni-icons v-if="currentLanguage === 'en-US'" type="checkmarkempty" size="20" color="#007AFF" />
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import GroupUtils from '../../utils/GroupUtils.js'
import LocaleUtils from '../../utils/LocaleUtils.js'

export default {
    data() {
        return {
            LocaleUtils,
            showAddGroup: false,
            showLanguagePanel: false,
            newGroupName: '',
            groups: [],
            currentLanguage: LocaleUtils.getCurrentLocale()
        }
    },
    onLoad() {
        this.loadGroups()
    },
    onShow() {
        this.loadGroups()
    },
    methods: {
        loadGroups() {
            this.groups = GroupUtils.getGroups()
        },
        navigateToCategory(type) {
            uni.navigateTo({
                url: `/pages/colors/colors?type=${type}`
            })
        },
        navigateToFavorites() {
            uni.navigateTo({
                url: '/pages/favorite/favorite'
            })
        },
        navigateToGroup(groupId) {
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
                    title: LocaleUtils.getText('my.groupNameRequired'),
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
                title: LocaleUtils.getText('favorite.deleteGroup'),
                content: LocaleUtils.getText('my.confirmDeleteGroup'),
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
                title: LocaleUtils.getText('my.editGroup'),
                editable: true,
                content: group.name,
                placeholderText: LocaleUtils.getText('favorite.groupName'),
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
        },
        changeLanguage(lang) {
            LocaleUtils.setLocale(lang)
            this.currentLanguage = lang
            this.showLanguagePanel = false
            // 刷新页面
            uni.reLaunch({
                url: '/pages/my/my'
            })
        }
    }
}
</script>

<style>
@import './my.css';
</style>