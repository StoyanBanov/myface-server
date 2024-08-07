const Post = require("../models/Post");
const { getSearchRegex } = require("../util/helpers");

exports.getPosts = async ({ where = {}, orderBy = { createdAt: -1 }, or, search, skip = 0, limit = 10 }) => {
    let query = Post.find()
        .where(where)
        .sort(orderBy)
        .skip(skip)
        .limit(limit)

    if (or) query = query.or(or)

    if (search) query = query.regex('text', getSearchRegex(search))

    return query.populate('user').lean()
}

exports.getPostById = async (id) => Post.findById(id).populate('user').lean()

exports.addPost = (data) => {
    if (!data.text && !data.images?.length)
        throw new Error('Empty post!')

    return Post.create(data)
}

exports.editPostById = (id, data) => {
    if (!data.text && !data.images)
        throw new Error('Empty post!')

    const post = Post.findByIdAndUpdate(id, data, { runValidators: true })

    return post
}


exports.deletePostById = (id) => Post.findByIdAndDelete(id)