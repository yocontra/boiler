db = require '../../database'
User = db.model 'User'

module.exports = (req, res, next) ->
  q = User.findOne handle: req.params.handle
  q.select '-token'
  q.exec (err, user) ->
    return res.end 500, err if err?
    res.json user