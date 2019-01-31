/**
 * This is the user model.
 * Creating schema for user
 *
 * @class userModel
 */
var userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    isSuperAdmin: { type: Boolean, default: false },
    lastActivity: { type: Date },
    code: { type: String },
    last_comapny_id: { type: Schema.Types.ObjectId, ref: 'company' },
    roleId: { type: Schema.Types.ObjectId, ref: 'rolesAndRights' },
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
var collectionName = 'users';
var users = mongoose.model('users', userSchema, collectionName);


/*
 * export users model
 */
module.exports = users;