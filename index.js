const express = require('express')
const app = express()
const User = require('./model/user')
const path = require('path')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const session = require()

// HELLO!

mongoose.connect('mongodb://127.0.0.1:27017/authDemo').
    catch(error => {
        console.log("ERROR CONNECTING TO DATABASE! ", error)
    });

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.send('THIS IS THE HOME PAGE')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    const validPassword = await bcrypt.compare(password, user.password)
    console.log(validPassword)
    if (validPassword) {
        res.send("YAY WELCOME!")
    } else {
        res.send("TRY AGAIN")
    }
})

app.post('/register', async (req, res) => {
    const { password, username } = req.body
    const hash = await bcrypt.hash(password, 12)
    const user = new User({
        username,
        password: hash
    })
    await user.save()
    res.redirect('/')
})

app.get('/secret', (req, res) => {
    res.send('THIS IS SECRET! YOU CANNOT SEE THIS UNLESS YOU ARE AUTHENTICATED')
})

app.listen(3000, () => {
    console.log("SERVING YOUR APP!")
})