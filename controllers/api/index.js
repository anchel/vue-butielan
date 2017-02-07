'use strict';

const utilLibrary = require('../../lib/utilLibrary');

module.exports = function (router) {

    router.get('/', function (req, res) {
        utilLibrary.outputJsonResult(req, res, {num: 2})
    });

};

