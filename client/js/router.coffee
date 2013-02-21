define ["layouts/App","views/Index", 
  "views/Sidebar", "views/Other",
  "views/NotFound"], 
(appLayout, Index, Sidebar, Other, NotFound) ->
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
      vu = new NotFound
      appLayout.set "main", vu
      appLayout.show "main"
      
  return dermis.router