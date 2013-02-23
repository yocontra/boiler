
define(["layouts/App", "views/Index", "views/Sidebar", "views/User", "views/NotFound", "views/Login"], function(appLayout, Index, Sidebar, User, NotFound, Login) {
  var checkAuth, doSidebar;
  doSidebar = function() {
    var sidevu;
    if (appLayout.get("sidebar") instanceof Sidebar) {
      return;
    }
    sidevu = new Sidebar;
    appLayout.set("sidebar", sidevu);
    return appLayout.show("sidebar");
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
      appLayout.set("main", vu);
      return appLayout.show("main");
    },
    "/user/:id": function(ctx) {
      var vu;
      if (!checkAuth()) {
        return;
      }
      doSidebar();
      vu = new User;
      appLayout.set("main", vu);
      return appLayout.show("main", ctx.params);
    },
    "*": function() {
      var vu;
      vu = new NotFound;
      appLayout.set("main", vu);
      return appLayout.show("main");
    }
  });
  return dermis.router;
});
