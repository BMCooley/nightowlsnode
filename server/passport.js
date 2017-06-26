const LocalStrategy = require('passport-local').Strategy;
const User = require('../db/models/users');
const Session = require('../db/models/session');
const bcrypt = require('bcrypt-nodejs');

// expose this function to our app using module.exports
module.exports = (passport) => {
  passport.serializeUser((user, done) => done(null, user.id));

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch(err => done(err, false));
  });


  // LOCAL SIGNUP ==========================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  (req, eMail, password, done) => {
    process.nextTick(() => {
      User.findOne({ where: { email: eMail } })
        .then((user) => {
          if (user) {
            return done(null, false, { message: 'User exsits' });
          }
          User.create({
            phone: req.body.phone,
            city: req.body.city,
            street: req.body.street,
            state: req.body.state,
            zip: req.body.zip,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            fullName: `${req.body.firstName} ${req.body.lastName}`,
            email: eMail,
            password: User.generateHash(password),
          })
            .then((newUser) => {
              console.log('id', newUser.id, 'sessID', req.sessionID);
              done(null, newUser);
            })
            .catch(err => done(err, false));
          return 'NextTick, findOne ran';
        });
    });
  }));
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then((user) => {
        if (!user) {
          console.log('!user');
          return done(null, false);
        }
        if (!bcrypt.compareSync(password, user.password)) {
          console.log('!pass');
          return done(null, false);
        }
        console.log('FOUND USER - login');
        return done(null, user);
      })
      .catch(err => done(err, false));
  }));
};
