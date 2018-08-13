import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';


class Messages extends React.Component {
    state = {
        message: null,
    }

    componentDidMount() {

    }

    shouldComponentUpdate(nextProps) {
        this.loadNextMessage(nextProps);
        return true;
    }

    loadNextMessage = (props) => {
        const ids = Object.keys(props.messages);
        const id = ids.length > 0 ? Math.min(...ids) : null;
        const newMessage = id ? props.messages[id] : null;

        if (newMessage && 
            this.state.message && 
            newMessage.id === this.state.message.id) {
            return;
        }

        if (newMessage === this.state.message) {
            return;
        }

        this.setState({
            message: newMessage
        }, () => {
            setTimeout(() => {
                this.setState({ message: null }, () => {
                    this.props.removeMessage(newMessage);
                });
            }, ids.length > 1 ? 2000 : 4000);
        })

    }

    render() {
        const { message } = this.state;
        const { content, type } = message || { content: '', type: ''};
        const className=`messages-panel ${message ? 'active' : ''}`;


        return (
            <div className={className}>
                <div className={`inner ${type}`}>
                    { content }
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ messages }) => {
    return { messages };
}

export default connect(mapStateToProps, actions)(Messages);