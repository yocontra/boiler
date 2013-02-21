
define(["layouts/App", "views/Index", "views/Sidebar", "views/Other", "views/FourOhFour"], function(appLayout, Index, Sidebar, Other, FourOhFour) {
  var doSidebar;
  doSidebar = function() {
    var sidevu;
    if (appLayout.get("sidebar") instanceof Sidebar) {
      return;
    }
    sidevu = new Sidebar;
    appLayout.set("sidebar", sidevu);
    return appLayout.show("sidebar");
  };
  dermis.router.add({
    "/": function(ctx) {
      var vu;
      vu = new Index;
      appLayout.set("main", vu);
      appLayout.show("main");
      return doSidebar();
    },
    "/other/:id": function(ctx) {
      var vu;
      vu = new Other;
      appLayout.set("main", vu);
      appLayout.show("main", ctx.params);
      return doSidebar();
    },
    "*": function() {
      var vu;
      vu = new FourOhFour;
      appLayout.set("main", vu);
      return appLayout.show("main");
    }
  });
  return dermis.router;
});
