const isAndroid = uni.getSystemInfoSync().platform === 'android';
const ADS_DISABLED_KEY = 'ads_disabled_until';

class AdsUtils {
	static androidPlantform () {
		return isAndroid;
	}

    static showAds() {
        if (!isAndroid || this.isAdsDisabled()) {
            return;
        }

        try {
            const ToastHelper = plus.android.importClass('com.git.hui.uniapp.ads.GlobalAdsManager');
            ToastHelper.autoShowAds();
        } catch (e) {
            console.error('调用Android Toast失败:', e);
        }
    }
	
	/**
	 * 视频激励广告
	 */
	static showRewards(callback) {
		if (!isAndroid) {
		    return;
		}
		
		var testModule = uni.requireNativePlugin("AdsModule");
		testModule.showAds('reward', (res) => {
			console.log('app返回的结果是:', res)
			const suc = res && res.code === 'success';
			const disabledUntil = Date.now() + 24 * 60 * 60 * 1000;
			if (suc) {
				// 设置24小时后的时间戳
				uni.setStorageSync(ADS_DISABLED_KEY, disabledUntil);
			}
			if (callback) {
				testModule.printLog(JSON.stringify(res) + "|" + suc + "无广告时间:" + disabledUntil);
				callback(suc);
			}
		})
	}

	static isAdsDisabled() {
		try {
			const disabledUntil = uni.getStorageSync(ADS_DISABLED_KEY);
			if (!disabledUntil) return false;
			return Date.now() < disabledUntil;
		} catch (e) {
			return false;
		}
	}

	static getAdsDisabledStatus() {
		return this.isAdsDisabled();
	}
}

export default AdsUtils;