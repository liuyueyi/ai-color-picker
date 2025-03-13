/**
 * 颜色分组工具类
 * 提供颜色分组的统一管理功能，包括查询、新建、删除、重命名等
 */
export class GroupUtils {
    /**
     * 获取所有颜色分组
     * @returns {Array} 分组列表
     */
    static getGroups() {
        try {
            return uni.getStorageSync('colorGroups') || []
        } catch (e) {
            console.error('获取分组失败:', e)
            return []
        }
    }

    /**
     * 保存分组列表
     * @param {Array} groups 分组列表
     * @returns {boolean} 是否保存成功
     */
    static saveGroups(groups) {
        try {
            uni.setStorageSync('colorGroups', groups)
            return true
        } catch (e) {
            console.error('保存分组失败:', e)
            return false
        }
    }

    /**
     * 根据ID获取分组
     * @param {number} groupId 分组ID
     * @returns {Object|null} 分组对象，如果未找到则返回null
     */
    static getGroupById(groupId) {
        const groups = this.getGroups()
        return groups.find(group => group.id === groupId) || null
    }

    /**
     * 创建新分组
     * @param {string} groupName 分组名称
     * @returns {Object} 包含success和message的结果对象
     */
    static createGroup(groupName) {
        if (!groupName || groupName.trim() === '') {
            return { success: false, message: '分组名称不能为空' }
        }

        try {
            const groups = this.getGroups()
            // 检查是否存在同名分组
            if (groups.some(group => group.name === groupName)) {
                return { success: false, message: '已存在同名分组' }
            }

            const newGroup = {
                id: Date.now(),
                name: groupName,
                colors: []
            }
            groups.push(newGroup)

            if (this.saveGroups(groups)) {
                return { success: true, message: '创建成功', group: newGroup }
            } else {
                return { success: false, message: '创建失败' }
            }
        } catch (e) {
            console.error('创建分组失败:', e)
            return { success: false, message: '创建失败' }
        }
    }

    /**
     * 删除分组
     * @param {number} groupId 分组ID
     * @returns {Object} 包含success和message的结果对象
     */
    static deleteGroup(groupId) {
        try {
            const groups = this.getGroups()
            const index = groups.findIndex(group => group.id === groupId)

            if (index === -1) {
                return { success: false, message: '分组不存在' }
            }

            groups.splice(index, 1)

            if (this.saveGroups(groups)) {
                return { success: true, message: '删除成功' }
            } else {
                return { success: false, message: '删除失败' }
            }
        } catch (e) {
            console.error('删除分组失败:', e)
            return { success: false, message: '删除失败' }
        }
    }

    /**
     * 重命名分组
     * @param {number} groupId 分组ID
     * @param {string} newName 新名称
     * @returns {Object} 包含success和message的结果对象
     */
    static renameGroup(groupId, newName) {
        if (!newName || newName.trim() === '') {
            return { success: false, message: '分组名称不能为空' }
        }

        try {
            const groups = this.getGroups()
            const group = groups.find(group => group.id === groupId)

            if (!group) {
                return { success: false, message: '分组不存在' }
            }

            // 检查是否存在同名分组（排除自身）
            if (groups.some(g => g.id !== groupId && g.name === newName)) {
                return { success: false, message: '已存在同名分组' }
            }

            group.name = newName

            if (this.saveGroups(groups)) {
                return { success: true, message: '重命名成功' }
            } else {
                return { success: false, message: '重命名失败' }
            }
        } catch (e) {
            console.error('重命名分组失败:', e)
            return { success: false, message: '重命名失败' }
        }
    }

    /**
     * 向分组添加颜色
     * @param {number} groupId 分组ID
     * @param {Object} color 颜色对象
     * @returns {Object} 包含success和message的结果对象
     */
    static addColorToGroup(groupId, color) {
        try {
            const groups = this.getGroups()
            const group = groups.find(group => group.id === groupId)

            if (!group) {
                return { success: false, message: '分组不存在' }
            }

            // 检查颜色是否已存在于当前分组
            if (group.colors.some(c => c.hex === color.hex)) {
                // 如果颜色的当前分组和目标分组相同，则允许更新
                if (color.category === group.name) {
                    // 更新颜色信息（以防有其他属性变化）
                    const index = group.colors.findIndex(c => c.hex === color.hex);
                    group.colors[index] = { ...color };

                    if (this.saveGroups(groups)) {
                        return { success: true, message: '更新成功' };
                    }
                }
                return { success: true, message: '添加成功' };
            }

            // 添加到新分组
            group.colors.push({ ...color, category: group.name });

            if (this.saveGroups(groups)) {
                return { success: true, message: '添加成功' }
            } else {
                return { success: false, message: '添加失败' }
            }
        } catch (e) {
            console.error('添加颜色失败:', e)
            return { success: false, message: '添加失败' }
        }
    }

    /**
     * 从分组移除颜色
     * @param {number} groupId 分组ID
     * @param {string} colorHex 颜色的十六进制值
     * @returns {Object} 包含success和message的结果对象
     */
    static removeColorFromGroup(groupId, colorHex) {
        try {
            const groups = this.getGroups()
            const group = groups.find(group => group.id === groupId)

            if (!group) {
                return { success: false, message: '分组不存在' }
            }

            const index = group.colors.findIndex(color => color.hex === colorHex)
            if (index === -1) {
                return { success: false, message: '颜色不存在于该分组' }
            }

            group.colors.splice(index, 1)

            if (this.saveGroups(groups)) {
                return { success: true, message: '移除成功' }
            } else {
                return { success: false, message: '移除失败' }
            }
        } catch (e) {
            console.error('移除颜色失败:', e)
            return { success: false, message: '移除失败' }
        }
    }
}