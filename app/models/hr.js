var hrDataSchema = new Schema({
    First_Name: { type: String, required: true },
    Last_Name: { type: String, required: true },
    Employee_Number: { type: Number},
    HireDate: { type: Date },
    Birthdate:{type:String},
    Status: { type: String },
    Company:  { type: String },
    Middle_Name: { type: String },
    Job_Title: { type: String },
    Address:[{
        type: {type: String},
        street:{type: String},
        country:{type: String},
        state:{type: String},
        city:{type: String},
        district:{type:String},
        Address_2:{type:String},
        zipCode:{type: String},
    }],
    Phone_Number:[{type:{type: String},
        mobileNo: {type: String}}],
    Extension:{type:String},
    Preferred_Name:{type:String},
    Alternate_Title:{type:String},
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
var collectionName = 'hrData';
var hrData = mongoose.model('hrData', hrDataSchema, collectionName);


/*
 * export users model
 */
module.exports = hrData;