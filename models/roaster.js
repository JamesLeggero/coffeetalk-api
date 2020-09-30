const mongoose = require('mongoose')

const RoasterSchema = new mongoose.Schema(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
    },
    { timestamps: true}
)

const Roaster = mongoose.model('Roaster', RoasterSchema)

module.exports = Roaster