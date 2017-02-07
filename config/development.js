
var path = require('path');
const protocol = 'http:';

module.exports = {
    server: {
        port: 80  //此端口号会被环境变量PORT覆盖
    },

    cacheConfig: {
        viewCache: false  //是否缓存视图引擎，正式环境必须开启
    },
    siteConfig: {
        host: protocol + '//butielan.teshehui.com'
    },

    loginConfig: {
        "host": "192.168.1.67",
        "port": 3667
    },

    hostConfig: {
        cmsweb: 'http://cms-web.teshehui.com',
        portalweb: 'http://portal-web.teshehui.com',
        uip: 'http://uip-app.teshehui.com',
        pay_gateway: 'http://pay-gateway.teshehui.com',
        datamgr: 'http://data.teshehui.com'
    },

    wechatConfig: {

    },

    sessionConfig: {
        redis: {
            host: '192.168.1.207',
            port: 6379,
            prefix: 'nodesess:'
        }
    },

    mysqlConfig: {
        host: '192.168.202.90',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'h5mall_assist'
    },

    logConfig: {
        accessLogPath: 'logs/access.log',
        normalLogPath: 'logs/normal.log'
    },

    mui: {
        manifestJsFile: 'public/rev/manifest-js.json',
        manifestCssFile: 'public/rev/manifest-css.json',
        jsPrefix: '/js/',
        seabase: '/js/mbase/',
        cssPrefix: '/style/css/',
        stylePrefix: '/style/'
    }
};