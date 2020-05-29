import { Route, Switch, Redirect } from "react-router-dom";
import Register from '../../components/Register/Register';
import Profile from '../../components/Profile/Profile';
import Loggout from '../../components/Loggout/Loggout';
import Forgot from '../../components/Forgot/Forgot';
import Login from '../../components/Login/Login';
import Reset from '../../components/Reset/Reset';
import Home from '../../components/Home/Home';
import Confirm from '../Confirm/Confirm';
import React, { Component } from 'react';
import MyNavBar from '../../MyNavBar';
import axios from 'axios';
import './App.css';

class App extends Component {

  state = {
    error: null,
    token: null,
    message: null,
    isLoading: false,
    isRegistered: false
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate') * 1000;
    if (token && expirationDate > new Date().getTime()) {
      this.setState({token: token});
    };
  };

  cleanMessages = () => {
    this.setState({
      error: null,
      message: null
    });
  };

  closeAlert = () => {
    this.setState({error: null});
  };
  
  loggout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    this.setState({token: null});
  };
  
  checkAuthTimeOut = (expirationTime) => {
    setTimeout(() => {
      this.loggout();
    }, expirationTime);
  };

  onSendRequest = (email) => {
    this.setState({isLoading: true});
    axios.post('/user/forgot', { email: email }).then(response => {
      if (response.status === 201) {        
        this.setState({
          message: response.data.message,
          isLoading: false
        });
      }
    }).catch(error => {      
      this.setState({
        error: error.response.data.message,
        isLoading: false
      });
    });
  };

  onResetPassword = (password, id) => {    
    this.setState({isLoading: true});
    axios.patch(`/user/reset/${id}`, { password: password }).then(response => {
      if (response.status === 201) {
        this.setState({
          message: response.data.message,
          isLoading: false
        });
      }
    }).catch(error => {      
      this.setState({
        error: error.response.data.message,
        isLoading: false
      });
    });
  };

  login = (loginInputData) => {
    this.setState({isLoading: true});
    axios.post('/user/login', loginInputData)
    .then(response => {
        if (response.status === 201) {
          this.setState({
            token: response.data.token,
            isLoading: false
          });
          const expirationDate =  response.data.expiresIn * 1000 - new Date().getTime();
          this.checkAuthTimeOut(expirationDate);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('expirationDate', response.data.expiresIn);
        }
    }).catch(error => {
        if (error.response.status === 401) {
          this.setState({isLoading: false});
          this.setState({
            error: error.response.data.message,
            isLoading: false
          });
        }
        else {
          this.setState({
            error: error.message,
            isLoading: false
          });
        }
    });
  };

  register = (registerInputData) => {    
    this.setState({isLoading: true});    
    axios.post("/user/register", registerInputData)
    .then(response => {
        if (response.status === 201) {
            this.setState({
              message: response.data.message,
              isLoading: false
            });
        }
    }).catch(error => {  
        if (error.response.status === 500) {
            this.setState({
              error: error.message,
              isLoading: false
            });
        }
        else {
            this.setState({
              error: error.response.data.message,
              isLoading: false
            });
        };
    });
  };

  render (){
    const isAuthenticated = this.state.token !== null;
    let routes = (
      <Switch>
          <Route exact path="/" render={(props) => <Home {...props} />}/>
          <Route exact path="/login" render={(props) => <Login
            {...props}
            error={this.state.error}
            token={this.state.token}
            isLoading={this.state.isLoading}
            login={this.login}
            closeAlert={this.closeAlert}
            cleanMessages={this.cleanMessages}
          />}/>
          <Route exact path="/register" render={(props) => <Register
            {...props}
            error={this.state.error}
            isLoading={this.state.isLoading}
            message={this.state.message}
            register={this.register}
            closeAlert={this.closeAlert}
            cleanMessages={this.cleanMessages}
          />}/>
          <Route exact path="/forgot" render={(props) => <Forgot
            {...props}
            error={this.state.error}
            onSendRequest={this.onSendRequest}
            message={this.state.message}
            isLoading={this.state.isLoading}
            closeAlert={this.closeAlert}
            cleanMessages={this.cleanMessages}
          />} />
          <Route exact path="/reset/:id" render={(props) => <Reset
            {...props}
            error={this.state.error}
            onResetPassword={this.onResetPassword}
            message={this.state.message}
            isLoading={this.state.isLoading}
            closeAlert={this.closeAlert}
            cleanMessages={this.cleanMessages}
          />} />
          <Route exact path="/confirm/:token" render={(props) => <Confirm
            {...props}
          />} />
          <Redirect to="/" />
      </Switch>
    );

    if (isAuthenticated) {
      routes = (
        <Switch>
          <Route exact path="/" render={(props) => <Home {...props} />}/>
          <Route exact path="/profile" render={(props) => <Profile {...props} token={this.state.token} /> }/>
          <Route exact path="/loggout" render={(props) => <Loggout {...props} loggout={this.loggout} /> }/>
          <Redirect to="/" />
        </Switch>
      );
    };

    let authRedirect = null;
    if (isAuthenticated) {
      authRedirect = <Redirect to='/profile' />;
    };

    return(
      <div className = "App">
        <MyNavBar isAuthenticated={isAuthenticated} />
        {routes}
        {authRedirect}
      </div>
    )
  }
}

export default App;