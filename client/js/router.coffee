define ["layouts/App","views/Index", 
  "views/Sidebar", "views/Other",
  "views/FourOhFour"], 
(appLayout, Index, Sidebar, Other, FourOhFour) ->
  doSidebar = ->
    return if appLayout.get("sidebar") instanceof Sidebar
    sidevu = new Sidebar
    appLayout.set "sidebar", sidevu
    appLayout.show "sidebar"

  dermis.router.add
    "/": (ctx) ->
      vu = new Index
      appLayout.set "main", vu
      appLayout.show "main"
      doSidebar()

    "/other/:id": (ctx) ->
      vu = new Other
      appLayout.set "main", vu
      appLayout.show "main", ctx.params
      doSidebar()

    "*": ->
      vu = new FourOhFour
      appLayout.set "main", vu
      appLayout.show "main"
      
  return dermis.router