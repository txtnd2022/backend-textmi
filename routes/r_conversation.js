const router = require("express").Router();
const Conversation = require("../models/m_conversation")

//userId is the current user

// new conv (** public + private -> solve ... )

router
    .post("/", async(req, res) => {
        try {
            const newConversation = await new Conversation({
                members: [req.body.senderId, req.body.reciverId]
            }).save()
            res.status(200).json(newConversation)
        } catch(err) {
            res.status(500).json(err)
        }
    })

//get a user convo (my chats-ui) 

    .get("/:userId", async(req, res) => {  //Cardy 
        try{
            const getConversation = await Conversation.find({
                members: { $in : [req.params.userId]}
            })
            res.status(200).json(getConversation)
        } catch(err) {
            res.status(500).json(err)
        }
    }) 



module.exports = router