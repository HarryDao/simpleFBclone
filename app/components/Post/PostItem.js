import React from 'react';
import { findDOMNode } from 'react-dom';
import PostForm from './PostForm';
import { Fade } from '../../styles/animations';
import { SpinnerLoader } from '../common';

const composeTimeString = () => {
    const now = Date.now();
    const nowTime = new Date(now);

    const today = new Date(
        nowTime.getFullYear(),
        nowTime.getMonth(),
        nowTime.getDate(), 
        0, 0, 0
    ).getTime();

    const yesterdayTime = new Date(nowTime - 24 * 60 * 60 * 1000);

    const yesterday = new Date(
        yesterdayTime.getFullYear(),
        yesterdayTime.getMonth(),
        yesterdayTime.getDate(), 
        0, 0, 0        
    ).getTime();

    return { today, yesterday };
}

const formatTime = (raw) => {
    if (typeof raw === 'string') {
        raw = Number(raw);
    }

    const casuals = composeTimeString();


    const time = new Date(raw);
    const hours = time.getHours();
    const mins = time.getMinutes();

    let timeString = `${hours < 10 ? `0${hours}` : hours}:${mins < 10 ? `0${mins}` : mins}`;

    let dateString = time.toDateString().split(' ').slice(1).join(' ');

    if (raw > casuals.today) {
        dateString = 'Today';
    }
    else if (raw > casuals.yesterday) {
        dateString = 'Yesterday';
    }

    return `${dateString}, ${timeString}`;
}

const mapUsersToContent = (content, allUsers) => {
    let arr = [content];

    for (let uid in allUsers) {
        let user = allUsers[uid];
        user.uid = uid;

        let searchName = new RegExp(`@${user.name}`, 'gi');

        let newArr = [];

        arr.map(part => {
            if (typeof part !== 'string') {
                newArr.push(part);
                return;
            }

            let newPart = [];

            part = part.split(searchName);

            part.map((section, i) => {
                newPart.push(section);

                if (i < part.length - 1) {
                    newPart.push({ user });
                }
            });

            newArr.push(...newPart);
        });

        arr = newArr;        
    }

    return arr.filter(i => i ? true : false);
}




class PostItem extends React.Component {
    state = {
        loading: false,
        currentUser: false,
        showOptions: false,
        showEdit: false,
    }

    componentDidMount() {
        const { user, post, preview } = this.props;

        this.setState({ currentUser: preview || user.uid == post.authorId })      
    }

    onEditOptionClick = () => {
        this.setState({ showOptions: false, showEdit: true });
    }

    onOptionsClick = () => {
        this.setState({ showOptions: true });

        const close = (e) => {
            if (!findDOMNode(this.optsRef).contains(e.target)) {
                this.setState({ showOptions: false });
                document.removeEventListener('click', close);
            }
        }

        document.addEventListener('click', close);
    }

    onRemoveOptionClick = () => {
        const { post: { uid }, onPostRemove } = this.props;

        this.setState({ loading: true, showOptions: false });

        onPostRemove({ uid }, () => {
            this.setState({ loading: false });
        });
    }

    onEditFinish = (content, cb) => {
        const { post: { uid }, onPostUpdate } = this.props;

        if (!content) {
            return this.setState({ showEdit: false }, cb);
        }

        onPostUpdate({ content, uid }, () => {
            return this.setState({ showEdit: false }, cb);
        })
    }


    renderOptions() {
        const { showOptions } = this.state;

        return Fade({ in: showOptions }, style => {
            return (
                <div
                    className='list' 
                    style={style}
                >
                    <button
                        className='edit'
                        onClick={this.onEditOptionClick}
                    >
                        <i className='fas fa-edit'/> edit
                    </button>

                    <button
                        className='remove'
                        onClick={this.onRemoveOptionClick}
                    >
                        <i className='fas fa-trash'/> remove
                    </button>
                </div>
            );
        });
    }

    renderOptionsMenu() {
        const { currentUser } = this.state;
        const { preview } = this.props;

        if (!preview && currentUser) {
            return (
                <div
                    ref={n => this.optsRef = n}
                    className='options'
                >
                    <button
                        className='icon'
                        onClick={this.onOptionsClick}
                    >
                        <i className='fas fa-ellipsis-v'/>
                    </button>
                    {this.renderOptions()}
                </div>
            );
        }
    }

    renderEditPanel() {
        const {
            user,
            allUsers,
            friends,
            post: { content },
        } = this.props;

        return (
            <div className='edit'>
                <div
                    className='close'
                    onClick={() => this.setState({ showEdit: false })}
                >
                    &times;
                </div>
                <PostForm
                    user={user}
                    allUsers={allUsers}
                    friends={friends}
                    content={content}
                    onFormSubmit={this.onEditFinish}
                    edit
                />
            </div>
        );
    }


    renderContentItem(key, item) {
        const { onFriendClick, preview } = this.props;

        if (!item.user) {
            return (
                <span
                    key={key}
                >
                    {item}
                </span>
            );            
        }

        const { name, uid } = item.user;

        return (
            <span
                key={key}
                className='user'
                onClick={() => preview || onFriendClick(uid)}
            >
                {name}
            </span>
        );
    }

    renderContent() {
        const {
            allUsers,
            post: { content, uid }, 
            preview, 
        } = this.props;

        const {
            currentUser
        } = this.state;

        if (!preview && currentUser && this.state.showEdit) {
            return this.renderEditPanel();
        }

        let mappedContent = mapUsersToContent(content, allUsers);

        mappedContent = mappedContent.map((item, index) => {
            const key = preview ? `preview-${index}` : `${uid}-${index}`;

            return this.renderContentItem(key, item);
        });

        return (
            <div className={`content  ${preview ? 'preview' : ''}`}>
                {mappedContent}
            </div>
        );
    }

    renderUser() {
        const { allUsers, post, preview } = this.props;

        let name = '';

        if (preview) {
            name = 'preview...';
        }
        
        if (post && post.authorId && allUsers[post.authorId]) {
            name = allUsers[post.authorId].name;
        }

        
        const created = formatTime(preview ? Date.now() : post.created);
        let edited = null;

        if (!preview && post.created !== post.edited) {
            edited = formatTime(post.edited);
        }

        if (edited) {
            edited = (() => {
                return (
                    <p className='time edited'>
                        (updated: {edited})
                    </p>
                );
            })();
        }

        const className = `user ${preview ? 'preview' : ''}`;

        return (
            <div className={className}>
                <div className='icon'>
                    <i className='fas fa-user'/>
                </div>

                <div className='info'>
                    <p className='name'>
                        {name}
                    </p>

                    <p className='time created'>
                    {created}
                    </p>

                    {edited}
                </div>
                
                {this.renderOptionsMenu()}
            </div>
        );
    }

    render() {
        const { post } = this.props;
        const { loading, currentUser } = this.state;
        const className=`post-item ${currentUser ? 'own' : ''}`;

        return (
            <div
                key={`post-${post.uid}`}
                className={className}
            >
                
                <SpinnerLoader inProp={loading} />

                {this.renderUser()}
                {this.renderContent()}
            </div>
        );
    }
}

export default PostItem;