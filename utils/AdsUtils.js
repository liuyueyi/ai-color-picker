const isAndroid = uni.getSystemInfoSync().platform === 'android';

class AdsUtils {
    static showAds() {
        if (!isAndroid) {
            return;
        }

        try {
            const ToastHelper = plus.android.importClass('com.git.hui.uniapp.ads.GlobalAdsManager');
            ToastHelper.autoShowAds();
        } catch (e) {
            console.error('调用Android Toast失败:', e);
        }
    }
}

export default AdsUtils;