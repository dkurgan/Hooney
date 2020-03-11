import React from "react";
import Webcam from "react-webcam";
import {connect} from 'react-redux';
import {createPost} from '../../actions/posts';
import StickerBar from './StickerBar'

class Choose extends React.Component {
  state = { imageData: null, fileInput:  React.createRef() };
  setRef = webcam => {
    this.webcam = webcam;
  };
  capturePhoto = async () => {
    this.setState({ imageData: await this.webcam.getScreenshot()});
    console.log(this.state.imageData);
  };
  waitCapture = () =>{
    setTimeout(async()=> this.setState({ imageData: await this.webcam.getScreenshot()}), 3000);
  }
  deletePhoto = () => {
    this.setState({ imageData: null });
  };
  render() {
    const videoConstraints = {
      width: 640,
      heigth: 480,
      facingMode: "user"
    };
    return (
      this.props.isAuth ?
      (<div style={{ marginTop: 100 }}>
        {this.state.imageData ? (
          <div className="ui center aligned grid ">
            <div className="sixteen wide column">
              <img src={this.state.imageData} />
            </div>
            <div className="content">
              <button className="btn" onClick={() => {this.props.createPost(this.state.imageData);
              window.location ='/'}} >Post</button>
              <button className="btn" onClick={this.deletePhoto}>Delete</button>
            </div>
          </div>
        ) : (
          <div className="ui center aligned grid ">
            <div className="sixteen wide column">
              <Webcam
                ref={this.setRef}
                audio={false}
                screenshotFormat={"image/jpeg"}
                videoConstraints={videoConstraints}
              />
            </div>
            <button className="photoBtn" onClick={this.capturePhoto}>
              <i className="huge camera icon"></i>
            </button>
          </div>
        )}
        <StickerBar/>
      </div>
    ) : <div  className="center aligned" style={{marginTop: 150}}>
      <h1>Please authorize to use camera</h1>
    </div>
    )
  }
}

const mapStateToProps = state =>{
    return {
        isAuth: state.user.token
    }
}

export default connect(mapStateToProps,{createPost})(Choose)
