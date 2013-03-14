define ["templates/user", "models/User"], (templ, User) ->
  class UserView extends dermis.View
    className: "user-view"
    content: templ
    render: ({handle}) ->
      user = new User handle: handle
      user.fetch()
      @bind user

      dermis.channel.emit "sidebar.page", "users"
      return @

  return UserView