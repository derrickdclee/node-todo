var mongoose = require('mongoose');

// tell mongoose that we want to use the standard Promise
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};
