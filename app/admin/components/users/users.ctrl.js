var swig = require('swig');
var jwt = require('jsonwebtoken');
var bcrypt = require("bcrypt-nodejs");
var base64 = require('base-64');
var swig = require('swig');
var bcrypt = require("bcrypt-nodejs");
var asyncLoop = require("node-async-loop");

/**
 * @desc User Controller
 */
module.exports = {
    /*
     * @description : List of all the users in the system
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    getList: function(req, res) {
        var modelName = models.users;
        var condition = { isDelete: false };
        modelName.find(condition)
            .populate({ path: 'roleId', select: 'name' })
            .sort({ createdAt: 1 }).then(function(data) {
                if (data.length) {
                    var response = {
                        httpStatus: 200,
                        data: data
                    };
                    helper.formatResponse(response, res, '');
                } else {
                    //                console.log("in else", appMessage.users.error.dataNotFound)
                    helper.formatResponse('', res, { msg: appMessage.users.error.dataNotFound });
                }
            }).catch(function(error) {
                helper.formatResponse('', res, error);
            });
    },
    /*
     * 
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     * @desc : admin Login 
     */
    login: function(req, res) {
        var requiredParams = ['email', 'password'];
        helper.validateRequiredParams(req, res, requiredParams).then(function(response) {
            var email = req.body.email;

            condition = {
                email: {
                    $regex: new RegExp(email, "i")
                },
                isDelete: false
            };
            models.users.findOne(condition)
                //.aggregate(agg)
                //                    .populate('roleId')
                .then(function(userData) {
                    console.log('userData', userData)
                    if (typeof userData != 'undefined' && userData != '' && userData != null) {
                        var data = userData;

                        var result = false;
                        if (data.password) {
                            result = bcrypt.compareSync(req.body.password, data.password);
                        }
                        if (data.isVerified == false) {
                            helper.formatResponse('', res, appMessage.users.error.activateAccount);
                        } else if (result) {
                            if (data.isActive == true) {
                                var condtion = {
                                    //companyId: data.last_comapny_id,
                                    userId: data._id
                                }
                                var roleCondition = { userId: new mongoose.Types.ObjectId("5bc4302f5805592f34ae8739") }
                                var agg = [{
                                        $match: roleCondition

                                    },
                                    {
                                        $lookup: {
                                            from: "company",
                                            localField: "companyId",
                                            foreignField: "_id",
                                            as: "companyDetails"
                                        }
                                    },

                                    {
                                        $lookup: {
                                            from: "rolesAndRights",
                                            localField: "userRoleTypeId",
                                            foreignField: "_id",
                                            as: "userRoles"
                                        }
                                    }, {
                                        $addFields: {
                                            companyDetails: { $arrayElemAt: ['$companyDetails', 0] },
                                            userRoles: { $arrayElemAt: ['$userRoles', 0] }
                                        }
                                    }

                                ]

                                models.companyRolesByUser
                                    // .find(roleCondition)
                                    // .populate('companyId')
                                    .aggregate(agg)
                                    .then(function(data1) {
                                        // _.each(data1, function(val1) {
                                        //     console.log(val1.companyDetails[0])
                                        //     val1.rolesAndRight = val1.rolesAndRights[0];
                                        //     val1.companyDetail = val1.companyDetails[0];
                                        // })


                                        /*
                                         * JWT token generation
                                         */
                                        var token = jwt.sign(JSON.stringify(data), process.env.JWT_SECRET_KEY);
                                        res.setHeader('x-access-token', token);
                                        data.password = undefined;
                                        var response = {
                                            data: {
                                                user: data,
                                                totalcompanies: data1

                                            }
                                        };
                                        // data.roleData = data1
                                        // response.data = data;

                                        //response.roleData = data1;
                                        var condition = { _id: new mongoose.Types.ObjectId(userData._id) }
                                        var updateParams = {
                                            lastActivity: Date.now()
                                        }
                                        models.users.findOneAndUpdate(condition, updateParams).then(function() {
                                            //                                        console.log("lastActivity updated")
                                        })
                                        console.log(response)
                                        helper.formatResponse(response, res, '');
                                    }).catch(function(err) {
                                        //                console.log(err, "here")
                                        var error = {
                                            msg: err
                                        }
                                        helper.formatResponse('', res, error);
                                    });
                            } else {
                                helper.formatResponse('', res, appMessage.users.error.accountDeactivate);
                            }
                        } else {
                            helper.formatResponse('', res, appMessage.users.error.invalidCredencials);
                        }
                    } else {
                        helper.formatResponse('', res, appMessage.users.error.invalidCredencials);
                    }
                }).catch(function(err) {
                    //                console.log(err, "here")
                    var error = {
                        msg: err
                    }
                    helper.formatResponse('', res, error);
                });
        });
    },
    /**
     * @desc Get Vendor Admin Details
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    viewDetails: function(req, res) {
        var userId = req.params.id
        var fields = ['id', 'firstName', 'lastName', 'email', 'isActive', 'lastActivity', 'createdOn'];
        var condition = {
            _id: new mongoose.Types.ObjectId(userId),
            isDelete: false
        }
        models.users.find(condition).then(function(data) {
            if (data.length) {
                var response = {
                    data: data
                }
                helper.formatResponse(response, res, '');
            } else {
                helper.formatResponse('', res, appMessage.users.error.dataNotFound);
            }
        }).catch(function(err) {
            var error = {
                msg: err
            }
            helper.formatResponse('', res, error);
        });
    },
    /**
     * @desc Create user with data : email,firstName, lastName,role
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    create: function(req, res) {
        var postData = req.body;
        console.log(postData, 'postData')
        var requiredParams = ['email', 'firstName', 'lastName', 'roleId', 'companyId'];
        helper.validateRequiredParams(req, res, requiredParams).then(function(response) {
            //            postData.password = bcrypt.hashSync("123456")
            //            postData.isActive = false;
            var userSchema = new models.users(postData);
            models.users.findOne({ email: { $regex: new RegExp("^" + postData.email, "i") } }).exec(function(err, displayData) {
                if (_.isEmpty(displayData)) {
                    _mongoose.save(userSchema).then(function(data) {
                        var response = {
                                data: data
                            }
                            /*Sending email with link for activation to user email with activation code*/
                        var link = process.env.ACTIVATION_LINK + base64.encode(data.id);
                        var message = swig.renderFile('./public/emailTemplate/acount-activation.html', {
                            user: data,
                            link: link,
                            path: process.env.LOGO_PATH
                        });

                        helper.sendEmail("Activate Acount", data.email, message, 'Account');
                        helper.formatResponse(response, res);
                    }).catch(function(err) {
                        //                console.log(err , "==========================")
                        var error = {
                            msg: err
                        }
                        helper.formatResponse('', res, error);
                    });
                } else {
                    var addminRoledata = {
                        company_id: postData.companyId,
                        userId: displayData._id,
                        roleId: postData.roleId

                    }
                    companyWraper.addRoleTOAdmin(addminRoledata, 'company', res).then(function(comapnyRoleData) {
                        models.company.findOne({ "_id": postData.companyId }).then(function(companyData) {
                                console.log(companyData)

                                var response = {
                                        data: displayData
                                    }
                                    /*Sending email with link for activation to user email with activation code*/

                                var message = swig.renderFile('./public/emailTemplate/invitemember.html', {
                                    user: displayData,
                                    comapnyName: companyData.name,
                                    link: process.env.BASE_URL,
                                    path: process.env.LOGO_PATH
                                });
                                helper.sendEmail("invited you to join " + companyData.name, displayData.email, message, 'Account');
                                helper.formatResponse(response, res);
                            })
                            // resolve(response);
                    })

                    // var error = {
                    //     msg: "email " + appMessage.common.error.unique.msg
                    // }
                    //helper.formatResponse('', res, error);
                }
            });
        });
    },
    /**
     * @desc Vefiry Link with code
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    activationLinkVerify: function(req, res) {
        var verificationCode = req.params.code;
        var userId = base64.decode(verificationCode);
        console.log(userId, "sam")
        var condition = {
            //            _id: new mongoose.Types.ObjectId(userId),
            _id: userId,
            isDelete: false,
            isVerified: false,
            lastActivity: { $exists: false }
        };
        models.users.findOne(condition)
            //                .populate({path: 'roleId', select: 'name'})
            .then(function(data) {
                if (data != null) {
                    console.log("hellooo in res", data)
                        //valid link
                    data.password = undefined
                    return res.json({
                        success: true,
                        isValid: true,
                        result: data,
                        msg: appMessage.users.success.validVerificationLink.msg
                    });
                } else {
                    //invalid link
                    return res.status(404).json({
                        success: false,
                        isValid: false,
                        msg: appMessage.users.error.invalidVerificationLink.msg
                    });
                }
            }).catch(function(error) {
                console.log(error)

                return res.status(400).json({
                    success: false,
                    msg: error.message
                });
            })
    },
    /**
     * @desc Set password for user
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    accountActivate: function(req, res) {
        var postData = req.body;
        var token = postData.code;
        var userId = base64.decode(token);
        console.log(userId, "Id")

        var condition = {
            _id: new mongoose.Types.ObjectId(userId),
            isDelete: false,
            isVerified: false
        }
        var updateParams = {
            password: bcrypt.hashSync(postData.password),
            isVerified: true
        }
        models.users.findOne(condition)
            .then(function(data) {
                //                    console.log(data)
                if (data !== null) {
                    //update password and set isVerified=1
                    models.users.findOneAndUpdate(condition, updateParams, { new: true }).then(function(result) {
                        return res.json({
                            success: true,
                            isValid: true,
                            msg: appMessage.users.success.activateAccountSuccess.msg
                        });
                    })
                } else {
                    //invalid link
                    return res.status(404).json({
                        success: false,
                        isValid: false,
                        msg: appMessage.common.error.pageNotFound.msg
                    });
                }
            }).catch(function(error) {
                return res.status(400).json({
                    success: false,
                    msg: error.message
                });
            });
    },
    /**
     * @desc Update user Details by Super Admin
     * @params firstName, lastName,isActive,roleId
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    update: function(req, res) {
        var postData = req.body;
        var id = new mongoose.Types.ObjectId(req.params.id);
        var condition = {
            _id: new mongoose.Types.ObjectId(id),
            isDelete: false
        }
        var updateParams = req.body;
        models.users.findOneAndUpdate(condition, updateParams, { new: true }).select(['firstName', 'lastName', 'isActive', 'roleId', 'email']).then(function(userData) {
            var response = [];
            response.data = userData;
            helper.formatResponse(response, res, '');
        }).catch(function(error) {
            error = {
                httpstatus: "409",
                msg: error
            }
            helper.formatResponse('', res, error);
        });
    },
    /**
     * @description To send Forgot password
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    forgotPasswordEmail: function(req, res) {
        var detail = req.body;
        if (typeof detail.email != 'undefined') {
            models.users.findOne({ email: { $regex: new RegExp("^" + detail.email, "i") }, isDelete: false }).then(function(detailCheck) {
                if (detailCheck !== null) {
                    if (detailCheck.isActive) {
                        /*Send activation link*/
                        var user = detailCheck;
                        var condition = {
                            _id: detailCheck._id,
                            isDelete: false
                        }
                        var code = helper.generateRandomString(20)
                        var updateParams = {
                            $set: {
                                code: code
                            }
                        }
                        models.users.findOneAndUpdate(condition, updateParams, { upsert: true }).then(function(result) {
                            var link = process.env.CONST_RESET_PASSWORD_URL + new Buffer(code + "|**|" + result._id).toString('base64');
                            var message = swig.renderFile('./public/emailTemplate/forgot-password.html', {
                                user: result,
                                link: link,
                                path: process.env.LOGO_PATH,
                                appName: process.env.APP_NAME
                            });
                            helper.sendEmail("Log in to your " + process.env.APP_NAME + " account", user.email, message, undefined, 'Account');
                            return res.json({
                                success: true,
                                msg: 'Link has been sent to your email.',
                            });
                        }).error(helper.handleError(res));
                    } else {
                        var message = 'Sorry , your account is Inactivated.'
                            //                        if (detailCheck.lastActivity == undefined) {
                            //                            message = 'Please activate your account first!';
                            //                        }
                        return res.status(200).json({
                            success: false,
                            msg: message
                        });
                    }
                } else {
                    return res.status(400).json({
                        success: false,
                        msg: 'This user account does not exisits, Please contact admin.'
                    });
                }
            }).error(helper.handleError(res));
        } else {
            return res.json({
                success: false,
                msg: 'Payload error.'
            });
        }
    },
    /**
     * @description To check forgot password token
     * @param {type} req
     * @param {type} res
     * @returns {unresolved}
     */
    forgotPasswordTokenCheck: function(req, res) {
        var inputs = req.body;
        if (typeof inputs.code != 'undefined') {
            var code = new Buffer(inputs.code, 'base64').toString('ascii');
            codeDecode = code.split("|**|");
            var condition = {
                _id: new mongoose.Types.ObjectId(codeDecode[1])
            }
            models.users.findOne(condition).then(function(userCheck) {
                console.log(userCheck)
                if (userCheck && typeof userCheck.code != "undefined") {
                    if (userCheck.code == codeDecode[0]) {
                        return res.status(200).json({
                            success: true,
                            is_valid: true,
                            msg: 'Lik is Valid'
                        });
                    } else {
                        return res.status(400).json({
                            success: false,
                            is_valid: false,
                            msg: 'Link was expired.'
                        });
                    }
                } else {
                    return res.status(400).json({
                        success: false,
                        is_valid: false,
                        msg: 'Link was expired.'
                    });
                }
            }).catch(function() {
                return res.status(400).json({
                    success: false,
                    is_valid: false,
                    msg: 'Link was expired.'
                });
            }).error(helper.handleError(res));
        } else {
            return res.json({
                success: false,
                msg: 'Payload error.'
            });
        }
    },
    /**
     * @description Change password from forgot password
     * @param {type} req
     * @param {type} res
     * @returns {unresolved}
     */
    forgotResetPassword: function(req, res) {
        var inputs = req.body;
        if (typeof inputs.code != 'undefined' && typeof inputs.confirmPassword != 'undefined' && typeof inputs.password != 'undefined') {
            var code = new Buffer(inputs.code, 'base64').toString('ascii');
            codeDecode = code.split("|**|");
            var condition = {
                _id: new mongoose.Types.ObjectId(codeDecode[1])
            }
            models.users.findOne(condition).then(function(userCheck) {
                if (userCheck.isActive) {
                    if (userCheck && typeof userCheck.code != "undefined") {
                        if (userCheck.code == codeDecode[0]) {
                            if (inputs.confirmPassword == inputs.password) {
                                var password = bcrypt.hashSync(inputs.password);
                                var condition = {
                                    _id: userCheck._id
                                }
                                var updateParams = {
                                    $set: {
                                        password: password
                                    },
                                    $unset: {
                                        code: undefined
                                    }
                                }
                                models.users.findOneAndUpdate(condition, updateParams, { upsert: true }).then(function() {
                                    return res.status(200).json({
                                        success: true,
                                        msg: 'Password has been updated Successfully.'
                                    });
                                }).error(helper.handleError(res));
                            } else {
                                return res.status(400).json({
                                    success: false,
                                    msg: 'password and confirm password are mismatch.'
                                });
                            }
                        } else {
                            return res.status(400).json({
                                success: false,
                                is_valid: false,
                                msg: 'Link was expired.'
                            });
                        }
                    } else {
                        return res.status(400).json({
                            success: false,
                            is_valid: false,
                            msg: 'Link was expired.'
                        });
                    }
                } else {
                    var message = 'Sorry , your account is Inactivated.'
                    if (userCheck.lastActivity == undefined) {
                        message = 'Please activate your account first.'
                    }
                    return res.status(400).json({
                        success: false,
                        msg: message
                    });
                }
            }).catch(function() {
                return res.status(400).json({
                    success: false,
                    is_valid: false,
                    msg: 'Link was expired.'
                });
            }).error(helper.handleError(res));
        } else {
            return res.json({
                success: false,
                msg: 'Payload error.'
            });
        }
    },
    /**
     * @description To change password
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    changePassword: function(req, res) {
        console.log("in pwd")
        var currentUser = requestUserId;
        var inputs = req.body;
        var condition = {
            _id: new mongoose.Types.ObjectId(currentUser),
            isDelete: false
        }
        var requiredParams = ['oldPassword', 'confirmPassword', 'password']
        helper.validateRequiredParams(req, res, requiredParams).then(function() {
            models.users.findOne(condition).then(function(user) {
                if (bcrypt.compareSync(inputs.oldPassword, user.password)) {
                    if (inputs.password == inputs.confirmPassword) {
                        var password = bcrypt.hashSync(inputs.password);
                        var updateParams = {
                            $set: {
                                password: password
                            }
                        };
                        models.users.findOneAndUpdate(condition, updateParams, { new: true }).select(['firstName', 'lastName', 'isActive', 'roleId', 'email']).then(function(result) {
                            return res.status(200).json({
                                success: true,
                                msg: 'Password has been updated successfully.',
                                data: result
                            });
                        })
                    } else {
                        return res.status(400).json({
                            success: false,
                            msg: 'password and confirm password are mismatch.'
                        });
                    }
                } else {
                    return res.status(400).json({
                        success: false,
                        msg: 'Invalid Old password.'
                    });
                }
            }).error(helper.handleError(res))
        })
    },
    /**
     * @desc Delete user
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    delete: function(req, res) {
        var modelName = models.users;
        var condition = { '_id': new mongoose.Types.ObjectId(req.params.id) };
        models.users.findOne(condition).then(function(data) {
            if (data.isSuperAdmin == true) {
                var error = {
                    httpStatus: 400,
                    msg: "SuperAdmin can not be delete!"
                }
                helper.formatResponse('', res, error);
            } else {
                _mongoose.deleteHook(modelName, condition).then(function() {
                    var response = {};
                    response.msg = appMessage.users.success.dataDeleted.msg;
                    helper.formatResponse(response, res, '');
                }).catch(function(error) {
                    helper.formatResponse('', res, error);
                });
            }
        })
    },
    /*
     * Role and Rights Managment For User
     */
    roleAndRights: function(req, res) {
        var condition = { '_id': new mongoose.Types.ObjectId(req.params.id), isDelete: false };
        models.rolesAndRights.findOne(condition).populate('modulesAndPermissions.moduleId', ['moduleId', 'name']).then(function(result) {
            if (result !== null) {
                var response = {
                    data: result
                }
                helper.formatResponse(response, res, '')
            } else {
                var error = {
                    msg: appMessage.roles.error.dataNotFound
                };
                helper.formatResponse('', res, error);
            }
        })
    },
}