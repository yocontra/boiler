var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app/server", "app/channel", "templates/404"], function(server, channel, templ) {
  var FourOhFour;
  FourOhFour = (function(_super) {

    __extends(FourOhFour, _super);

    function FourOhFour() {
      return FourOhFour.__super__.constructor.apply(this, arguments);
    }

    FourOhFour.prototype.className = "404-view";

    FourOhFour.prototype.template = templ;

    FourOhFour.prototype.render = function() {
      this.$el.html(this.template());
      channel.emit("404.rendered");
      return this;
    };

    return FourOhFour;

  })(dermis.View);
  return FourOhFour;
});
