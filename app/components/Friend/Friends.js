import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { SpinnerLoader } from '../common';
import FriendSearch from './FriendSearch';
import FriendList from './FriendList';


class Friends extends React.Component {
    state = {
        searchTerm: '',
        suggestions: [],
        loading: false,
    }

    filterSuggestions = (newSearchTerm, cb = () => {}) => {
        try {
            const { user, allUsers } = this.props;

            const { uid: userUID, asking, asked, friends } = user;

            if (!user || !allUsers) {
                throw '';
            }

            const newSuggestions = [];

            for (let uid in allUsers) {
                const suggestion = allUsers[uid]
                const { name } = suggestion;

                const isCurrentUser = uid == userUID;
                const isAdded = friends && friends[uid];
                const isAsking = asking && asking[uid];
                const isBeingAsked = asked && asked[uid];

                const matchCondition = new RegExp(`(^|\\s)${newSearchTerm.toLowerCase()}`);
                const matched = !newSearchTerm || name.toLowerCase().match(matchCondition);

                if (!isCurrentUser && 
                    !isAdded && 
                    !isAsking && 
                    !isBeingAsked && 
                    matched
                ){
                    suggestion.uid = uid;
                    newSuggestions.push(suggestion);
                }

            }

            newSuggestions.sort((a, b) => a.name > b.name ? 1 : -1);

            this.setState({
                searchTerm: newSearchTerm,
                suggestions: newSuggestions,
            }, cb);
        }
        catch(err) {
            this.setState({
                searchTerm: newSearchTerm,
                suggestions: [],
            }, cb);
        }
    }

    toggleLoading = (action) => {
        this.setState({ loading: true });

        action(() => {
            this.setState({ loading: false });
        });
    }

    onSearchTermChange = (e) => {
        this.filterSuggestions(e.target.value);
    }    

    onSuggestionClick = (suggestion) => {
        this.setState({
            searchTerm: suggestion.name,
            suggestions: []
        }, () => this.toggleLoading(cb => {

                this.props.requestFriend(suggestion, () => {
                    cb();
                    this.setState({ searchTerm: '' });
                })
            })
        );
    }

    onSuggestionReset = () => {
        this.setState({ suggestions: [] });
    }

    onFriendRequestAccept = (friend) => {
        this.toggleLoading(cb => this.props.acceptFriendRequest(friend, cb));
    }

    onFriendRequestReject = (friend) => {
        this.toggleLoading(cb => this.props.rejectFriendRequest(friend, cb));
    }

    onPendingRequestCancel = (friend) => {
        this.toggleLoading(cb => this.props.cancelPendingRequest(friend, cb));
    }

    onFriendRemove = (friend) => {
        this.toggleLoading(cb => this.props.removeFriend(friend, cb));
    }

    onFriendClick = (uid) => {
        const { history, toggleFriendPanel } = this.props; 

        const next = this.props.user.uid !== uid ? `/friends/${uid}` : '/';
        
        history.push(next);
        toggleFriendPanel();
    }
 
    render() {
        const {
            user,
            showFriendPanel,
            toggleFriendPanel
        } = this.props;

        const className=`friends ${showFriendPanel ? 'show' : ''}`;

        return (
            <div className={className}>
                <div className='buttons'>

                    <div
                        className='home'
                        onClick={() => this.onFriendClick(user.uid)}
                    >
                        <i className='fas fa-home'/> {user.name}
                    </div>

                    <div 
                        className='close'
                        onClick={toggleFriendPanel}
                    >&times;</div>

                </div>

                <div className='inner'>

                    <SpinnerLoader
                        inProp={this.state.loading}
                    />

                    <FriendSearch
                        searchTerm={this.state.searchTerm}
                        onSearchTermChange={this.onSearchTermChange}
                        suggestions={this.state.suggestions}
                        onSuggestionClick={this.onSuggestionClick}
                        onSuggestionReset={this.onSuggestionReset}
                    />

                    <FriendList
                        user={this.props.user}
                        allUsers={this.props.allUsers}
                        onFriendRequestAccept={this.onFriendRequestAccept}
                        onFriendRequestReject={this.onFriendRequestReject}
                        onPendingRequestCancel={this.onPendingRequestCancel}
                        onFriendRemove={this.onFriendRemove}
                        onFriendClick={this.onFriendClick}
                    />
                </div>

            </div>
        );
    }
}
export default connect(null, actions)(Friends);