import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as actions from '../actions';
import { FIREBASE_CONFIGS } from '../../configs';
import Header from './Header';
import Footer from './Footer';
import Messages from './Messages';
import AuthForm from './Auth';
import requireAuthentication from './require_authentication';
import Main from './Main';

class App extends React.Component {
    async componentDidMount() {
        let fullyInitialized = false;

        Firebase.initializeApp(FIREBASE_CONFIGS);
        Firebase.firestore().settings({ timestampsInSnapshots: true });

        Firebase.auth().onAuthStateChanged(user => {
            this.props.updateAuthentication(user);

            if (!fullyInitialized) {
                this.props.firebaseInitialized();
                fullyInitialized = true;
            }
        });
    }

    

    render() {
        return (
            <BrowserRouter>
                <div className='app'>
                    <Header/>
                    
                    <Messages/>

                    <main>
                        <div className='padding'>&nbsp;</div>

                        <Switch>
                            <Route
                                path='/login'
                                component={AuthForm}
                            />

                            <Route
                                path='/friends/:uid'
                                component={requireAuthentication(Main)}
                            />

                            <Route
                                path='/'
                                component={requireAuthentication(Main)}
                            />
                        </Switch>
                    </main>
                    
                    <Footer/>
                </div>
            </BrowserRouter>
        );
    }
}

export default connect(null, actions)(App);