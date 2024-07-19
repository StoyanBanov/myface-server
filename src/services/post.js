const Post = require("../models/Post");
const User = require("../models/User");
const { getSearchRegex } = require("./util");

exports.getPosts = async (userId, { search = '', skip = 10, limit = 10 }) => {
    const user = await User.findById(userId)

    let query = Post.find().where('visibility', 'friends').in('user', user.friends).or('visibility', 'all').skip(skip).limit(limit)

    if (search) query = query.regex('text', getSearchRegex(search))

    return query
}

exports.getPostById = async (id) => {
    const post = await Post.findById(id)

    if (!post)
        throw new Error('No such post')

    return post
}

exports.addPost = (userId, data) => Post.create({ ...data, user: userId })