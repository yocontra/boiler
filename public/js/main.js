var __slice = [].slice;

define(["app/server"], function(server) {
  dermis.route('/');
  return server.ready(function(services) {
    return console.log.apply(console, ["Server connected:"].concat(__slice.call(services)));
  });
});
