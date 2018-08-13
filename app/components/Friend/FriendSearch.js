import React from 'react';
import { findDOMNode } from 'react-dom';
import { Slide } from '../../styles/animations';


class FriendSearch extends React.Component {
    state = { focus: false }

    onItemClick = (suggestion) => {
        this.props.onSuggestionClick(suggestion);
    }

    renderListItem(suggestion) {
        const { uid, name } = suggestion;

        return (
            <button
                key={`suggest-${uid}`}
                onClick={() => this.onItemClick(suggestion)}
            >
                <i className='far fa-comment-dots'/> {name}
            </button>
            
        );
    }

    onSearchFocus = () => {
        document.addEventListener('click', this.handleClick);
    }

    handleClick = (e) => {
        const input = findDOMNode(this.inputDiv);
        const suggest = findDOMNode(this.suggestDiv);
        const focus = input.contains(e.target) || suggest.contains(e.target);

        this.setState({ focus });

        if (!focus) {
            document.removeEventListener('click', this.handleClick);
        }
    }

    renderList() {
        const { focus } = this.state;
        const suggestions = this.props.suggestions.map(s => {
            return this.renderListItem(s);
        });

        return Slide({ in: focus && suggestions.length > 0 }, style => {
            return (
                <div className='list' style={style}>
                    {suggestions}
                </div>
            );
        });
    }

    render() {
        const {
            searchTerm,
            onSearchTermChange,
        } = this.props;

        return (
            <div
                className='friend-finder'
                onFocus={this.onSearchFocus}
            >
                <form>
                    <div className='input-group'
                    >
                        <i className='fas fa-search'></i>
                        <input
                            type='text'
                            placeholder='find new friend ...'
                            value={searchTerm}
                            onChange={onSearchTermChange}
                            onClick={onSearchTermChange}
                            ref={n => this.inputDiv = n}
                        />
                    </div>
    
                    <div className='suggestions'
                        ref={n => this.suggestDiv = n}
                    >
                        {this.renderList()}
                    </div>
                </form>
            </div>    
        );
    }
}

export default FriendSearch;