module.exports = (req, res) ->
  return res.send 500, "Not found" unless req.user?
  res.json req.user