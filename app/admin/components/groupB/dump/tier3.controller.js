// /**
// * This is the tier3 class.
// * It contains all the methods of tier3
// * @class tier3Controller
// */
// var multiparty = require('multiparty');
// var asyncLoop = require('node-async-loop');
// module.exports = {
// 	/**
//     * Action for dump tier3 data
//     *
//     * @method importTier3Data
//     * @param {req} request
//     * @param {res} response
//     * @return {status} res -If it returns error then the status is false otherwise true. 
//     */
//    	importTier3Data: (req, res) => {
  
// 		const path = __dirname + '/../../../../../public/cust_basic_common_extract_19700101000000_20180906191503.csv';
// 		helper.readCsvFile(path).then((data) => {
// 			var i = 0;
// 			asyncLoop(data, (obj, next) => {
// 				process.nextTick(function() {
// 					i = i + 1;
// 					var tempObj = {};
// 					var insert = false;
// 					if(typeof obj.firstName != 'undefined' && obj.firstName.trim() != "") {
// 						insert = true;
// 						tempObj.firstName = obj.firstName.trim();
// 					}
// 					if(typeof obj.lastName != 'undefined' && obj.lastName.trim() != "") {
// 						insert = true;
// 						tempObj.lastName = obj.lastName.trim();
// 					}
// 					if(typeof obj.middleName != 'undefined' && obj.middleName.trim() != "") {
// 						insert = true;
// 						tempObj.middleName = obj.middleName.trim();
// 					}
// 					if(typeof obj.secondLastName != 'undefined' && obj.secondLastName.trim() != "") {
// 						insert = true;
// 						tempObj.secondLastName = obj.secondLastName.trim();
// 					}

// 					if((typeof obj.DayOfBirth != 'undefined' && obj.DayOfBirth.trim() != "") &&
// 						(typeof obj.MonthOfBirth != 'undefined' && obj.MonthOfBirth.trim() != "") && 
// 						(typeof obj.YearOfBirth != 'undefined' && obj.YearOfBirth.trim() != "")) {
						
// 						insert = true;
// 						let year;
// 						if(obj.YearOfBirth.length != 4) {
// 							helper.decrypt(obj.YearOfBirth.trim()).then((year) => {
// 								year = year;
// 								let date = year.toString() + '/' + obj.MonthOfBirth.toString() + '/' + obj.DayOfBirth.toString();
// 								tempObj.dob = new Date(date);
// 							});
// 						} else {
// 							let date = obj.YearOfBirth.toString() + '/' + obj.MonthOfBirth.toString() + '/' + obj.DayOfBirth.toString();
// 							tempObj.dob = new Date(date);
// 						}
// 					}
// 					console.log("i", i);
// 					setImmediate(() => {
// 						if(insert) {
// 							tempObj.customerRefNo = obj.customerRefNo;
// 							const tempSave = new models.tier3(tempObj);
// 							_mongoose.save(tempSave).then(() => {
// 								next();
// 							}).catch((error) => {
// 								console.log("error", error);
// 								next();
// 							});

// 						} else {
// 							next();
// 						}
// 					});
// 				});
// 			}, (error) => {
// 				if(error) {
// 					helper.formatResponse('', res, error);
// 				} else {
// 					res.status(200).json({
// 						sucess: true,
// 						records: i
// 					});
// 				}
// 			});
// 		}).catch((error) => {
// 			helper.formatResponse('', res, error);
// 		});
	
// 	},

// 	/**
//     * Action for dump tier3 data
//     *
//     * @method dumpAddTier3Data
//     * @param {req} request
//     * @param {res} response
//     * @return {status} res -If it returns error then the status is false otherwise true. 
//     */
	
// 	dumpAddTier3Data: (req, res) => {
// 		const path = __dirname + '/../../../../../public/cust_address_extract_19700101000000_20180906191558.csv';
// 		helper.readCsvFile(path).then((data) => {
// 			var i = 0;
// 			asyncLoop(data, (obj, next) => {
//                 process.nextTick(function() {
// 					i += 1;
// 					var tempObj = {};
// 					var isUpdate = false;
// 					if(typeof obj.AddressType != 'undefined' && obj.AddressType.trim() != "") {
// 						tempObj.type = obj.AddressType;
// 					}
// 					if(typeof obj.Address != 'undefined' && obj.Address.trim() != "") {
// 						isUpdate = true;
// 						tempObj.street = obj.Address;
// 					}
// 					if(typeof obj.City != 'undefined' && obj.City.trim() != "") {
// 						isUpdate = true;
// 						tempObj.city = obj.City;
// 					}
// 					if(typeof obj.State != 'undefined' && obj.State.trim() != "") {
// 						isUpdate = true;
// 						tempObj.state = obj.State;
// 					}
// 					if(typeof obj.ZipCode != 'undefined' && obj.ZipCode.trim() != "") {
// 						isUpdate = true;
// 						tempObj.zipCode = obj.ZipCode;
// 					}
					
// 					tempObj.country = 'United States';
// 					// console.log("tempObj", tempObj);
// 					// return false;
// 					if(isUpdate) {
// 						var condition = {customerRefNo: obj.CustomerRefNo.toString()};
// 						var updateParams = {
// 							$push: {
// 								address: {
// 									$each: [tempObj]
// 								}
// 							}
// 						}
// 						console.log("i", i);
// 						// console.log("updateParams", updateParams);
// 						models.tier3.update(condition, updateParams).then((data) => {
// 							console.log("address", data);
// 							next();
// 						}).catch((error) => {
// 							next();
// 						})
// 					} else {
// 						console.log("i", i);
// 						next();
// 					}
// 				});
// 				// _mongoose.update(models.tier3, condition, updateParams).then((data) => {
// 				// 	console.log("var1 hello", data);
					
// 				// }).catch((error) => {
// 				// 	// console.log("error", error);
// 				// 	next();
// 				// })

// 			}, (error) => {
// 				if(error) {
// 					helper.formatResponse('', res, error);		
// 				} else {
// 					console.log("var1");
// 				}
// 			});	
// 		}).catch((error) => {
// 			helper.formatResponse('', res, error);
// 		});
// 	},

// 	/**
//     * Action for dump tier3 data
//     *
//     * @method importIdentityData
//     * @param {req} request
//     * @param {res} response
//     * @return {status} res -If it returns error then the status is false otherwise true. 
//     */
	
// 	importIdentityData: (req, res) => {
// 		const path = __dirname + '/../../../../../public/cust_ids_extract_19700101000000_20180906191526.csv';
// 		helper.readCsvFile(path).then((data) => {
// 			var i = 0;
// 			asyncLoop(data, (obj, next) => {
// 				process.nextTick(function() {
// 					var isUpdate = false;
// 					i += 1;
// 					var tempObj = {};
// 					if(typeof obj.IdentificationType != 'undefined' && obj.IdentificationType.trim() != "") {
// 						tempObj.type = obj.IdentificationType;
// 					}
// 					if(typeof obj.IdentificationNumber != 'undefined' && obj.IdentificationNumber.trim() != "") {
// 						isUpdate = true;
// 						helper.decrypt(obj.IdentificationNumber.trim()).then((identificationNo) => {
// 							tempObj.identificationNo = identificationNo;	
// 						});
						
// 					}
// 					if(typeof obj.ExpirationDate != 'undefined' && obj.ExpirationDate.trim() != "" && obj.ExpirationDate.trim() != "-") {
// 						tempObj.expiryDate = new Date(obj.ExpirationDate);
// 					}
					
// 					setImmediate(() => {
// 						if(isUpdate) {
// 							var condition = {customerRefNo: obj.CustomerRefNo.toString()};
// 							var updateParams = {
// 								$push: {
// 									identification: {
// 										$each: [tempObj]
// 									}
// 								}
// 							}
							
// 							console.log("i", i);
// 							models.tier3.update(condition, updateParams).then((data) => {
// 								console.log("identification", data);
// 								next();
// 							}).catch((error) => {
// 								next();
// 							});
// 						} else {
// 							next();
// 							console.log("i", i);
// 						}

// 					});
// 				});
// 			}, (error) => {
// 				if(error) {
// 					helper.formatResponse('', res, error);		
// 				} else {
// 					console.log("var1");
// 				}
// 			});	
// 		}).catch((error) => {
// 			helper.formatResponse('', res, error);
// 		});
// 	},

// 	/**
//     * Action for dump tier3 data
//     *
//     * @method importPhoneData
//     * @param {req} request
//     * @param {res} response
//     * @return {status} res -If it returns error then the status is false otherwise true. 
//     */
	
// 	importPhoneData: (req, res) => {
// 		const path = __dirname + '/../../../../../public/cust_phone_extract_19700101000000_20180906191548.csv';
// 		helper.readCsvFile(path).then((data) => {
// 			var i = 0;
// 			asyncLoop(data, (obj, next) => {
// 				process.nextTick(function() {
// 					i += 1;
// 					var tempObj = {};
// 					var isUpdate = false;
// 					if(typeof obj.PhoneType != 'undefined' && obj.PhoneType.trim() != "") {
// 						tempObj.type = obj.PhoneType;
// 					}
// 					if(typeof obj.PhoneNumber != 'undefined' && obj.PhoneNumber.trim() != "" && obj.PhoneNumber.trim() != 0) {
// 						isUpdate = true
// 						tempObj.mobileNo = obj.PhoneNumber;
// 					}

// 					if(isUpdate) {
// 						var condition = {customerRefNo: obj.CustomerRefNo.toString()};
// 						var updateParams = {
// 							$push: {
// 								phone: {
// 									$each: [tempObj]
// 								}
// 							}
// 						}
						
// 						console.log("i", i);
// 						models.tier3.update(condition, updateParams).then((data) => {
// 							console.log("phone", data);
// 							next();
// 						}).catch((error) => {
// 							next();
// 						});
// 					} else {
// 						console.log("i", i);
// 						next();
// 					}
// 				});
// 			}, (error) => {
// 				if(error) {
// 					helper.formatResponse('', res, error);		
// 				} else {
// 					console.log("var1");
// 				}
// 			});	
// 		}).catch((error) => {
// 			helper.formatResponse('', res, error);
// 		});
// 	}, 

// 	/**
//     * Action for dump tier3 data
//     *
//     * @method importEmailData
//     * @param {req} request
//     * @param {res} response
//     * @return {status} res -If it returns error then the status is false otherwise true. 
//     */
	
// 	importEmailData: (req, res) => {
// 		const path = __dirname + '/../../../../../public/cust_email_extract_19700101000000_20180906191557.csv';
// 		helper.readCsvFile(path).then((data) => {
// 			var i = 0;
// 			asyncLoop(data, (obj, next) => {
// 				i += 1;
// 				// setTimeout(() => {
// 					// console.log("obj", obj);
// 					// return false;
// 					console.log("typeof", typeof obj.Email != 'undefined' && obj.Email.trim() != "");
// 					if(typeof obj["Email "] != 'undefined' && obj["Email "].trim() != "") {
// 						var email = obj["Email "];
// 						var condition = {customerRefNo: obj.CustomerRefNo.toString()};
// 						var updateParams = {
// 							$push: {
// 								email: {
// 									$each: [email]
// 								}
// 							}
// 						}
						
// 						// console.log("updateParams", updateParams);
// 						models.tier3.update(condition, updateParams).then((data) => {
// 							console.log("var1", data);
// 						});
// 					}
// 					console.log("i", i);
// 					next();
// 				// }, 200);
// 			}, (error) => {
// 				if(error) {
// 					console.log("error1", error);
// 					helper.formatResponse('', res, error);		
// 				} else {
// 					console.log("var1 hello");
// 				}
// 			});	
// 		}).catch((error) => {
// 			console.log("error", error);
// 			helper.formatResponse('', res, error);
// 		});
// 	},
// }
