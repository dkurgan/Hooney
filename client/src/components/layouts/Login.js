import React from 'react';
import { connect } from 'react-redux';

import api from '../../api';
import '../../style.css';
import  logo from '../../honey.png';
import { loginUser}from '../../actions/user';

class Login extends React.Component{    
    state = {email: null, password: null};
//Auth user and save token to local storage
    handleSubmit = async(event) =>{
        event.preventDefault();
        const res = await api.post('/auth', {
            password: this.state.password,
            email: this.state.email
        });
        this.props.loginUser(res.data.token);
        window.location = '/';
      }
    render(){
        return(
            <div className="container" style={{marginTop: 150}}>
            <div className="ui one column stackable center aligned page grid">
            <div className="column twelve wide">
                <img alt="hooney_logo" src={logo} style={{maxWidth:80}}/>
                <div className="row">
                <form className="input-field" onSubmit={this.handleSubmit}>
                        <input type="email"  placeholder="Email" onChange={(e)=> this.setState({email: e.target.value})}/>
                    <div className="row">
                        <div className="input-field">
                            <input type="password" placeholder="Password" onChange={(e)=> this.setState({password: e.target.value})}/>
                        </div>
                    </div>
                <button className='ui button' >Log in</button>
            </form>
          </div>
          </div>
          </div>
          </div>
        )
    }
}

const mapStateToProps = state =>{
    return {token: state.token}
}
export default connect(mapStateToProps, {loginUser})(Login)