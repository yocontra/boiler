db = require '../../database'
User = db.model 'User'

module.exports = (req, res, next) ->
  q = User.findOneAndRemove handle: req.params.handle
  q.exec (err, doc) ->
    return res.end 500, err if err?
    return res.json success: false unless doc?
    res.json success: true