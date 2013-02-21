define ["app/server", "app/channel", "templates/sidebar"], (server, channel, templ) ->
  class Sidebar extends dermis.View
    className: "sidebar-view"
    template: templ
    render: ->
      @$el.html @template()
      channel.emit "sidebar.rendered"
      return @

  return Sidebar