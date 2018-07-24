const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../modals/user-modal');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});
passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: '125586898654-2u6jbkp4r5c8750b3bbk6g991dlh17ho.apps.googleusercontent.com',
        clientSecret: '7NrDKbHa3TKLYl4yZA_9DFO8',
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        console.log(accessToken, refreshToken, profile, )

        // check if user already exists in our own db
        User.findOne({ googleId: profile.id }).then((currentUser) => {
            if (currentUser) {
                // already have this user
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                // if not, create user in our db
                new User({
                    facebookId: 'null',
                    googleId: profile.id,
                    username: profile.displayName,
                    thumbnail: profile._json.image.url
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    done(null, newUser);
                });
            }
        });
    })
);

passport.use(new FacebookStrategy({
    clientID: '268599507057193',
    clientSecret: '4b127dc4644d0868f8bc0c6807f85dcd',
    callbackURL: "/auth/facebook/redirect"
  },
  (accessToken, refreshToken, profile, done)=> {
    console.log(profile)
    User.findOne({ facebookId: profile.id }, function (err, currentUser) {
        console.log(err)
        if (currentUser) {
            // already have this user
            console.log('user is: ', currentUser);
            done(null, currentUser);
        } else {
            // if not, create user in our db
            new User({
                googleId : '',
                facebookId: profile.id,
                username: profile.displayName,
                thumbnail: 'sadasdas'
            }).save().then((newUser) => {
                console.log('created new user: ', newUser);
                done(null, newUser);
            });
        }
    //   return cb(null, user);
    }); 
  }
));