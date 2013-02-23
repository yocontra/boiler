define ["templates/sidebar", "models/Me"], (templ, me) ->
  class Sidebar extends dermis.View
    className: "sidebar-view"
    template: templ
    events:
      "click .logout": ->
        singly.clearToken()
        window.location.href = "/"

    render: ->
      loggedIn = singly.token()?
      @$el.html @template loggedIn: loggedIn

      if loggedIn
        @bind me: me
        me.fetch()

      dermis.channel.on "sidebar.user", (id) =>
        @$(".active").removeClass "active"
        @$("li[data-user='#{id}']").addClass "active"
      dermis.channel.on "sidebar.page", (page) =>
        @$(".active").removeClass "active"
        @$("li[data-page='#{page}']").addClass "active"
      dermis.channel.emit "sidebar.rendered"
      return @

  return Sidebar