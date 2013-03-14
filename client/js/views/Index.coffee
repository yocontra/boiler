define ["templates/index"], (templ) ->
  class Index extends dermis.View
    className: "index-view"
    content: templ
    render: ->
      dermis.channel.emit "sidebar.page", "index"
      return @

  return Index