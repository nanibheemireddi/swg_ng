var ProntoSchema = new Schema({
    First_Name: { type: String },
    Last_Name: { type: String },
    preferred_language: { type: String},
    preferred_store:{type:String},
    registered_user:{type:String},
    registered_via:{typeof :String},
    gender: { type: String },
    date_of_birth:{type:String},
    customer_id:  { type: String },
    group_id: { type: String },
    group_name: { type: String },
    Address:[{
        type: {type: String},
        street:{type: String},
        country:{type: String},
        country_id:{type:String},
        state:{type: String},
        state_id:{type:String},
        city:{type: String},
        district:{type:String},
        Address_2:{type:String},
        zipCode:{type: String}
    }],
    Phone_Number:[{type:{type: String},
        mobileNo: {type: String}}],
    customer_since:{type:Date},
    email:[{ type: String, lowercase: true }],
    isDump: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    
}, {
    timestamps: true,
    versionKey: false
});
/*
 * create model from schema
 */
var collectionName = 'pronto';
var pronto = mongoose.model('pronto', ProntoSchema, collectionName);


/*
 * export users model
 */
module.exports = pronto;