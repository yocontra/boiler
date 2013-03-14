define ["templates/users", "models/Users"], (templ, Users) ->
  class UsersView extends dermis.View
    className: "users-view"
    content: templ
    render: ({id}) ->
      users = new Users
      users.fetch()
      @bind users

      dermis.channel.emit "sidebar.page", "users"
      return @

  return UsersView