db = require '../../database'
User = db.model 'User'

module.exports = (req, res, next) ->
  q = User.find({})
  q.select '-token'
  q.exec (err, users) ->
    return res.end 500, err if err?
    res.json users