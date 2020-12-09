const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const bcrypt = require('bcrypt');
const User = require('./model/User');

const cookieFromExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["qid"];
    }
    return token;
}

// local
passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username }).exec((err, user) => {
        if (err) return done(err);

        if (!user) return done(null, false);

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {          // hashed password
                return done(err);
            }
            if (!isMatch) {
                return done(null, false);
            }
            return done(null, user);
        })
    })
}));


passport.use(new JWTStrategy({
    jwtFromRequest: cookieFromExtractor,
    passReqToCallback: true,
    secretOrKey: "keyboard cat" // maybe wanna use environment variables here
}, (req, payload, done) => {
    // console.log(payload.sub)
    User.findOne({ _id: payload.sub }, (err, user) => {
        if (err) return done(err);

        if (!user) {
            return done(null, false);
        } else {
            req.user = user;
            return done(null, user);
        }
    })
}))