// all imports
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser') // populate req.cookies

const PORT = process.env.PORT || 5000;
// import dotenv -> dev
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// we want to connect to mongodb
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Connected to MongoDB successfully!')
});

require('./passport-config');

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('hello world')
}) // 'http://localhost:5000/' => 'hello world'

// register, login, authenticate, logout
app.use('/user', require('./routes/user'))

app.listen(PORT, () => console.log('listening on http://localhost:5000'));
