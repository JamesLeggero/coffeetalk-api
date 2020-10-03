const express = require('express')
const router = express.Router();
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt')
const passport = require('../config/passport.js')
const config = require('../config/config.js')
const Farmer = require('../models/farmer.js')

router.get('/', (req,res) => {
    Farmer.find({}, (error, allFarmers) => {
        error ? res.status(404).json(error) :
        res.status(200).json(allFarmers)
    })
})

router.post("/signup", (req, res) => {
    console.log(req.body);
    if (req.body.username && req.body.password) {
    
      // Hash the password:
      req.body.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10)
      );
  
      Farmer.findOne({ username: req.body.username }, (farmer) => {
        console.log("========findOne=======", farmer);
        if (!farmer) {
          console.log("Running create farmer");
          Farmer.create(req.body, (error, createdFarmer) => {
            console.log("createdFarmer", createdFarmer);
            console.log("error", error);
            if (createdFarmer) {
              let payload = {
                id: createdFarmer.id,
              };
              console.log(payload);
              let token = jwt.encode(payload, config.jwtSecret);
              console.log(token);
              res.json({
                token: token,
              })
              
            } else {
              console.log("failed to create farmer");
              res.sendStatus(401);
            }
          });
        } else {
          console.log("Farmer already exists, try logging in instead");
          res.sendStatus(401);
        }
      });
    } else {
      res.sendStatus(401);
    }
  });

  router.get('/:id', (req, res) => {
    Farmer.findById(req.params.id, (error, foundFarmer) => {
        error ? res.status(404).json(error) : res.status(200).json({username: foundFarmer.username,
        _id: foundFarmer.id,
        imageURL: foundFarmer.imageURL,
        farmerLocation: foundFarmer.farmerLocation,
        phoneNumber: foundFarmer.phoneNumber});

    });
});

module.exports = router