var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["models/User"], function(User) {
  var Me;
  Me = (function(_super) {

    __extends(Me, _super);

    function Me() {
      return Me.__super__.constructor.apply(this, arguments);
    }

    Me.prototype.url = function() {
      return "/v1/users/me";
    };

    return Me;

  })(User);
  return new Me;
});
