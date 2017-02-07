'use strict';

var config = require('config');
var querystring = require('querystring');
var _ = require('lodash');
var utilLibrary = require('../lib/utilLibrary');
var requestLibrary = require('../lib/requestLibrary');
var uipBaseUrl = config.get('hostConfig.uip');
var ResponseError = require('../errors/ResponseError');
var Logger = require('../lib/logger');
var log = Logger.getLogger();

function wrapret (body, cb) {
    if (body.status === 0 && body.code == 0) {
        cb(null, body.data);
    } else {
        cb(new ResponseError({status: body.status || body.code, msg: body.message}));
    }
}

function preRequest (req, options, cb) {
	let defaultParams = {
	    version: '1.0.0',
        businessType: '01',
        timestamp: +new Date,
        clientType: 'WAP',
        imei:'wap',
        clientVersion: '5.1.0',
        ditchCode: 'tsh',
        token: req.cookies.skey || '',
        userId: req.cookies.userid || '',
    };

    options.body = _.extend(defaultParams, options.body);

	let defaultOptions = {
        url: uipBaseUrl,
        method: 'post',
        json: true,
        timeout: 10000,
        proxy: 'http://127.0.0.1:8888'
    };
    _.extend(defaultOptions, options);
    requestLibrary.request(defaultOptions, function (err, body) {
        if (err || !body) {
            cb(new ResponseError(ResponseError.REQUEST_PORTAL_ERROR),body);
        } else {
            wrapret(body, cb);
        }
    });
}

const _Service = {

    // 获取统计数据
    getStatisticsInfo: function(req, params, cb){
        params = params || {};
        let options = {
            headers: {
                '-Guid': 1,
                '-Command': 'clearing.manager.subsidy.PromoteSubsidyManager.getStatisticsInfo'
            },
            body: params
        };
        preRequest(req, options, cb)
    },

    // 获取本月数据
    get_month_tongji: function(req, params, cb){
        params = params || {};
        let options = {
            headers: {
                '-Guid': 1,
                '-Command': 'clearing.manager.subsidy.PromoteSubsidyManager.getMonthStatistics'
            },
            body: params
        };
        preRequest(req, options, cb)
    },

    // 获取月结收益列表
    get_yuejie_list: function(req, params, cb){
        params = params || {};
        let options = {
            headers: {
                '-Guid': 1,
                '-Command': 'clearing.manager.subsidy.PromoteSubsidyManager.getClearingsList'
            },
            body: params
        };
        preRequest(req, options, cb)
    },

    // 获取会员列表
    get_member_list: function(req, params, cb){
        params = params || {};
        let options = {
            headers: {
                '-Guid': 1,
                '-Command': 'clearing.manager.subsidy.PromoteSubsidyManager.getMembers'
            },
            body: params
        };
        preRequest(req, options, cb)
    },

    // 获取创客列表
    get_maker_list: function(req, params, cb){
        params = params || {};
        let options = {
            headers: {
                '-Guid': 1,
                '-Command': 'clearing.manager.subsidy.PromoteSubsidyManager.getPromoters'
            },
            body: params
        };
        preRequest(req, options, cb)
    },

    // 获取分润订单列表
    get_order_list: function(req, params, cb){
        params = params || {};
        let options = {
            headers: {
                '-Guid': 1,
                '-Command': 'clearing.manager.subsidy.PromoteSubsidyManager.getOrders'
            },
            body: params
        };
        preRequest(req, options, cb)
    },

    // 获取会员卡列表
    get_card_list: function(req, params, cb){
        params = params || {};
        let options = {
            headers: {
                '-Guid': 1,
                '-Command': 'clearing.manager.subsidy.EntityCardManager.getMemberCardList'
            },
            body: params
        };
        preRequest(req, options, cb)
    },

    // 获取补贴蓝用户信息
    get_user_info: function(req, params, cb){
        params = params || {};
        let options = {
            headers: {
                '-Guid': 1,
                '-Command': 'clearing.manager.subsidy.PromoteSubsidyManager.getUserInfo'
            },
            body: params
        };
        preRequest(req, options, cb)
    },

    // 创客审核操作
    maker_shenhe: function(req, params, cb){
        params = params || {};
        let options = {
            headers: {
                '-Guid': 1,
                '-Command': 'clearing.manager.subsidy.PromoteSubsidyManager.checkPromoter'
            },
            body: params
        };
        preRequest(req, options, cb)
    }
};

module.exports = _Service;


