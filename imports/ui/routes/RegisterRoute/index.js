import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accounts } from 'meteor/accounts-base';
import { Link, withRouter } from 'react-router-dom';

import userRoles from '../../userRoles';

class Register extends Component {
  state = {
    email: '',
    password: '',
    userRole: '',
    error: null,
    processing: false,
  };

  handleSubmit = evt => {
    evt.preventDefault();
    const { history } = this.props;
    const { email, password, userRole } = this.state;

    this.setState({
      processing: true,
    });

    Accounts.createUser(
      { email, username: email, password, profile: { role: userRole } },
      error => {
        this.setState({
          error,
          processing: false,
        });
        if (!error) {
          history.push('/');
        }
      },
    );
  };

  render() {
    const { email, password, userRole, processing, error } = this.state;
    return (
      <div className="register-page" style={{backgroundSize: 'cover', backgroundImage: 'url(images/bckg.jpg)'}}>
        <div className="register-box">
          <div className="register-logo">
            <b>i</b>devops
          </div>
          <div className="register-box-body">
            <p className="register-box-msg">Register a new user account.</p>
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
              <div className="form-group">
                <select
                  className="form-control"
                  onChange={evt =>
                    this.setState({ userRole: evt.target.value })
                  }
                  value={userRole}
                >
                  <option>Select user role</option>
                  {userRoles.map(userRole => (
                    <option key={userRole.value} value={userRole.value}>
                      {userRole.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block btn-flat"
                disabled={processing || !email || !password || !userRole}
              >
                Register
              </button>
              <br />
              <p className="text-center">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(Register);
