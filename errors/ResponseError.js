'use strict';

const util = require('util');
const ErrorConstants = require('./ErrorConstants');

function ResponseError(message, extobj){
    extobj = extobj || {};
    Error.captureStackTrace(this, ResponseError);

    if(typeof(message) == 'object'){
        this.status = message.status;
        this.msg = message.msg;
    }else{
        this.status = ErrorConstants.DEFAULT.status;
        this.msg = message;
    }
    if(extobj.msg){
        this.msg += extobj.msg;
    }
}
util.inherits(ResponseError, Error);

module.exports = ResponseError;

for(var k in ErrorConstants){
    ResponseError[k] = ErrorConstants[k];
}