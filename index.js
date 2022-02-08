const express = require("express")
const app = express();
const PORT = 8080
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const passport = require('passport')
var cookieSession = require('cookie-session')
var session = require('express-session')
require('./google-oauth')
require('./socket')
// const cors = require('./cors')
const cors = require('cors')

dotenv.config({ path: './config.env' })

//db connection
require('./db/connection')

//cors setting
const whiteList = ['http://localhost:3000']
app.use(cors({
    origin: true,
    credentials: true,
}))
 

//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(session({
    // resave: true,
    // saveUninitialized: true,
    secret: 'cats'
}))
app.use(passport.initialize())
app.use(passport.session())

// app.use(cookieSession({
//     name: 'test-session',
//     keys: ['key1', 'key2']
// }))




//test route
app.get("/", (req, res) => {
    res.send("<a href='/auth/google'> Authenticate s </a>")
})

app.get('/failed', async (req, res) => {
    res.status(404).json({ '404': 'Failed' })
})

app.get('/success', async (req, res) => {
    res.status(200).json({ '200': `Welcome ${req.user.email}` })
})

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)
app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/falied' }),
            function (req, res) {
                res.redirect('/success');
})

//using routes
const userRouter = require('./routes/r_users')
const authRouter = require('./routes/r_auth')
const conversationRouter = require('./routes/r_conversation')
const messageRouter = require('./routes/r_message')


//api/ --> end points url
app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/conversations", conversationRouter)
app.use("/api/messages", messageRouter)

app.listen(PORT, () => {
    console.log("Backend Ready on " + PORT)
})   