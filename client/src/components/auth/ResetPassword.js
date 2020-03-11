import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../honey.png";
import { resetPassword } from "../../actions/user";

class ResetPassword extends React.Component {
  state = { email: null };
  handleSubmit = async e => {
    e.preventDefault();
    await this.props.resetPassword(this.state.email);
  };
  render() {
    return (
      <div className="container" style={{ marginTop: 150 }}>
        <div className="ui one column stackable center aligned page grid">
          <div className="column twelve wide">
            <img alt="hooney_logo" src={logo} style={{ maxWidth: 80 }} />
            <h3>Remeber what's your email and we will help you!</h3>
            <div className="row">
              <form className="input-field" onSubmit={this.handleSubmit}>
                <input
                  type="email"
                  placeholder="Type Email here"
                  onChange={e => this.setState({ email: e.target.value })}
                  required
                />
                <button className="ui button">Reset</button>
              </form>
            </div>
          </div>
          <div>
            <p>
              Dont have account? <Link to="register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.token
  };
};

export default connect(mapStateToProps, { resetPassword })(ResetPassword);
