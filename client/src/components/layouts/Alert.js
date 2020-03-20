import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) => {
    let alertArray = Array();
    console.log(alerts)
    if (alerts != null && alerts.length > 0) {
       return(
           <div key={alerts[0].id} style={{color: "white"}}className={`ui ${alerts[0].alertType} message`}>
                {alerts[0].msg}
           </div>)
    }
    return <div></div>
}

Alert.propTypes = {
   alerts: PropTypes.array.isRequired 
}

const mapStateToProps = state => ({
    alerts: state.alert
})

export default connect(mapStateToProps)(Alert);