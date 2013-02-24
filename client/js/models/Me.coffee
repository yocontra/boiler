define ["models/User"], (User) ->
  class Me extends User
    url: -> "/v1/users/me"
  return new Me