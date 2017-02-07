'use strict';

const ResponseError = require('../../../errors/ResponseError');
const utilLib = require('../../../lib/utilLibrary');
const paygatewayService = require('../../../services/paygatewayService');
const userLib = require('../../../lib/userLibrary');
const async = require('async');
const _ = require('lodash');

module.exports = function (router) {

    // 添加银行卡
    router.get('/add_bank_card', function (req, res) {
        var params = get_bank_params(req);
        paygatewayService.add_bank_card(req, params, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });

    // 修改银行卡
    router.get('/update_bank_card', function (req, res) {
        var params = get_bank_params(req);
        paygatewayService.update_bank_card(req, params, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });

    function get_bank_params (req) {
        var bankCardId = req.query.bankCardId;
        var holderName = req.query.holderName;
        var cardNo = req.query.cardNo;
        var bankName = req.query.bankName;
        var branchName = req.query.branchName;
        var provinceName = req.query.provinceName;
        var cityName = req.query.cityName;
        var cardType = 'PERSON';
        return {
            bankCardId,
            holderName,
            cardNo,
            bankName,
            branchName,
            provinceName,
            cityName,
            cardType
        };
    }

    // 查询银行卡
    router.get('/query_bank_card', function (req, res) {
        var params = {

        };
        paygatewayService.query_bank_card(req, params, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });

    // 删除银行卡
    router.get('/delete_bank_card', function (req, res) {
        var params = {
            bankCardId: req.query.bankCardId
        };
        paygatewayService.delete_bank_card(req, params, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });

    // 查询余额
    router.get('/query_balance', function (req, res) {
        var params = {

        };
        paygatewayService.query_balance(req, params, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });

    // 申请提现
    router.get('/apply_tixian', function (req, res) {
        var params = {
            accountId: req.query.accountId,
            bankCardId: req.query.bankCardId,
            amount: req.query.amount,
            nickName: req.query.nickName,
            remark: req.query.remark,
            clientIp: req.ip
        };
        paygatewayService.apply_tixian(req, params, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });

    // 查询提现记录
    router.get('/query_tixian_records', function (req, res) {
        var params = {
            pageNum: req.query.pageNum,
            numPerPage: req.query.pageSize
        };
        paygatewayService.query_tixian_records(req, params, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });
};

