const mongoose = require('mongoose');
const Schema = mongoose.Schema();

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String
    },
    likes: [{
        name: {
            type: String
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        text: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        },

    }],
    date: {
        type: Date,
        deafult: Date.now
    }
});

module.exports = Post = mongoose.model('post', PostSchema);