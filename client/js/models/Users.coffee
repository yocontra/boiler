define ["models/User"], (User) ->
  class Users extends dermis.Collection
    model: User
    url: "/v1/users"

  return Users