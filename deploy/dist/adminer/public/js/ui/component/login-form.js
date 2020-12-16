import React from 'react';
import HttpClient from 'axios';

import AdminerConfig from '../../config/adminer.config';
import { UIEvent } from '../../service/ui-event';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      login_data: {
        username: '',
        password: ''
      }
    }
  }

  formValue(event) {
    this.state.login_data[event.target.name] = event.target.value;
    this.setState(this.state);
  }

  submitForm(e) {
    e.preventDefault();

    var self = this;
    this.setState(function () {
      return {
        loading: true
      }
    });

    // Dev
    HttpClient({
      method: "POST",
      responseType: "json",
      url: AdminerConfig.login_url,
      data: this.state.login_data // prod
    }).then(function (response) {

      // default message
      var eventMessage = { success: false, auth_token: '' };
      if (response.status === 200) {
        eventMessage.success = true;
        eventMessage.auth_token = response.data.auth_token;
      }
      // hide loading icon
      self.setState(function () {
        return { loading: false }
      });
      UIEvent.dispatch('login-success', eventMessage);

    }).catch(function (err) {
      // hide loading icon
      self.setState(function () {
        return { loading: false }
      });
      alert("Error see log console");
      console.log(err);
    });



  }


  render() {
    var buttonClass = "btn btn-primary btn-block";
    buttonClass += this.state.loading ? " submited-form" : "";

    return (
      <form className="login-form">
        {/* <div className="form-group">
          <label htmlFor="login-username">User</label>
          <input type="text" name="username"
            className="form-control"
            id="login-username" placeholder="User Name"
            value={this.state.login_data.username}
            onChange={this.formValue.bind(this)} />
        </div> */}
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input type="password" name="password"
            className="form-control"
            id="login-password" placeholder="Password"
            value={this.state.login_data.password}
            onChange={this.formValue.bind(this)} />
        </div>
        <button type="submit"
          className={buttonClass}
          onClick={this.submitForm.bind(this)}>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span className="button-text">Login</span>
        </button>
      </form>
    );
  }
}

