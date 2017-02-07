var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var SubscribeUser = sequelize.define('t_subscribe_user', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true
    },
    actname: {
        type: Sequelize.STRING
    },
    userid: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    platform: {
        type: Sequelize.STRING,
    },
    mtime: {
        type: Sequelize.DATE
    },
    ctime: {
        type: Sequelize.DATE
    }
}, {
    tableName: 't_subscribe_user'
});

module.exports = SubscribeUser;