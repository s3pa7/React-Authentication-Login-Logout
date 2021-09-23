import {useRef , useContext} from 'react';
import classes from './ProfileForm.module.css';
import AuthContext from "../../store/auth-context";

import {useHistory} from 'react-router-dom';

const ProfileForm = () => {
    const newPasswordInputRef = useRef();
    const authCtx = useContext(AuthContext);
    const history = useHistory();
    const submitHandler = (event) => {
        event.preventDefault();


        const enteredNewPassword = newPasswordInputRef.current.value;


        //add Validation

        fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyA6J5IlS3ILRZ7MJzvuOjdbKp8UYQdH4Io' , {
            method: 'POST',
            body: JSON.stringify({
                idToken: authCtx.token,
                password: enteredNewPassword,
                returnSecureToken: false
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            // assumption: Alwayd succeeds


            if(res.ok){
                history.replace('/');
                //return res.json();
            }else {
                return res.json().then((data) => {
                    debugger;
                    let errorMessage =  'Authentication failed';
                    if(data && data.error && data.error.message){
                        errorMessage = data.error.message;
                    }

                    throw new Error(errorMessage);
                });
            }
        })
    }
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
