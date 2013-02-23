define ["templates/notFound"], (templ) ->
  class NotFound extends dermis.View
    className: "notFound-view"
    template: templ
    render: ->
      @$el.html @template()
      dermis.channel.emit "404.rendered"
      return @

  return NotFound