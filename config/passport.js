const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const config = require("./config");

const Roaster = require("../models/roaster.js");

const params = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

module.exports = function () {
  const strategy = new Strategy(params, (payload, callback) => {
    const roaster = Roaster.findById(payload.id) || null;
    if (roaster) {
      return callback(null, {
        id: roaster.id,
      });
    } else {
      return callback(new Error("Roaster not found"), null);
    }
  });
  passport.use(strategy);
  return {
    initialize: function () {
      return passport.initialize();
    },
    authenticate: function () {
      return passport.authenticate("jwt", { session: false });
    },
  };
};