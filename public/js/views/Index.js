var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["templates/index"], function(templ) {
  var Index;
  Index = (function(_super) {

    __extends(Index, _super);

    function Index() {
      return Index.__super__.constructor.apply(this, arguments);
    }

    Index.prototype.className = "index-view";

    Index.prototype.content = templ;

    Index.prototype.render = function() {
      dermis.channel.emit("sidebar.page", "index");
      return this;
    };

    return Index;

  })(dermis.View);
  return Index;
});
