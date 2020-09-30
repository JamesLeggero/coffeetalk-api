require('dotenv').config()

const JWT_KEY = process.env.JWT_KEY

module.exports = {  
    jwtSecret: JWT_KEY,
    jwtSession: {
        session: false
    }
}