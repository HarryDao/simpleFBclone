import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../actions';
import { IMAGES } from '../media';
import { Fade } from '../styles/animations';


class Header extends React.Component {
    state = { showMenu: false }

    onLogoutClick = () => {
        this.props.logoutUser();
        this.toggleMenuList();
    }

    renderUserName() {
        const { user } = this.props;
        const name = user && user.name ? user.name : '';

        return Fade({ in: name }, style => {

            return (
                <Link
                    to='/'
                    style={style}
                >
                    <i className='far fa-user'/> {name}
                </Link>
            );
        });
    }

    toggleMenuList = () => {
        this.setState({ showMenu: !this.state.showMenu });
    }

    renderLogout() {
        const { user } = this.props;
        
        if (user) {
            return (
                <a
                    onClick={this.onLogoutClick}
                >
                    Logout
                </a>
            );
        }
    }

    renderLogin() {
        const { user } = this.props;

        if (!user) {
            return (
                <Link
                    to='/login'
                    onClick={this.toggleMenuList}
                >
                    Login
                </Link>
            );
        }
    }

    renderMenuList() {
        const { showMenu } = this.state;
        const className=`menu-list ${showMenu ? 'active' : ''}`;

        return (
            <div className={className}>
                <div
                    className='close'
                    onClick={this.toggleMenuList}
                >&times;</div>

                <div className='inner'>
                    {this.renderLogin()}
                    {this.renderLogout()}
                </div>
            </div>
        );
    }

    render() {
        return(
            <header>
                <div className='icon'>
                    <img src={IMAGES.ICON} />
                </div>

                <div className='title'>
                    <h1>Simple FB Clone</h1>
                </div>

                <div className='user-name'>
                    {this.renderUserName()} 
                </div>

                <div
                    className='menu-icon'
                    onClick={this.toggleMenuList}
                >
                    <h1><i className='fa fa-bars'/></h1>
                </div>

                {this.renderMenuList()}
            </header>
        );
    }
}

const mapStateToProps = ({ auth: { user } }) => {
    return { user };
}

export default connect(mapStateToProps, actions)(Header);