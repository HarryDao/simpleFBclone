import React from 'react';
import { findDOMNode } from 'react-dom';
import getCaretCoordinates from 'textarea-caret';
import { SpinnerLoader } from '../common';
import { Slide, Fade } from '../../styles/animations';
import PostItem from './PostItem';


const getMatchedFriends = (text, friends) => {
    let matchedFriends = {};

    friends.map(friend => {
        const name = friend.name.toLowerCase();
        const reg = new RegExp(`\@${name}`);

        if (text.match(reg)) {
            text = text.split(`@${name}`).join('');
            matchedFriends[friend.uid] = friend;
        }
    });

    return { matchedFriends, leftoverText: text };
}

const getSuggestionIndex = (text) => {
    const userHint = /\@/g;
    let lastIndex = -1;
    let match = userHint.exec(text);

    while(match != null) {
        lastIndex = match.index;
        match = userHint.exec(text);
    }

    return lastIndex;
}

const getFriendSugestions = (friends, leftoverText) => {
    let suggestions = [];
    const suggestMatches = leftoverText.match(/\@\w+/g);

    if (suggestMatches) {
        let lastMatch = suggestMatches[suggestMatches.length - 1];

        lastMatch = lastMatch.replace('@', '').toLowerCase();
        lastMatch = new RegExp(`^${lastMatch}`);

        suggestions = friends.filter(friend => {
            return friend.name.toLowerCase().match(lastMatch);
        });
    }

    return { suggestions };
}



class PostForm extends React.Component {
    state = {
        loading: false,
        content: '',
        selectionEnd: 1,
        matchedFriends: {},
        suggestions: [],
        suggestBoxCoord: { top: 0, left: 0, displayOnLeft: false },
        activeSuggestion: null,
        formFocus: false,
    }

    componentDidMount() {
        if (this.props.content) {
            this.setState({ content: this.props.content });
            this.postFormRef.focus();
        }
    }

    componentDidUpdate(prevProp, prevState) {
        if (prevState.content != this.state.content) {
            this.updateSuggestionBox();
        }
    }

    processNewContent = () => {
        const { content } = this.state;
        const { friends } = this.props;
        const text = content.toLowerCase();
        
        const {
            matchedFriends,
            leftoverText
        } = getMatchedFriends(text, friends);

        const { suggestions } = getFriendSugestions(friends, leftoverText);

        return { matchedFriends, suggestions };
    }

    updateSuggestionBox = () => {
        const input = findDOMNode(this.postFormRef);
        const { height, width } = input.getBoundingClientRect();
        const { selectionEnd } = this.state;

        const coord = getCaretCoordinates(input, selectionEnd);
        let top = Math.min(coord.top + coord.height, height);
        let left = coord.left + 5;
        let displayOnLeft = left > width/2;

        top = top + 'px';
        left = left + 'px';

        const {
            matchedFriends,
            suggestions,
        } = this.processNewContent();

        this.setState({
            matchedFriends,
            suggestions,
            suggestBoxCoord: { top, left, displayOnLeft },
            activeSuggestion: null,
        });
    }

    onInputChange = (e) => {
        const { value, selectionEnd } = e.target;
        this.setState({ content: value, selectionEnd: selectionEnd });
    }

    onSuggestionClick = ({ name }) => {
        
        let { content } = this.state;
        let suggestionIndex = getSuggestionIndex(content);

        content = content.slice(0, suggestionIndex) + `@${name}`;
        this.setState({ content }, () => {
            this.postFormRef.focus();
        });

    }

    onButtonClick = (e) => {
        e.preventDefault();


        this.setState({ loading: true });
        this.props.onFormSubmit(this.state.content, () => {
            this.setState({
                content: '',
                loading: false
            });
        })
        
    }

    renderSuggestions() {
        const {
            suggestions, 
            activeSuggestion,
            formFocus,
            suggestBoxCoord: { top, left, displayOnLeft },
        } = this.state;

        const suggestionItems = suggestions.map((suggestion, index) => {
            const { name, uid } = suggestion;
            const className= index === activeSuggestion ? 'active' : '';

            return (
                <p
                    key={`suggest-${uid}`}
                    className={className}
                    onMouseEnter={() => this.setState({ activeSuggestion: index })}
                    onClick={() => this.onSuggestionClick(suggestion)}
                >
                    <i className='far fa-user'/> {name}
                </p>
            );
        });

        const displayBox = suggestions.length > 0 && (formFocus || activeSuggestion != null);

        return Fade({ in: displayBox }, style => {

            style = { ...style, top, left };
            const className = `suggestions ${displayOnLeft ? 'left' : ''}`;

            return (
                <div
                    className={className}
                    style={style}
                    onMouseLeave={() => this.setState({ activeSuggestion: null })}
                >
                    <div className='inner'>
                        {suggestionItems}
                    </div>
                </div>
            );
        });
    }

    renderPreview() {
        const { content, loading } = this.state;
        const { user, allUsers } = this.props;

        return Slide({ in: !loading && user && content }, style => {
            return (
                <div className='preview' style={style}>
                    <PostItem
                        preview
                        post={{
                            content: content,
                            authorName: user ? user.name : '',
                        }}
                        allUsers={allUsers}
                    />
                </div>
            );
        }, { duration: 100 });
    }

    render() {
        const {
            content,
            matchedFriends,
            suggestions,
        } = this.state;

        const { edit } = this.props;

        return (
            <div className='post-form'>
                
                <SpinnerLoader inProp={this.state.loading} />

                <form>
                    <div className='input'>
                        <textarea
                            ref = {f => this.postFormRef = f}
                            type='text'
                            value={this.state.content}
                            placeholder={edit ? '' : `What's on your mind? (use "@" before friends' name)`}
                            onChange={this.onInputChange}
                            onFocus={() => this.setState({ formFocus: true })}
                            onBlur={() => this.setState({ formFocus: false })}
                        />
                        {this.renderSuggestions()}
                    </div>
                    <button
                        onClick={this.onButtonClick}
                    >{edit ? 'Save' : 'Post'}</button>
                </form>

                {this.renderPreview()}
            </div>
        );
    }
}

export default PostForm;