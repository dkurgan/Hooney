import React from "react";
import { connect } from 'react-redux';
import { stickersArray } from './../../img';

class StickerBar extends React.Component {
  selectedSticker = (id, path) => {
    this.props.selectedSticker(id, path);
  }
  render() {
    const sticker = stickersArray.map((sticker, index) => {
       return (<div key={index} className="item">
         <img alt={sticker} className="stickers" onClick={()=>this.selectedSticker(index, sticker)} src={sticker} />
        </div>)
    })
    return (
      <div className="ui center aligned grid" style={{ marginTop: 20 }}>
        <div id="contentContainer">
          <div style={{zIndex: 1}}className="ui large horizontal divided list">
            {sticker}
            </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    slctdSticker: state.stickers
  }
}

export default connect(mapStateToProps)(StickerBar);
