const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bu: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    employee_id: {
        type: String,
        required: true
    },
    is_admin: {
        type: Boolean,
        default: false
    },
       
    tokens: {
            type: String
        }
    
})
userSchema.methods.generatetoken = async function () {

    try {
        let tokeni = jwt.sign({ _id: this._id }, 'persistent');
        this.tokens = tokeni;
        await this.save();
        console.log(tokeni)
        return tokeni
    } catch (err) {
        console.log(err)
    }

}

userSchema.pre('save',async function (next){
    if (this.isModified('password')){
        this.password=await bcrypt.hash(this.password,12);
    }
    next();
});

const User = mongoose.model('users', userSchema);
module.exports = User;