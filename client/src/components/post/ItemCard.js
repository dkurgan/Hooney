import React from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom'
import { getPosts, postComment, likeUnlike} from '../../actions/posts';

class ItemCard extends React.Component{
    state = {comment: ''}
    componentDidMount(){
        this.props.getPosts();
    }
    postComment = (event, comment_id) =>{
        event.preventDefault();
        this.props.postComment(comment_id, this.state.comment);
        document.getElementById(comment_id).reset();
    }
    likeDislike =  (event, post_id) =>{
        event.preventDefault();
        this.props.likeUnlike(post_id)
    }
    isAuth(){
        return (
            <input type="text" placeholder="Add Comment..." onChange={(e)=> this.setState({comment: e.target.value})}/>
        )
    }
    isGuest(){
        return(
            <input placeholder="Please authorize" readOnly type="text"></input>
        )
    }
    isYes(id){
        return(
            <Link to={`/post/${id}`}><i className="comment icon"></i></Link>
        )
    }
    isNo(){
        return(
            <i className="comment icon"></i>
        )
    }
    render(){
        let image = this.props.items.sort((a, b)=>{
            if (a.date > b.date) return -1;
            if (a.date < b.date) return 1;
            return 0;
        });
        image = image.map(item => {
            return(
                <div key={item._id} className="ui centered card width">
                    <div className="content">
                        <div className="right floated meta"> <Moment fromNow>{item.date}</Moment></div>
                            <img alt={item.name} className="ui avatar image"src={"http://localhost:4000/" + item.imageAvatar}/> {item.name}
                    </div>
                        <div className="image">
                            <img alt={item.name} src={"http://localhost:4000/" + item.imagePost} />
                    </div>
                    <div className="content">
                        <span className="right floated">
                            <i className="heart outline like icon" onClick={(e)=> this.likeDislike(e, item._id)}></i>
                            {item.likes.length}
                        </span>
                        {this.props.isAuthincated ? this.isYes(item._id) : this.isNo()}
                     {item.comments.length}
                    </div>
                <div className="extra content">
                    <form id={item._id} className="ui large transparent left icon input" onSubmit={(event)=>this.postComment(event, item._id)}>
                    {this.props.isAuthincated ? this.isAuth() : this.isGuest()}
                    <i className="comment outline icon"></i>
                    </form>
                </div>         
                </div>
            )
        });
        return(
            <div className="container" style={{marginTop: 80}}> 
                <div className="centered">
                {image}
                </div> 
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return {
        items: state.posts.posts,
        token: state.user.token,
        isAuthincated: state.user.isAuthincated,
    }
}

export default connect(mapStateToProps, {getPosts, postComment, likeUnlike})(ItemCard)