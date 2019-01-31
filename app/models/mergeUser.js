/**
 * This is the merge user model.
 * Creating schema for mergeUser
 *
 * @class mergeUserModel
 */
var schema = new Schema({
    type: { type: String, enum: ['ciam', 'tier3', 'powercheck']},
    sourceId: { type: String },
    childs: [
        {
            sourceId: { type: String },
            type: { type: String, enum: ['ciam', 'tier3', 'powercheck']}
        }
    ],
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});
/*
 * create model from schema
 */
var collectionName = 'mergeUser';
var model = mongoose.model('mergeUser', schema, collectionName);


/*
 * export users model
 */
module.exports = model;