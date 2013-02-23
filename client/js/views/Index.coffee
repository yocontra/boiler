define ["app/server", "templates/index"], (server, templ) ->
  class Index extends dermis.View
    className: "index-view"
    template: templ
    render: ->
      dermis.channel.emit "sidebar.page", "index"
      server.ready =>
        server.example (msg) =>
          @$el.html @template message: msg
          dermis.channel.emit "index.rendered"
      return @

  return Index