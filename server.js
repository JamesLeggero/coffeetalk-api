require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const TMClient = require('textmagic-rest-client')
const cors = require('cors')
const http = require('http')
const server = http.createServer(app)
const socket = require('socket.io')
const io = socket(server)
const axios = require('axios')
const passport = require('./config/passport')()

const PORT = process.env.PORT || 3001
const MONGO_URI = process.env.MONGO_URI
const WEATHER_API_KEY = process.env.WEATHER_API_KEY
const TM_USERNAME = process.env.TM_USERNAME
const TM_API_KEY = process.env.TM_API_KEY
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

app.get('/', (req, res)=>{
    res.send('get outta here')
})

app.get('/sms/:roomID', async (req, res) => {

    try {
        const link = `https://jml-coffeetalk-client.herokuapp.com/room/${req.params.roomID}`
        const farmerID = link.slice(-48, -24)
        const roasterID = link.slice(-24)
        const farmerResponse = await axios.get(`https://jml-coffeetalk-api.herokuapp.com/farmers/${farmerID}`)
        const farmerData = await farmerResponse.data
        const roasterResponse = await axios.get(`https://jml-coffeetalk-api.herokuapp.com/roasters/${roasterID}`)
        const roasterData = await roasterResponse.data
        const c = new TMClient(TM_USERNAME, TM_API_KEY)

        await c.Messages.send({
            text: `${roasterData.username} from Coffeetalk would like to speak to you! \n The link is ${link}`, 
            phones: farmerData.phoneNumber}, (err, res) => {
                console.log(`Message sent to ${farmerData.username}`)
            })

    
        
        
    } catch (error) {
        console.error(error)
    }
    
    
    

}) 

app.get ('/weather/:cityID', async (req, res) => {
    const cityID = req.params.cityID
    // const cityID = req.params.cityID + " from BE"
    const url = `http://api.openweathermap.org/data/2.5/weather?units=imperial&id=${cityID}&appid=${WEATHER_API_KEY}`
    
    try {
    const response = await axios.get(url)
    const data = await response.data
    console.log(data.name, data.weather[0].description, '\n')
    res.json(data)
    // res.json(url)
    // res.json(cityID)
    } catch (error){
        console.error(error)
    }
})

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