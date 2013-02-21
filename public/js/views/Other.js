var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app/server", "app/channel", "templates/other"], function(server, channel, templ) {
  var Other;
  Other = (function(_super) {

    __extends(Other, _super);

    function Other() {
      return Other.__super__.constructor.apply(this, arguments);
    }

    Other.prototype.className = "other-view";

    Other.prototype.template = templ;

    Other.prototype.render = function(_arg) {
      var id;
      id = _arg.id;
      this.$el.html(this.template({
        id: id
      }));
      channel.emit("other.rendered");
      return this;
    };

    return Other;

  })(dermis.View);
  return Other;
});
