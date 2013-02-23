var __slice = [].slice;

define(["app/server", "app/router", "layouts/App"], function(server, router, appLayout) {
  singly.setKey("dbc1540393c92f04d2907574b2a508e0");
  $('body').html(appLayout.render().el);
  router.start();
  return server.ready(function(services) {
    return console.log.apply(console, ["Server connected:"].concat(__slice.call(services)));
  });
});
