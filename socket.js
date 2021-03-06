const io = require('socket.io')(8900, {
    cors: {
        origin: 'http://localhost:3000',
    }
})

let users = []

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) &&
        users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    console.log(userId)
    return users.find(user => user.userId === userId)
}

io.on('connection', (socket) => {
    console.log('A user connected')
    //after every connection take socket id from user/client
    socket.on('addUsers', userId => {
        addUser(userId, socket.id)
        io.emit('getUsers', users)
    })
    // console.log(users)
    io.emit('Welcome', 'Hello this is socket server')

    //send and get message
    socket.on('sendMessage', ({ senderId, recieverId, text }) => {
        // console.log(senderId, recieverId, text)
        const user = getUser(recieverId)
        // console.log(user)
        if (user) {
            io.to(user.socketId).emit('getMessage', {
                senderId,
                text
            })
        }
    })




    //disconnet
    socket.on('disconnect', () => {
        console.log('A user disconnected')
        removeUser(socket.id)
        io.emit('getUsers', users)
    })

})