'use strict';

var config = require('config');
var querystring = require('querystring');
var _ = require('lodash');
var utilLibrary = require('../lib/utilLibrary');
var requestLibrary = require('../lib/requestLibrary');
var baseUrl = config.get('hostConfig.pay_gateway');
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
        partnerCode: 'TSH_MAKER',
        signType: 'md5',
        clientType: 'WAP',
        clientVersion: '5.1.0',
        token: req.cookies.skey || '',
        userId: req.cookies.userid || '',
        //userId: 163
    };

    options.body = _.extend(defaultParams, options.body);

	let defaultOptions = {
        url: baseUrl + '/service',
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

    // 添加提现银行卡
    add_bank_card: function(req, params, cb){
        params = params || {};
        _.extend(params, {
            serviceCode: 'WITHDRAW_CARD_ADD'
        });
        let options = {
            body: params
        };
        preRequest(req, options, cb)
    },

    // 查询提现银行卡
    query_bank_card: function(req, params, cb){
        params = params || {};
        _.extend(params, {
            serviceCode: 'WITHDRAW_CARD_QUERY'
        });
        let options = {
            body: params
        };
        preRequest(req, options, cb)
    }
    ,

    // 修改提现银行卡
    update_bank_card: function(req, params, cb){
        params = params || {};
        _.extend(params, {
            serviceCode: 'WITHDRAW_CARD_MODIFY'
        });
        let options = {
            body: params
        };
        preRequest(req, options, cb)
    },

    // 删除提现银行卡
    delete_bank_card: function(req, params, cb){
        params = params || {};
        _.extend(params, {
            serviceCode: 'WITHDRAW_CARD_DELETE'
        });
        let options = {
            body: params
        };
        preRequest(req, options, cb)
    },

    // 查询账户余额
    query_balance: function(req, params, cb){
        params = params || {};
        _.extend(params, {
            serviceCode: 'BALANCE_QUERY',
            accountType: '03'
        });
        let options = {
            body: params
        };
        preRequest(req, options, cb)
    },

    // 申请提现
    apply_tixian: function(req, params, cb){
        params = params || {};
        _.extend(params, {
            serviceCode: 'WITHDRAW_APPLY'
        });
        let options = {
            body: params
        };
        preRequest(req, options, cb)
    },

    // 查询提现记录
    query_tixian_records: function(req, params, cb){
        params = params || {};
        _.extend(params, {
            serviceCode: 'WITHDRAW_USER_QUERY'
        });
        let options = {
            body: params
        };
        preRequest(req, options, cb)
    }
};

module.exports = _Service;


