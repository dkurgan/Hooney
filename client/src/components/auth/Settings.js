import React from "react";
import { connect } from "react-redux";
import { Honey } from '../../img';
import { getUser, deleteUser, updUser } from "../../actions/user";
import { setAlert } from "../../actions/alerts";
import Alert from "../layouts/Alert";


class Settings extends React.Component {
  state = { email: null, passwordNew: null, passwordOld: null, notifications: false };
  async componentDidMount() {
    await this.props.getUser();
    if (this.props.user.notifications === true)
      this.setState({notifications: true})
  }
  handleSubmit = async event => {
    event.preventDefault();
    const { email, passwordNew, passwordOld, notifications } = this.state;
    if (email === null) {
      this.setState({ email: this.props.user.email });
    }
    await this.props.updUser(email, passwordOld, passwordNew, notifications);
  };
  handelCheckBox = () => {
    if (this.state.notifications === false) {
      this.setState({ notifications: true })
    }
    else
      this.setState({notifications: false})
  }
  render() {
    const { deleteUser, token, isAlert } = this.props;
    return (token ?
      (<div className="container" style={{ marginTop: 80 }}>
        <div className="ui one column stackable center aligned page grid">
          <div className="column twelve wide">
            <img alt="hooney_logo" src={Honey} style={{ maxWidth: 80 }} />
            <h1>Settings</h1>
            <div className="row">
              <form className="input-field" onSubmit={this.handleSubmit}>
                <input
                  type="email"
                  placeholder="Email"
                  onChange={e => this.setState({ email: e.target.value })}
                />
                <div style={{ marginTop: -10 }} className="row">
                  <div className="input-field">
                    <input
                      type="password"
                      placeholder="Old Password is required"
                      required
                      onChange={e =>
                        this.setState({ passwordOld: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div style={{ marginTop: -30 }} className="row">
                  <div className="input-field">
                    <input
                      type="password"
                      placeholder="New Password"
                      onChange={e =>
                        this.setState({ passwordNew: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div style={{marginBottom: 20}}  className="ui toggle checkbox">
                  <input type="checkbox" name="public" checked={this.state.notifications} />
                  <label onClick={this.handelCheckBox}>
                    Subscribe to comments update
                    </label>
                </div>
                <br/>
                <button className="ui button">Update</button>
              </form>
              {isAlert ? <Alert /> : null}
              <div>
                <button className="ui button red"
                  onClick={(e) => { deleteUser(token) }}>Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </div >) : (<div><h1 style={{ marginTop: 150 }}>Sorry u cannot acces this page</h1>
        {setTimeout(() => window.location = '/', 5000)}</div>)
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.user.token,
    user: state.profile.current,
    isAlert: state.alert
  };
};

export default connect(mapStateToProps, { getUser, deleteUser, setAlert, updUser })(Settings);
