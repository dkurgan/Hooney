import React from 'react';
import {connect} from 'react-redux';
import { checkVerify } from '../../actions/user';

class Verify extends React.Component{
    async componentDidMount(){
        await this.props.checkVerify(this.props.match.params.token);
        setTimeout(()=> {window.location='/'}, 3000);
    }
    render(){
        return(
            <div style={{marginTop: 150}}>
                <div className="ui center aligned grid" > 
                <h1>You account have been verityfied</h1>
                </div>
                </div>
        )
    }
}

const mapStateToProps = state =>{
    return {
        user: state.user.token
    }
}

export default connect(mapStateToProps, {checkVerify})(Verify)