/*
 *  providing the helper functions
 */
var path = require('path');
var multer = require('multer');
const csv = require('csv-parser');
module.exports = {
    /*
     * Helper function to format all error and success response to maintain common format
     * return json output
     */

    formatResponse: function (response, res, error) {
        var httpstatus = 200;
        if (typeof response.httpstatus != 'undefined' && response.httpstatus != '') {
            var httpstatus = response.httpstatus;
        }
        if (httpstatus != 200 && process.env.WINSON_ERROR_LOG == true) {
            winston.log('error', response);
        }
        var output = {};
        if (response !== '') {
            var successStatus = true;
            output['success'] = successStatus;
            if (typeof response.msg != 'undefined' && response.msg != '') {
                var responseMessage = response.msg;
                output['msg'] = responseMessage;
            }
            if (typeof response.data != 'undefined' && response.data != '') {
                var responseData = response.data;
                output['result'] = responseData;
            }
        } else {
            var successStatus = false;
            if (typeof error.httpstatus != 'undefined' && error.httpstatus != '') {
                var httpstatus = error.httpstatus;
                delete error.httpstatus;
            } else {
                var httpstatus = helper.getHttpStatusFromMongooseError(error.code);
            }
            output = {
                success: successStatus,
                error: error.msg,
            }
        }
        res.status(httpstatus).json(output)
    },
    /*
     * Helper function to validate all required parameters.
     * return ===> error = httpstatus 422, success = true.
     */

    validateRequiredParams: function (req, res, requiredParams) {
        return new Promise(function (resolve, reject) {
            var errorCount = 0;
            var missingParams = [];
            var errorMsg = [];
            requiredParams.forEach(function (obj) {
                if (typeof req.body[obj] == 'undefined' || req.body[obj] == '') {
                    errorCount++;
                    missingParams.push(obj);
                    errorMsg.push(obj + ' is required.');
                }
            });
            if (errorCount > 0) {
                var error = {
                    success: false,
                    httpstatus: 422,
                    message: 'Missing required parameters',
                    data: {
                        missingParams: missingParams
                    }
                };
                helper.formatResponse(error, res);
            } else {
                resolve({
                    success: true,
                    data: []
                });
            }

        })
    },
    getHttpStatusFromMongooseError: function (errorCode) {
        var codeLibrary = {};
        var code = '';
        codeLibrary = {
            '11000': 409
        };
        if ((typeof codeLibrary[errorCode] != 'undefined') && codeLibrary[errorCode] != '') {
            code = codeLibrary[errorCode];
        } else {
            code = 400; // default
        }
        return code;
    },
    /*
     * Helper function to parse unique field name from moongose error syntex.
     * return ===> error = httpstatus 422, success = true.
     */

    parseUniqueFieldError: function (errorCode) {
        var field = errorCode.message.split('index: ')[1];
        // now we have `keyname_1 dup key`
        field = field.split(' dup key')[0];
        field = field.substring(0, field.lastIndexOf('_')); // returns keyname
        return field;
    },
    /**
     * @method generateRandomString
     * @description To generate randem string
     * @param {type} len
     * @returns random string
     */
    generateRandomString: function (len) {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var token = '';
        for (var i = len; i > 0; --i) {
            token += chars[Math.round(Math.random() * (chars.length - 1))];
        }
        return token;
    },
    /**
     * @method sendEmail
     * @description send email to specified EmailId
     * @param {type} errorsIn
     * @returns {}
     */
    sendEmail: function (subject, to, content, fromTitle, replyTo) {
        mailHelper.sendEmail(to, content, subject, cc = [], bcc = [], attachments = [])
                .then(function (response) {
                    return response;
                    console.log(response, "response")
                }, function (error) {
                    console.log(error, "error")
                    return error;
                });
    },

    /**
    * Action for reading csv file
    *
    * @method readCsvFile
    * @param {string} path - path of the file
    * @return {promise} res - If query is sucess then it resolves retrieved data otherwise rejects some error.
    */

    readCsvFile: function(path) {
        return new Promise(function(resolve, reject) {
            var tempCsvData = [];
            fs.createReadStream(path).pipe(csv({ separator: '|' })).on('data', function(data) {
                tempCsvData.push(data)
            }).on('error', function(error) {
                reject(error);
            }).on('end', function() {
                resolve(tempCsvData);
            })
        });
    },

    /*
     * @description uploading the images into the server
     *              Note : present upload path uploads
     * @param {type} req
     * @param {type} res
     * @returns {undefined}
     */
    
    decrypt: (encString) => {
        return new Promise((resolve, reject) => {
            // console.log("encString", encString);
            var os = require('os');
            if (os.platform() == 'win32') {
                var chilkat = require('chilkat_node10_win32'); 
            } else if (os.platform() == 'linux') {
                if (os.arch() == 'arm') {
                    var chilkat = require('chilkat_node10_arm');
                } else if (os.arch() == 'x86') {
                    var chilkat = require('chilkat_node10_linux32');
                } else {
                    var chilkat = require('chilkat_node8_linux64');
                }
            } else if (os.platform() == 'darwin') {
                var chilkat = require('chilkat_node10_macosx');
            }

            var crypt = new chilkat.Crypt2();

            var success = crypt.UnlockComponent("Anything for 30-day trial");
            if (success !== true) {
                console.log("error", crypt.LastErrorText);
                return;
            }


            //  AES is also known as Rijndael.
            crypt.CryptAlgorithm = "aes";

            //  CipherMode may be "ecb", "cbc", "ofb", "cfb", "gcm", etc.
            //  Note: Check the online reference documentation to see the Chilkat versions
            //  when certain cipher modes were introduced.
            crypt.CipherMode = "ecb";

            //  KeyLength may be 128, 192, 256
            crypt.KeyLength = 256;

            //  The padding scheme determines the contents of the bytes
            //  that are added to pad the result to a multiple of the
            //  encryption algorithm's block size.  AES has a block
            //  size of 16 bytes, so encrypted output is always
            //  a multiple of 16.
            // crypt.PaddingScheme = 0;

            //  EncodingMode specifies the encoding of the output for
            //  encryption, and the input for decryption.
            //  It may be "hex", "url", "base64", or "quoted-printable".
            crypt.EncodingMode = "base64";

            //  An initialization vector is required if using CBC mode.
            //  ECB mode does not use an IV.
            //  The length of the IV is equal to the algorithm's block size.
            //  It is NOT equal to the length of the key.
            // var ivHex = "000102030405060708090A0B0C0D0E0F";
            // crypt.SetEncodedIV(ivHex,"hex");

            //  The secret key must equal the size of the key.  For
            //  256-bit encryption, the binary secret key is 32 bytes.
            //  For 128-bit encryption, the binary secret key is 16 bytes.
            var keyHex = "N0rth9@t3T13r%";
            crypt.SetEncodedKey(keyHex,"ascii");

            //  Encrypt a string...
            //  The input string is 44 ANSI characters (i.e. 44 bytes), so
            //  the output should be 48 bytes (a multiple of 16).
            //  Because the output is a hex string, it should
            //  be 96 characters long (2 chars per byte).
            // var encStr = crypt.EncryptStringENC("The quick brown fox jumps over the lazy dog.");
            // console.log(encStr);

            //  Now decrypt:
            var decStr = crypt.DecryptStringENC(encString);
            // console.log("decStr", decStr);
            resolve(decStr);
        });
    },
    
    handleError: function (res) {
        return function (error) {
            return res.json({
                success: false,
                error: error
            });
        }
    }
}