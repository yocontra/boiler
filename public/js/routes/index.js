
define(["app/server", "templates/index"], function(server, indexTempl) {
  return {
    init: function() {
      return this.emit('ready');
    },
    show: function() {
      return server.ready(function() {
        return server.example(function(msg) {
          return $("#main").html(indexTempl({
            message: msg
          }));
        });
      });
    },
    hide: function() {}
  };
});
