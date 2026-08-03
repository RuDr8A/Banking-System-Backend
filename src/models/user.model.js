const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : [true, "Email already exists"],
        trim : true,
        lowercase : true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    name : {
        type : String,
        required : [true, "Name is required"],
        trim : true,
        minlength : [3, "Name must be at least 3 characters long"],
        maxlength : [50, "Name must be less than 50 characters long"]
    },
    password : {
        type : String,
        required : [true, "Password is required"],
        minlength : [6, "Password must be at least 6 characters long"],
        select : false
    }
},{
    timestamps : true
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next;
})

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;
