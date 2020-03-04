import React from 'react';
import {Link} from 'react-router-dom';

class Choose extends React.Component{
    render(){
        return(
            <div className="center aligned chooseCard" style={{marginTop: 150}}>
            <div className="ui massive horizontal divided list" >
                <div className="item">
                   <Link to='/loadphoto'><h1>Upload Photo</h1></Link>
                </div>
                <div className="item">
                 <Link to='/campage'><h1>Take Photo</h1></Link>
                </div>
            </div>
            </div>
        )
    }
}

export default Choose