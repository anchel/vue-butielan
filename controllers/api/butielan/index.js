'use strict';

const ResponseError = require('../../../errors/ResponseError');
const utilLib = require('../../../lib/utilLibrary');
const uipService = require('../../../services/uipService');
const portalService = require('../../../services/portalService');
const userLib = require('../../../lib/userLibrary');
const async = require('async');
const _ = require('lodash');
const qrimage = require('qr-image');

module.exports = function (router) {

    // 获取统计数据
    router.get('/get_tongji_data', function (req, res) {
        uipService.getStatisticsInfo(req, {}, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });

    // 获取本月数据
    router.get('/get_month_tongji', function (req, res) {
        uipService.get_month_tongji(req, {}, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });

    // 获取月结收益列表
    router.get('/get_yuejie_list', function (req, res) {
        let params = {
            requestUserId: req.query.requestUserId || req.cookies.userid,
            pageNo: req.query.pageNum || 1,
            pageSize: req.query.pageSize || 10
        };
        uipService.get_yuejie_list(req, params, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });

    // 获取会员列表
    router.get('/get_member_list', function (req, res) {
        let params = {
            requestUserId: req.query.requestUserId || req.cookies.userid,
            pageNo: req.query.pageNum || 1,
            pageSize: req.query.pageSize || 10
        };
        uipService.get_member_list(req, params, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });

    // 获取创客列表
    router.get('/get_maker_list', function (req, res) {

        let params = {
            requestUserId: req.query.requestUserId || req.cookies.userid,
            checkStatus: req.query.isshenhe,
            pageNo: req.query.pageNum || 1,
            pageSize: req.query.pageSize || 10
        };
        uipService.get_maker_list(req, params, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });

    // 获取订单列表
    router.get('/get_order_list', function (req, res) {
        let params = {
            requestUserId: req.query.requestUserId || req.cookies.userid,
            isAlreadyClearing: req.query.isfenrun || 1,  // 1-已分润 0-待分润
            orderType: req.query.order_type || 0, // 0-all 1-商城 2-在线升级 3-激活创客 4-创客续费
            pageNo: req.query.pageNum || 1,
            pageSize: req.query.pageSize || 10
        };
        uipService.get_order_list(req, params, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });

    // 获取会员卡列表
    router.get('/get_card_list', function (req, res) {
        let params = {
            requestUserId: req.query.requestUserId || req.cookies.userid,
            activationStatus: req.query.isjihuo,  // 1-已激活 0-待激活
            pageNo: req.query.pageNum || 1,
            pageSize: req.query.pageSize || 10
        };
        uipService.get_card_list(req, params, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });

    // 获取补贴蓝用户信息
    router.get('/get_user_info', function (req, res) {
        let params = {

        };
        uipService.get_user_info(req, params, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });

    // 创客审核操作
    router.get('/maker_shenhe', function (req, res) {
        let params = {
            requestUserId: req.query.requestUserId
        };
        uipService.maker_shenhe(req, params, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });

    // 生成url的二维码
    router.get('/qrcode', function (req, res) {
        let url = req.query.url;
        try {
            let img = qrimage.image(url,{size : 10});
            res.writeHead(200, {'Content-Type': 'image/png'});
            img.pipe(res);
        } catch (e) {
            res.writeHead(414, {'Content-Type': 'text/html'});
            res.end('<h1>414 Request-URI Too Large</h1>');
        }
    });

    // 检查补贴蓝升级信息
    router.get('/check_upgrade', function (req, res) {
        let options = {
            form: {
                clientVersion: req.query.version
            }
        };
        portalService.checkButielanUpgrade(req, options, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });
};

