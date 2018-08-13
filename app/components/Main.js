import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { trackMultipleLoadings } from './helpers';
import { SpinnerLoader } from './common';
import Posts from './Post/Posts';
import Friends from './Friend/Friends';

const extractFriends = (user, allUsers) => {
    let friends = [];
        
    if (user.friends) {
        _.map(user.friends, (value, uid) => {
            const friend = allUsers[uid];
            friend.uid = uid;

            friends.push(friend);
        });
    }

    return friends;
}

class Main extends React.Component {
    state = {
        showFriendPanel: false,
        loaded: false,
        loading: false,
        error: '',
        friendUID: null,
    };

    componentDidMount() {
        this.loadData(this.props);
    }

    loadData = (props) => {

        const {
            allUsers,
            posts,
            fetchAllUsers,
            fetchPosts,
        } = props;


        this.setState({
            loaded: false, 
            loading: true, 
            error: ''
        }, () => {
            trackMultipleLoadings(
                [
                    {
                        condition: allUsers,
                        func: fetchAllUsers,
                    },
                    {
                        condition: posts,
                        func: fetchPosts,
                    }
                ],
                (errors) => {
                    return this.setState({
                        loaded: true,
                        loading: false, 
                        error: errors ? errors[0] : ''
                    });
                },
            );
        });
    }

    toggleFriendPanel = () => {
        this.setState({ showFriendPanel: !this.state.showFriendPanel });
    }

    renderContent() {
        const { loaded, error } = this.state;
        let {
            user,
            allUsers,
            posts,
            history,
            match
        } = this.props;

        if (!loaded || error) {
            return;
        }

        const friends = extractFriends(user, allUsers);

        posts = JSON.stringify(posts);

        return (
            <div className='inner'>
                <Friends
                    user={user}
                    allUsers={allUsers}
                    history={history}
                    showFriendPanel={this.state.showFriendPanel}
                    toggleFriendPanel={this.toggleFriendPanel}
                />
                <Posts
                    user={user}
                    allUsers={allUsers}
                    friends={friends}
                    posts={posts}
                    toggleFriendPanel={this.toggleFriendPanel}
                    history={history}
                    friendUID={match.params.uid}
                />
            </div>
        );
    }

    render() {
        const { loading } = this.state;

        return (
            <div className='main'>
                <SpinnerLoader
                    inProp={loading}
                    customStyle={{ backgroundColor: 'transparent' }}
                />

                {this.renderContent()}

            </div>
        );
    }
}

const mapStateToProps = ({ auth, allUsers, posts }) => {
    const { user } = auth;

    return { user, allUsers, posts };
}

export default connect(mapStateToProps, actions)(Main);