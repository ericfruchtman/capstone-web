import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Dashboard from "./dashboard";

import React, {useEffect, useState} from "react";
import { Button, notification } from 'antd';

// https://boiling-waters-15789.herokuapp.com/

function Auth() {

  let apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const [emailLogin, setEmailLogin] = useState('');
  const [emailSignUp, setEmailSignUp] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [passwordSignUp, setPasswordSignUp] = useState('');
  const [retypePassword, setRetypePassword] = useState('');

  const onSignIn = async (event) => {
    event.preventDefault();
    // console.log(emailLogin);
    // console.log(passwordLogin);

    let loginBody = { 
      email: emailLogin,
      password: passwordLogin
    }

    let options = {
      method: 'POST',
      body: JSON.stringify(loginBody),
      headers: {}
    };
    options.headers["Accept"] = "application/json, text/plain, */*";
    options.headers["Content-Type"] = "application/json;charset=utf-8";
    // console.log(options);
    
    const res = await fetch(`${apiUrl}/api/v1/login`, options);

    let data = await res.json();
    // console.log(data);
    if(data.token){
      localStorage.setItem('token', data.token);
      window.location.href='/dashboard';
    }
    
  }

  const onSignUp = async (event) => {
    event.preventDefault();
    // console.log(emailSignUp);
    // console.log(passwordSignUp);

    let signupBody = { 
      email: emailSignUp,
      password: passwordSignUp
    }

    let options = {
      method: 'POST',
      body: JSON.stringify(signupBody),
      headers: {}
    };
    options.headers["Accept"] = "application/json, text/plain, */*";
    options.headers["Content-Type"] = "application/json;charset=utf-8";
    // console.log(options);
    
    const res = await fetch(`${apiUrl}/api/v1/signup`, options);
    
    let data = await res.json();
    console.log(data);
    if(data.success){
      notification['success']({
        message:'Received',
        description:
        "All set! You may now login using your credentials.",
      })
    }

  }

  return (
    <>
      {/* Navbar */}
      <div className={"grid grid-cols-12 place-items-center border bg-gray-50 bg-opacity-100"}>
      <div className={"col-span-8 md:col-span-9 lg:col-span-10 xl:col-span-8 p-2 mt-2"}>
        <h1 className={"text-center text-blue-900 text-3xl tracking-wider text-opacity-80 subpixel-antialiased"}>
          Custom Quiz Builder
        </h1>
        </div>

        {/* Log In */}
        <div className={"col-start-2 col-span-10 md:col-start-3 md:col-span-8 shadow-lg p-8"}>
          <h1 className={"text-center text-2xl p-2"}>Sign In</h1>
          <form className={"grid grid-cols-12"} onSubmit={onSignIn}>
            <input type="email" value={emailLogin} onChange={(event) => setEmailLogin(event.currentTarget.value)} 
              required className={"border col-span-full lg:col-start-2 lg:col-span-10 rounded p-2 m-4"} placeholder={"Email address"}/>
            <input type="password" value={passwordLogin} onChange={(event) => setPasswordLogin(event.currentTarget.value)} 
              required className={"border col-span-full lg:col-start-2 lg:col-span-10 rounded p-2 m-4"} placeholder={"Password"}/>
            <Button type={"primary"} htmlType={"submit"} 
              className={"col-start-5 col-span-4 lg:col-start-6 lg:col-span-2"}>
                Log In
            </Button>

          </form>
        </div>

        <div className={"col-span-full"}>
          <br/>
          <span className={"text-center text-xl p-2"}>Or</span>
        </div>

        {/* Sign Up */}
        <div className={"col-start-2 col-span-10 md:col-start-3 md:col-span-8 shadow-lg p-8"}>
          <h1 className={"text-center text-2xl p-2"}>Sign Up</h1>
          <form className={"grid grid-cols-12"} onSubmit={onSignUp}>
            <input type="email" value={emailSignUp} onChange={(event) => setEmailSignUp(event.currentTarget.value)} 
              required className={"border col-span-full lg:col-start-2 lg:col-span-10 rounded p-2 m-4"} placeholder={"Email address"}/>
            <input type="password" value={passwordSignUp} onChange={(event) => setPasswordSignUp(event.currentTarget.value)} 
              required className={"border col-span-full lg:col-start-2 lg:col-span-10 rounded p-2 m-4"} placeholder={"Password"}/>
             <input type="password" value={retypePassword} onChange={(event) => setRetypePassword(event.currentTarget.value)} 
              required className={"border col-span-full lg:col-start-2 lg:col-span-10 rounded p-2 m-4"} placeholder={'Retype Password'}/>
             {(passwordSignUp != retypePassword) && <small className={'text-red-500 font-bold'}>Passwords don't match</small>}
            <Button type={"primary"} htmlType={"submit"} 
              className={"col-start-4 col-span-6 md:col-start-5 md:col-span-4 lg:col-start-6 lg:col-span-2"}>
                Sign Up
            </Button>

          </form>
        </div>
      </div>

    </>
  );
}

function App() {
    
  return (
    <>
      <Router>
          <div>
              {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
              <Switch>
                  <Route path="/dashboard">
                      <Dashboard />
                  </Route>
                  <Route path="/">
                      <Auth />
                  </Route>
              </Switch>
          </div>
      </Router>
    </>
  );
}

export default App;