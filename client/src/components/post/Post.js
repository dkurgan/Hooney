import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getPost, deleteComment, postCom } from "../../actions/posts";
import { getUser } from "../../actions/user";
import Moment from "react-moment";

class Post extends React.Component {
  async componentDidMount() {
    await this.props.getUser();
    await this.props.getPost(this.props.match.params.id);
  }
  postComment = (event, comment_id) =>{
    event.preventDefault();
    this.props.postCom(comment_id, this.state.comment);
    document.getElementById(comment_id).reset();
}
  isAuth() {
    return (
      <input
        type="text"
        placeholder="Add Comment..."
        onChange={e => this.setState({ comment: e.target.value })}
      />
    );
  }
  isGuest() {
    return <input placeholder="Please authorize" readOnly type="text"></input>;
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
                <img src={"http://localhost:4000/" + comment.imageAvatar} />
              </Link>
              <div className="content">
                <Link to={`/profile/${post.user}`} className="author">
                  {comment.name}
                </Link>
                <div className="metadata">
                  <div className="date"><Moment fromNow>{comment.date}</Moment></div>
                </div>
                <span className="right floated">
                  {user.user._id === comment.user ? (
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
      <div key={post._id} className="container" style={{ marginTop: 80 }}>
        <div className="ui centered card width">
          <div className="content">
            <div className="right floated meta"><Moment fromNow>{post.date}</Moment></div>
            <img
              alt={post.name}
              className="ui avatar image"
              src={"http://localhost:4000/" + post.imageAvatar}
            />{" "}
            {post.name}
          </div>
          <div className="image">
            <img
              alt={post.name}
              src={"http://localhost:4000/" + post.imagePost}
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
              {this.props.isAuthincated ? this.isAuth() : this.isGuest()}
              <i className="comment outline icon"></i>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    post: state.posts.post,
    user: state.profile.current,
    isAuthincated: state.user.token
  };
};

export default connect(mapStateToProps, { getPost, deleteComment, getUser, postCom })(Post);
