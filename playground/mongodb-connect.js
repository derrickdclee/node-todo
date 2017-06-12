const {MongoClient, ObjectID} = require('mongodb');

// first connect to the database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'I have something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo ', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // no need to create the database first
  db.collection('Users').insertOne({
    name: 'Derrick',
    age: 22,
    location: 'Durham'
  }, (err, result) => {
    if (err) {
      console.log('Unable to insert user');
    } else {
      console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    }
  });
  db.close();
});
