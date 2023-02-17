const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
//const dotenv = require('dotenv').config();

require('./passport-setup');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(cookieSession({
    name: 'auth-demo-session',
    keys: ['key1', 'key2']
}));

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401);
    }
};

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.status(200).send("hellloo!, not logged-in"));

app.get('/auth/failed', (req, res) => res.status(401).send("Failed to login!"));
app.get('/auth/success', isLoggedIn, (req, res) => res.send(`Welcome ${req.user.displayName}!`));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/auth/success');
  });

app.get('/logout', (req, res) => {
    req.session = null,
    req.logout(),
    res.redirect('/')
});

app.listen(process.env.PORT_LOCAL, () => {
    console.log(`Server is up and running locally at: ${process.env.BASE_URL}${process.env.PORT_LOCAL}`);
});