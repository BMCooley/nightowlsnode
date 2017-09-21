if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  console.log('starting in dev mode');
}
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const controller = require('./server/controller.js');
const db = require('./db/models/db.js');
const Session = require('./db/models/session.js');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const extendDefaultFields = (defaults, session) => ({ // config for holding session in db
  userId: session.userId,
});
const port = process.env.PORT || 8080;
const app = express();
module.exports = app;

require('./server/passport')(passport);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.secretsecret,
  store: new SequelizeStore({
    db,
    extendDefaultFields,
    table: 'Session',
  }),
  saveUninitialized: false,
  resave: true,
  proxy: undefined,
  secure: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(controller.publicRoutes, express.static(path.join(__dirname, '/public')));
require('./server/routes.js')(app, passport);

app.listen(port);

console.log(`Neighborly running on: ${port}`);
