const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : [true, 'User reference is required'],
        index : true
    },
    status : {
        type : String,
        enum : ['active', 'inactive', 'suspended'],
        message : 'Status must be either active, inactive, or suspended',
        default : 'active',
    },
    currancy : {
        type : String,
        required : [true, 'Currency is required'],
        trim : true,
        uppercase : true,
        match: [/^[A-Z]{3}$/, 'Please provide a valid 3-letter currency code'],
        default : 'INR'
    }
}, {
    timestamps : true
});
accountSchema.index({ user: 1, status: 1 });
const Account = mongoose.model('Account', accountSchema);
module.exports = Account;