define ["templates/index"], (templ) ->
  class Index extends dermis.View
    className: "index-view"
    template: templ
    render: ->
      dermis.channel.emit "sidebar.page", "index"
      @$el.html @template()
      dermis.channel.emit "index.rendered"
      return @

  return Index