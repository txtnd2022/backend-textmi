const router = require("express").Router();
const User = require("../models/m_user")
const passport = require('passport')

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.sendStatus(401)
    }
}

//Register

router.route("/register")
    .get((req, res) => {
        res.send("Hello from routes")
    })
    .post(async (req, res) => {
        try {
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });
            const saveUser = await user.save();
            res.status(200).json(saveUser)
        } catch (err) {
            console.log(err)
        }
    })


//login

router.route("/login")
    .post(async (req, res) => {
        try {
            if (!req.body.email || !req.body.password) {
                return res.status(400).json({ error: 'Empty fields' })
            }

            const user = await User.findOne({
                email: req.body.email
            })

            if (user) {
                if (req.body.password === user.password) {
                    res.status(201).json({ data: user, status: 'SUCCESS', token: 'abcd' })
                } else {
                    res.status(401).json({ message: "Invalid credentials", status: 'FAILED' })
                }
            } else {
                res.status(401).json({ message: "Invalid credentials", status: 'FAILED' })
            }
        } catch (err) {
            console.log(err)
        }
    })

router
    .get('/retrieveUser/:email', async (req, res) => {
        try {

            const getEmailToken = await User.findOne({
                email: req.params.email
            })
            if (getEmailToken) {
                res.status(200).json({ data: getEmailToken })
            } else {
                res.status(401).json({ data: getEmailToken })
            }

        } catch (e) {
            res.status(401).json({ message: "Invalid credentials", status: 'FAILED' })
        }
    })

router.route('/failed')
    .get(async (req, res) => {
        res.status(404).json({ '404': 'Failed' })
    })

router.route('/success', isLoggedIn)
    .get(async (req, res) => {
        res.status(200).json({ '200': `Welcome ${req.user.email}` })
    })

router.route('/google')
    .get(
        passport.authenticate('google', { scope: ['profile', 'email'] })
    )

router.route('/google/callback')
    .get(passport.authenticate('google', { failureRedirect: '/falied' }),
        function (req, res) {
            res.redirect('/success');
        })

router.route('/logout')
    .get((req, res) => {
        // res.session = null;
        // res.logout();
        // res.redirect('/')
    })


module.exports = router