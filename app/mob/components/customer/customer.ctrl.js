/**
* This is the tier3 class.
* It contains all the methods of tier3
* @class tier3Controller
*/
var asyncLoop = require('node-async-loop');
var imageBase64 = require('./imageBase64.js');
// console.log("imageBase64", imageBase64)

module.exports = {
	/**
    * Action for search cutomer data
    *
    * @method search
    * @param {req} request
    * @param {res} response
    * @return {status} res -If it returns error then the status is false otherwise true. 
    */
   	
   	search: (req, res) => {
   		var body = req.body;
   		//craeting object for pim request
   		var params = {
   			firstName: "",
   			lastName: "",
   			mobile: "",
   			email: "",
   			myfamilaId: "",
   			prosperaId: "",
   			employeeId: "",
   			imageWidth: body.imageWidth
   		};

   		/*
   		* conditions for defined or not empty
   		*/
   		if(typeof body.firstName != 'undefined' && body.firstName.trim() != "") {
			params.firstName = body.firstName;
		}
		
		if(typeof body.lastName != 'undefined' && body.lastName.trim() != "") {
			params.lastName = body.lastName;
		}
		
		if(typeof body.mobile != 'undefined' && body.mobile.trim() != "") {
			params.mobile = body.mobile;
			
		}
		
		if(typeof body.email != 'undefined' && body.email.trim() != "") {
			params.email = body.email;
			
		}
		
		if(typeof body.myFamiliaId != 'undefined' && body.myFamiliaId != "") {
			params.myFamiliaId = body.myFamiliaId;
		}

		if(typeof body.prosperaId != 'undefined' && body.prosperaId != "") {
			params.prosperaId = body.prosperaId;
		}

		if(typeof body.employeeId != 'undefined' && body.employeeId != "") {
			params.employeeId = body.employeeId;
		}

		if(typeof body.imageWidth != 'undefined' && body.imageWidth != "") {
			params.imageWidth = body.imageWidth;
		}

		
		const pimApi = "/api/search-user";
		common.apiCall.postApi(params, pimApi).then((ciamData) => {
			const searchOnItems = ['powercheck1', 'tier3'];
			var result = {};
			result.ciam = [];
			if(ciamData.status) {
				if(typeof ciamData.isActive != 'undefined' && ciamData.isActive){
					return res.status(200).body(ciamData);	
				} else {
					result.ciam = ciamData.data
				}
			} 
			
			// console.log("match", match);
			
			asyncLoop(searchOnItems, (obj, next) => {
				var match = {};
		   		match.$or = [];
		   		var haveOrCondition = false;
				if(obj === 'tier3') {
					
					let andCond = []
					if(typeof body.firstName != 'undefined' && body.firstName != "") {
						andCond.push({"firstName": {$eq: body.firstName}});
					}
					if(typeof body.lastName != 'undefined' && body.lastName != "") {
						andCond.push({"lastName": {$eq: body.lastName}});
					}
					
					if(params.email != "") {
						haveOrCondition = true;
						match.$or.push({"email": body.email});
					}

					if(params.mobile != "") {
						haveOrCondition = true;
						match.$or.push({"phone.mobileNo": body.mobile});
					}

					if(typeof body.employeeId == 'undefined' && body.employeeId === "") {
						if(andCond.length > 0) {
							match.$or.push({$and: andCond});
						}
					}

					if(typeof body.prosperaId != 'undefined' && body.prosperaId != "") {
						haveOrCondition = true;
						match.$or.push({"customerRefNo": body.prosperaId});
						// let andCond = []
						// if(typeof body.firstName != 'undefined' && body.firstName != "") {
						// 	andCond.push({"firstName": {$regex: body.firstName, "$options": "i"}})
						// }
						// if(typeof body.lastName != 'undefined' && body.lastName != "") {
						// 	andCond.push({"lastName": {$regex: body.lastName, "$options": "i"}})
						// }
						
						// if(andCond.length > 0) {
						// 	match.$or.push({$and: andCond});
						// }
					} else if(andCond.length > 0) {
						match.$or.push({$and: andCond});
					}
					
				} else if(obj === "powercheck1"){
					
					let andCond = []
					if(typeof body.firstName != 'undefined' && body.firstName != "") {
						andCond.push({"firstName": {$eq: body.firstName}});
					}
					if(typeof body.lastName != 'undefined' && body.lastName != "") {
						andCond.push({"lastName": {$eq: body.lastName}});
					}
					
					if(params.email != "") {
						haveOrCondition = true;
						match.$or.push({"email": body.email});
					}

					if(params.mobile != "") {
						haveOrCondition = true;
						match.$or.push({"phone.mobileNo": body.mobile});
					}

					if(typeof body.employeeId == 'undefined' && body.employeeId === "") {
						if(andCond.length > 0) {
							match.$or.push({$and: andCond});
						}
					}

					if(typeof body.myFamiliaId != 'undefined' && body.myFamiliaId != "") {
						haveOrCondition = true;
						match.$or.push({"customerRefNo": body.myFamiliaId});
						// let andCond = []
						// if(typeof body.firstName != 'undefined' && body.firstName != "") {
						// 	andCond.push({"firstName": {$regex: body.firstName, "$options": "i"}})
						// }
						// if(typeof body.lastName != 'undefined' && body.lastName != "") {
						// 	andCond.push({"lastName": {$regex: body.lastName, "$options": "i"}})
						// }
						
						// if(andCond.length > 0) {
						// 	match.$or.push({$and: andCond});
						// }
					} else if(andCond.length > 0) {
						match.$or.push({$and: andCond});
					}
				}

				if(!haveOrCondition) {
					delete match.$or;
				}
				// console.log("match", match);
				common.groupB.searchOnPowerCheckData(match, '', '', obj).then((searchData) => {
					if(obj === "tier3") {
						result.tier3 = searchData;
					} else {
						result.powercheck = searchData;
					}
					next();
				}).catch((error) => {
					console.log("error", error);
					next();
				});
			}, (error) => {
				if(error) {
					helper.formatResponse('', res, error);
				} else {
					var response = {};
					response.data = result;
					helper.formatResponse(response, res, '');
				}
			});
		}).catch((error) => {
			console.log("error", error);
			helper.formatResponse('', res, error);
		});
	},

	/**
    * Action for master selection and merge data
    *
    * @method generateCutomerObj
    * @param {req} request
    * @param {res} response
    * @return {status} res -If it returns error then the status is false otherwise true. 
    */
   
 //   	{
	// 	"masterType":"ciam/tier3/powercheck",
	// 	"masterId":"1"
	// 	"data":{
	// 			ciam:["1","2","3"],

	// 			tier3:["1","2","3"],

	// 			powercheck:["1","2","3"],
	// 			licenceFrontImage:"Base64Image",
	// 			licenceBackImage:"Base64Image"
	// 		}
	// }	
   
    generateCutomerObj: (req, res) => {
    	const requiredParams = ['masterType', 'masterId'];
    	helper.validateRequiredParams(req, res, requiredParams).then(() => {
    		let response = {};
    		const cond = (typeof req.body.data.licenseBackImage != 'undefined' && typeof req.body.data.licenseFrontImage != 'undefined');
    		// console.log("conditions", cond);
    		if(req.body.masterType === 'ciam') {
    			// console.log("masterType", req.body.masterType);
    			
    			common.apiCall.ciamDetails(req.body.masterId).then((ciamData) => {
					// console.log("var1", ciamData);
					// return false;
					// var data = {
					// 	ciam: ['NG00000001'],
					// 	powercheck: ['2000013']
					// }
					ciamData.source = req.body.masterType;
					if(typeof ciamData['contact'] != 'undefined' && ciamData['contact'].length > 0) {
						ciamData['contact'][0].isPrimary = true;	
					}

					// if(typeof ciamData['address'] != 'undefined' && ciamData['address'].length > 0) {
					// 	ciamData['address'][0].isPrimary = true;	
					// }
					
					common.groupB.mergeData(ciamData, req.body.data.ciam, "ciam", req.body.masterType).then((mergeData) => {
						common.groupB.mergeData(mergeData, req.body.data.tier3, "tier3", req.body.masterType).then((mergeData1) => {
							// console.log("mergeData", mergeData);
							common.groupB.mergeData(mergeData1, req.body.data.powercheck, "powercheck1", req.body.masterType).then((mergeData2) => {
								mergeData2['northgateId'] = (typeof mergeData2['northgateId'] != 'undefined') ? mergeData2['northgateId'] : '';
								mergeData2['myFamiliaId'] = (typeof mergeData2['myFamiliaId'] != 'undefined') ? mergeData2['myFamiliaId'] : '';
								mergeData2['prosperaId'] = (typeof mergeData2['prosperaId'] != 'undefined') ? mergeData2['prosperaId'] : '';
								
								if(cond) {
									const licenseObj = {
										// licenseBackImage: req.body.data.licenseBackImage,
										licenseBackImage: (req.body.data.licenseBackImage != "") ? req.body.data.licenseBackImage : imageBase64.licenseBackImage,
										backFileNameWithOutExt: req.body.data.backFileNameWithOutExt,
										frontFileNameWithOutExt: req.body.data.frontFileNameWithOutExt,
										licenseFrontImage: (req.body.data.licenseFrontImage != "") ? req.body.data.licenseBackImage : imageBase64.licenseFrontImage,
										// licenseFrontImage: req.body.data.licenseFrontImage
									}
									// console.log("var1", licenseObj.licenseBackImage);
									common.groupB.licenseDataHandle(mergeData2, licenseObj).then((finalData) => {
										response.data = finalData;
										helper.formatResponse(response, res, '');
									}).catch((error) => {
										console.log("error123", error);
										helper.formatResponse('', res, error);
									})
								} else {
									mergeData2.license = {};
									response.data = mergeData2;
									helper.formatResponse(response, res, '');
								}
								
							});
						});
					});
				}).catch((error) => {
					console.log("error561", error);
    				helper.formatResponse('', res, error);
    			});
    		} else if(req.body.masterType === 'powercheck' || req.body.masterType === 'tier3'){
    			const match = {
					customerRefNo: req.body.masterId
				}

				var model = (req.body.masterType === 'tier3') ? "tier3" : "powercheck1";
    			common.groupB.searchOnPowerCheckData(match, true, 'powercheck', model).then((powercheckData) => {
    				powercheckData[0].source = req.body.masterType;
    				if(powercheckData[0]['contact'] != 'undefined' && powercheckData[0]['contact'].length > 0) {
						powercheckData[0]['contact'][0].isPrimary = true;	
					}

					// if(powercheckData[0]['address'] != 'undefined' && powercheckData[0]['address'].length > 0) {
					// 	powercheckData[0]['address'][0].isPrimary = true;	
					// }

					
					common.groupB.mergeData(powercheckData[0], req.body.data.ciam, "ciam", req.body.masterType).then((mergeData) => {
						common.groupB.mergeData(mergeData, req.body.data.tier3, "tier3", req.body.masterType).then((mergeData1) => {
							// console.log("var1", mergeData1);
							common.groupB.mergeData(mergeData1, req.body.data.powercheck, "powercheck1", req.body.masterType).then((mergeData2) => {
								// console.log("mergeData1", mergeData2);
								mergeData2['northgateId'] = (typeof mergeData2['northgateId'] != 'undefined') ? mergeData2['northgateId'] : '';
								mergeData2['myFamiliaId'] = (typeof mergeData2['myFamiliaId'] != 'undefined') ? mergeData2['myFamiliaId'] : '';
								mergeData2['prosperaId'] = (typeof mergeData2['prosperaId'] != 'undefined') ? mergeData2['prosperaId'] : '';
								if(cond) {
									const licenseObj = {
										// licenseBackImage: req.body.data.licenseBackImage,
										licenseBackImage: (req.body.data.licenseBackImage != "") ? req.body.data.licenseBackImage : imageBase64.licenseBackImage,
										backFileNameWithOutExt: req.body.data.backFileNameWithOutExt,
										frontFileNameWithOutExt: req.body.data.frontFileNameWithOutExt,
										licenseFrontImage: (req.body.data.licenseFrontImage != "") ? req.body.data.licenseBackImage : imageBase64.licenseFrontImage,
										// licenseFrontImage: req.body.data.licenseFrontImage
									}

									common.groupB.licenseDataHandle(mergeData2, licenseObj).then((finalData) => {
										response.data = finalData;
										helper.formatResponse(response, res, '');
									}).catch((error) => {
										console.log("license error", error);
										helper.formatResponse('', res, error);
									})
								} else {
									mergeData2.license = {};
									response.data = mergeData2;
									helper.formatResponse(response, res, '');
								}
							});
						});
					});
    			}).catch((error) => {
    				console.log("error", error);
    				helper.formatResponse('', res, error);	
    			})
    		}
    	});
    },

	/**
	 * @swagger
	 * /mob/v1.0/ciam-details/{id}:
	 *   get:
	 *     summary: Get ciam details
	 *     description: Get User
	 *     tags: [Users]
	 *     parameters:
	 *       - name: id
	 *         description: User's id
	 *         in: path
	 *         type: string
	 *         required: true
	 *     produces:
	 *       - application/body
	 *     responses:
	 *       200:
	 *         description: Success get customer details
	 */
   
    ciamDetails: (req,res) => {
    	var ngId = req.params.id;
    	common.apiCall.ciamDetails(ngId).then((ciamData) => {
    		let response = {};
    		response.data = ciamData;
    		helper.formatResponse(response, res, '');
    	}).catch((error) => {
			console.log("error367", error);
			helper.formatResponse('', res, error);
		});;
	},


   /**
	 * @swagger
	 * paths:
	 *   /mob/v1.0/push-user:
	 *     post:
	 *       summary: push User
	 *       description: Add user
	 *       tags: [Users]
	 *       parameters:
	 *         - name: body
	 *           description: add user
	 *           in: "body"
	 *           required: true
	 *           schema:
	 *             $ref: "#/definitions/user"
	 *       produces:
	 *         - application/json
	 *       responses:
	 *         200:
	 *           description: Success add user
	 *         400:
	 *           description: exception for required fieleds and validation
	 * definitions:
	 *   Add:
	 *     type: array
	 *     items:
	 *       type: object
	 *       properties:
	 *         type:
	 *           type: string
	 *         street:
	 *           type: string
	 *         country:
	 *           type: string
	 *         state:
	 *           type: string
	 *         city:
	 *           type: string
	 *         address_2:
	 *           type: string
	 *         district:
	 *           type: string
	 *   Phone:
	 *     type: array
	 *     items:
	 *       type: object
	 *       properties:
	 *         type:
	 *           type: string         
	 *         mobileNo:
	 *           type: string
	 *         email:
	 *           type: string
	 *   user:
	 *     type: object
	 *     required:
	 *       - firstName
	 *       - lastName
	 *     properties:
	 *       firstName:
	 *         type: string
	 *       lastName:
	 *         type: string
	 *       middleName:
	 *         type: string
	 *       secondLastName:
	 *         type: string
	 *       primaryPhoneNumber:
	 *         type: number
	 *       source:
	 *         type: string
	 *       Birthdate:
	 *         type: string
	 *         format: date
	 *       Address:
	 *         $ref: "#/definitions/Add"
	 *       Phone_Number:
	 *         $ref: "#/definitions/Phone"
	 *         
	 */

	pushUser: (req, res) => {
		// console.log("req", req.body);
		common.apiCall.postApi(req.body, '/api/pushUser').then((data) => {
            res.status(200).json(data);
        }).catch(function(error) {
            helper.formatResponse('', res, error);
        });
	}
}

