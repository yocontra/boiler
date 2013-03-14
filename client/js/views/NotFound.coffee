define ["templates/notFound"], (templ) ->
  class NotFound extends dermis.View
    className: "notFound-view"
    content: templ

  return NotFound