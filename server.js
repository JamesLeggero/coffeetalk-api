require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const passport = require('./config/passport')

const MONGO_URI = process.env.MONGO_URI
const db = mongoose.connection

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
db.on('open', () => {
    console.log('TALK' + PORT)
})
app.use(cors())
app.use(express.json())
app.use(passport.initialize())

app.use('/api/roasters', require('./controllers/roasters.js'))
app.use('/api/farmers', require('./controllers/farmers.js'))

app.listen(PORT, () => {
    console.log(`COFFEE`)
})