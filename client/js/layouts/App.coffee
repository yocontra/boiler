define ["templates/appLayout"], (templ) ->
  class AppLayout extends dermis.Layout
    template: templ
    regions:
      "sidebar": "#sidebar"
      "main": "#main"
  return new AppLayout