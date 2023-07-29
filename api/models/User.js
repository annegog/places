const mongoose = require("mongoose");
const {Schema} = mongoose;

const UserSchema = new Schema({
    first_name: String,
    last_name: String,
    username: {type:String, unique:true},
    selectedProperties: String,
    phone: Number,
    email: {type:String, unique:true},
    password: String,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;