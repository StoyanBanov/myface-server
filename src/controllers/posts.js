const { isUser } = require('../middleware/routeGuards');
const { getPostById, addPost, getPosts } = require('../services/post');
const { getFriendships } = require('../services/user');
const { getSearchRegex, getPossibleFriendshipIndices } = require('../util/helpers');
const router = require('express').Router()

router.get('/', isUser(), async (req, res) => {
    try {
        const friends = (await getFriendships({ where: { ind: getSearchRegex(req.user._id) } }))
            .map(f => f.accepted == req.user._id ? f.requested : f.accepted)

        const posts = await getPosts({
            ...req.query,
            or: [
                { visibility: 'friends', user: { '$in': friends } }
                , { visibility: 'all', user: { '$ne': req.user._id } }
            ]
        })

        res.status(200).json(posts)
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.get('/own', isUser(), async (req, res) => {
    try {
        const posts = await getPosts({
            ...req.query,
            where: {
                user: req.user._id
            }
        })

        res.status(200).json(posts)
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

        if (post.visibility == 'all' || post.user._id == req.user._id)
            isUserAuthorized = true

        if (post.visibility == 'friends') {
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
            res.status(200).json(post)
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

router.put('/:id', isUser(), (req, res) => {

})

router.delete('/posts/:id', isUser(), (req, res) => {

})

module.exports = router