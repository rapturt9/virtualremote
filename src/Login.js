import React, { Component } from 'react';
import { loginWithGoogle } from './auth';
import { firebaseAuth } from './config/constants';
import { Button } from "semantic-ui-react";

import firebase from 'firebase';

const firebaseAuthKey = 'firebaseAuthInProgress';
const appTokenKey = 'appToken';

export default class Login extends Component {
constructor(props) {
        super(props);
        this.state = { splashScreen: false };
        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    }
handleGoogleLogin() {
     loginWithGoogle()
     .catch(err => {
      localStorage.removeItem(firebaseAuthKey)
     });
// this will set the splashscreen until its overridden by the real firebaseAuthKey
     localStorage.setItem(firebaseAuthKey, '1');
    }
componentWillMount = () => {
// checks if we are logged in, if we are go to the home route
firebaseAuth().onAuthStateChanged(user => {
         if (user) {
          localStorage.removeItem(firebaseAuthKey);
          localStorage.setItem(appTokenKey, user.uid);
          console.log('/app/home');
          firebase.firestore().collection('remotes').doc(user.email).get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                this.props.setRemotes([user.email,doc.data()]);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                this.props.setRemotes([user.email]);
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
          //console.log(firebase.firestore().collection('remotes').get());
         }
        })
    }
render() {
if (localStorage.getItem(firebaseAuthKey) === '1') 
   return <Splashscreen />;
  return <LoginPage handleGoogleLogin={this.handleGoogleLogin} />;
}
}
// this is the URL we copied from firebase storage
const LoginPage = ({ handleGoogleLogin }) => (
    <Button fluid primary onClick = {handleGoogleLogin}>Sign In With Google</Button>
)
const Splashscreen = () => (<p></p>);