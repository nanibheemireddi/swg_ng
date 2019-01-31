/**
 * This is the powercheck user model.
 * Creating schema for powercheck
 *
 * @class powercheckModel
 */
var schema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    middleName: { type: String },
    secondLastName: { type: String },
    customerRefNo: { type: String },
    email: [{ type: String}],
    dob: { type: Date },
    address:[{
        type: {type: String},
        street:{type: String},
        country:{type: String},
        state:{type: String},
        city:{type: String},
        zipCode:{type: String},
    }],
    phone: [{
        type: {type: String},
        mobileNo: {type: String},
    }],
    identification: [{
        type: {type: String},
        identificationNo: {type: String},
        expiryDate: {type: Date}
    }],
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});
/*
 * create model from schema
 */
var collectionName = 'powercheck';
var model = mongoose.model('powercheck', schema, collectionName);


/*
 * export users model
 */
module.exports = model;