var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app/server", "app/channel", "templates/user"], function(server, channel, templ) {
  var User;
  User = (function(_super) {

    __extends(User, _super);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    User.prototype.className = "user-view";

    User.prototype.template = templ;

    User.prototype.render = function(_arg) {
      var id;
      id = _arg.id;
      this.$el.html(this.template({
        id: id
      }));
      channel.emit("user.rendered");
      return this;
    };

    return User;

  })(dermis.View);
  return User;
});
