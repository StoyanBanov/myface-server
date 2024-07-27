const { isUser } = require('../middleware/routeGuards');
const { getUsers, getUserById, addFriend, removeFriend, getFriendShips } = require('../services/user');

const router = require('express').Router()

router.get('/', isUser(), async (req, res) => {
    try {
        const users = await getUsers(req.query)
        const friendships = await getFriendShips({
            where: {
                ind: {
                    '$in': users.map(u => [
                        `${u._id} ${req.user_id}`,
                        `${req.user_id} ${u._id}`
                    ])
                }
            }
        })

        res.status(200).json(users.map(u => {
            const fr = friendships.find(f => f.ind == `${u._id} ${req.user_id}` || f.ind == `${req.user_id} ${u._id}`)
            if (fr) {
                if (fr.accepted) u.friends = true
                else if (fr.requested == u._id) u.incomingRequest = true
                else u.outgoingRequest = true
            }

            return u
        }))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.post('/request-friend', isUser(), async (req, res) => {
    try {
        res.status(200).json(await addFriendship(req.user._id, req.body.id))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.post('/accept-friend', isUser(), async (req, res) => {
    try {
        res.status(200).json(await editFriendship(req.user._id, req.body.id))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.delete('/remove-friend/:id', async (req, res) => {
    try {
        res.status(200).json(await removeFriend(req.user._id, req.params.id))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.get('/:id', async (req, res) => {
    try {
        res.status(200).json(await getUserById(req.params.id))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

module.exports = router