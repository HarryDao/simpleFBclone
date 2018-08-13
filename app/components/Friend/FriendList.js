import React from 'react';
import _ from 'lodash';

class FriendList extends React.Component {
    renderAsked() {
        const { 
            user, 
            allUsers,
            onFriendRequestAccept, 
            onFriendRequestReject 
        } = this.props;

        let askedList = user && user.asked ? user.asked : {};

        askedList = _.map(askedList, (value, uid) => {
            const friend = allUsers[uid];
            const { name } = friend;
            friend.uid = uid;

            const title = `${name} is requesting to be your friend. Accept now!`;

            return (
                <div
                    key={uid}
                    className='item'
                    title={title}
                >
                    <div className='icon'>
                        <i className='fas fa-plus-circle'/>
                    </div>

                    <div className='name'>
                        {name}
                    </div>

                    <div className='buttons'>
                        <button
                            className='yes'
                            onClick={() => onFriendRequestAccept(friend)}
                        ><i className='fas fa-check'/></button>
                        <button
                            className='no'
                            onClick={() => onFriendRequestReject(friend)}
                        ><i className='fas fa-times'/></button>
                    </div>
                </div>
            );
        });

        const className=`list asked ${askedList.length ? '' : 'inactive'}`;

        return (
            <div className={className}>
                {askedList}
            </div>
        );
    }

    renderAsking() {
        const {
            user, 
            allUsers,
            onPendingRequestCancel,
        } = this.props;

        let askingList = user && user.asking ? user.asking : {};

        askingList = _.map(askingList, (value, uid) => {
            
            const friend = allUsers[uid];
            const { name } = friend;
            friend.uid = uid;

            const title = `Friend request to ${name} is waiting to be accepted...`

            return (
                <div
                    key={uid}
                    className='item'
                    title={title}
                >
                    <div className='icon'>
                        <i className='far fa-comment-dots'/>
                    </div>

                    <div className='name'>
                        {name}...
                    </div>

                    <div className='buttons'>
                        <button
                            className='no'
                            onClick={() => onPendingRequestCancel(friend)}
                        ><i className='fas fa-times'/></button>
                    </div>
                </div>
            );
        });

        const className=`list asking ${askingList.length ? '' : 'inactive'}`;

        return (
            <div className={className}>
                {askingList}
            </div>
        );
    }

    renderFriends(){
        const {
            user, 
            allUsers,
            onFriendRemove, 
            onFriendClick
        } = this.props;
        
        let friendList = user && user.friends ? user.friends : {};

        friendList = _.map(friendList, (value, uid) => {
            const friend = allUsers[uid];
            const { name } = friend;
            friend.uid = uid;

            return (
                <div
                    key={uid}
                    className='item'
                >
                    <div className='icon'>
                        <i className='far fa-user'/>
                    </div>

                    <div className='name' >
                        <button
                            onClick={() => onFriendClick(uid)}
                        >
                            {name}
                        </button>
                    </div>

                    <div className='buttons'>
                        <button
                            className='no'
                            onClick={() => onFriendRemove(friend)}
                        ><i className='fas fa-times'/></button>
                    </div>
                </div>
            );
        });

        return (
            <div className='list friends'>
                {friendList}
            </div>
        );
    }

    renderAsks() {
        const { user } = this.props;

        const noAsked = !user || !user.asked || Object.keys(user.asked).length < 1;
        const noAsking = !user || !user.asking || Object.keys(user.asking).length < 1;

        if (noAsked && noAsking) {
            return;
        }

        return (
            <div className='asks'>
                {this.renderAsked()}
                {this.renderAsking()}
            </div>
        )

    }

    render() {
        return (
            <div className='friend-list'>
                {this.renderAsks()}
                {this.renderFriends()}
            </div>
        );
    }
}

export default FriendList;