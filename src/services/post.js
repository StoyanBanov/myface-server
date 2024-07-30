const Post = require("../models/Post");
const User = require("../models/User");
const { getSearchRegex } = require("../util/helpers");

exports.getPosts = async ({ where = {}, or, search, skip = 0, limit = 10 }) => {
    let query = Post.find()
        .where(where)
        .skip(skip).limit(limit)

    if (or) query = query.or(or)

    if (search) query = query.regex('text', getSearchRegex(search))

    return query.populate('user')
}

exports.getPostById = async (id) => Post.findById(id).populate('user')

exports.addPost = (data) => {
    if (!data.text && !data.images)
        throw new Error('Empty post!')

    return Post.create(data)
}