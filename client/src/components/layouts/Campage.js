import React from "react";
import Webcam from "react-webcam";
import {connect} from 'react-redux';
import StickerBar from './StickerBar'
import Canvas from "./Canvas";
let stickerArr = [];

class Choose extends React.Component {
  state = { imageData: null, fileInput: React.createRef(), stickers: [] };
  setRef = webcam => {
    this.webcam = webcam;
  };
  capturePhoto = async () => {
    this.setState({ imageData: await this.webcam.getScreenshot() });
  };
  waitCapture = () => {
    setTimeout(async () => this.setState({ imageData: await this.webcam.getScreenshot() }), 3000);
  }
  deletePhoto = () => {
    this.setState({ imageData: null, stickers: [] });
  };
  updateSticker = (id, path) => {
    if (this.imageData === undefined)
    this.setState({stickers: [...this.state.stickers, {id, path, pos:{x: 0, y:0}}]});
  }
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
          <div className="ui center aligned grid">
              <Canvas updCanvas={this.updateCanvas} cleanCanvas={this.deletePhoto}
              stickerArray={this.state.stickers} image={this.state.imageData} />
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
        <StickerBar selectedSticker={this.updateSticker}/>
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

export default connect(mapStateToProps)(Choose)
