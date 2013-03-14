var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function() {
  var User;
  User = (function(_super) {

    __extends(User, _super);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    User.prototype.url = function() {
      return "/v1/users/" + (this.get('handle'));
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
