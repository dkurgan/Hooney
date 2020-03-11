import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logOut, loginUser } from '../actions/user'

class NavBar extends React.Component{
    // isAuthinicated
 userAuthinated = () => {
    return(
    <ul>
      <li><Link to="/campage">Add Post</Link></li>
      <li><Link to={`/settings`}>Settings</Link></li>
      <li><Link to="/" onClick={async()=> await this.props.logOut()}>Logout</Link></li>
    </ul>
  )
    }
 isGuest = () =>{
    return(
      <ul>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    )
  }
  render(){
    const token = localStorage.getItem('Token');
    if (token){
      this.props.loginUser(token);
    }
      return(
          <nav className="navbar bg-dark nav">
        <h1>
          <Link to="/"> Hooney</Link>
        </h1>
        { this.props.token ? this.userAuthinated() : this.isGuest()}
        </nav>
      )
  }
}

const mapStateToProps = state => {
  return {
    token: state.user.token,
  }
}
export default connect(mapStateToProps, {logOut, loginUser})(NavBar)