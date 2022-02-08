const router = require("express").Router();
const User = require("../models/m_user")


//userId is the current user

//update user

//delete user

//get a user

router
    .get("/", async (req, res) => {
        const userId = req.query.userId;
        const username = req.query.username;
        try {
            const user = userId ? await User.findById(req.params.id) : await User.findOne({ username: username })
            // const showData = {
            //     username: user.username,
            // } 
            const { password, updatedAt, ...other } = user._doc
            res.status(200).json(other)
        } catch (err) {
            console.log(err)
        }
    })

    //add connection

    .put("/:id/connect", async (req, res) => {
        if (req.body.userId !== req.params.id) {
            try {
                const user = await User.findById(req.params.id) //to be added user - jacob, rayan
                const currentUser = await User.findById(req.body.userId) // current user - Cardy
                if (!currentUser.connections.includes(req.params.id)) {
                    await currentUser.updateOne({ $push: { connections: req.params.id } })
                    await user.updateOne({ $push: { connections: req.body.userId } })
                    res.status(200).json({message: 'User added'})
                } else {
                    res.status(200).json({message: 'User already exists'})
                }
            } catch (err) {
                res.status(500).json(err)
            }
        } else {
            res.status(403).json('cannnot connect to yourself')
        }

    })


    //delete connection

    .put("/:id/disconnect", async (req, res) => {
        if (req.body.userId !== req.params.id) {
            try {
                const user = await User.findById(req.params.id) //to be deleted user - Cardy
                const currentUser = await User.findById(req.body.userId) // current user - Jacob
                if (currentUser.connections.includes(req.params.id)) {
                    await currentUser.updateOne({ $pull: { connections: req.params.id } })
                    await user.updateOne({ $pull: { connections: req.body.userId } })
                    res.status(200).json('User disconnected') 
                } else {
                    res.status(403).json('Already disconnected')
                }
            } catch (err) {
                res.status(500).json(err)
            }
        } else {
            res.status(403).json('cannnot disconnect to yourself')
        }

    })


    //see connections

    .get("/:id/connections", async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            res.status(203).json(user.connections)
        } catch (err) {
            res.status(500).json(err)
        }
    })

    //get details of a connection
    .get('/viewuser/:id', async (req, res) => {
        try {
            const id = await User.findById(req.params.id)
            res.status(203).json({ user: id })
        } catch (error) {
            res.status(401).json(err)
        }
    })




module.exports = router