const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        unique: true,
    },
    phoneNo: {
        type: Number,
        required: true,
    },
    email : {
        type: String, //add validator
        min: 5,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    connections : {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
},{
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema)