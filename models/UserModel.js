const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    college: String,
    education: String,
    position: String,
    experience: String

    // other user properties
});

module.exports = mongoose.model('UserModel', userSchema);
