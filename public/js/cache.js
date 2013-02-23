
define(function() {
  var cache, makeCache;
  makeCache = function(cb) {};
  cache = {
    me: function(cb) {
      return singly.get("profile", function(err, res) {
        return console.log(err, res);
      });
    }
  };
  return cache;
});
