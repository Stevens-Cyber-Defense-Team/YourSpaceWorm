const express = require('express');
const app = express();
const configRoutes = require('./routes');
const expressLayouts = require('express-ejs-layouts')
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

/* 
    what I use for express handlebars
    can delete if u dont need any of these
    - Farhan

    const static = express.static(__dirname + '/static');
    const exphbs = require('express-handlebars');
    app.use('/public', static);
    app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');
    app.set('views', './views');

*/

const session = require('express-session')

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: false
  }
}));

app.use('/profiles', (req, res, next) => {
    // the profiles routes will be protected and will only be accessible after logging in
    if (!req.session.username) {
      return res.redirect('/login');
    } else {
      next();
    }
  });

app.use('/signout', (req, res, next) => {
    //cant sign out if your not logged in
    if (!req.session.user) {
        return res.redirect('/');
    } else {
        next();
    }
});

app.use('/ping', (req, res) => {
    // health check
    return res.send('PONG');
});

configRoutes(app);

app.listen(3000, "0.0.0.0" , async () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});