var mongoose = require('mongoose');

// tell mongoose that we want to use the standard Promise
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};
