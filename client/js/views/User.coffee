define ["app/server", "app/channel", "templates/user"], (server, channel, templ) ->
  class User extends dermis.View
    className: "user-view"
    template: templ
    render: ({id}) ->
      @$el.html @template id: id
      channel.emit "user.rendered"
      channel.emit "sidebar.user", id
      return @

  return User