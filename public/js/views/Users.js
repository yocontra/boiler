var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["templates/users", "models/Users"], function(templ, Users) {
  var UsersView;
  UsersView = (function(_super) {

    __extends(UsersView, _super);

    function UsersView() {
      return UsersView.__super__.constructor.apply(this, arguments);
    }

    UsersView.prototype.className = "users-view";

    UsersView.prototype.content = templ;

    UsersView.prototype.render = function(_arg) {
      var id, users;
      id = _arg.id;
      users = new Users;
      users.fetch();
      this.bind(users);
      dermis.channel.emit("sidebar.page", "users");
      return this;
    };

    return UsersView;

  })(dermis.View);
  return UsersView;
});
