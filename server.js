require('dotenv').config()
const passport = require('./config/passport')()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const http = require('http')
const server = http.createServer(app)
const socket = require('socket.io')
const io = socket(server)

const PORT = process.env.PORT || 3001
const MONGO_URI = process.env.MONGO_URI
const db = mongoose.connection

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
db.on('open', () => {
    console.log(`TALK ${PORT}`)
})
app.use(cors())
app.use(express.json())
app.use(passport.initialize())

const roasterController = require('./controllers/roasters.js')

app.use('/roasters', roasterController)
app.use('/farmers', require('./controllers/farmers.js'))

// const rooms = {}

// io.on("connection", socket => {
//     socket.on("join room", roomID => {
//         if (rooms[roomID]) {
//             rooms[roomID].push(socket.id);
//         } else {
//             rooms[roomID] = [socket.id];
//         }
//         const otherUser = rooms[roomID].find(id => id !== socket.id);
//         if (otherUser) {
//             socket.emit("other user", otherUser);
//             socket.to(otherUser).emit("user joined", socket.id);
//         }
//     });

//     socket.on("offer", payload => {
//         io.to(payload.target).emit("offer", payload);
//     });

//     socket.on("answer", payload => {
//         io.to(payload.target).emit("answer", payload);
//     });

//     socket.on("ice-candidate", incoming => {
//         io.to(incoming.target).emit("ice-candidate", incoming.candidate);
//     });
// });

// app.listen(PORT, () => {
//     console.log(`COFFEE`)
// })


server.listen(PORT, () => {
    console.log('ROOMY')
})