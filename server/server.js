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

// private route
// using authenticate as middleware
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// http POST method
app.post('/todos', (req, res) => {
  var myTodo = new Todo({
    text: req.body.text
  });

  myTodo.save().then((doc) => {
    res.send(doc); // show the user the saved document
  }, (e) => {
    res.sendStatus(400).send(e);
  });
});

// http GET method
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    // setting it as an object makes it more flexible
    res.send({todos: todos});
  }, (e) => {
    res.status(400).send(e);
  })
});

// http GET /todos/:id
app.get('/todos/:id', (req, res) => {
  var searchId = req.params.id;
  if (!ObjectID.isValid(searchId)) {
    return res.status(404).send();
  }
  Todo.findById(searchId).then((todo) => {
    if (!todo) {
      res.sendStatus(404);
    }
    console.log(JSON.stringify(todo, undefined, 3));
    res.send({
      todo: todo
    });
  }).catch((e) => {
    res.status(404).send();
  });
});

// http DELETE method
app.delete('/todos/:id', (req, res) => {
  var searchId = req.params.id;

  if (!ObjectID.isValid(searchId)) {
    return res.sendStatus(404);
  }

  Todo.findByIdAndRemove(searchId).then((doc) => {
    if (!doc) {
      return res.sendStatus(404);
    }
    res.send({doc}).sendStatus(200);
  }).catch((e) => {
    res.sendStatus(400);
  });
});

// http PATCH method
app.patch('/todos/:id', (req, res) => {
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
  Todo.findByIdAndUpdate(searchId, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.sendStatus(404);
    }

    res.send({todo});
  }).catch((e) => {
    res.sendStatus(400);
  })
});

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

////////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
