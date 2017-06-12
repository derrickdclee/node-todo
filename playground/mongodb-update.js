const {MongoClient, ObjectID} = require('mongodb');

// first connect to the database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID("593e60e179aea8c8fb810ad8")
  // }, {
  //   //// update operator /////
  //   $set: {
  //     completed: true
  //   }
  //   //////////////////////////
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID("593a7db35f01b343077d0f61")
  }, {
    $set: {
      name: 'Derrick'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });
});
