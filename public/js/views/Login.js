var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["templates/login"], function(templ) {
  var Login;
  Login = (function(_super) {

    __extends(Login, _super);

    function Login() {
      return Login.__super__.constructor.apply(this, arguments);
    }

    Login.prototype.className = "login-view";

    Login.prototype.template = templ;

    Login.prototype.events = {
      "click .twitterLogin": "loginTwitter",
      "click .facebookLogin": "loginFacebook"
    };

    Login.prototype.loginTwitter = function() {
      return singly.authorize('twitter');
    };

    Login.prototype.loginFacebook = function() {
      return singly.authorize('facebook');
    };

    Login.prototype.render = function() {
      this.$el.html(this.template());
      dermis.channel.emit("login.rendered");
      return this;
    };

    return Login;

  })(dermis.View);
  return Login;
});
