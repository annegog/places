const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    first_name: String,
    last_name: String,
    username: {type:String, unique:true},
    phone: Number,
    email: String,
    password: String,
    host: Boolean,
    tenant: Boolean,
    isAdmin: {type:Boolean, default:false}
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;