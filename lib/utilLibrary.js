'use strict';

const crypto = require('crypto');
const ip = require('ip');
const config = require('config');

const _lib = {
    md5: function(str) {
        const md5 = crypto.createHash('md5');
        return md5.update(str).digest('hex');
    },

    ipToLong: function(ipStr){
        return ip.toLong(ipStr);
    },

    int64ToIp: function(i6){
        return ip.fromLong(i6.toNumber());
    },

    getCsrfToken: function(req) {
        const _self = this;
        if(req.cookies.skey){
            return _self.md5(req.cookies.skey);
        }
        return null;
    },

    getClientInfo: function(req) {
        const platform = req.query.platform || req.body.platform;
        return {
            device: '',
            platform: platform,
            guid: '',
            userIp: this.ipToLong(req.ip)
        };
    },

    outputJsonResult: function(req, res, data, iserr){
        if (iserr) {
            if(data instanceof Error){
                data = {
                    errcode: data.status,
                    errmsg: data.msg || '发生错误'
                };
            }else{
                data = {
                    errcode: -1,
                    errmsg: typeof(data) === 'string' ? data : JSON.stringify(data)
                }
            }
        } else {
            if(data instanceof Error){
                data = {
                    errcode: data.status,
                    errmsg: data.msg || '发生错误'
                };
            }else{
                data = {
                    errcode: 0,
                    errmsg: '',
                    data: data
                }
            }
        }

        res.jsonp(data);
    },

    goLogin: function(req, res, opt){
        res.redirect('/user/login');
    },

    wechatSign: function(rnd) {
        return this.md5(rnd + config.get('wechatConfig.signKey'));
    },

    /**
     * 判断是否在微信内
     * @param req
     * @returns {boolean}
     */
    isWechatWebView: function(req){
        const ua = req.headers['user-agent'];
        return /micromessenger/i.test(ua);
    },

    /**
     * 判断是否在特奢汇的app内
     * @returns {boolean}
     */
    isAppWebView: function(req){
        const ua = req.headers['user-agent'];
        return /teshehui/i.test(ua);
    },

    isIosView: function(req){
        const ua = req.headers['user-agent'];
        const isIphone = /iphone/i.test(ua);
        const isIpad = /ipad/i.test(ua);
        const isIpod = /ipod/i.test(ua);
        return isIphone || isIpad || isIpod;
    },

    isAndroidView: function(req) {
        const ua = req.headers['user-agent'];
        const isAndroid = /android/i.test(ua);
        return isAndroid;
    },

    isMobileView: function(req){
        return this.isIosView(req) || this.isAndroidView(req)
    },

    /**
     * 判断是否在微信内
     * @param req
     * @returns plf(1.PC,2.Android,3.IOS,4.H5-微信,5.H5-Wap,19.其他)
     */
    checkPlatform: function (req) {
        if (this.isAppWebView(req)) {
            if (this.isIosView(req)) {
                return 3
            } else if (this.isAndroidView(req)) {
                return 2
            } else {
                return 19
            }
        } else {
            if (this.isWechatWebView(req)) {
                return 4
            } else {
                return 5
            }
        }
    },

    nl2br: function(str, isXhtml) {
        const breakTag = isXhtml ? '<br />' : '<br>';
        return String(str).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    },

    sliceArr: function(arr, count){
        const n = Math.ceil(arr.length / count);
        const retarr = [];
        for(let i=0; i<n; i++){
            retarr[i] = arr.slice(i*count, (i+1)*count);
        }
        return retarr;
    }
};


if(Date.prototype.format == undefined){
    Date.prototype.format = function (fmt) {
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        const expMap = {'M+':this.getMonth()+1,'d+':this.getDate(),'h+':this.getHours(),'m+':this.getMinutes(),'s+':this.getSeconds(),'S':this.getMilliseconds()};
        for(let exp of expMap){
            if(new RegExp('('+exp+')').test(fmt)){
                fmt = fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(expMap[exp]):(("00"+expMap[exp]).substr((""+expMap[exp]).length)));
            }
        }
        return fmt;
    };
}

module.exports = _lib;