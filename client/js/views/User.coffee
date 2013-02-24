define ["templates/user", "models/User"], (templ, User) ->
  class UserView extends dermis.View
    className: "user-view"
    template: templ
    render: ({handle}) ->
      @$el.html @template()
      
      user = new User handle: handle
      user.fetch()

      @bind user

      dermis.channel.emit "sidebar.page", "users"
      dermis.channel.emit "user.rendered"
      return @

  return UserView