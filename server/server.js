var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(bodyParser.json());

// http POST method
app.post('/todos', (req, res) => {
  var myTodo = new Todo({
    text: req.body.text
  });

  myTodo.save().then((doc) => {
    res.send(doc); // show the user the saved document
  }, (e) => {
    res.status(400).send(e);
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


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
