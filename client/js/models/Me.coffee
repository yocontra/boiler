define ->
  class Me extends dermis.Model
    fetch: ->
      singly.get "/profile", (err, res) =>
        return console.log err if err?
        @set res.body

  # There is only one of us
  return new Me