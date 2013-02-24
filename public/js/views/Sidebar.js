var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["templates/sidebar", "models/Me"], function(templ, me) {
  var Sidebar;
  Sidebar = (function(_super) {

    __extends(Sidebar, _super);

    function Sidebar() {
      return Sidebar.__super__.constructor.apply(this, arguments);
    }

    Sidebar.prototype.className = "sidebar-view";

    Sidebar.prototype.template = templ;

    Sidebar.prototype.events = {
      "click .logout": function() {
        singly.clearToken();
        dermis.router.stop();
        return window.location.href = "/";
      }
    };

    Sidebar.prototype.render = function() {
      var loggedIn,
        _this = this;
      loggedIn = singly.token() != null;
      this.$el.html(this.template({
        loggedIn: loggedIn
      }));
      if (loggedIn) {
        this.bind({
          me: me
        });
        me.fetch();
      }
      dermis.channel.on("sidebar.page", function(page) {
        _this.$(".active").removeClass("active");
        return _this.$("li[data-page='" + page + "']").addClass("active");
      });
      dermis.channel.emit("sidebar.rendered");
      return this;
    };

    return Sidebar;

  })(dermis.View);
  return Sidebar;
});
