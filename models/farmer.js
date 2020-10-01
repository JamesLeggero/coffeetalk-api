const mongoose = require('mongoose')

const FarmerSchema = new mongoose.Schema(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
        farmerLocation: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        imageURL: String
    },
    { timestamps: true}
)

const Farmer = mongoose.model('Farmer', FarmerSchema)

module.exports = Farmer