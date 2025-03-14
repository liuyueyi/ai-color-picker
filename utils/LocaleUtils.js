import enUS from '../locale/en-US.js'
import zhCN from '../locale/zh-CN.js'

const LOCALE_KEY = 'app_locale'
const DEFAULT_LOCALE = 'zh-CN'

export default class LocaleUtils {
  static locales = {
    'en-US': enUS,
    'zh-CN': zhCN
  }
  
  static currentLocale = uni.getStorageSync(LOCALE_KEY) || DEFAULT_LOCALE
  
  /**
   * 获取当前语言
   */
  static getCurrentLocale() {
    return this.currentLocale
  }
  
  /**
   * 切换语言
   * @param {string} locale 语言代码
   */
  static setLocale(locale) {
    if (this.locales[locale]) {
      this.currentLocale = locale
      uni.setStorageSync(LOCALE_KEY, locale)
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