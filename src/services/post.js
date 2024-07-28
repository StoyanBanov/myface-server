const Post = require("../models/Post");
const User = require("../models/User");
const { getSearchRegex } = require("../util/helpers");

exports.getPosts = async (userId, { search, skip = 10, limit = 10 }) => {
    const user = await User.findById(userId)

    let query = Post.find().in('user', user.friends).or([{ visibility: 'friends', user: { '$in': user.friends } }, { status: 'emergency' }]).skip(skip).limit(limit)

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