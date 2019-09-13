const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys')
const User = require('../Models/User-model');

// Stage 2
passport.serializeUser((user, done) => {
    done(null, user.id)
});

// Stage 3
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    })
});

// stage 1
passport.use(
    new GoogleStrategy({
        // options for google strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists
        // console.log(profile)
        User.findOne({
            googleId: profile.id
        }).then((existingUser) => {
            if (existingUser) {
                // already have user
                console.log(`user is ${existingUser}`);
                // done means go to the next stage
                done(null, existingUser)
            } else {
                // if not, create a new user
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    thumbnail: profile._json.picture
                }).save().then((newUser) => {
                    console.log(`new user created ${newUser}`)

                    done(null, newUser)
                })
            }
        })
    })
)