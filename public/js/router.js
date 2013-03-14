
define(["layouts/App", "views/Index", "views/Sidebar", "views/User", "views/NotFound", "views/Login", "views/Users"], function(appLayout, Index, Sidebar, User, NotFound, Login, Users) {
  var checkAuth, doSidebar;
  doSidebar = function() {
    var sidevu;
    if (appLayout.region("sidebar").view instanceof Sidebar) {
      return;
    }
    sidevu = new Sidebar;
    return appLayout.region("sidebar").set(sidevu).show();
  };
  checkAuth = function() {
    var vu;
    if (singly.token()) {
      return true;
    }
    vu = new Login;
    $('body').html(vu.render().el);
    return false;
  };
  dermis.router.add({
    "/": function(ctx) {
      var vu;
      doSidebar();
      vu = new Index;
      return appLayout.region("main").set(vu).show();
    },
    "/user/:handle": function(ctx) {
      var vu;
      if (!checkAuth()) {
        return;
      }
      doSidebar();
      vu = new User;
      return appLayout.region("main").set(vu).show(ctx.params);
    },
    "/users": function(ctx) {
      var vu;
      if (!checkAuth()) {
        return;
      }
      doSidebar();
      vu = new Users;
      return appLayout.region("main").set(vu).show(ctx.params);
    },
    "*": function() {
      var vu;
      vu = new NotFound;
      return appLayout.region("main").set(vu).show();
    }
  });
  return dermis.router;
});
