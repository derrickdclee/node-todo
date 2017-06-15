const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

var hashedPassword = '$2a$10$Ehq2SuI7L5SKIvJjvF7Zl.Nu9oZmF5IMQc4pDNtTSMK6Yzk3XrYXW';
bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});

// var msg = 'I am user number 3';
// var hash = SHA256(msg).toString();
// console.log(`Message: ${msg}`);
// console.log(`Hash: ${hash}`);
//
// // sent from the server to the client
// var data = {
//   id: 4
// };
//
// var token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Can\'t be trusted!');
// }

// var data = {
//   id: 10
// };
// // sent to the user when they sign up and log in
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
// // if the token has been modified, then this will throw an error
// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);
// console.log(typeof decoded);
