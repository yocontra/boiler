define ["templates/appLayout"], (templ) ->
  class AppLayout extends dermis.Layout
    content: templ
    regions:
      "sidebar": "#sidebar"
      "main": "#main"
  return new AppLayout