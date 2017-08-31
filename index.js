const express = require('express');
const passport = require('passport');
const passportfb = require('passport-facebook').Strategy;
const session = require('express-session');
const db = require('./db');

const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(session({
    secret: "sssecret"
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('Welcome to VN');
});

app.get('/login', (req, res) => res.render('login'));

app.get('/auth/fb', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/fb/cb', passport.authenticate('facebook', {
    failureRedirect: '/', successRedirect: '/'
}));

app.listen(3000, () => {
    console.log("Server up http://localhost:3000");
});

passport.use(new passportfb(
    {
        clientID: "1361299343988217",
        clientSecret: "6f2a34f3e82da82138ee4860f1da3584",
        callbackURL: "http://localhost:3000/auth/fb/cb",
        profileFields: ['email', 'gender', 'locale', 'displayName']
    },
    (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        db.findOne({ id: profile._json.id }, (err, user) => {
            if (err) return done(err);
            if (user) return done(null, user);
            const newUser = new db({
                id: profile._json.id,
                name: profile._json.name,
                email: profile._json.email
            });
            newUser.save((err) => {
                return done(null, newUser);
            });

        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.findOne({ id: id }, (error, user) => {
        done(null, user);
    })
});