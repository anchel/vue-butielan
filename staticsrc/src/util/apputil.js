/**
 * Created by Anchel on 2017/1/10.
 */

export default {

    isIos () {
        let ua = navigator.userAgent;
        let isIphone = /iphone/i.test(ua);
        let isIpad = /ipad/i.test(ua);
        let isIpod = /ipod/i.test(ua);
        return isIphone || isIpad || isIpod
    },

    isAndroid () {
        let ua = navigator.userAgent;
        return /android/i.test(ua);
    },

    getAppVersion () {
        let ua = navigator.userAgent;
        let reg = /\s{1}(butielan\/(\d{1,3}\..*))/i;
        let ret = reg.exec(ua);
        if (ret) {
            return ret[2]
        } else {
            return ''
        }
    }
}