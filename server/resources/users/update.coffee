db = require '../../database'
User = db.model 'User'

module.exports = (req, res, next) ->
  q = User.findByOneAndUpdate {handle: req.params.handle}, req.body
  q.exec (err, updated) ->
    return res.end 500, err if err?
    res.json success: true