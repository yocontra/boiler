define ["layouts/App","views/Index", 
  "views/Sidebar", "views/User",
  "views/NotFound"], 
(appLayout, Index, Sidebar, User, NotFound) ->
  doSidebar = ->
    return if appLayout.get("sidebar") instanceof Sidebar
    sidevu = new Sidebar
    appLayout.set "sidebar", sidevu
    appLayout.show "sidebar"

  dermis.router.add
    "/": (ctx) ->
      doSidebar()
      vu = new Index
      appLayout.set "main", vu
      appLayout.show "main"

    "/user/:id": (ctx) ->
      doSidebar()
      vu = new User
      appLayout.set "main", vu
      appLayout.show "main", ctx.params

    "*": ->
      vu = new NotFound
      appLayout.set "main", vu
      appLayout.show "main"
      
  return dermis.router