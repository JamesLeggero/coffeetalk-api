const express = require('express')
const router = express.Router();
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt')
const passport = require('../config/passport.js')
const config = require('../config/config.js')
const Roaster = require('../models/roaster.js')

router.get('/', (req, res) => {
  Roaster.find({}, (error, allRoasters) => {
    error ? res.status(404).json(error) :
      res.status(200).json(allRoasters)
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
              id: roaster._id
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
//
router.post("/login", (req, res) => {
  if (req.body.username && req.body.password) {
    console.log(req.body.username);
    Roaster.findOne({ username: req.body.username }, (error, roaster) => {
      if (error) res.status(401).json(error);
      if (roaster) {
        console.log("Found roaster. Checking password...");
        if (bcrypt.compareSync(req.body.password, roaster.password)) {
          console.log("Password correct, generating JWT...");
          let payload = {
            id: roaster.id,
            username: roaster.username
          };
          let token = jwt.encode(payload, config.jwtSecret);
          console.log(token);
          res.json({
            token: token,
            id: roaster._id,
          });
        } else {
          console.log("Wrong password");
          res.status(401).json(error);
        }
      } else {
        console.log("Couldn't find roaster. Try signing up.");
        res.status(401).json(error);
      }
    });
  } else {
    res.status(401).json(error);
  }
});

router.get('/:id', (req, res) => {
  Roaster.findById(req.params.id, (error, foundRoaster) => {
      error ? res.status(404).json(error) : res.status(200).json({username: foundRoaster.username,
      _id: foundRoaster.id});

  });
})



module.exports = router