import React from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';

import '../../style.css';
import {Honey} from '../../img';
import { loginUser, authUser}from '../../actions/user';
import Alert from '../layouts/Alert';

class Login extends React.Component{    
    state = {email: null, password: null};
//Auth user and save token to local storage
    handleSubmit = async(event) =>{
        event.preventDefault();
        await this.props.authUser(this.state.email, this.state.password);
        if (this.props.alert.length < 1){
            window.location = '/'
        }
      }
    render() {
        const { alert } = this.props
        return(
            <div className="container" style={{marginTop: 150}}>
            <div className="ui one column stackable center aligned page grid">
            <div className="column twelve wide">
                <img alt="hooney_logo" src={Honey} style={{maxWidth:80}}/>
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
                            {alert ? <Alert /> : null}
                        </div>
                    </div>
          </div>
          <div className="ui center aligned grid links">
              <Link to='register'>Register</Link>
              <Link to="resetpassword">Reset Password</Link>
          </div>
          </div>
        )
    }
}

const mapStateToProps = state =>{
    return {
        token: state.token,
        alert: state.alert
    }
}
export default connect(mapStateToProps, {loginUser, authUser})(Login)