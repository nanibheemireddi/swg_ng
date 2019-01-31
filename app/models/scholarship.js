var scholarshipSchema = new Schema({
    First_name: { type: String },
    Last_name: { type: String },
    status:{type:String},
    roles:{type:String},
    modificationDate:{type:Date},
    email:[{ type: String, lowercase: true }],
    isDump: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    
}, {
    timestamps: true,
    versionKey: false
});
//    var date = String(new Date(parseInt(elodata.x)));

/*
 * create model from schema
 */
var collectionName = 'scholarship';
var scholarship = mongoose.model('scholarship', scholarshipSchema, collectionName);


/*
 * export users model
 */
module.exports = scholarship;