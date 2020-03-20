import React from 'react';
import { connect } from 'react-redux';
import {createPost} from '../../actions/posts';

class Canvas extends React.Component{
    state = { flyingSticker: null, placedSticker: null, image: null}
    componentDidMount() {
        this.canvas = this.refs.canvas;
		this.ctx = this.canvas.getContext("2d");
        const background = this.refs.background;
        this.canvas.addEventListener('click', this.handelMouseClick);
        this.canvas.addEventListener('dblclick', this.handelDoubleClick);
        background.onload = () => {
			this.fitToContainer(background.height, background.width);
			this.ctx.drawImage(background, 0, 0, background.width, background.height);
        }
    }
    componentDidUpdate() {
        this.redraw()
    }
    fitToContainer(height, width) {
		this.canvas.width=width;
		this.canvas.height=height;
    }
    getMousePos(e) {
		const rect = this.canvas.getBoundingClientRect();
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;
		return {x, y}
	}
    handelMouseMove = e => {
        const { stickerArray } = this.props;
        const { flyingSticker } = this.state;
        //check for empty array
        if (stickerArray[flyingSticker] === undefined)
            return;
        else {
        stickerArray[flyingSticker].pos = this.getMousePos(e);
        this.unmountSticker();
        this.redraw()}
    }
    handelMouseClick = e => {
        const counter = this.props.stickerArray.length;
        this.setState({ flyingSticker: (counter - 1) });
        const {flyingSticker, placedSticker} = this.state
        //check if sticker already placed
        if ((flyingSticker + 1) === placedSticker)
            return;
        else {
            this.canvas.addEventListener('mousemove', this.handelMouseMove);
        }
    }
    handelDoubleClick = e => {
        this.canvas.removeEventListener('mousemove', this.handelMouseMove);
        this.setState({placedSticker: this.props.stickerArray.length})
        const background = this.refs.background;
        const dataURL = this.canvas.toDataURL()
        background.src = dataURL
        this.ctx.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
    }
    unmountSticker() {
        const background = this.refs.background;
        this.ctx.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
    }
    sendPost() {
        const dataURL = this.canvas.toDataURL()
        this.props.createPost(dataURL);
        setTimeout(() => window.location = '/', 200);
    }
    redraw() {
        const {stickerArray} = this.props;
		for (let i = 0; i< stickerArray.length; i++) {
				stickerArray[i].image =  new Image();
				stickerArray[i].image.src=stickerArray[i].path;
				stickerArray[i].image.onload = () => {
                    this.ctx.drawImage(stickerArray[i].image, stickerArray[i].pos.x - 50,
                    stickerArray[i].pos.y - 50, 100, 100);
				}
        }
	}
    render() {
        return (
            <div >
                <canvas style={{zIndex: 3, marginTop: 15}}ref="canvas" width={640} heigth={480} />
                <img ref="background" src={this.props.image} style={{ display: 'none' }} />
                <img ref="load" src={this.state.image} style={{ display: 'none' }} />
                <div className='content'>
                    <button className="btn" onClick={() => this.sendPost()}>Post</button>
                    <button className="btn" onClick={this.props.cleanCanvas}>Delete</button>
            </div>
            </div>
        )
    }
}

export default connect(null,{createPost})(Canvas)