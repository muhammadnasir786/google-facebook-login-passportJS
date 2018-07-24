const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const mongoose = require('mongoose');
const passportSetup = require('./config/passport-setup');


const app = express();

app.set('view engin', 'ejs');

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['thenetninjaisawesomeiguess']
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://admin123:admin123@ds249079.mlab.com:49079/oauth', () => {
    console.log('Mongoose Connect')
})
app.get('/', (req, res) => {
    res.send({ msg: 'OK' })
})
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}));
app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send({
        GoogleLogin: "Google Login Success"
    })
})
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/redirect',
    passport.authenticate('facebook'),
     (req, res)=> {
        // Successful authentication, redirect home.
    
        res.redirect('/profile');
    });

app.listen(3000, () => {
    console.log("App listen at 3000")
})