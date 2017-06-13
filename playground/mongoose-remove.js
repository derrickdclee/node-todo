const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// remove({}) removes everything
// e.g. Todo.remove({}).then((result) => console.log(result));

// removes and returns the document that is removed
Todo.findOneAndRemove({
  text: 'yaaay'
}).then((doc) => {
  console.log(JSON.stringify(doc, undefined, 2));
});
// Todo.findByIdAndRemove() works similarly
