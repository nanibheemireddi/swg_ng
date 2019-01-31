/*
 * Authencation middleware with session
 
 * list of allowed URLs without login
 */
var jwt = require('jsonwebtoken');
var allowed = [
    {url: '/admin-login', method: 'POST'},
    {url: '/web/tier3/import', method: 'POST'},
    {url: '/admin-forget-password', method: 'POST'},
    {url: '/roles-list', method: 'GET'},
    {url: '/default/setup', method: 'POST'},
    {url: '/users/account-activation', method: 'POST'},
    {url: '/users/forgotPasswordEmail', method: 'POST'},
    {url: '/users/forgotPasswordTokenCheck', method: 'POST'},
    {url: '/users/forgotResetPassword', method: 'POST'},
    {url: '/users/link-verification', method: 'GET'},
];

function checkIfRouteExistInAllowedList(route, method) {
    var evens = _.filter(allowed, function (obj) {
        return route.indexOf(obj.url) !== -1 && (obj.method === "ALL" || obj.method === method);
    });
    if (evens.length > 0) {
        return true;
    } else {
        return false;
    }
}
/**
 *  middleware enabled or not
 * @type Boolean
 */
var enabled = true;

/**
 * the middleware function
 * @param {type} onoff : to enable middleware
 * @returns {Function}
 */
module.exports = function (onoff) {
    enabled = (onoff == 'on') ? true : false;
    return function (req, res, next) {
        global.requestLanguage = req.headers.language;
        var originalUrlAllowed = checkIfRouteExistInAllowedList(req.originalUrl, req.method);
        try {
            if (typeof req.headers['lang-code'] != 'undefined' && req.headers['lang-code'] != '') {
                langCode = req.headers['lang-code'];
                appMessage = require('../helpers/language/' + langCode + ".msg.js");
            } else {
                langCode = '';
                appMessage = require('../helpers/language/' + process.env.MSGLANG + ".msg.js");
            }
        } catch (e) {
            langCode = '';
            appMessage = require('../helpers/language/' + process.env.MSGLANG + ".msg.js");
        }
        if (enabled && originalUrlAllowed === false) {
            // check header or url parameters or post parameters for token
            var token = req.headers['x-access-token'];
            // decode token
            if (typeof token !== 'undefined' && token)
            {
                // verifies secret and checks exp
                jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
                    if (err) {
                        helper.formatResponse('', res, "Failed to authenticate token.");
                    } else {
                        // if everything is good, save to request for use in other routes
                        req.decoded = decoded;
                        global.requestUserId = decoded._id;
                        next();
                    }
                });
            } else {
                // if there is no token
                var error = {
                    httpstatus: 401,
                    msg: appMessage.common.error.noToken.msg
                };
                helper.formatResponse('', res, error);
            }
        } else {
            var accessToken = req.headers['x-access-token'];
            if (typeof accessToken !== 'undefined' && accessToken)
            {
                // verifies secret and checks exp
                jwt.verify(accessToken, process.env.JWT_SECRET_KEY, function (err, decoded) {
                    if (err) {
                        helper.formatResponse('', res, "Failed to authenticate token.");
                    } else {
                        // if everything is good, save to request for use in other routes
                        req.decoded = decoded;
                        global.requestUserId = decoded._id;
                        next();
                    }
                });
            } else {
                /*
                 * If jwt is disabled
                 */
                global.requestUserId = '';
                next();
            }
        }
    }
};