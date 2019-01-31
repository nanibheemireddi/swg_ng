/**
 * This is the groupb class. ex: tier3, powercheck data
 * It contains all the methods with promises of groupB
 * @class groupBCommon
 */
const asyncLoop = require('node-async-loop');
const moment = require('moment');
module.exports = {
	/**
     * Action for getting results from powercheck
     *
     * @method searchOnPowerCheckData
     * @param {object} matchObj - object data
     * @return {promise} res - If query is sucess then it resolves retrieved data otherwise rejects some error.
     */
    
    searchOnPowerCheckData : (matchObj, isDetail, masterType, model) => {
    	return new Promise((resolve, reject) => {
    		if(!_.isEmpty(matchObj)) {

    			let project = {
					firstName: {$ifNull: ["$firstName", '']},
					lastName: {$ifNull: ["$lastName", '']},
					middleName: {$ifNull: ["$middleName", '']},
					secondLastName: {$ifNull: ["$secondLastName", '']},
					birthdate: {$ifNull: [{ $dateToString: { format: "%m/%d/%Y", date: "$dob"}}, '']},
					gender: "",
					updateAt: {$ifNull: [{ $dateToString: { format: "%m/%d/%Y", date: "$updatedAt" } }, '']},
				}

				if(model === "tier3") {
					project.prosperaId = "$customerRefNo";
				} else {
					project.myFamiliaId = "$customerRefNo";
				}

    			if(isDetail) {
    				project.address = {$ifNull: ["$address", []]};
    				project.phone = {$ifNull: ["$phone", []]};
    				project.email = {$ifNull: ["$email", []]};
    			} else {
    				project.phoneNo = {
    					$cond: { if: { $gt: [ "$phoneLength", 1 ] }, 
	    					then: {
	    						$cond: { 
			    					if: { 
			    						$or: [
				    						{$eq: [ { $arrayElemAt: [ "$phone.type", 0 ]}, "Cellphone" ]}, 
				    						{$eq: [ { $arrayElemAt: [ "$phone.type", 0 ]}, "Work" ]}
			    						], 
									},
									then: {$ifNull: [{ $arrayElemAt: [ "$phone.mobileNo", 0 ]}, '']},
									else: {$ifNull: [{ $arrayElemAt: [ "$phone.mobileNo", 0 ]}, '']}
									
								}
	    					}, 
	    					else: {$ifNull: [{ $arrayElemAt: [ "$phone.mobileNo", 0 ]}, '']}
	    				}
    				};
    				project.email = {$ifNull: [{ $arrayElemAt: [ "$email", 0 ]}, '']};
    			}

    			
    			const agg = [
					{
						$match: matchObj
					},
					{$sort: {updatedAt: -1}},
					{$addFields: {phoneLength: {$size: "$phone"}}},
					{
						$project: project
					}
				];
				var source = (model === "tier3") ? "tier3" : "powercheck";
				models[model].aggregate(agg, (error, powercheckData) => {
					if(error) {
						reject(error);
					} else {
						if(!_.isEmpty(powercheckData)) {
							if(isDetail) {
								powercheckData[0].contact = [];
								if(typeof powercheckData[0].phone != 'undefined' && powercheckData[0].phone.length > 0) {
									if(typeof masterType != 'undefined' && masterType != "" ) {
										powercheckData[0].phone[0].isPrimary = true;
										powercheckData[0].phone[0].source = masterType;	
										
									}
									
									_.each(powercheckData[0].phone, (phoneObj) => {
										phoneObj.type = (typeof phoneObj.type != 'undefined') ? phoneObj.type : "";
										phoneObj.dialCode = (typeof phoneObj.dialCode != 'undefined') ? phoneObj.dialCode : "";
										phoneObj.isPrimary = (typeof phoneObj.isPrimary != 'undefined') ? phoneObj.isPrimary : false;
										phoneObj.mobileNo = (typeof phoneObj.mobileNo != 'undefined') ? phoneObj.mobileNo : "";
										phoneObj.source = source;
										phoneObj.email = (typeof powercheckData[0].email[0] != 'undefined') ? powercheckData[0].email[0] : "";
										powercheckData[0].contact.push(phoneObj);
									});

								} else if(typeof powercheckData[0].email != 'undefined' && powercheckData[0].email.length > 0) {
									powercheckData[0].contact.push({email: powercheckData[0].email[0]});
									powercheckData[0].contact.push({isPrimary: false});
									powercheckData[0].contact.push({source: source});
									powercheckData[0].contact.push({dialCode: ""});
									powercheckData[0].contact.push({type: ""});
									powercheckData[0].contact.push({mobileNo: ""});
								}

								if(typeof powercheckData[0].address != 'undefined' && powercheckData[0].address.length > 0) {
									if(typeof masterType != 'undefined' && masterType != "" ) {
										powercheckData[0].address[0].isPrimary = false;	
										powercheckData[0].address[0].source = source;	
									}
									_.each(powercheckData[0].address, (addressObj) => {
										addressObj.title = (typeof addressObj.type != 'undefined') ? addressObj.type : "";
										addressObj.street = (typeof addressObj.street != 'undefined') ? addressObj.street : "";
										addressObj.city = (typeof addressObj.city != 'undefined') ? addressObj.city : "";
										addressObj.state = (typeof addressObj.state != 'undefined') ? addressObj.state : "";
										addressObj.isPrimary = (typeof addressObj.isPrimary != 'undefined') ? addressObj.isPrimary : false;
										addressObj.country = (typeof addressObj.country != 'undefined') ? addressObj.country : "United States";
										addressObj.zipCode = (typeof addressObj.zipCode != 'undefined') ? addressObj.zipCode : "";
										addressObj.noOfMonths = (typeof addressObj.noOfMonths != 'undefined') ? addressObj.noOfMonths : "0";
										addressObj.source = source;
										delete addressObj.type;
									});
									
								}
								delete powercheckData[0].phone;
								delete powercheckData[0].email;
								resolve(powercheckData);
							} else {
								resolve(powercheckData);
							}
						} else {
							resolve([]);
						}
					}
				});
    		} else {
    			resolve([]);
    		}
    	});
    },

    /**
     * Action for getting results from powercheck
     *
     * @method searchOnPowerCheckData
     * @param {object} matchObj - object data
     * @return {promise} res - If query is sucess then it resolves retrieved data otherwise rejects some error.
     */
    
    mergeData: (masterData, mergeIds, type, masterType) => {
    	return new Promise((resolve, reject) => {
    		if(type === 'ciam') {
    			if(!_.isEmpty(mergeIds)) {
					asyncLoop(mergeIds, (obj, next) => {
						common.apiCall.ciamDetails(obj).then((ciamData1) => {
							if(!_.isEmpty(ciamData1)) {
								let sourceId;
								if(masterType === "ciam") {
									sourceId = masterData.northgateId;
								} else if(masterType === "powercheck"){
									sourceId = masterData.myFamiliaId;
								} else if(masterType === "tier3") {
									sourceId = masterData.prosperaId;
								}
								common.groupB.mergeUserSaveAndUpdate(sourceId, masterType, ciamData1.northgateId, 'ciam').then(() => {
									let masterKeys = Object.keys(masterData);
									let ciamKeys1 = Object.keys(ciamData1);
									let remainingKeys = _.difference(ciamKeys1, masterKeys);
									if((typeof masterData['contact'] != 'undefined' && masterData["contact"].length > 0) || 
										(typeof ciamData1['contact'] != 'undefined' && ciamData1["contact"].length > 0)) {
										masterData['contact'] = _.concat(masterData['contact'], ciamData1['contact']);
										masterData['contact'][0].isPrimary = true; 
									}

									if((typeof masterData['address'] != 'undefined' && masterData["address"].length > 0) ||
										(typeof ciamData1['address'] != 'undefined' && ciamData1["address"].length > 0)) {
										masterData['address'] = _.concat(masterData['address'], ciamData1['address']);
										// masterData['address'][0].isPrimary = true;
									} 

									if(remainingKeys.length > 0) {
										_.each(remainingKeys, (key) => {
											if(key !== 'contact' || key !== 'address') {
												masterData[key] = ciamData1[key];
											}
										});
										next();
									} else {
										next();
									}
								});
							} else {
								next();
							}
						});	
					}, (error) => {
						if(error) {
							reject(error)
						} else {
							resolve(masterData);
						}
					});
				} else {
					resolve(masterData);
				}
    		} else if(type === "powercheck1" || type === "tier3") {
    			// console.log("var1", mergeIds);
    			if(!_.isEmpty(mergeIds)) {
					asyncLoop(mergeIds, (obj, next) => {
						const match = {
							customerRefNo: obj
						}
						var childType = (type === "tier3") ? "tier3" : "powercheck";
						
						common.groupB.searchOnPowerCheckData(match, true, '', type).then((data) => {
							// console.log("data", data);
							let sourceId;
							if(masterType === "ciam") {
								sourceId = masterData.northgateId;
							} else if(masterType === "powercheck"){
								sourceId = masterData.myFamiliaId;
							} else if(masterType === "tier3") {
								sourceId = masterData.prosperaId;
							}

							var childSourceId = (type === "tier3") ? data[0].prosperaId : data[0].myFamiliaId;
							
							// return false;
							common.groupB.mergeUserSaveAndUpdate(sourceId, masterType, childSourceId, childType).then(() => {
								let masterKeys = Object.keys(masterData);
								let dataKeys = Object.keys(data[0]);
								let remainingKeys = _.difference(dataKeys, masterKeys);
								
								// console.log("masterData", masterData);
								if((typeof masterData['contact'] != 'undefined' && masterData["contact"].length > 0) ||
									(typeof data[0]['contact'] != 'undefined' && data[0]['contact'].length > 0)) {
									masterData['contact'] = _.concat(masterData['contact'], data[0]['contact']);
									masterData['contact'][0].isPrimary = true; 
								}

								if((typeof masterData['address'] != 'undefined' && masterData["address"].length > 0) ||
									(typeof data[0]['address'] != 'undefined' && data[0]['address'].length > 0)) {
									masterData['address'] = _.concat(masterData['address'], data[0]['address']);
									// masterData['address'][0].isPrimary = true;
								}

								if((masterData['prosperaId'] === "") &&
									(typeof data[0]['prosperaId'] != 'undefined' && data[0]['prosperaId'] !== "")) {
									masterData['prosperaId'] = data[0]['prosperaId'];
								}
								
								if((masterData['myFamiliaId'] === "") &&
									(typeof data[0]['myFamiliaId'] != 'undefined' && data[0]['myFamiliaId'] !== "")) {
									masterData['myFamiliaId'] = data[0]['myFamiliaId'];
								}

								if(remainingKeys.length > 0) {
									_.each(remainingKeys, (key) => {
										if(key != 'contact' || key != 'address') {
											masterData[key] = data[0][key];
										}
									});
									next();
								} else {
									next();
								}
							});
						});	
					}, (error) => {
						if(error) {
							reject(error)
						} else {
							resolve(masterData);
						}
					});
				} else {
					resolve(masterData);
				}
    		}
    	});
    },

    /**
     * Action for getting results from powercheck
     *
     * @method searchOnPowerCheckData
     * @param {object} matchObj - object data
     * @return {promise} res - If query is sucess then it resolves retrieved data otherwise rejects some error.
     */
    

    mergeUserSaveAndUpdate: (sourceId, masterType, childId, childType) => {
    	return new Promise((resolve, reject) => {
    		models.mergeUser.findOne({sourceId: sourceId}).exec((error, mergeUser) => {
				if(error) {
					reject(error);
				} else {
					if(_.isEmpty(mergeUser)) {
						const postData = {
							sourceId: sourceId,
							type: masterType,
							childs: [
								{
									sourceId: childId,
									type: childType
								}
							]
						};
						const postDataSave = new models.mergeUser(postData);
						_mongoose.save(postDataSave).then(() => {
							resolve(true);
						}).catch((error) => {
							console.log("mergeUserSave");
						})
					} else {
						const updateParams = {
							$push: {
								childs: {
									$each: [
										{
											sourceId: childId,
											type: childType
										}
									]
								}
							}
						};
						// console.log("updateParams", updateParams);
						models.mergeUser.update({sourceId: sourceId}, updateParams).then(() => {
							resolve(true);
						}).catch((error) => {
							console.log("update merge data");
						});
					}
				} 
			});	
    	});
    },

    /**
     * Action for getting results from powercheck
     *
     * @method searchOnPowerCheckData
     * @param {object} matchObj - object data
     * @return {promise} res - If query is sucess then it resolves retrieved data otherwise rejects some error.
     */
    
    licenseDataHandle : (mergeData2, licenseObj) => {
    	return new Promise((resolve, reject) => {
    		common.apiCall.postApi(licenseObj, '/api/get-license-detail').then((licenseData) => {
    			// console.log("licenseData", licenseData);
    			mergeData2.license = {};

				if(licenseData.status && !_.isEmpty(licenseData.data)) {
					delete licenseData.data.xml;
					mergeData2.license = licenseData.data;
					mergeData2.license.backImageAssetId = (typeof licenseData.backImageAssetId != 'undefined') ? licenseData.backImageAssetId : ""; 
					mergeData2.license.frontImageAssetId = (typeof licenseData.frontImageAssetId != 'undefined') ? licenseData.frontImageAssetId : "";
					mergeData2.license.licenseFrontUrl = (typeof licenseData.licenseFrontUrl != 'undefined') ? licenseData.licenseFrontUrl : "";
					mergeData2.license.licenseBackUrl = (typeof licenseData.licenseBackUrl != 'undefined') ? licenseData.licenseBackUrl : "";
					if(typeof licenseData.data.first != 'undefined' && licenseData.data.first != "") {
						mergeData2.firstName = licenseData.data.first;
					}
					if(typeof licenseData.data.last != 'undefined' && licenseData.data.last != "") {
						mergeData2.lastName = licenseData.data.last;	
					}
					if(typeof licenseData.data.middle != 'undefined' && licenseData.data.middle != "") {
						mergeData2.middleName = licenseData.data.middle;
					}
					if(typeof licenseData.data.dob != 'undefined' && licenseData.data.dob != "") {
						mergeData2.birthdate = moment(licenseData.data.dob).format('MM/DD/YYYY');
					}
					if(typeof licenseData.data.sex != 'undefined' && licenseData.data.sex != "") {
						mergeData2.gender = licenseData.data.sex;
					}

					let address = {};
					let isAddExist = false;
					if(typeof licenseData.data.city != 'undefined' && licenseData.data.city != "") {
						isAddExist = true;
						address.city = licenseData.data.city;	
					}
					if(typeof licenseData.data.street != 'undefined' && licenseData.data.street != "") {
						isAddExist = true;
						address.street = licenseData.data.street;
					}
					if(typeof licenseData.data.country != 'undefined' && licenseData.data.country != "") {
						isAddExist = true;
						address.country = licenseData.data.country;
					}
					if(typeof licenseData.data.state != 'undefined' && licenseData.data.state != "") {
						isAddExist = true;
						address.state = licenseData.data.state;
					}
					if(typeof licenseData.data.postal != 'undefined' && licenseData.data.postal != "") {
						isAddExist = true;
						address.zipCode = licenseData.data.postal;
					}

					if(isAddExist) {
						address.source = 'license';
						address.title = "";	
						address.noOfMonths = "";
						address.zipCode = (typeof address.zipCode != 'undefined') ? address.zipCode : "";
						address.street = (typeof address.street != 'undefined') ? address.street : "";
						address.city = (typeof address.city != 'undefined') ? address.city : "";
						address.state = (typeof address.state != 'undefined') ? address.state : "";
						address.country = (typeof address.country != 'undefined') ? address.country : "";
						mergeData2.address.push(address);
					}

					mergeData2.address = _.sortBy(mergeData2.address, ['source']);
					mergeData2.contact = _.sortBy(mergeData2.contact, ['source']);
					resolve(mergeData2);
				} else {
					mergeData2.address = _.sortBy(mergeData2.address, ['source']);
					mergeData2.contact = _.sortBy(mergeData2.contact, ['source']);
					resolve(mergeData2);
				}
			}).catch((error) => {
				console.log("license error", error);
				reject(error)
			});
    	});
    }

}