const express = require('express');
const User = require('../model/User');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { createMessage, signToken } = require('../utils');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json(createMessage('username or password missing', true));
    }

    // check if username already exists
    const userInExisting = await User.findOne({ username })
        .catch((err) => res.status(500).json(createMessage('something went wrong', true)));

    if (userInExisting) {
        return res.status(400).json({ msgBody: "username already taken", msgErr: true });
    }

    const hashedPassword = await bcrypt.hash(password, 12)
        .catch((err) => res.status(500).json(createMessage('something went wrong', true)));

    const user = new User({
        username: username,
        password: hashedPassword
    });

    await user.save()
        .catch((err) => res.status(500).json(createMessage("something went wrong", true)));

    return res.json(createMessage('user created', false));
});

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    if (req.isAuthenticated()) {
        const { _id, username } = req.user;
        console.log(_id);
        const token = signToken(_id);
        res.cookie('qid', token, { httpOnly: true, sameSite: true });
        console.log(token);
        res.status(200).json({
            isAuthenticated: true,
            user: {
                username: username
            }
        });
    }
});

router.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.clearCookie('qid');
    // console.log('clear')
    return res.json({
        user: {
            username: ""
        },
        success: true
    })
});

router.get('/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { username } = req.user;
    res.status(200).json({
        isAuthenticated: true,
        user: {
            username
        }
    });
});


module.exports = router;