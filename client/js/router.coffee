define ["layouts/App","views/Index", 
  "views/Sidebar", "views/User",
  "views/NotFound", "views/Login",
  "views/Users"], 
(appLayout, Index, Sidebar, User, NotFound, Login, Users) ->
  doSidebar = ->
    return if appLayout.get("sidebar") instanceof Sidebar
    sidevu = new Sidebar
    appLayout.set "sidebar", sidevu
    appLayout.show "sidebar"

  checkAuth = ->
    return true if singly.token()
    vu = new Login
    $('body').html vu.render().el
    return false

  dermis.router.add
    "/": (ctx) ->
      doSidebar()
      vu = new Index
      appLayout.set "main", vu
      appLayout.show "main"

    "/user/:handle": (ctx) ->
      return unless checkAuth()
      doSidebar()
      vu = new User
      appLayout.set "main", vu
      appLayout.show "main", ctx.params

    "/users": (ctx) ->
      return unless checkAuth()
      doSidebar()
      vu = new Users
      appLayout.set "main", vu
      appLayout.show "main", ctx.params

    "*": ->
      vu = new NotFound
      appLayout.set "main", vu
      appLayout.show "main"
  
  return dermis.router