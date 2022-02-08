const router = require("express").Router();
const Message = require("../models/m_message")

//userId is the current user

//add

router
    .post("/", async (req, res) => {
        try {
            const newMessage = await new Message(req.body).save()
            res.status(200).json({newMessage: newMessage, status: 'SUCCESS'})
        } catch (err) {
            res.status(200).json({newMessage: null, status: 'FAILED'})
        }

    })
    
    //get
     
    .get("/:conversationId", async (req, res) => {
        try {
            const messages = await Message.find({
                conversationId: req.params.conversationId,
            })
            res.status(200).json({messages: messages, status: 'SUCCESS'})
        } catch (err) {
            res.status(401).json({messages: null, status: 'FAILED'})
        }
    })


module.exports = router