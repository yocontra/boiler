define ["app/server", "app/channel", "templates/index"], (server, channel, templ) ->
  class Index extends dermis.View
    className: "index-view"
    template: templ
    render: ->
      server.ready =>
        server.example (msg) =>
          @$el.html @template message: msg
          channel.emit "index.rendered"
      return @

  return Index