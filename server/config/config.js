
var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  var config = require('./config.json'); // automatically turns into a JS object
  // bracket notation is required for using variables in accessing properties
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
