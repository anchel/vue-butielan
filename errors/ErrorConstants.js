'use strict';

module.exports = {

    DEFAULT: {status: 1, msg: '发生错误'},

    CSRF: {status: 2, msg: 'CSRF 验证失败'},

    NOLOGIN: {status: 3, msg: '未登录'},

    WECHAT_REQUEST_ERR: {status: 24, msg: '调用微信接口失败'},
    WECHAT_RESULT_ERR: {status: 25, msg: '微信接口返回内容不正确'},

    REQUEST_CMS_ERROR: {status: 10001, msg: 'cms接口调用失败'},
    REQUEST_PORTAL_ERROR: {status: 10002, msg: 'porta接口调用失败'},
    REQUEST_UIP_ERROR: {status: 10003, msg: 'uip接口调用失败'},
    REQUEST_PAY_GATEWAY_ERROR: {status: 10004, msg: 'pay-gateway接口调用失败'}
};