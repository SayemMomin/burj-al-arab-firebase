import React, { useState, useContext } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.confiq';
import { useHistory, useLocation } from 'react-router-dom';
import { UserContext } from '../../App';

// if (!firebase.apps.length) {
//   firebase.initializeApp({firebaseConfig});
// }
firebase.initializeApp(firebaseConfig);


function Login() {
    let history = useHistory();
    let location = useLocation();
  
    let { from } = location.state || { from: { pathname: "/" } };

  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    photo: '',
    password: ''
  })
  
const [userLoggedIn, setUserLoggedIn] = useContext(UserContext)

  const handleGoogleSignIn = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleProvider)
    .then((res) => {
      const {displayName, email, photoURL} = res.user
        const userSignIn ={
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(userSignIn)
        setUserLoggedIn(userSignIn)
        history.replace(from);
        //console.log
    })
    
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  const handleOnBlur =(e) => {
    let isFieldValied;
    if (e.target.name === 'email') {
      isFieldValied = /\S+@\S+\.\S+/.test(e.target.value);    
    }
    if (e.target.name === 'password') {
      const isPasswordValied = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValied = isPasswordValied && passwordHasNumber;
      
    }
    if (isFieldValied) {
      const newUserInfo = {...user};
      console.log(newUserInfo);
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)
    }
    //console.log(e.target.name, e.target.value)
  }

  const handleSubmit = (e) => {
    if (newUser && user.email && user.password) {
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(res => {
      const newUserInfo = {...user}
      setUser(newUserInfo)
      updateUserName(user.name)
      
      newUserInfo.error = '';
      newUserInfo.success = true;
      //updateUserName(user.name)
    })
    .catch(function(error) {
      // Handle Errors here.
      const newUserInfo = {...user}
      setUser(newUserInfo)
      newUserInfo.error = error.message;
      newUserInfo.success = false;
      // ...
    });
    }

    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user}
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo)
        setUserLoggedIn(newUserInfo)
        history.replace(from);
      })
      .catch(function(error) {
        // Handle Errors here.
        const newUserInfo = {...user}
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo)
        // ...
      });
    }
   e.preventDefault()
  }

  const updateUserName = (name, photo) => {
    const user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: name,
      photoURL: photo
    }).then(function() {
       console.log('User name Update successfully.')
    }).catch(function(error) {
      // An error happened.
    });
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(function() {
      const signOutUser ={
        isSignIn: false,
        name: '',
        email: '',
        photo: '',
        error: '',
        success: false
      }
      setUser(signOutUser)
      
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }
  
  return (
    <div className="App">
      {
        user.isSignIn && <div>
          <p>Name: {user.name} </p>
          <p>Email: {user.email} </p>
        </div>
        
      }
      {
       user.isSignIn ? 
        <button onClick={handleSignOut}>Sign Out with Google</button> :
          <button onClick={handleGoogleSignIn}>Sign In with Google</button>
      }

      <h2>Authentication with Email And Password</h2>
      <p>Email: {user.email} </p>
        <p>Password: {user.password} </p>
        <input type="checkbox" name="" id="" onChange={() => setNewUser(!newUser)} />
        <level>Sign Up with email</level>
    
      <form action="" onClick={handleSubmit}>
       { newUser && <input type="text" onBlur={handleOnBlur} name="name" placeholder="Your Name" />}
        <br/>
        <input type="text" onBlur={handleOnBlur} name="email" placeholder="Your Email" />
        <br/>
        <input type="password" onBlur={handleOnBlur} name="password" id="" Placeholder="Your Password" />
        <br/>
        <input type="submit" value={newUser ? "Sign up" : " Sign In"} />
      </form>
      { user.success && <p style={{color: 'green'}}>User { newUser ? 'created' : 'Logged In'} successfully</p>}
      <p style={{color: 'red'}}>{user.error} </p>
    </div>
  );
}

export default Login;
