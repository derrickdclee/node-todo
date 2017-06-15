var {User} = require('./../models/user');

// defining middleware
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    // additional custom attributes on the req object
    req.user = user;
    req.token = token;
    next(); // VERY important
  }).catch((e) => {
    res.sendStatus(401); // 401 means authentication failed
  });
};

module.exports = {authenticate};
