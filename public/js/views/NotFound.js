var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["templates/notFound"], function(templ) {
  var NotFound;
  NotFound = (function(_super) {

    __extends(NotFound, _super);

    function NotFound() {
      return NotFound.__super__.constructor.apply(this, arguments);
    }

    NotFound.prototype.className = "notFound-view";

    NotFound.prototype.content = templ;

    return NotFound;

  })(dermis.View);
  return NotFound;
});
