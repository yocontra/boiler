
define(["templates/index"], function(indexTempl) {
  return {
    init: function() {
      return this.emit('ready');
    },
    show: function() {
      return $("#main").html(indexTempl());
    },
    hide: function() {}
  };
});
