/**
 * This is the api call class
 * It contains all the methods with promises of api call
 * @class apiCallCommon
 */
const request = require('request');
module.exports = {
    /**
     * Action for getting results from ciam
     *
     * @method searchOnCiam
     * @param {object} searchObj - object data
     * @return {promise} res - If query is sucess then it resolves retrieved data otherwise rejects some error.
     */

    postApi: (searchObj, url) => {
        // console.log("searchObj", searchObj);
        return new Promise((resolve, reject) => {
            var options = {
			    url: process.env.PIM_SAERVER + url,
			    method: 'POST',
			    json: true,
			    body: searchObj
			}

			// Start the request
			request(options,(error, response, body) => {
                // console.log("body", body);
                // console.log("error", error);
                // console.log("response", response);
                // console.log("body", body);
                var data = [];
                // console.log("response", response);
			    if (!error && response.statusCode == 200) {
			    	resolve(body);
                } else {
                    resolve(data);   
			    }
			});
        });
    },

    /**
     * Action for getting results from ciam
     *
     * @method ciamDetails
     * @param {object} searchObj - object data
     * @return {promise} res - If query is sucess then it resolves retrieved data otherwise rejects some error.
     */

    ciamDetails: (northgateId) => {
        // console.log("northgateId", northgateId);
        return new Promise((resolve, reject) => {
            var options = {
			    url: process.env.PIM_SAERVER + '/api/user-details/' + northgateId,
			    method: 'GET',
			    json: true,
			}

			// Start the request
			request(options,(error, response, body) => {
                if (!error && response.statusCode == 200) {
			    	var data = [];
			    	if(body.status) {
			    		data = body.data;
			    	}
			    	resolve(data);
			    } else {
                    console.log("error", error);
			    	reject(error);
			    }
			});
        });
    },

}