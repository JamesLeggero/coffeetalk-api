const express = require('express')
const router = express.Router()
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt')

const passport = require('../config/passport.js')
const config = require('../config/config')

const Roaster = require('../models/roaster')

router.post("/signup", (req, res) => {
    console.log(req.body);
    if (req.body.username && req.body.password) {
    
      // Hash the password:
      req.body.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10)
      );
  
      Roaster.findOne({ username: req.body.username }, (roaster) => {
        console.log("========findOne=======", roaster);
        if (!roaster) {
          console.log("Running create roaster");
          Roaster.create(req.body, (error, createdRoaster) => {
            console.log("createdRoaster", createdRoaster);
            console.log("error", error);
            if (createdRoaster) {
              let payload = {
                id: createdRoaster.id,
              };
              console.log(payload);
              let token = jwt.encode(payload, config.jwtSecret);
              console.log(token);
              res.json({
                token: token,
              });
            } else {
              console.log("failed to create roaster");
              res.sendStatus(401);
            }
          });
        } else {
          console.log("Roaster already exists, try logging in instead");
          res.sendStatus(401);
        }
      });
    } else {
      res.sendStatus(401);
    }
  });

module.exports = router