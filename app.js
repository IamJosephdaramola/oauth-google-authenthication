const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session')
const passport = require('passport')
// const path = require('path');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');

const passportSetup = require('./config/passport-setup');

const keys = require('./config/keys')

const app = express()

// Set up view engine
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}))

// Initialize passport
app.use(passport.initialize())
app.use(passport.session())


//  connect to mongodb
mongoose.connect(keys.mongodb.dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to DB'))
    .catch(err => console.log(err))


//  set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
    res.render('home', {user: req.user  });
});


const port = 8888
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});