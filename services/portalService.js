'use strict';

var config = require('config');
var querystring = require('querystring');
var _ = require('lodash');
var utilLibrary = require('../lib/utilLibrary');
var requestLibrary = require('../lib/requestLibrary');
var portalBaseUrl = config.get('hostConfig.portalweb');
var ResponseError = require('../errors/ResponseError');
var Logger = require('../lib/logger');
var log = Logger.getLogger();

function wrapret (body, cb) {
    if (body && body.status === 200) {
        cb(null, body);
    } else {
        cb(new ResponseError({status: body.code, msg: body.message}));
    }
}

function portalRequest (req, options, cb) {
	options = options || {};
	var defaultParams = {
        timestamp: +new Date,
        clientType: options.clientType || 'WAP',
        imei:'wap',
        clientVersion: '5.1.0',
        ditchCode: 'tsh',
        token: req.cookies.skey || '',
        userId: req.cookies.userid || '',
    };

    // 数据上报url
    var urlDateReport = querystring.stringify({
        uid: req.cookies.userid,
        plf: utilLibrary.checkPlatform(req)
    })

	var defaultOptions = {
        url: portalBaseUrl + '/client?' + urlDateReport,
        method: 'post',
        json: true,
        timeout: 10000,
        proxy: 'http://127.0.0.1:8888'
    };
    _.extend(defaultParams, options.form || {});
    options.form = {
    	requestObj: JSON.stringify(defaultParams)
    };
    _.extend(defaultOptions, options);
    requestLibrary.portalWebRequest(defaultOptions, function (err, body, httpResponse) {
        if (err || !body) {
            cb(new ResponseError(ResponseError.REQUEST_PORTAL_ERROR),body);
            log.error('portaRequestError form.requestObj:%s', JSON.stringify(defaultParams));
        } else {
            wrapret(body, cb);
        }
    });
}

var portalService = {
    // 获取首页默认数据
    getindexbaseinf: function(req, options, cb){
        options = options || {};
        var defaultParams = {
            requestClassName: 'com.teshehui.portal.client.index.request.PortalIndexBaseInfoRequest',
            url: '/index/queryIndexBaseInfos',
        };
        var defaultOptions = {};
        options.form = _.extend(defaultParams, options.form || {});
        _.extend(defaultOptions, options);
        portalRequest(req, defaultOptions, cb)
    },
    // 获取首页自定义模版数据
    getcustompageinf: function(req, options, cb){
        options = options || {};
        var defaultParams = {
            requestClassName: 'com.teshehui.portal.client.index.request.PortalCustomPageRequest',
            url: '/index/queryCustomPageInfos',
        };
        var defaultOptions = {};
        options.form = _.extend(defaultParams, options.form || {});
        _.extend(defaultOptions, options);
        portalRequest(req, defaultOptions, cb)
    },
    // 获取首页固定模版数据
    getfixedpageinf: function(req, options, cb){
        options = options || {};
        var defaultParams = {
            requestClassName: 'com.teshehui.portal.client.index.request.PortalFixedPageRequest',
            url: '/index/queryFixedPageInfos',
        };
        var defaultOptions = {};
        options.form = _.extend(defaultParams, options.form || {});
        _.extend(defaultOptions, options);
        portalRequest(req, defaultOptions, cb)
    },
    // 获取即将开抢数据
    getsnapupinf: function(req, options, cb){
        options = options || {};
        var defaultParams = {
            requestClassName: 'com.teshehui.portal.client.index.request.PortalSnapUpRequest',
            url: '/index/querySnapUpInfos',
        };
        var defaultOptions = {};
        options.form = _.extend(defaultParams, options.form || {});
        _.extend(defaultOptions, options);
        portalRequest(req, defaultOptions, cb)
    },
    // 用户登录检查
	checkLogin: function(req, options, cb){
		options = options || {};
        var defaultParams = {
	        requestClassName: 'com.teshehui.portal.client.user.request.PortalUserLoginCheckRequest',
	        url: '/user/userLoginCheck'
        };
        var defaultOptions = {};
        options.form = _.extend(defaultParams, options.form || {});
        _.extend(defaultOptions, options);
        portalRequest(req, defaultOptions, cb)
    },
    // 获取登录信息
	getUserInfo: function(req, options, cb){
		options = options || {};
        var defaultParams = {
	        requestClassName: 'com.teshehui.portal.client.user.request.QueryUserInfoRequest',
	        url: '/user/queryUserInfo'
        };
        var defaultOptions = {};
        options.form = _.extend(defaultParams, options.form || {});
        _.extend(defaultOptions, options);
        portalRequest(req, defaultOptions, cb)
    },
    // 获取验证码
    getVerificationCode: function(req, options, cb) {
    	options = options || {};
        var defaultParams = {
	        requestClassName: 'com.teshehui.portal.client.user.request.PortalMemberSmsRequest',
            url: '/user/sendMemberSms',
        };
        var defaultOptions = {};
        options.form = _.extend(defaultParams, options.form || {});
        _.extend(defaultOptions, options);
        portalRequest(req, defaultOptions, cb)
    },
    // 手机验证登录
    phoneLogin: function (req, options, cb) {
        options = options || {};
        var defaultParams = {
	        requestClassName: 'com.teshehui.portal.client.user.request.PortalMobRegLoginRequest',
            url: '/user/userRegLogin',
            loginMark: 0,
            reportData: querystring.stringify({
                plf: utilLibrary.checkPlatform(req),
                lgt: 201
            })
        };
        var defaultOptions = {};
        options.form = _.extend(defaultParams, options.form || {});
        _.extend(defaultOptions, options);
        portalRequest(req, defaultOptions, cb)
    },
    // 密码登录
    passwordLogin: function (req, options, cb) {
        options = options || {};
        var defaultParams = {
            requestClassName: 'com.teshehui.portal.client.user.request.PortalUserLoginRequest',
            url: '/user/userLogin',
            loginMark: 0,
            reportData: querystring.stringify({
                plf: utilLibrary.checkPlatform(req),
                lgt: 201
            })
        };
        var defaultOptions = {};
        options.form = _.extend(defaultParams, options.form || {});
        _.extend(defaultOptions, options);
        portalRequest(req, defaultOptions, cb)
    },
    // 重置密码
    passwordReset: function (req, options, cb) {
        options = options || {};
        var defaultParams = {
            requestClassName: 'com.teshehui.portal.client.user.request.PortalUpdateUserPasswordRequest',
            url: '/user/userPwdUpdate',
            loginMark: 0,
            reportData: querystring.stringify({
                plf: utilLibrary.checkPlatform(req)
            })
        };
        var defaultOptions = {};
        options.form = _.extend(defaultParams, options.form || {});
        _.extend(defaultOptions, options);
        portalRequest(req, defaultOptions, cb)
    },
    // 修改手机号
    phoneReset: function (req, options, cb) {
        options = options || {};
        var defaultParams = {
            requestClassName: 'com.teshehui.portal.client.user.request.PortalUpdateUserMobRequest',
            url: '/user/userMobUpdate',
            loginMark: 0,
            reportData: querystring.stringify({
                plf: utilLibrary.checkPlatform(req)
            })
        };
        var defaultOptions = {};
        options.form = _.extend(defaultParams, options.form || {});
        _.extend(defaultOptions, options);
        portalRequest(req, defaultOptions, cb)
    },
    // 验证手机验证码，获取checktoken
    checkVerifyCode: function (req, options, cb) {
        options = options || {};
        var defaultParams = {
            requestClassName: 'com.teshehui.portal.client.user.request.PortalMemberSmsValidRequest',
            url: '/user/validMemberSms',
            loginMark: 0,
            reportData: querystring.stringify({
                plf: utilLibrary.checkPlatform(req)
            })
        };
        var defaultOptions = {};
        options.form = _.extend(defaultParams, options.form || {});
        _.extend(defaultOptions, options);
        portalRequest(req, defaultOptions, cb)
    },
    // 登出
    userLogout: function (req, options, cb) {
        options = options || {};
        var defaultParams = {
	        requestClassName: 'com.teshehui.portal.client.user.request.PortalUserLogoutRequest',
            url: '/user/userLogout',
        };
        var defaultOptions = {};
        options.form = _.extend(defaultParams, options.form || {});
        _.extend(defaultOptions, options);
        portalRequest(req, defaultOptions, cb)
    },

    // 判断手机号是否被注册
    checkPhoneReg: function (req, options, cb) {
        options = options || {};
        var defaultParams = {
            requestClassName: 'com.teshehui.portal.client.user.request.PortalPhoneRegCheckRequest',
            url: '/user/isAlreadyReg',
        };
        var defaultOptions = {};
        options.form = _.extend(defaultParams, options.form || {});
        _.extend(defaultOptions, options);
        portalRequest(req, defaultOptions, cb)
    },

    // 检查补贴蓝升级信息
    checkButielanUpgrade: function (req, options, cb) {
        options = options || {};
        var defaultParams = {
            requestClassName: 'com.teshehui.portal.client.index.request.AndroidUpgradeRequest',
            url: '/index/querySubsidyBlueClientVersion',
        };
        var defaultOptions = {
            clientType: utilLibrary.isAndroidView(req)? 'ANDROID' : 'ANDROID'
        };
        options.form = _.extend(defaultParams, options.form || {});
        _.extend(defaultOptions, options);
        portalRequest(req, defaultOptions, cb)
    }
};

module.exports = portalService;


