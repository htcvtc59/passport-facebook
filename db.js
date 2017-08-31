const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://tron:GTj5xX7Z@ds115124.mlab.com:15124/passport-facebook");

const userSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String
});

const user = mongoose.model('user', userSchema, 'user');
module.exports = user;
