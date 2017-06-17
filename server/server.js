require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT;

// using middleware
app.use(bodyParser.json());


// POST /todos
app.post('/todos', authenticate, (req, res) => {
  var myTodo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  myTodo.save().then((doc) => {
    res.send(doc); // show the user the saved document
  }, (e) => {
    res.sendStatus(400).send(e);
  });
});

// GET /todos
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    // setting it as an object makes it mor e flexible
    res.send({todos: todos});
  }, (e) => {
    res.status(400).send(e);
  })
});

// GET /todos/:id
app.get('/todos/:id', authenticate, (req, res) => {
  var searchId = req.params.id;
  if (!ObjectID.isValid(searchId)) {
    return res.status(404).send();
  }

  // if we just search by searchId, then anyone with the Id can
  // access the todo and modify it

  // so we findOne instead
  Todo.findOne({
    _id: searchId,
    _creator: req.user._id // VERY important
  }).then((todo) => {
    if (!todo) {
      res.sendStatus(404);
    }
    res.send({
      todo: todo
    });
  }).catch((e) => {
    res.status(404).send();
  });
});

// DELETE /toods/:id
app.delete('/todos/:id', authenticate, (req, res) => {
  var searchId = req.params.id;

  if (!ObjectID.isValid(searchId)) {
    return res.sendStatus(404);
  }

  Todo.findOneAndRemove({
    _id: searchId,
    _creator: req.user._id
  }).then((doc) => {
    if (!doc) {
      return res.sendStatus(404);
    }
    res.send({doc}).sendStatus(200);
  }).catch((e) => {
    res.sendStatus(400);
  });
});

// PATCH /todos/:id
app.patch('/todos/:id', authenticate, (req, res) => {
  var searchId = req.params.id;
  // creates an object composed of the picked object properties
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(searchId)) {
    return res.status(404).send();
  }

  // completed is boolean AND it is true
  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  // body object now contains the properties that need to be updated
  Todo.findOneAndUpdate({
    _id: searchId,
    _creator: req.user.id
  }, {
    $set: body
  }, {
    new: true
  }).then((todo) => {
    if (!todo) {
      return res.sendStatus(404);
    }

    res.send({todo});
  }).catch((e) => {
    res.sendStatus(400);
  })
});

// GET /users/me
// private route
// using authenticate as middleware
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users
app.post('/users', (req, res) => {
  var userObj = _.pick(req.body, ['email', 'password']);

  var newUser = new User(userObj);
  newUser.save()
    .then(() => {
    return newUser.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(newUser);
  }).catch((e) => {
    res.sendStatus(400).send(e);
  });
});

// POST /users/login
app.post('/users/login', (req, res) => {
  var userObj = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(userObj.email, userObj.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.sendStatus(400);
  });
});

// DELETE /users/me/token
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.sendStatus(200);
  }, () => {
    res.sendStatus(400);
  });
});
////////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
