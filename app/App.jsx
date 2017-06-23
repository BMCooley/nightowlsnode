/* eslint-env browser */
import {
  Router,
  Route,
  Switch,
  Link,
  Redirect,
} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();
const React = require('react');
const ReactDOM = require('react-dom');
const Search = require('./Search/Search.jsx');
const Profile = require('./Profile/Profile.jsx');
const Login = require('./Login/Login.jsx');
const PrivateRoute = require('./PrivateRoute.jsx');
const Auth = require('./lib/helpers').Auth;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loginPage: false, profile: null, loggedIn: false };
    this.methods = {
      updateUser: profile => this.setState({ profile }),
      goTo: path => history.push(path),
      openLoginPage: () => this.setState({ loginPage: true }),
      loggedIn: () => this.setState({ loginPage: false, loggedIn: true }),
      logout: (e) => {
        e.preventDefault();
        fetch('/logout').then(Auth.logout())
          .then(this.methods.goTo('/'))
          .then(this.setState({ loggedIn: false }))
          .then(console.log('loggedOut'));
      },
      LoginRender: (moarProps) => {
        this.methods.openLoginPage();
        return (<Redirect to={{
          pathname: '/',
          state: { from: props.location },
        }}
        />);
      },
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.location) {
      this.setState({ loginPage: true });
    }
    return true;
  }
  render() {
    // dynamically change button based on loggedIn status
    const logButton = this.state.loggedIn
      ? (<button
        onClick={this.methods.logout}
        className="btn"
      >Logout</button>)
      : (<button
        onClick={this.methods.openLoginPage}
        className="btn"
      >Login</button>);
    // conditionally render loginBox
    const LoginPage = this.state.loginPage ? <Login appMethods={this.methods} /> : null;
    const profileLink = this.state.profile ? `/profile/${this.state.profile.id}` : '/profile';

    return (
      <div>
        <Router history={history}>
          <div>
            <div>
              <div className="navbar-fixed-top navbar-color">
                <nav className="navbar-inner pull-right">
                  <Link to="/" className="btn">
                    HOME
                  </Link>
                  <Link to="/" className="btn">
                    RESULTS
                  </Link>
                  <Link to={profileLink} className="btn">
                    PROFILE
                  </Link>
                  {logButton}
                </nav>
              </div>
            </div>
            {LoginPage}
            <Switch style={{ marginTop: '10px' }}>
              <PrivateRoute path="/profile/:id" component={Profile} />
              <PrivateRoute path="/profile" component={Profile} />
              <Route path="/login" render={this.methods.LoginRender} />
              <Route path="/" component={Search} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('App'),
);

exports.history = history;
