define ["templates/user"], (templ) ->
  class User extends dermis.View
    className: "user-view"
    template: templ
    render: ({id}) ->
      @$el.html @template id: id
      dermis.channel.emit "sidebar.user", id
      dermis.channel.emit "user.rendered"
      return @

  return User