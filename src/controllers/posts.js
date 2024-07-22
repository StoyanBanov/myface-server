const { isUser } = require('../middleware/routeGuards');
const { getPostById, addPost, getPosts } = require('../services/post');
const router = require('express').Router()

router.get('/', isUser(), async (req, res) => {
    try {
        res.status(200).json(await getPosts(req.user._id, req.query))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.get('/:id', async (req, res) => {
    try {
        res.status(200).json(await getPostById(req.params.id))
    } catch (error) {
        console.log(error);
        res.status(404).json(error.message)
    }
})

router.post('/:id', isUser(), async (req, res) => {
    try {
        res.status(200).json(await addPost(req.params.id))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.put('/:id', isUser(), (req, res) => {

})

router.delete('/posts/:id', isUser(), (req, res) => {

})

module.exports = router