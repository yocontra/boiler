define ["layouts/App","views/Index", 
  "views/Sidebar", "views/User",
  "views/NotFound", "views/Login",
  "views/Users"], 
(appLayout, Index, Sidebar, User, NotFound, Login, Users) ->
  doSidebar = ->
    return if appLayout.region("sidebar").view instanceof Sidebar
    sidevu = new Sidebar
    appLayout.region("sidebar").set(sidevu).show()

  checkAuth = ->
    return true if singly.token()
    vu = new Login
    $('body').html vu.render().el
    return false

  dermis.router.add
    "/": (ctx) ->
      doSidebar()
      vu = new Index
      appLayout.region("main").set(vu).show()

    "/user/:handle": (ctx) ->
      return unless checkAuth()
      doSidebar()
      vu = new User
      appLayout.region("main").set(vu).show ctx.params

    "/users": (ctx) ->
      return unless checkAuth()
      doSidebar()
      vu = new Users
      appLayout.region("main").set(vu).show ctx.params

    "*": ->
      vu = new NotFound
      appLayout.region("main").set(vu).show()
  
  return dermis.router