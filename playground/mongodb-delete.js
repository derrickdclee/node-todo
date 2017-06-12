const {MongoClient, ObjectID} = require('mongodb');

// first connect to the database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // // deleteMany
  // //// deletes all documents that match the criteria
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });
  //
  // // deleteOne
  // //// deletes only the first document that matches the criteria
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((results) => {
  //   console.log(results);
  // })

  // findOneAndDelete
  //// deletes the document and returns it
  db.collection('Todos').findOneAndDelete({text: 'walk the dog'}).then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
  });
  // db.close();
});
