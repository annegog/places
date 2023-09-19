const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    first_name: String,
    last_name: String,
    username: {type:String, unique:true},
    phone: Number,
    email: String,
    password: String,
    profilephoto: [],
    host: Boolean,
    tenant: Boolean,
    isApproved: Boolean,
    isAdmin: {type:Boolean, default:false}
    // type: String, default: "false" //-- "true" + "render"
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;