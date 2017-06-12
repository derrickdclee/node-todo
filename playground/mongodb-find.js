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
  // db.collection('Todos').find({
  //   _id: new ObjectID('593a7ca283846342f92d1a2b') // need to use ObjectID
  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (error) => {
  //   console.log('Unable to fetch todos ', error);
  // });

  db.collection('Todos').find({
    completed: false
  }).count().then((count) => {
    console.log(`Todos count: ${count}`);
  }, (error) => {
    console.log('Unable to fetch todos ', error);
  });

  // db.close();
});
