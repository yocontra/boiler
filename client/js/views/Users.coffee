define ["templates/users", "models/Users"], (templ, Users) ->
  class UsersView extends dermis.View
    className: "users-view"
    template: templ
    render: ({id}) ->
      @$el.html @template()

      users = new Users
      users.fetch()

      @bind users

      dermis.channel.emit "sidebar.page", "users"
      dermis.channel.emit "users.rendered"
      return @

  return UsersView