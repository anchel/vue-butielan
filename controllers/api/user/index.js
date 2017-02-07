'use strict';

const ResponseError = require('../../../errors/ResponseError');
const utilLib = require('../../../lib/utilLibrary');
const portalService = require('../../../services/portalService');
const paygatewayService = require('../../../services/paygatewayService');
const userLib = require('../../../lib/userLibrary');
const async = require('async');
const _ = require('lodash');

module.exports = function (router) {

    // 获取登录信息
    router.get('/get_user_info', function (req, res) {
        userLib.getUserInfo(req, res, function(err, body){
            if (err) {
                utilLib.outputJsonResult(req, res, err);
            } else {
                utilLib.outputJsonResult(req, res, body)
            }
        })
    });

    // 获取手机验证码
    router.get('/get_verification_code', function(req, res) {
        let phone_mob = req.query.phone;
        if(/^1\d{10,10}$/.test(phone_mob)) {
            portalService.getVerificationCode(req, {
                form: {phoneMob: phone_mob}
            }, function (err, body) {
                if (err) {
                    utilLib.outputJsonResult(req, res, err);
                } else {
                    utilLib.outputJsonResult(req, res, body)
                }
            })
        } else {
            utilLib.outputJsonResult(req, res, new ResponseError('非正确大陆号码！'))
        }
    });

    // 登出
    router.get('/logout', function(req, res) {
        portalService.userLogout(req, null, function (err, body) {
            if (err) {
                utilLib.outputJsonResult(req, res, err);
            } else {
                // res.cookie('userid', null, { domain: '.teshehui.com', path: '/', maxAge: -1 });
                // res.cookie('skey', null, { domain: '.teshehui.com', path: '/', maxAge: -1 });
                res.cookie('userid', null, { path: '/', maxAge: -1 });
                res.cookie('skey', null, { path: '/', maxAge: -1 });
                utilLib.outputJsonResult(req, res, body);
            }
        })
    });

    // 检查登录
    router.get('/checklogin', function(req, res) {
        userLib.checkLogin(req, res, function (err, body) {
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body.data);
            }
        })
    });

    // 检查登录并获取用户详情
    router.get('/check_and_get_user_info', function(req, res) {
        function check_login (cb) {
            userLib.checkLogin(req, res, function (err, body) {
                cb(err, body);
            })
        }
        function get_user_info (cb) {
            userLib.getUserInfo(req, res, function (err, body) {
                cb(err, body)
            })
        }
        function get_account_info (cb) {
            paygatewayService.query_balance(req, {}, function(err, body){
                let account_info = {
                    accountId: '',
                    usableBalance: 0,
                    canExtractBalance: 0,
                    freezeBalance: 0,
                    accountStatus: '',

                    bankCardId: '',
                    holderName: '',
                    cardNo: ''
                };
                if (err) {
                    cb(err, body)
                    // cb(null, account_info)
                } else {
                    paygatewayService.query_bank_card(req, {}, function (err, body2) {
                        if (err) {
                            cb(err, body2)
                        } else {
                            let arr = body || [];
                            let arr2 = body2 || [];
                            _.extend(account_info, arr[0]);
                            _.extend(account_info, arr2[0]);
                            cb(err, account_info)
                        }
                    })
                }
            })
        }
        async.parallel([check_login, get_user_info, get_account_info], function (err, rets) {
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                let retdata = rets[0].data;
                _.extend(retdata, rets[1]);
                retdata.account_info = rets[2];
                utilLib.outputJsonResult(req, res, retdata);
            }
        });
    });

    // 验证码登录
    router.get('/verifycode_login', function(req, res) {
        if (!req.query.account || !req.query.verifycode) {
            utilLib.outputJsonResult(req, res, new ResponseError('手机号或验证码不能为空'));
            return;
        }
        check_phone_reg(req, req.query.account).then(function(isreg){
            if (!isreg) {
                utilLib.outputJsonResult(req, res, '手机号未注册', true);
                return;
            }
            let form = {
                phoneMob: req.query.account,
                checkCode: req.query.verifycode
            };
            portalService.phoneLogin(req, {
                form: form
            }, function (err, body) {
                if (err) {
                    utilLib.outputJsonResult(req, res, err, true);
                } else {
                    // res.cookie('userid', body.userId, { domain: '.teshehui.com', path: '/', maxAge: 7*24*3600*1000 });
                    // res.cookie('skey', body.token, { domain: '.teshehui.com', path: '/', maxAge: 7*24*3600*1000 });
                    res.cookie('userid', body.userId, { path: '/', maxAge: 7*24*3600*1000 });
                    res.cookie('skey', body.token, { path: '/', maxAge: 7*24*3600*1000 });
                    utilLib.outputJsonResult(req, res, body);
                }
            });
        }, function(e){
            utilLib.outputJsonResult(req, res, e, true);
        });
    });

    // 密码登录
    router.get('/password_login', function(req, res) {
        if (!req.query.account || !req.query.password) {
            utilLib.outputJsonResult(req, res, new ResponseError('用户名或密码不能为空'));
            return;
        }
        check_phone_reg(req, req.query.account).then(function(isreg){
            if (!isreg) {
                utilLib.outputJsonResult(req, res, '手机号未注册', true);
                return;
            }
            let form = {
                number: req.query.account,
                password: utilLib.md5(req.query.password)
            };
            portalService.passwordLogin(req, {
                form: form
            }, function (err, body) {
                if (err) {
                    utilLib.outputJsonResult(req, res, err, true);
                } else {
                    // res.cookie('userid', body.userId, { domain: '.teshehui.com', path: '/', maxAge: 7*24*3600*1000 });
                    // res.cookie('skey', body.token, { domain: '.teshehui.com', path: '/', maxAge: 7*24*3600*1000 });
                    res.cookie('userid', body.userId, { path: '/', maxAge: 7*24*3600*1000 });
                    res.cookie('skey', body.token, { path: '/', maxAge: 7*24*3600*1000 });
                    utilLib.outputJsonResult(req, res, body);
                }
            });
        }, function(e){
            utilLib.outputJsonResult(req, res, e, true);
        });
    });

    // 检查验证码
    router.get('/check_verifycode', function (req, res) {
        let phone = req.query.phone;
        let verifycode = req.query.verifycode;
        if (!phone || !verifycode) {
            utilLib.outputJsonResult(req, res, '请输入手机号或验证码', true);
            return;
        }
        portalService.checkVerifyCode(req, {
            form: {
                phoneMob: phone,
                checkCode: verifycode
            }
        }, function (err, body) {
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body.data);
            }
        })
    });

    //重置密码
    router.get('/password_reset', function (req, res) {
        let phone = req.query.phone;
        let checktoken = req.query.checktoken;
        let password = req.query.password;
        if (!phone || !password) {
            utilLib.outputJsonResult(req, res, '请输入手机号或密码', true);
            return;
        }
        portalService.passwordReset(req, {
            form: {
                checkToken: checktoken,
                phoneMob: phone,
                password: utilLib.md5(password)
            }
        }, function (err, body) {
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body);
            }
        })
    });

    // 修改手机号
    router.get('/phone_reset', function (req, res) {
        let phone_old = req.query.phone_old;
        let checktoken = req.query.checktoken;
        let verifycode = req.query.verifycode;
        let phone_new = req.query.phone_new;
        if (!phone_new || !verifycode) {
            utilLib.outputJsonResult(req, res, '请输入新手机号或验证码', true);
            return;
        }
        check_phone_reg(req, phone_new).then(function(isreg){
            if (isreg) {
                utilLib.outputJsonResult(req, res, '该手机号已注被注册，请重新填写', true);
                return;
            }
            portalService.phoneReset(req, {
                form: {
                    checkToken: checktoken,
                    oldPhoneMob: phone_old,
                    phoneMob: phone_new,
                    checkCode: verifycode
                }
            }, function (err, body) {
                if (err) {
                    utilLib.outputJsonResult(req, res, err, true);
                } else {
                    utilLib.outputJsonResult(req, res, body);
                }
            })
        }, function(e){
            utilLib.outputJsonResult(req, res, e, true);
        });
    });

    // 判断手机号是否已注册
    router.get('/check_phone_reg', function (req, res) {
        let phone = req.query.phone;
        if (!phone) {
            utilLib.outputJsonResult(req, res, '请输入手机号', true);
            return;
        }
        portalService.checkPhoneReg(req, {
            form: {
                phoneMob: phone
            }
        }, function (err, body) {
            if (err) {
                utilLib.outputJsonResult(req, res, err, true);
            } else {
                utilLib.outputJsonResult(req, res, body);
            }
        })
    });

    function check_phone_reg (req, phone) {
        return new Promise(function (resolve, reject) {
            portalService.checkPhoneReg(req, {
                form: {
                    phoneMob: phone
                }
            }, function (err, body) {
                if (err) {
                    reject(err);
                } else {
                    if (body.result == 1) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            })
        });
    }
};

