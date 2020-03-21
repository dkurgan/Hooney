import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getPost, deleteComment, postCom, deletePost } from "../../actions/posts";
import { getUser } from "../../actions/user";
import Moment from "react-moment";

class Post extends React.Component {
  async componentDidMount() {
    await this.props.getUser();
    console.log("tut")
    await this.props.getPost(this.props.match.params.id);
  }
  postComment = (event, comment_id) => {
    event.preventDefault();
    if (comment_id > 0) {
      this.props.postCom(comment_id, this.state.comment);
    }
    document.getElementById(comment_id).reset();
  };
  delPost = (id) => {
    this.props.deletePost(id);
    setTimeout(()=> window.location = '/', 1000);
  }
  render() {
    const { post, deleteComment, user } = this.props;
    let comments = "";
    if (post.comments) {
      comments = this.props.post.comments.map(comment => {
        return (
          <div key={comment._id} className="ui comments">
            <div className="comment">
              <Link to={`/profile/${post.user}`} className="avatar">
                <img src={"https://hooney.herokuapp.com/" + comment.imageAvatar} />
              </Link>
              <div className="content">
                <Link to={`/profile/${post.user}`} className="author">
                  {comment.name}
                </Link>
                <div className="metadata">
                  <div className="date">
                    <Moment fromNow>{comment.date}</Moment>
                  </div>
                </div>
                <span className="right floated">
                  {user._id === comment.user ? (
                    <i
                      id="closeX"
                      className="close icon"
                      onClick={() => deleteComment(post._id, comment._id)}
                    ></i>
                  ) : (
                    ""
                  )}
                </span>
                <div className="text">{comment.text}</div>
              </div>
            </div>
          </div>
        );
      });
    }
    return (
      this.props.isAuth ?
      (<div key={post._id} className="container" style={{ marginTop: 80 }}>
        <div className="ui centered card width">
          <div className="content">
            <div className="right floated meta">
              <Moment fromNow>{post.date}</Moment>
            </div>
            <div className="right floated">
            {post.user === user._id ? <div className="right floated">
            <i id="closeX" className="close icon"
            onClick={() => this.delPost(post._id)}></i>
            </div> : null}
            </div>
            <img
              alt={post.name}
              className="ui avatar image"
              src={"https://hooney.herokuapp.com/" + post.imageAvatar}
            />{" "}
            {post.name}
          </div>
          <div className="image">
            <img
              alt={post.name}
              src={"https://hooney.herokuapp.com/" + post.imagePost}
            />
          </div>
          <div className="content">
          {comments}
          </div>
          <div className="extra-content">
            <form
              id={post._id}
              className="ui large transparent left icon input"
              onSubmit={event => this.postComment(event, post._id)}
            >
              <input
                type="text"
                placeholder="Add Comment..."
                onChange={e => this.setState({ comment: e.target.value })}
              />
              <i className="comment outline icon"></i>
            </form>
          </div>
        </div>
      </div>) : <div  className="center aligned" style={{marginTop: 150}}>
      <h1>Please authorize to see comments</h1>
    </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    post: state.posts.post,
    user: state.profile.current,
    isAuth: state.user.token
  };
};

export default connect(mapStateToProps, {
  getPost,
  deleteComment,
  getUser,
  postCom,
  deletePost
})(Post);
