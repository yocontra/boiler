request = require 'request'
db = require '../database'
User = db.model 'User'

getSinglyProfile = (token, cb) ->
  opt =
    uri: "https://api.singly.com/profile"
    qs: 
      access_token: token
  request opt, (err, ores, body) ->
    return cb err if err?
    p = JSON.parse body
    cb null, p.services.twitter

module.exports = (req, res, next) ->
  token = req.cookies.singly_access_token
  return next() unless token?

  User.findOne {token:token}, (err, user) ->
    return res.send 500, err if err?
    if user?
      req.user = user
      return next()

    getSinglyProfile token, (err, profile) ->
      return res.send 500, err if err?
      profile.token = token
      
      User.findOne {handle: profile.handle}, (err, user) ->
        return res.send 500, err if err?
        if user?
          user.set 'token', token
          user.save (err, user) ->
            return res.send 500, err if err?
            req.user = user
            next()
        else
          User.create profile, (err, user) ->
            return res.send 500, err if err?
            req.user = user
            next()