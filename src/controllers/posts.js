const { isUser } = require('../middleware/routeGuards');
const { addLike, getLikes, deleteLike, getLikeById, deleteLikes } = require('../services/like');
const { getPostById, addPost, getPosts, editPostById, deletePostById } = require('../services/post');
const { getFriendships } = require('../services/user');
const { deleteFIleById } = require('../util/fileManagement');
const { getSearchRegex, getPossibleFriendshipIndices } = require('../util/helpers');
const router = require('express').Router()

router.post('/likes', async (req, res) => {
    try {
        const { post } = req.body
        const userId = req.user._id

        const existingPost = await getPostById(post)

        if (!existingPost)
            throw new Error('No such post!')

        if (existingPost.user._id == userId)
            throw new Error('Can\'t like own post!')

        const [existingLike] = await getLikes({ where: { post, user: userId } })
        if (existingLike)
            throw new Error('Already liked this post!')

        res.status(200).json(await addLike({ post, user: userId }))
    } catch (error) {
        console.log(error);

        res.status(400).json(error.message)
    }
})

router.delete('/likes/:postId', isUser(), async (req, res) => {
    try {
        const { postId } = req.params

        const post = await getPostById(postId)

        if (!post)
            throw new Error('No such post!')

        const [like] = await getLikes({ where: { post: postId, user: req.user._id } })

        if (!like)
            throw new Error('No such like!')

        await deleteLike(like._id)

        res.status(204).end()
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.get('/', isUser(), async (req, res) => {
    try {
        const userId = req.user._id

        const friends = (await getFriendships({ where: { ind: getSearchRegex(userId) } }))
            .map(f => f.accepted == userId ? f.requested : f.accepted)

        const posts = await getPosts({
            ...req.query,
            or: [
                { visibility: 'friends', user: { '$in': friends } }
                , { visibility: 'all', user: { '$ne': userId } }
            ]
        })

        res.status(200).json(await appendLikes(posts, userId))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.get('/own', isUser(), async (req, res) => {
    try {
        const userId = req.user._id

        const posts = await getPosts({
            ...req.query,
            where: {
                user: userId
            }
        })

        res.status(200).json(await appendLikes(posts))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const post = await getPostById(req.params.id)

        if (!post) throw new Error('No such post!')

        let isUserAuthorized = false

        if (post.visibility == 'all' || post.user._id == req.user?._id)
            isUserAuthorized = true

        if (post.visibility == 'friends' && req.user) {
            const friends = await getFriendships({
                where: {
                    ind: {
                        '$in': getPossibleFriendshipIndices(post.user._id, req.user._id)
                    }
                }
            })

            if (friends.length)
                isUserAuthorized = true
        }

        if (isUserAuthorized)
            res.status(200).json(await appendLikes(post, req.user._id))
        else
            res.status(403).json('Not authorized to view this post!')

    } catch (error) {
        console.log(error);
        res.status(404).json(error.message)
    }
})

router.post('/', isUser(), async (req, res) => {
    try {
        res.status(200).json(await addPost({ ...req.body, user: req.user._id, }))
    } catch (error) {
        console.log(error);

        await Promise.all(req.body.images.map(id => deleteFIleById(id)))

        res.status(400).json(error.message)
    }
})


router.put('/:id', isUser(), async (req, res) => {
    try {
        const { id } = req.params

        const post = await getPostById(id)
        if (post.user._id != req.user._id)
            throw new Error('Not the owner of the post!')

        if (req.body.removedImages)
            await Promise.all(req.body.removedImages.map(id => deleteFIleById(id)))

        res.status(200).json(await editPostById(id, req.body))
    } catch (error) {
        console.log(error);

        await Promise.all(req.body.images.map(id => deleteFIleById(id)))

        res.status(400).json(error.message)
    }
})

router.delete('/:id', isUser(), async (req, res) => {
    try {
        const postId = req.params.id

        const post = await getPostById(postId)

        if (post.user._id != req.user._id)
            throw new Error('Post not yours!')

        await deletePostById(postId)

        await deleteLikes({ where: { post: postId } })

        await Promise.all(post.images.map(id => deleteFIleById(id)))

        res.status(204).end()
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

module.exports = router


async function appendLikes(posts, user) {
    if (Array.isArray(posts)) {
        for (const post of posts) {
            await append(post)
        }
    } else {
        await append(posts)
    }

    return posts

    async function append(post) {
        post.likesCount = await getLikes({ where: { post }, count: true })
        post.isLiked = (await getLikes({ where: { post, user } })).length > 0
    }
}