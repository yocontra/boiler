var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function() {
  var User;
  User = (function(_super) {

    __extends(User, _super);

    function User() {
      User.__super__.constructor.apply(this, arguments);
      this.setStatic();
    }

    User.prototype.url = function() {
      return "/v1/users/" + (this.get('handle'));
    };

    User.prototype.setStatic = function() {
      this.set('profileImage', this.profileImage());
      this.set('profileImageLarge', this.profileImageLarge());
      this.set('profileUrl', "/user/" + (this.get('handle')));
      return this;
    };

    User.prototype.fetch = function() {
      var _this = this;
      return request.get(this.url(), function(err, res) {
        if (err != null) {
          return console.log(err);
        }
        _this.set(res.body);
        return _this.setStatic();
      });
    };

    User.prototype.profileImage = function() {
      return "http://api.twitter.com/1/users/profile_image?screen_name=" + (this.get('handle')) + "&size=normal";
    };

    User.prototype.profileImageLarge = function() {
      return "http://api.twitter.com/1/users/profile_image?screen_name=" + (this.get('handle')) + "&size=bigger";
    };

    return User;

  })(dermis.Model);
  return User;
});
