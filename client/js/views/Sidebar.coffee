define ["app/server", "templates/sidebar"], (server, templ) ->
  class Sidebar extends dermis.View
    className: "sidebar-view"
    template: templ
    render: ->
      @$el.html @template()
      dermis.channel.on "sidebar.user", (id) =>
        @$(".active").removeClass "active"
        @$("li[data-user='#{id}']").addClass "active"
      dermis.channel.on "sidebar.page", (page) =>
        @$(".active").removeClass "active"
        @$("li[data-page='#{page}']").addClass "active"
      dermis.channel.emit "sidebar.rendered"
      return @

  return Sidebar