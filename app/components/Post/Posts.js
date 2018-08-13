import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../actions';
import { Fade } from '../../styles/animations';
import { SpinnerLoader } from '../common';
import PostForm from './PostForm';
import PostItem from './PostItem';
import PostGuide from './PostGuide';


class Posts extends React.Component {
    state = { loading: false }

    componentDidMount() {
        this.onTransition();
    }

    onTransition = () => {
        this.setState({ loading: true }, () => {
            setTimeout(() => {
                this.setState({ loading: false });
            }, 300);
        });
    }

    onPostAdd = (content, cb) => {
        this.props.addPost({ content }, cb);
    }

    onPostUpdate = ({ content, uid }, cb) => {
        this.props.updatePost({ uid, content }, cb);
    }

    onPostRemove = ({ uid }, cb) => {
        this.props.removePost({ uid }, cb);
    }

    onFriendClick = (uid) => {
        const next = this.props.user.uid !== uid ? `/friends/${uid}` : '/';
        
        this.props.history.push(next);
    }

    renderGuide() {
        const { user, allUsers, friendUID } = this.props;

        let isHome = true;
        let name = user.name;

        if (friendUID && friendUID !== user.uid && allUsers[friendUID]) {
            isHome = false;
            name = allUsers[friendUID].name;
        }
        return <PostGuide
            isHome={isHome}
            name={name}
        />
    }

    renderPostList() {
        let { user, allUsers, friends, posts, friendUID } = this.props;
        let { loading } = this.state;

        posts = JSON.parse(posts);

        if (friendUID && !posts[friendUID]) {
            let name = allUsers[friendUID] ? allUsers[friendUID].name : null;

            if (!name) {
                return;
            }

            return (
                <div className='not-friend'>
                    <h1>sorry, you need to be friend with <span className='name'>{name}</span> to see content</h1>
                </div>
            );
        }

        let postArr = [];

        if (friendUID) {
            postArr = posts[friendUID];
        }
        else {
            _.map(posts, userPosts => {
                postArr.push(...userPosts);
            });
        }

        postArr.sort((a, b) => b.created > a.created ? 1: -1);

        postArr = postArr.map(post => {
            return (
                <PostItem
                    key={post.uid}
                    post={post}
                    user={user}
                    allUsers={allUsers}
                    friends={friends}
                    onPostUpdate={this.onPostUpdate}
                    onPostRemove={this.onPostRemove}
                    onFriendClick={this.onFriendClick}
                />
            );
        });

        return Fade({ in: !loading }, style => {
            return (
                <div className='post-list' style={style}>
                    {postArr.length > 0 ? postArr : this.renderGuide()}
                </div>
            );
        });
    }

    renderPostForm() {
        const {
            user, 
            allUsers,
            friends
        } = this.props;

        return (
            <PostForm
                user={user}
                allUsers={allUsers}
                friends={friends}
                onFormSubmit={this.onPostAdd}
            />
        );
    }

    renderUserInfo() {
        const {
            user, 
            allUsers, 
            friendUID, 
            history, 
            toggleFriendPanel
        } = this.props;

        const content = () => {
            if (friendUID){

                if (allUsers[friendUID]) {
                    const { name } = allUsers[friendUID];
    
                    return (
                        <div className='details'>
                            <i className='far fa-user'/> {name}
                        </div>
                    );
                }
                else {
                    return (
                        <div className='details'>No User Found!</div>
                    );
                }
    
            }
            else {
                const { name } = user;
    
                return (
                    <div className='details welcome'>
                        Welcome, <span className='name'>{name}</span>!
                    </div>
                );       
            }
        }

        return (
            <div className='info'>
                <div className='buttons'>
                    <button
                        onClick={toggleFriendPanel}
                        className='friends'
                    >
                        <i className='fas fa-user-friends'/>
                    </button>

                    <button
                        className='home'
                        onClick={() => history.push('/')}
                    >
                        <i className='fas fa-home'/>
                    </button>
                </div>

                {content()}
            </div>
        );

    }

    renderLoading() {
        return Fade(
            { in: this.state.loading },
            style => {
                return (
                    <div className='loading' style={style}>
                        <SpinnerLoader
                            inProp={this.state.loading}
                            customStyle={{ backgroundColor: 'transparent' }}
                        />
                    </div>
                );
            }
        );
    }

    render() {

        return (
            <div className='posts'>
                {this.renderUserInfo()}
                {this.renderPostForm()}
                {this.renderLoading()}
                {this.renderPostList()}
            </div>
        );
    }
}

export default connect(null, actions)(Posts);