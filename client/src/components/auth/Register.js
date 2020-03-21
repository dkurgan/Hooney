import React from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom'
import {Honey} from '../../img';
import { regUser } from '../../actions/user'
import Alert from '../layouts/Alert';

class Register extends React.Component {
    state = { password: null, email: null, name: null }
    //Register user and set token
    handleSubmit = async (event) => {
        event.preventDefault(); //do no refresh on enter
        await this.props.regUser(
            this.state.email,
            this.state.name,
            this.state.password);
        if (this.props.alert.length < 1) {
            window.location = '/';
        }
    }
    render() {
        return (
            <div className="container" style={{ marginTop: 150 }}>
                <div className="ui one column stackable center aligned page grid">
                    <div className="column twelve wide">
                        <img alt="hooney_logo" src={Honey} style={{ maxWidth: 80 }} />
                        <div className="row">
                            <form onSubmit={this.handleSubmit}>
                                <div className="input-field">
                                    <input type="email" className="validation" placeholder="Email"
                                        onChange={(e) => this.setState({ email: e.target.value })} />
                                </div>
                                <div className="row">
                                    <div className="input-field">
                                        <input type="text" placeholder="Name"
                                            onChange={(e) => this.setState({ name: e.target.value })} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field">
                                        <input type="password" placeholder="Password min 6 symbols"
                                            onChange={(e) => this.setState({ password: e.target.value })} />
                                    </div>
                                </div>
                                <button className='ui button' >Register</button>
                            </form>
                            {alert ? <Alert /> : null}
                        </div>
                    </div>
                    <div>
                        <p>Already have account? <Link to='login'>Sign In</Link></p>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.user.token,
        alert: state.alert
    }
}

export default connect(mapStateToProps, { regUser })(Register)