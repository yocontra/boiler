var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app/server", "templates/index"], function(server, templ) {
  var Index;
  Index = (function(_super) {

    __extends(Index, _super);

    function Index() {
      return Index.__super__.constructor.apply(this, arguments);
    }

    Index.prototype.className = "index-view";

    Index.prototype.template = templ;

    Index.prototype.render = function() {
      var _this = this;
      dermis.channel.emit("sidebar.page", "index");
      server.ready(function() {
        return server.example(function(msg) {
          _this.$el.html(_this.template({
            message: msg
          }));
          return dermis.channel.emit("index.rendered");
        });
      });
      return this;
    };

    return Index;

  })(dermis.View);
  return Index;
});
