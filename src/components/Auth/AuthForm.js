import { useState , useRef , useContext } from 'react';
import {useHistory} from 'react-router-dom';

import classes from './AuthForm.module.css';
import AuthContext from "../../store/auth-context";

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  const authCtx = useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    debugger;
    //optimal: Add validation
    setIsLoading(true);
    let url;
    if(isLogin){
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA6J5IlS3ILRZ7MJzvuOjdbKp8UYQdH4Io'

    }else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA6J5IlS3ILRZ7MJzvuOjdbKp8UYQdH4Io';

    }

    fetch(url,
        {
          method: 'POST',
          body: JSON.stringify({
            email:enteredEmail,
            password:enteredPassword,
            returnSecureToken:true
          }),
          headers:{
            'Content-Type': 'application/json'
          }
        }).then((res) => {
        setIsLoading(false);
      if(res.ok){
        return res.json();
      }else {
        return res.json().then((data) => {
          let errorMessage =  'Authentication failed';
          if(data && data.error && data.error.message){
            errorMessage = data.error.message;
          }

          throw new Error(errorMessage);
        });
      }
    }).then((data) => {
      //With Context
        const exparationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));
      authCtx.login(data.idToken , exparationTime.toISOString());
        history.replace('/')
    }).catch(err => {
      alert(err.message);
    })
  }
  return (
    <section className={classes.auth}>
      {!isLoading && <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>}
      {isLoading && <p>Sending request...</p>}
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password'  ref={passwordInputRef} required />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
