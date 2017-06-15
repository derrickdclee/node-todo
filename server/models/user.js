const mongoose = require('mongoose');
const validator = require('validator'); // used for validating things
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true, // get rid of leading and trailing white spaces
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  // tokens is an array of subdocuments
  tokens: [{
    access: {
      type: String,
      required: true
    },

    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function() {
  console.log(this);
  var userObject = this.toObject(); // calling toObject() filters out unnecessary data
  // console.log(userObject);

  return _.pick(userObject, ['_id', 'email']);
};

// this is how you define an instance method
UserSchema.methods.generateAuthToken = function() {
  // var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: this._id.toHexString(), access}, 'abc123').toString();

  this.tokens.push({access, token});
  // returning a Promise that eventually gets resolved with the value of token
  return this.save().then(() => {
    return token;
  });
};

// this is hwo you define a model method
UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch(e) {
    return Promise.reject(); // just return a promise that rejects!
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

// middleware to be called before User is saved to db
UserSchema.pre('save', function(next) {
  var user = this;

  if (user.isModified('password')) {
    // generate a salt, hash the password with the salt, and then save the
    // hashed password to db
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next(); // note that this function call should be here!
      });
    });
  } else {
    next();
  }
});


// creates User model
var User = mongoose.model('User', UserSchema);

module.exports = {User};
