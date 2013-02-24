define ["models/User"], (User) ->
  class Users extends dermis.Collection
    model: User
    url: -> "/v1/users"
    fetch: ->
      request.get @url(), (err, res) =>
        return console.log err if err?
        @add res.body

  return Users