const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config({ path: './config.env' })
const authenticate = require("./middleware/authenticate")

const NODE_ENV = process.env.NODE_ENV



const PORT = process.env.PORT || 8000

require("./db/conn")
const User = require('./models/schema')

app.use(express.json())
app.use(cookieParser())
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*")
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//     next()
// })
app.use(cors({
    origin: true,
    credentials: true,
}))


const myPath = (req, res, next) => {
    console.log(req.path)
    next()
}



app.get('/fromatlas', async (req, res) => {

    try {
        const show = await User.find()
        res.cookie('cookiew1', 'oaskda')
        res.send(show)
    } catch (error) {
        res.send(error)
    }
})

app.post('/registers', async (req, res) => {

    const { name, email, phone, dob, password, c_password } = req.body

    const data = {
        name, email, phone, dob, password, c_password
    }


    if (!name || !email || !phone || !dob || !password || !c_password) {
        return res.status(422).json({ message: 'Fill the fields' })

    } else {

        try {

            const userExist = await User.findOne({ email: email })
            console.log(userExist)
            if (userExist) {
                return res.status(422).json({ message: "  Email already exists" })
            }
            const user = new User({ name, email, phone, dob, password, c_password })
            const registerUser = await user.save()
            console.log(registerUser)
            if (registerUser) {
                res.status(201).json({ message: 'Message created succesfully' })
            } else {
                return res.status(402).json({ message: 'Server down' })
            }

        } catch (error) {
            console.log(error)
            res.status(422).json({ message: error })
        }
    }
})

app.get('/', async (req, res) => {

    try {
        const show = "Welcome to test backend deploy"
        // res.send(show)
        res.status(201).json({ message: show })
        res.cookie("jwtoken", 'cokkie')
    } catch (error) {
        res.send(error)
    }
})

app.get('/profile', authenticate, async (req, res) => {

    try {
        const show = "Profile"
        res.status(201).send(req.rootUser)
    } catch (error) {
        res.send(error)
    }
})

app.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Empty fields' })
        }

        const userLog = await User.findOne({ email: email })

        if (userLog) {


            if (password === userLog.password) {
                const token = await userLog.generateAuthToken()
                console.log(token)

                res.cookie('jwt', token, {
                    expires: new Date(Date.now() + 60000 * 15),
                    sameSite: NODE_ENV === 'production' ? 'none' : '',
                    secure: NODE_ENV === 'production' ? true : false,
                    httpOnly: NODE_ENV === 'production' ? true : false,
                })

                res.json({ message: "Login Succesful" })
            } else {
                res.status(400).json({ error: "Invalid credentials" })
            }

        }
        else {
            return res.status(400).json({ error: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
    }

})

app.patch('/patch/:id', async (req, res) => {
    try {
        const application_no = req.params.id
        const update = { isVerified: true }
        const showData = await User.findOneAndUpdate({ application_no: application_no }, update,
            {
                new: true
            })
        // function (err, doc) {
        //     if(err) {
        //         return res.send(err)
        //     } else {
        //         return res.send({data: doc})
        //     }
        // })
        showData.isVerified
        res.send(showData)
    } catch (error) {
        res.send(error)
    }

})

app.patch('/patchAll/', async (req, res) => {
    try {
        const update = { isVerified: false }
        const showData = await User.updateMany({ isVerified: true }, update,
            {
                new: true
            },
            function (err, ret) {
                if (err) {
                    return res.send(err)
                } else {
                    return res.send(ret)
                }
            }
        )
        showData.isVerified
        // res.status(200).json({message: 'Success'})
        console.log(showData.nModified)
        return
    } catch (error) {
        console.log(error)
    }

})

app.post('/register', myPath, async (req, res) => {

    // const uni_no = 1
    // const application_no = '2021' + uni_no
    const { name, email, phone, dob, password, c_password } = req.body

    console.log(req.body)


    // const data = {
    //     name, email, phone, message, application_no
    // }

    const isVerified = false

    if (!name || !email) {
        return res.status(422).json({ error: 'Fill the fields' })
    } else {

        try {

            const feedbackExist = await User.findOne({ email: email })

            if (feedbackExist) {
                return res.status(422).json({ error: 'Email already exist' })
            } else {
                const user = new User({ name, email, phone, dob, password, c_password })

                const registerUser = await user.save()
                console.log(registerUser)
                if (registerUser) {
                    // const re = registerUser.application_no
                    res.status(201).json({ message: 'Message created succesfully' })
                } else {
                    return res.status(422).json({ message: 'Server down' })
                }

            }

        } catch (error) {
            console.log(error)
        }

        // console.log(JSON.stringify(data))
    }
})


app.listen(PORT, () => {
    console.log('Hosted')
})