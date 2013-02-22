define ["app/server", "app/channel", "templates/sidebar"], (server, channel, templ) ->
  class Sidebar extends dermis.View
    className: "sidebar-view"
    template: templ
    render: ->
      @$el.html @template()
      channel.on "sidebar.user", (id) =>
        @$(".active").removeClass "active"
        @$("li[data-user='#{id}']").addClass "active"
      channel.on "sidebar.page", (page) =>
        @$(".active").removeClass "active"
        @$("li[data-page='#{page}']").addClass "active"
      channel.emit "sidebar.rendered"
      return @

  return Sidebar