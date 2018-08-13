import React from 'react';
import { connect } from 'react-redux';
import { SpinnerLoader } from './common';

export default (TargetComponent) => {
    class AuthenticatedComponent extends React.Component {
        componentDidMount() {
            this.checkAuthentication(this.props);
        }

        shouldComponentUpdate(nextProps) {
            if (!this.checkAuthentication(nextProps)) {
                return false;
            };

            return true;
        }

        checkAuthentication = (props) => {
            const { user, loading, initialized } = props;

            if (initialized && !loading && !user) {

                this.props.history.push('/login', {
                    next: this.props.location.pathname
                });

                return false;
            }

            return true;
        }

        render() {
            const { initialized, loading, user } = this.props;
            const initializing = !initialized || loading || !user;

            if (initializing) {
                return(
                    <div className='initializing'>
                        <SpinnerLoader
                            inProp={initializing}
                            customStyle={{backgroundColor: 'transparent'}}    
                        />
                    </div>
                );
            }

            return (
                <TargetComponent {...this.props} />
            );
        }
    }

    const mapStateToProps = ({ auth }) => {
        const { user, loading, initialized } = auth;
        return { user, loading, initialized };
    }

    return connect(mapStateToProps)(AuthenticatedComponent);
}