const httpsServer = require('https').createServer()
const io = require('socket.io')(httpsServer, {
    cors: {
        origin: 'https://main--textmi-chatui.netlify.app',
        method: [GET, POST]
    }
})

let users = []

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) &&
        users.push({userId, socketId})
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user=> user.userId === userId)
}

io.on('connection', (socket) => {
    console.log('A user connected')
    //after every connection take socket id from user/client
    socket.on('addUsers', userId => {
        addUser(userId, socket.id)
        io.emit('getUsers', users)
    })
    io.emit('Welcome', 'Hello this is socket server')


    //send and get message
    socket.on('sendMessage', ({senderId, recieverId, text}) => {
        const user = getUser(recieverId)
        // console.log(user)
        io.to(user.socketId).emit('getMessage',{
            senderId,
            text
        })
    })




    //disconnet
    socket.on('disconnect', ()=>{
        console.log('A user disconnected')
        removeUser(socket.id)
        io.emit('getUsers', users)
    })

})