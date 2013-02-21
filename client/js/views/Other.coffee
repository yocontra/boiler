define ["app/server", "app/channel", "templates/other"], (server, channel, templ) ->
  class Other extends dermis.View
    className: "other-view"
    template: templ
    render: ({id}) ->
      @$el.html @template id: id
      channel.emit "other.rendered"
      return @

  return Other