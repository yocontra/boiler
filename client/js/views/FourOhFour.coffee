define ["app/server", "app/channel", "templates/404"], (server, channel, templ) ->
  class FourOhFour extends dermis.View
    className: "404-view"
    template: templ
    render: ->
      @$el.html @template()
      channel.emit "404.rendered"
      return @

  return FourOhFour