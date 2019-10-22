import React from 'react';
import HttpClient from 'request';

import AdminerConfig from '../../adminer.config';
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
    HttpClient.post({
      json: true,
      url: AdminerConfig.login_url,
      form: this.state.login_data // prod
    }, function (err, httpResponse, body) {
      
      self.setState(function () {
        return { loading: false }
      });

      if (err) {
        return console.log(err);
      }

      // default message
      var eventMessage = { success : false, auth_token : '' };

      if(httpResponse.statusCode === 200){
        eventMessage.success = true;
        eventMessage.auth_token = body.auth_token;
      }

      UIEvent.dispatch('login-success', eventMessage);

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

