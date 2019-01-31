const request = require('request');
module.exports = {
    
    /**
    * Action for re-registration
    *
    * @method registration1
    * @param {req} request
    * @param {res} response
    * @return {status} res -If it returns error then the status is false otherwise true. 
    */
   
    registration1: (req, res) => {
        var body = req.body;
        if(typeof body.contact != 'undefined' && body.contact.length > 0) {
            let primaryObj = _.filter(body.contact, 'isPrimary');
            body.email = primaryObj[0].email || "";
            body.mobileNo = primaryObj[0].mobileNo || "";
        }
        common.apiCall.postApi(body, '/api/re-registration').then((data) => {
            if(typeof data.status != 'undefined' && data.status) {
                res.status(200).json(data);
            } else {
                const error = {
                    httpstatus: 400,
                    msg: "something went wrong in the function of re registration"
                }
                helper.formatResponse('', res, error);
            }
        }).catch(function(error) {
            helper.formatResponse('', res, error);
        });
    },

    
    /**
    * Action for ofac search
    *
    * @method ofacSearch
    * @param {req} request
    * @param {res} response
    * @return {status} res -If it returns error then the status is false otherwise true. 
    */
   
    ofacSearch: (req, res) => {
        

        var fullName = req.body.firstName.trim();
        if(typeof req.body.lastName != 'undefined' && req.body.lastName != '') {
            fullName = fullName + ' ' + req.body.lastName.trim();
        }
        console.log("fullName", fullName);
        const options = {
            url: "https://easyofac.com/api/fullNameSearch?api_key=SqxD2ynGWKcok1w4SO6JPydthq3S62fL&name=" + fullName + "&include_parsed=1&test=1",
            method: 'GET',
        }
        
        request(options,(error, response, body) => {
            
            if (!error && response.statusCode == 200) {
                const data = JSON.parse(body);
                if(data.length > 1) {
                    res.status(200).json({"success": true, "ofacVerified": false});
                } else {
                    res.status(200).json({"success": true, "ofacVerified": true});
                }
            } else {
                if(fullName != '') {
                    res.status(200).json({"success": true, "ofacVerified": true});
                } else {
                    res.status(200).json({"success": true, "ofacVerified": true});
                }
            }
        });
    }
}