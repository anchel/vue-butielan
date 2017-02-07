'use strict';

var utilLibrary = require('./utilLibrary');
var portalService = require('../services/portalService');
var log = require('./logger').getLogger();

var _lib = {
    /**
     * 判断是否登录
     */
    checkLogin: function(req, res, callback) {
        var _self = this;
        var invalidInfo = _self.checkSkeyAndUid(req);
        if(invalidInfo){
            callback(invalidInfo);
            return;
        }
        // var clientInfo = utilLibrary.getClientInfo(req);
        // log.info('userLibrary.checkLogin - userId: %s, ukey: %s, clientInfo: %s', userId, '*', JSON.stringify(clientInfo));
        portalService.checkLogin(req, null, callback);
    },

    /**
     * 获取用户信息
     */
    getUserInfo: function(req, res, callback){
        var _self = this;
        var invalidInfo = _self.checkSkeyAndUid(req);
        if(invalidInfo){
            callback(invalidInfo);
            return;
        }
        // var userId = req.cookies.userid;
        // var token = req.cookies.skey;
        // var clientInfo = utilLibrary.getClientInfo(req);
        // log.info('userLibrary.getUserInfo - userId: %s, ukey: %s, clientInfo: %s', userId, '*', JSON.stringify(clientInfo));
        portalService.getUserInfo(req, null, callback);
    },

    /**
     * 检测cookie里面用户态相关key是否合法
     * @param req
     * @returns {*}
     */
    checkSkeyAndUid: function(req) {
        var skey = req.cookies.skey;  //skey被内部系统占用，所以换个ukey
        var userid = req.cookies.userid;
        if(!skey || !userid){
            return {
                status: -1,
                msg: 'skey or userid in cookie can not be empty'
            };
        }
        if(!/^\d*$/.test(userid)){
            return {
                status: -1,
                msg: 'userid in cookie invalid'
            };
        }
        return null;
    }
};
module.exports = _lib;