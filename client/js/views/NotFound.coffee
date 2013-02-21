define ["app/server", "app/channel", "templates/notFound"], (server, channel, templ) ->
  class NotFound extends dermis.View
    className: "notFound-view"
    template: templ
    render: ->
      @$el.html @template()
      channel.emit "404.rendered"
      return @

  return NotFound