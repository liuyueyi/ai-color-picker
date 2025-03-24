import enUS from '../locale/en-US.js'
import zhCN from '../locale/zh-CN.js'
import jaJP from '../locale/ja-JP.js'
import zhTW from '../locale/zh-TW.js'
import frFR from '../locale/fr-FR.js'
import deDE from '../locale/de-DE.js'

const LOCALE_KEY = 'app_locale'
const DEFAULT_LOCALE = 'en-US'

export default class LocaleUtils {
    static locales = {
        'en-US': enUS,
        'zh-CN': zhCN,
        'ja-JP': jaJP,
        'zh-TW': zhTW,
        'fr-FR': frFR,
        'de-DE': deDE,
    }

    static currentLocale = uni.getStorageSync(LOCALE_KEY) || DEFAULT_LOCALE

    static getLanguageName(lan) {
        if (lan == 'en-US') {
            return 'English'
        } else if (lan == 'zh-CN') {
            return '简体中文' 
        } else if (lan == 'ja-JP') {
            return '日本語' 
        } else if (lan == 'zh-TW') {
            return '繁體中文'
        }   else if (lan == 'fr-FR') {
            return 'Français' 
        } else if (lan == 'de-DE') {
            return 'Deutsch'
        }
    }

    /**
     * 获取当前语言
     */
    static getCurrentLocale() {
        return this.currentLocale
    }

    static updateTabBar() {
        uni.setTabBarItem({
            index: 0,
            text: this.getText('tabBar.picker')
        })
        uni.setTabBarItem({
            index: 1,
            text: this.getText('tabBar.record')
        })
        uni.setTabBarItem({
            index: 2,
            text: this.getText('tabBar.my')
        })
    }

    /**
     * 切换语言
     * @param {string} locale 语言代码
     */
    static setLocale(locale) {
        if (this.locales[locale]) {
            this.currentLocale = locale
            uni.setStorageSync(LOCALE_KEY, locale)

            this.updateTabBar()
        }
    }

    /**
     * 获取文本
     * @param {string} key 文本键值，支持点号分隔的多级键值
     * @param {Object} params 替换参数
     * @returns {string}
     */
    static getText(key, params = {}) {
        const keys = key.split('.')
        let text = this.locales[this.currentLocale]

        for (const k of keys) {
            if (!text || typeof text !== 'object') {
                return key
            }
            text = text[k]
        }

        if (typeof text !== 'string') {
            return key
        }

        // 替换参数
        return text.replace(/\{([^}]+)\}/g, (match, key) => {
            return params[key] || match
        })
    }

    /**
     * 获取所有支持的语言列表
     * @returns {Array<string>}
     */
    static getSupportedLocales() {
        return Object.keys(this.locales)
    }
}