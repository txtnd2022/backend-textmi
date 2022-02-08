const passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require("dotenv")

dotenv.config({ path: './config.env' })

//commented some parts related to db

passport.serializeUser(function (user, done) {
    done(err, user);
});

passport.deserializeUser(function (id, done) {
    // User.findById(id, function (err, user) {
    done(err, user);
    // });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        //use the profile info mainly id to check if user is registered in db or not
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(null, profile);
        // });
    }
));