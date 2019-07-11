import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Link, withRouter } from 'react-router-dom';

class Login extends Component {
  state = {
    email: '',
    password: '',
    error: null,
    processing: false,
  };

  handleSubmit = evt => {
    evt.preventDefault();
    const { history } = this.props;
    const { email, password } = this.state;

    this.setState({
      processing: true,
    });

    Meteor.loginWithPassword(email, password, error => {
      this.setState({
        error,
        processing: false,
      });
      if (!error) {
        history.push('/');
      }
    });
  };

  render() {
    const { email, password, processing, error } = this.state;
    return (
      <div className="login-page" style={{backgroundSize: 'cover', backgroundImage: 'url(images/bckg.jpg)'}}>
        <div className="login-box">
          <div className="login-logo">
            <b>i</b>devops
          </div>
          <div className="login-box-body">
            <p className="login-box-msg">Login to start your session.</p>
            {error && <p>{error.message}</p>}
            <form onSubmit={this.handleSubmit}>
              <div className="form-group has-feedback">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={evt => this.setState({ email: evt.target.value })}
                  value={email}
                />
              </div>
              <div className="form-group has-feedback">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={evt =>
                    this.setState({ password: evt.target.value })
                  }
                  value={password}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block btn-flat"
                disabled={processing || !email || !password}
              >
                Login
              </button>
              <br />
              <p className="text-center">
                Don&apos;t have an account? <Link to="/register">Register</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(Login);
