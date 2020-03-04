import React from 'react';
import { connect } from 'react-redux';

import logo from '../../honey.png';
import api from '../../api';
import { registerUser } from '../../actions/user'


class Register extends React.Component {
    state = { password: null, email: null, name: null }
    //Register user and set token
    handleSubmit = async (event) => {
        event.preventDefault(); //do no refresh on enter
        const res = await api.post('/users', {
            password: this.state.password,
            email: this.state.email,
            name: this.state.name
        });
        this.props.registerUser(res.data.token);
    }
    render() {
        return (
            <div className="container" style={{ marginTop: 150 }}>
                <div className="ui one column stackable center aligned page grid">
                    <div className="column twelve wide">
                        <img alt="hooney_logo" src={logo} style={{ maxWidth: 80 }} />
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
                                        <input type="password" placeholder="Password"
                                            onChange={(e) => this.setState({ password: e.target.value })} />
                                    </div>
                                </div>
                                <button className='ui button' >Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { token: state.user.token }
}

export default connect(mapStateToProps, { registerUser })(Register)