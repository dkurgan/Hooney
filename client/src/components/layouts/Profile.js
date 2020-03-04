import React from 'react'
import {connect} from 'react-redux';
import { getCurUserProfile } from '../../actions/profile';

class Profile extends React.Component{
   async componentDidMount(){
       await this.props.getCurUserProfile(this.props.match.params.id);
    }
    render(){
        const {profile} = this.props
        console.log(profile, "stels icona")
        let avatr = ''
        if (profile){
            avatr = <img src={profile.imageAvatar} />
        }
        return(
            <div className="ui centered card" style={{marginTop: 150}}>
                <div className="ui centered card">
                    {avatr}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        profile: state.profile.current
    }
}

export default connect(mapStateToProps, {getCurUserProfile})(Profile)