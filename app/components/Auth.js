import React from 'react';
import { connect } from 'react-redux';
import { Toggle, SpinnerLoader } from './common';
import * as actions from '../actions';
import { Fade } from '../styles/animations';


class AuthForm extends React.Component {
    state = {
        name: '',
        email: '',
        password: '',
        isRegister: false,
    }

    componentDidUpdate() {
        this.redirectToContent(this.props);
    }

    shouldComponentUpdate(nextProps) { 
        this.redirectToContent(nextProps);

        return true;
    }

    redirectToContent = (props) => {
        const { user, location, history } = props;

        if (user) {
            let next = '/';

            if (location && 
                location.state && 
                location.state.next) {
                    next = location.state.next;
            }

            history.push(next);
        }
    }

    onInputChange = (key, value) => {
        this.setState({ [key]: value });
    }

    onSubmitClick = (e) => {
        e.preventDefault();

        const { email, password, name, isRegister } = this.state;

        if (isRegister) {
            this.props.registerUser({ email, password, name });
        }
        else {
            this.props.loginUser({ email, password });
        }
    }

    onOAuthLogin = (e, provider) => {
        e.preventDefault();

        switch(provider) {
            case 'google':
                this.props.oauthGoogle();
        }
    }

    renderError() {
        let { error } = this.props;
        if (error && error.message) {
            error = error.message;
        }

        return Fade({ in: error }, style => {
            return (
                <h3 className='error' style={style}>{error}</h3>
            );
        }, { time: 100 }, 'auth-error')
    }

    renderToggleRegister() {
        const { isRegister } = this.state;
        const className=`text ${isRegister ? 'active' : ''}`;

        return (
            <div className='toggle-register'>
                <span className='button'>
                    <Toggle
                        value={isRegister}
                        onToggle={()=> this.setState({
                            isRegister: !isRegister
                        })}
                        height={0.8}
                        width={0.8}
                    />
                </span>

                <span className={className}>
                    create new account
                </span>
            </div>
        );
    }

    renderSubmitButton() {
        const { isRegister } = this.state;

        return (
            <div className='submit'>
                <button
                    type='submit'
                    onClick={this.onSubmitClick}
                >
                    {isRegister ? 'Register' : 'Login'}
                </button>
            </div>
        );
    }

    renderNameInput() {
        const { isRegister } = this.state;

        return Fade({in: isRegister}, style => {
            return (
                <div className='input-group' style={style}>
                    <input
                        type='text'
                        placeholder='Name'
                        value={this.state.name}
                        onChange={e => this.onInputChange('name', e.target.value)}
                    />
                </div>
            );
        }, {duration: 300});
    }

    render() {


        return (
            <div className='login-form'>

                <form>

                    <SpinnerLoader
                        inProp={this.props.loading}
                    />

                    <h1>Login</h1>

                    {this.renderError()}

                    {this.renderToggleRegister()}

                    <div className='input-group'>
                        <input
                            type='text'
                            placeholder='Email'
                            value={this.state.email}
                            onChange={e => this.onInputChange('email', e.target.value)}
                        />
                    </div>


                    <div className='input-group'>
                        <input
                            type='password'
                            placeholder='Password'
                            value={this.state.password}
                            onChange={e => this.onInputChange('password', e.target.value)}
                        />
                    </div>

                    {this.renderNameInput()}

                    {this.renderSubmitButton()}

                    <div className='oauth'>
                        <button
                            className='google'
                            onClick={(e) => this.onOAuthLogin(e, 'google')}
                        >
                            <div>
                                <i className='fab fa-google'/>
                            </div>
                        </button>

                        {/* <button
                            className='facebook'
                            onClick={(e) => this.onOAuthLogin(e, 'facebook')}
                        >
                            <div>
                                <i className='fab fa-facebook-f'/>
                            </div>
                        </button>                        */}

                    </div>

                </form>
            </div>
        );
    }
}

const mapStateToProps = ({ auth }) => {
    const { user, error, loading } = auth;

    return { user, error, loading };
}

export default connect(mapStateToProps, actions)(AuthForm);