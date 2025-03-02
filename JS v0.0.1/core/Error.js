'use strict';

import { LADYBUG_ERR } from '../assets/errorSet.js';

function errStack(msg, code, config, req, res) {
    Error.call(this);
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, errStack);
    } else {
        this.stack = (new Error()).stack;
    }

    this.message = msg || 'An error occurred';
    this.name = 'LadybugError';
    this.code = code || LADYBUG_ERR.CUSTOM;
    this.config = config || null;
    this.request = req || null;
    this.response = res || null;
    this.status = res?.status || null;
    this.data = res?.data || null;
    this.cause = null;
}

errStack.prototype = Object.create(Error.prototype);
errStack.prototype.constructor = errStack;

Object.defineProperties(errStack, {
    CUSTOM: { value: LADYBUG_ERR.CUSTOM },
    NETWORK_ERROR: { value: LADYBUG_ERR.NETWORK_ERROR },
    TIMEOUT: { value: LADYBUG_ERR.TIMEOUT },
});

errStack.prototype.toJSON = function toJSON() {
    return {
        message: this.message,
        name: this.name,
        code: this.code,
        config: this.config,
        request: this.request,
        response: this.response,
        status: this.status,
        data: this.data,
        stack: this.stack
    };
};

errStack.from = (error, code, config, req, res, customProps) => {
    const ladybugError = Object.create(errStack.prototype);

    Object.assign(ladybugError, error);

    new errStack(ladybugError.message, code, config, req, res);

    ladybugError.cause = error;
    ladybugError.name = error.name;

    if (customProps) {
        Object.assign(ladybugError, customProps);
    }

    return ladybugError;
};

export default errStack;