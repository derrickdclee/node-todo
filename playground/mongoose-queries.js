const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '693fbced55709f585758d587';
if (!ObjectID.isValid(id)) {
  console.log('ID not valid');
}

// Todo.find({
//   _id: id // mongoose doesn't need ObjectID
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id // mongoose doesn't need ObjectID
// }).then((todo) => {
//   console.log('Todo', todo);
// });
//
// Todo.findById(id).then((todo) => {
//   // for situations where the ID is not found
//   if (!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Todo by ID', todo);
// }).catch((e) => {
//   console.log(e);
// });

User.findById('593fabb01fd103ac53cb0eab').then((user) => {
  if (!user) {
    return console.log('User not found');
  }
  console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
  console.log(e);
});
