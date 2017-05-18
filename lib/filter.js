'use strict';

var cors = require('cors');
var utilLibrary = require('./utilLibrary');
var userLibrary = require('./userLibrary');
var ResponseError = require('../errors/ResponseError');

var filterMap = {
    cors: function (opt) {
        return cors(opt);
    },

    csrf: function(opt) {
        return function(req, res, next){
            var token = req.query.token || req.body.token;
            var ser_token = utilLibrary.getCsrfToken(req);
            var flag = false;
            if(token && ser_token && token === ser_token){
                flag = true;
            }
            if(!flag){
                utilLibrary.outputJsonResult(req, res, new ResponseError(ResponseError.CSRF))
            }else{
                next();
            }
        };
    },

    /**
     * 判断登录
     * @param opt
     * @returns {Function}
     */
    checklogin: function(opt) {
        return function(req, res, next){
            userLibrary.checkLogin(req, res, function(err, ret) {
                if(!err && ret.status === 200){
                    req._isLogined = true;
                    next();
                }else{
                    if(!opt.required){
                        return next();
                    }else{
                        if(opt.ajax){
                            utilLibrary.outputJsonResult(req, res, new ResponseError(ResponseError.NOLOGIN));
                        }else{
                            utilLibrary.goLogin(req, res, opt);
                        }
                    }
                }
            });
        };
    },
    /**
     * 获取用户信息
     * @param opt
     * @returns {Function}
     */
    getloginuserinfo: function(opt) {
        var _self = this;
        return function(req, res, next){
            userLibrary.checkLogin(req, res, function(err, ret) {
                if(!err && ret.status === 200){
                    req._isLogined = true;
                    userLibrary.getUserInfo(req, res, function(err, ret) {
                        if(!err && ret.status === 200){
                            req._userinfo = ret;
                            // if(!ret.userInfo.header||ret.userInfo.header==''){
                            //     ret.userInfo.header = '/public/img/head-img-replace.jpg'
                            // }
                            res.locals._userinfo = ret;
                            next();
                        }else{
                            if(!opt.required){
                                return next();
                            }else{
                                if(opt.ajax){
                                    utilLibrary.outputJsonResult(req, res, new ResponseError(ResponseError.NOLOGIN));
                                }else{
                                    utilLibrary.goLogin(req, res);
                                }
                            }
                        }
                    });
                }else{
                    if(!opt.required){
                        return next();
                    }else{
                        if(opt.ajax){
                            utilLibrary.outputJsonResult(req, res, new ResponseError(ResponseError.NOLOGIN));
                        }else{
                            utilLibrary.goLogin(req, res);
                        }
                    }
                }
            });
        };
    }
};

/**
 *
 * @param arr ['cors', 'csrf', 'checklogin', 'getloginuserinfo', ...]
 * @param opt
 */
module.exports = function(arr, opt){
    arr = arr || [];
    opt = opt || {};

    var filters = [];

    arr.forEach(function(k) {
        if(filterMap[k]){
            filters.push(filterMap[k](opt));
        }
    });

    return filters;
};