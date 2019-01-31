var formidable = require('multiparty');
var asyncLoop = require('node-async-loop');
module.exports = {
    /**
     * Action for dump tier3 data
     *
     * @method importTier3Data
     * @param {req} request
     * @param {res} response
     * @return {status} res -If it returns error then the status is false otherwise true. 
     */
    importHrData: function(req, res) {
        var finalData = [];
        var form = new formidable.Form();
        form.parse(req, function(error, fields, files) {
            helper.readCsvFile(files.files[0].path).then(function(data) {
                asyncLoop(data, (obj, next) => {
                    var singleUserData = {};
                    process.nextTick(function() {
                        singleUserData.First_Name = obj.First_Name;
                        singleUserData.Last_Name = obj.Last_Name;
                        singleUserData.Employee_Number = obj.Employee_Number;
                        singleUserData.HireDate = obj.HireDate;
                        singleUserData.Birthdate = obj.Birthdate;
                        singleUserData.Status = obj.Status;
                        singleUserData.Company = obj.Company;
                        singleUserData.Middle_Name = obj.Middle_Name;
                        singleUserData.Job_Title = obj.Job_Title;
                        singleUserData.Address = [{
                            type: 'hr',
                            street: obj.Address,
                            country: '',
                            state: obj.State,
                            city: obj.City,
                            Address_2: obj.Address_2,
                            district: obj.District,
                            zipCode: obj.zipCode
                        }]
                        singleUserData.Phone_Number = [{
                            type: '',
                            mobileNo: obj.Phone_Number
                        }, {
                            type: '',
                            mobileNo: obj.Work_Phone_Number
                        }]
                        console.log(obj.Primary_EMail)
                        singleUserData.Extension = obj.Extension;
                        singleUserData.Preferred_Name = obj.Preferred_Name;
                        singleUserData.Alternate_Title = obj.Alternate_Title;
                        // var email = typeof obj.Primary_EMail != 'undefined' && obj.Primary_EMail != ''? [obj.Primary_EMail]:[];
                        var email = [];
                        if (typeof obj.Primary_EMail != 'undefined' && obj.Primary_EMail != '') {
                            email.push(obj.Primary_EMail);
                            email.push(obj.Alternate_EMail_Address)
                        }
                        console.log(email, 'email')
                        singleUserData['email'] = email;
                        // if()
                        // singleUserData.email.push(email)
                        // singleUserData.email.push(obj.Alternate_EMail_Address) 
                        finalData.push(singleUserData);
                        singleUserData = {}
                        next();
                    })
                    //return false;
                }, (error) => {
                    if (error) {
                        helper.formatResponse('', res, error);
                    } else {
                        models.hrData.insertMany(finalData).then(function(resdata) {
                            console.log(resdata)
                            var response = {
                                httpstatus: 200,
                                data: resdata
                            }
                            helper.formatResponse(response, res, '');
                        }).catch(function(err) {
                            error = {
                                httpstatus: 404,
                                msg: error
                            }
                            helper.formatResponse('', res, error);
                        })
                        console.log("var1");
                    }
                })
            })
            console.log("error", error);
            console.log("files", files.files[0].path);
        });
    },
    scholarshipData: function(req, res) {
        var finalData = [];
        var form = new formidable.Form();
        form.parse(req, function(error, fields, files) {
            console.log(files.files[0].path)
            helper.readCsvFile(files.files[0].path).then(function(data) {
                asyncLoop(data, (obj, next) => {
                    var singleUserData = {};
                    process.nextTick(function() {
                        singleUserData.First_name = obj.first_name;
                        singleUserData.Last_Name = obj.last_name;
                        singleUserData.status = obj.status;
                        singleUserData.roles = obj.roles;
                        singleUserData.modificationDate = String(new Date(parseInt(obj.modificationDate)));
                        // var email = typeof obj.Primary_EMail != 'undefined' && obj.Primary_EMail != ''? [obj.Primary_EMail]:[];
                        var email = [];
                        if (typeof obj.username != 'undefined' && obj.username != '') {
                            email.push(obj.username);
                        }
                        console.log(email, 'email')
                        singleUserData['email'] = email;
                        // if()
                        // singleUserData.email.push(email)
                        // singleUserData.email.push(obj.Alternate_EMail_Address) 
                        finalData.push(singleUserData);
                        singleUserData = {}
                        next();
                    })
                    //return false;
                }, (error) => {
                    if (error) {
                        helper.formatResponse('', res, error);
                    } else {
                        models.scholarship.insertMany(finalData).then(function(resdata) {
                            console.log(resdata)
                            var response = {
                                httpstatus: 200,
                                data: resdata
                            }
                            helper.formatResponse(response, res, '');
                        }).catch(function(err) {
                            error = {
                                httpstatus: 404,
                                msg: err
                            }
                            helper.formatResponse('', res, error);
                        })
                        console.log("var1");
                    }
                })
            })
            console.log("error", error);
            console.log("files", files.files[0].path);
        });
    },
    getBulkRecodes: function(req, res) {
        console.log(req.params.limit)
        if (typeof req.params.type != 'undefined' && req.params.type != '') {
            if (typeof req.params.limit != 'undefined' && req.params.limit != '') {
                var modelName = ''
                if (req.params.type.toLowerCase() == 'hr') {
                    modelName = 'hrData';
                } else {
                    modelName = req.params.type.toLowerCase();
                }
                models[modelName].aggregate(
                    [{
                        $match: {
                            isDump: false
                        }
                    }, {
                        $limit: parseInt(req.params.limit)
                    }]).then(function(data) {
                    var response = {
                        httpstatus: 200,
                        data: data
                    }
                    helper.formatResponse(response, res, '');
                }).catch(function(err) {
                    console.log(err)
                    var error = {
                        httpstatus: 404,
                        msg: err
                    }
                    helper.formatResponse('', res, error);
                })
            } else {
                var error = {
                    httpstatus: 404,
                    msg: 'limit can not empty or zero'
                }
                helper.formatResponse('', res, error);
            }
        } else {
            var error = {
                httpstatus: 404,
                msg: 'type can not found'
            }
            helper.formatResponse('', res, error);
        }
    },
    updateAsnc: function(req, res) {
        if (typeof req.body.type != 'undefined' && req.body.type != '') {
            var modelName = ''
            console.log(req.body.type,'hii')
            if (req.body.type.toLowerCase() == 'hr') {
                modelName = 'hrData';
            } else {
                modelName = req.body.type.toLowerCase();
            }
            asyncLoop(req.body.ids, (obj, next) => {
                var condition = {
                    _id: obj
                };
                var updateParams = {
                    isDump: true
                }
                models[modelName].update(condition, updateParams).then((data) => {
                    next();
                }).catch((error) => {
                    next();
                });
            }, (error) => {
                if (error) {
                    helper.formatResponse('', res, error);
                } else {
                    var response = {
                        httpstatus: 200,
                        data: 'updated'
                    }
                    helper.formatResponse(response, res, '');
                }
            })
        } else {
            var error = {
                message: 'can not found type'
            }
            helper.formatResponse('', res, error);
        }
    },
    importProntoData:(req,res) => {
         var finalData = [];
        var form = new formidable.Form();
        form.parse(req, function(error, fields, files) {
            helper.readCsvFile(files.files[0].path).then(function(data) {
                asyncLoop(data, (obj, next) => {
                    var singleUserData = {};
                    process.nextTick(function() {
                        singleUserData.First_Name = obj.firstname;
                        singleUserData.Last_Name = obj.lastname;
                        singleUserData.customer_id = obj.customer_id;
                        singleUserData.group_id = obj.group_id;
                        singleUserData.group_name = obj.group_name;
                        singleUserData.date_of_birth = obj.date_of_birth;
                        singleUserData.gender = obj.gender;
                        singleUserData.preferred_language = obj.preferred_language;
                        singleUserData.preferred_store = obj.preferred_store;
                        singleUserData.Address = [{
                            type: 'pronto',
                            street: '',
                            country: obj.country_name,
                            state: obj.state_name,
                            state_id:obj.state_id,
                            country_id:obj.country_id,
                            zipCode: obj.zip
                        }]
                        singleUserData.Phone_Number = [{
                            type: '',
                            mobileNo: obj.phone
                        }]
                        singleUserData.customer_since = obj.customer_since;
                        singleUserData.registered_via = obj.registered_via;
                        singleUserData.registered_user = obj.registered_user;
                        // var email = typeof obj.Primary_EMail != 'undefined' && obj.Primary_EMail != ''? [obj.Primary_EMail]:[];
                        var email = [];
                        if (typeof obj.email != 'undefined' && obj.email != '') {
                            email.push(obj.email);
                        }
                        singleUserData['email'] = email;
                        finalData.push(singleUserData);
                        singleUserData = {}
                        next();
                    })
                    //return false;
                }, (error) => {
                    if (error) {
                        console.log('adasdsad')
                        helper.formatResponse('', res, error);
                    } else {
                        console.log('adasdsa11111',finalData)
                        models.pronto.insertMany(finalData).then(function(resdata) {
                            console.log(resdata)
                            var response = {
                                httpstatus: 200,
                                data: resdata
                            }
                            helper.formatResponse(response, res, '');
                        }).catch(function(err) {
                            error = {
                                httpstatus: 404,
                                msg: err
                            }
                            helper.formatResponse('', res, error);
                        })
                        console.log("var1");
                    }
                })
            })
            console.log("error", error);
            console.log("files", files.files[0].path);
        });
    }
}