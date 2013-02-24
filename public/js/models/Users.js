var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["models/User"], function(User) {
  var Users;
  Users = (function(_super) {

    __extends(Users, _super);

    function Users() {
      return Users.__super__.constructor.apply(this, arguments);
    }

    Users.prototype.model = User;

    Users.prototype.url = function() {
      return "/v1/users";
    };

    Users.prototype.fetch = function() {
      var _this = this;
      return request.get(this.url(), function(err, res) {
        if (err != null) {
          return console.log(err);
        }
        return _this.add(res.body);
      });
    };

    return Users;

  })(dermis.Collection);
  return Users;
});
