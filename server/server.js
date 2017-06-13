var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/Todo');
var {User} = require('./models/User');

var app = express();

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

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    // setting it as an object makes it more flexible
    res.send({todos: todos});
  }, (e) => {
    res.status(400).send(e);
  })
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
