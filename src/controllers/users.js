const { isUser } = require('../middleware/routeGuards');
const { getUsers, getUserById, addFriendship, removeFriendship, acceptFriendship, getFriendships } = require('../services/user');
const { getSearchRegex } = require('../util/helpers');

const router = require('express').Router()

router.get('/', isUser(), async (req, res) => {
    try {
        const users = await getUsers(req.query)
        const friendships = await getFriendships({
            where: {
                ind: {
                    '$in': users.map(u => getPossibleFriendshipIndices(u._id, req.user._id)).flat()
                }
            }
        })

        res.status(200).json(users.map(u => {
            const fr = friendships.find(f => getPossibleFriendshipIndices(u._id, req.user._id).includes(f.ind))
            if (fr) {
                if (fr.isAccepted) u.friends = true
                else if (fr.requested.toString() == u._id.toString()) u.incomingRequest = true
                else u.outgoingRequest = true
            }

            return u
        }))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.get('/friendships', isUser(), async (req, res) => {
    const options = {
        where: req.query.where || {}
    }

    options.where.ind = {
        '$regex': getSearchRegex(req.user._id)
    }

    try {
        let search = req.query.search
        if (search) {
            const [fname, lname] = search.split(' ')

            options.or = [
                {
                    requested: { '$ne': req.user._id },
                    requestedFname: { '$regex': getSearchRegex(fname) },
                    requestedLname: { '$regex': getSearchRegex(fname) }
                },
                {
                    accepted: { '$ne': req.user._id },
                    acceptedFname: { '$regex': getSearchRegex(lname || '') },
                    acceptedLname: { '$regex': getSearchRegex(lname || '') }
                }
            ]
        }

        const friendships = await getFriendships(options).populate('requested').populate('accepted').lean()

        const friends = friendships.map(f => {
            const friend = f.accepted._id == req.user._id ? f.requested : f.accepted

            if (f.isAccepted) friend.friends = true
            else friend.incomingRequest = true

            return friend
        })

        res.status(200).json(friends)
    } catch (error) {
        console.log(error.message);
        res.status(400).json(error.message)
    }
})

router.post('/friendships', isUser(), async (req, res) => {
    try {
        res.status(200).json(await addFriendship(req.user._id, req.body.id))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.put('/friendships', isUser(), async (req, res) => {
    try {
        res.status(200).json(await acceptFriendship(req.user._id, req.body.id))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.delete('/friendships/:id', async (req, res) => {
    try {
        res.status(200).json(await removeFriendship(req.user._id, req.params.id))
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

function getPossibleFriendshipIndices(id1, id2) {
    return [
        `${id1} ${id2}`,
        `${id2} ${id1}`
    ]
}

module.exports = router