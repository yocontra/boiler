define ["templates/sidebar", "models/Me"], (templ, me) ->
  class Sidebar extends dermis.View
    className: "sidebar-view"
    events:
      "click .logout": "logout"

    logout: =>
      singly.clearToken()
      @$el.html templ loggedIn: false
      window.location.href = "/"

    render: ->
      loggedIn = singly.token()?
      @$el.html templ loggedIn: loggedIn

      if loggedIn
        @bind me: me
        me.fetch()

      dermis.channel.on "sidebar.page", (page) =>
        @$(".active").removeClass "active"
        @$("li[data-page='#{page}']").addClass "active"

      dermis.channel.emit "sidebar.rendered"
      return @

  return Sidebar