var mongoose = require('mongoose');
var bcrypt = require("bcrypt-nodejs");
const jwt = require('jsonwebtoken');

var SALT_FACTOR = 10;

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    isAdmin: {
        type : Boolean,
        default : false
    },

    private: {
        type : Boolean,
        default : false
    }
});

var noop = function () { };
userSchema.pre("save", function (done) {
    var user = this;
    if (!user.isModified("password")) {
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) {
            return done(err);
        }
        bcrypt.hash(user.password, salt, noop, function (err, hashedPassword) {
            if (err) {
                return done(err);
            }
            user.password = hashedPassword;
            done();
        });
    });
});

userSchema.methods.checkPassword = function (guess, done) {
    bcrypt.compare(guess, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};

userSchema.methods.generateJwt = function () {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        exp: parseInt(expiry.getTime() / 1000)
    }, 'process.env.JWT_SECRET');
};

var User = mongoose.model("User", userSchema);

module.exports = User;