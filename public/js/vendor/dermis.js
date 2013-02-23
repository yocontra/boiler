;(function(){


/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = callbacks.indexOf(fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("apily-guid/index.js", function(exports, require, module){

/**
 * guid
 * Simple prefixed unique id generator
 * 
 * @copyright 2013 Enrico Marino and Federico Spini
 * @license MIT
 */

/**
 * Expose `guid`
 */

module.exports = guid;

/**
 * id
 */

var id = 0;

/**
 * guid
 *
 * @param {String} prefix prefix
 * @return {String} prefixed unique id
 * @api public
 */

function guid (prefix) {
  prefix = prefix || '';
  id += 1;
  return prefix + id;
};

});
require.register("mikeric-rivets/lib/rivets.js", function(exports, require, module){
// rivets.js
// version: 0.4.5
// author: Michael Richards
// license: MIT
(function() {
  var Rivets, bindEvent, getInputValue, rivets, unbindEvent,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Rivets = {};

  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }

  Rivets.Binding = (function() {

    function Binding(el, type, model, keypath, options) {
      var identifier, regexp, value, _ref;
      this.el = el;
      this.type = type;
      this.model = model;
      this.keypath = keypath;
      this.options = options != null ? options : {};
      this.unbind = __bind(this.unbind, this);

      this.bind = __bind(this.bind, this);

      this.publish = __bind(this.publish, this);

      this.sync = __bind(this.sync, this);

      this.set = __bind(this.set, this);

      this.formattedValue = __bind(this.formattedValue, this);

      if (!(this.binder = Rivets.binders[type])) {
        _ref = Rivets.binders;
        for (identifier in _ref) {
          value = _ref[identifier];
          if (identifier !== '*' && identifier.indexOf('*') !== -1) {
            regexp = new RegExp("^" + (identifier.replace('*', '.+')) + "$");
            if (regexp.test(type)) {
              this.binder = value;
              this.args = new RegExp("^" + (identifier.replace('*', '(.+)')) + "$").exec(type);
              this.args.shift();
            }
          }
        }
      }
      this.binder || (this.binder = Rivets.binders['*']);
      if (this.binder instanceof Function) {
        this.binder = {
          routine: this.binder
        };
      }
      this.formatters = this.options.formatters || [];
    }

    Binding.prototype.formattedValue = function(value) {
      var args, formatter, id, _i, _len, _ref;
      _ref = this.formatters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        formatter = _ref[_i];
        args = formatter.split(/\s+/);
        id = args.shift();
        formatter = this.model[id] instanceof Function ? this.model[id] : Rivets.formatters[id];
        if ((formatter != null ? formatter.read : void 0) instanceof Function) {
          value = formatter.read.apply(formatter, [value].concat(__slice.call(args)));
        } else if (formatter instanceof Function) {
          value = formatter.apply(null, [value].concat(__slice.call(args)));
        }
      }
      return value;
    };

    Binding.prototype.set = function(value) {
      var _ref;
      value = value instanceof Function && !this.binder["function"] ? this.formattedValue(value.call(this.model)) : this.formattedValue(value);
      return (_ref = this.binder.routine) != null ? _ref.call(this, this.el, value) : void 0;
    };

    Binding.prototype.sync = function() {
      return this.set(this.options.bypass ? this.model[this.keypath] : Rivets.config.adapter.read(this.model, this.keypath));
    };

    Binding.prototype.publish = function() {
      var args, formatter, id, value, _i, _len, _ref, _ref1, _ref2;
      value = getInputValue(this.el);
      _ref = this.formatters.slice(0).reverse();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        formatter = _ref[_i];
        args = formatter.split(/\s+/);
        id = args.shift();
        if ((_ref1 = Rivets.formatters[id]) != null ? _ref1.publish : void 0) {
          value = (_ref2 = Rivets.formatters[id]).publish.apply(_ref2, [value].concat(__slice.call(args)));
        }
      }
      return Rivets.config.adapter.publish(this.model, this.keypath, value);
    };

    Binding.prototype.bind = function() {
      var dependency, keypath, model, _i, _len, _ref, _ref1, _ref2, _results;
      if ((_ref = this.binder.bind) != null) {
        _ref.call(this, this.el);
      }
      if (this.options.bypass) {
        this.sync();
      } else {
        Rivets.config.adapter.subscribe(this.model, this.keypath, this.sync);
        if (Rivets.config.preloadData) {
          this.sync();
        }
      }
      if ((_ref1 = this.options.dependencies) != null ? _ref1.length : void 0) {
        _ref2 = this.options.dependencies;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          dependency = _ref2[_i];
          if (/^\./.test(dependency)) {
            model = this.model;
            keypath = dependency.substr(1);
          } else {
            dependency = dependency.split('.');
            model = this.view.models[dependency.shift()];
            keypath = dependency.join('.');
          }
          _results.push(Rivets.config.adapter.subscribe(model, keypath, this.sync));
        }
        return _results;
      }
    };

    Binding.prototype.unbind = function() {
      var dependency, keypath, model, _i, _len, _ref, _ref1, _ref2, _results;
      if ((_ref = this.binder.unbind) != null) {
        _ref.call(this, this.el);
      }
      if (!this.options.bypass) {
        Rivets.config.adapter.unsubscribe(this.model, this.keypath, this.sync);
      }
      if ((_ref1 = this.options.dependencies) != null ? _ref1.length : void 0) {
        _ref2 = this.options.dependencies;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          dependency = _ref2[_i];
          if (/^\./.test(dependency)) {
            model = this.model;
            keypath = dependency.substr(1);
          } else {
            dependency = dependency.split('.');
            model = this.view.models[dependency.shift()];
            keypath = dependency.join('.');
          }
          _results.push(Rivets.config.adapter.unsubscribe(model, keypath, this.sync));
        }
        return _results;
      }
    };

    return Binding;

  })();

  Rivets.View = (function() {

    function View(els, models) {
      this.els = els;
      this.models = models;
      this.publish = __bind(this.publish, this);

      this.sync = __bind(this.sync, this);

      this.unbind = __bind(this.unbind, this);

      this.bind = __bind(this.bind, this);

      this.select = __bind(this.select, this);

      this.build = __bind(this.build, this);

      this.bindingRegExp = __bind(this.bindingRegExp, this);

      if (!(this.els.jquery || this.els instanceof Array)) {
        this.els = [this.els];
      }
      this.build();
    }

    View.prototype.bindingRegExp = function() {
      var prefix;
      prefix = Rivets.config.prefix;
      if (prefix) {
        return new RegExp("^data-" + prefix + "-");
      } else {
        return /^data-/;
      }
    };

    View.prototype.build = function() {
      var bindingRegExp, el, node, parse, skipNodes, _i, _j, _len, _len1, _ref, _ref1,
        _this = this;
      this.bindings = [];
      skipNodes = [];
      bindingRegExp = this.bindingRegExp();
      parse = function(node) {
        var attribute, attributes, binder, binding, context, ctx, dependencies, identifier, keypath, model, n, options, path, pipe, pipes, regexp, splitPath, type, value, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
        if (__indexOf.call(skipNodes, node) < 0) {
          _ref = node.attributes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            attribute = _ref[_i];
            if (bindingRegExp.test(attribute.name)) {
              type = attribute.name.replace(bindingRegExp, '');
              if (!(binder = Rivets.binders[type])) {
                _ref1 = Rivets.binders;
                for (identifier in _ref1) {
                  value = _ref1[identifier];
                  if (identifier !== '*' && identifier.indexOf('*') !== -1) {
                    regexp = new RegExp("^" + (identifier.replace('*', '.+')) + "$");
                    if (regexp.test(type)) {
                      binder = value;
                    }
                  }
                }
              }
              binder || (binder = Rivets.binders['*']);
              if (binder.block) {
                _ref2 = node.getElementsByTagName('*');
                for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                  n = _ref2[_j];
                  skipNodes.push(n);
                }
                attributes = [attribute];
              }
            }
          }
          _ref3 = attributes || node.attributes;
          for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
            attribute = _ref3[_k];
            if (bindingRegExp.test(attribute.name)) {
              options = {};
              type = attribute.name.replace(bindingRegExp, '');
              pipes = (function() {
                var _l, _len3, _ref4, _results;
                _ref4 = attribute.value.split('|');
                _results = [];
                for (_l = 0, _len3 = _ref4.length; _l < _len3; _l++) {
                  pipe = _ref4[_l];
                  _results.push(pipe.trim());
                }
                return _results;
              })();
              context = (function() {
                var _l, _len3, _ref4, _results;
                _ref4 = pipes.shift().split('<');
                _results = [];
                for (_l = 0, _len3 = _ref4.length; _l < _len3; _l++) {
                  ctx = _ref4[_l];
                  _results.push(ctx.trim());
                }
                return _results;
              })();
              path = context.shift();
              splitPath = path.split(/\.|:/);
              options.formatters = pipes;
              options.bypass = path.indexOf(':') !== -1;
              if (splitPath[0]) {
                model = _this.models[splitPath.shift()];
              } else {
                model = _this.models;
                splitPath.shift();
              }
              keypath = splitPath.join('.');
              if (model) {
                if (dependencies = context.shift()) {
                  options.dependencies = dependencies.split(/\s+/);
                }
                binding = new Rivets.Binding(node, type, model, keypath, options);
                binding.view = _this;
                _this.bindings.push(binding);
              }
            }
          }
          if (attributes) {
            attributes = null;
          }
        }
      };
      _ref = this.els;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        parse(el);
        _ref1 = el.getElementsByTagName('*');
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          node = _ref1[_j];
          if (node.attributes != null) {
            parse(node);
          }
        }
      }
    };

    View.prototype.select = function(fn) {
      var binding, _i, _len, _ref, _results;
      _ref = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        if (fn(binding)) {
          _results.push(binding);
        }
      }
      return _results;
    };

    View.prototype.bind = function() {
      var binding, _i, _len, _ref, _results;
      _ref = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        _results.push(binding.bind());
      }
      return _results;
    };

    View.prototype.unbind = function() {
      var binding, _i, _len, _ref, _results;
      _ref = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        _results.push(binding.unbind());
      }
      return _results;
    };

    View.prototype.sync = function() {
      var binding, _i, _len, _ref, _results;
      _ref = this.bindings;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        _results.push(binding.sync());
      }
      return _results;
    };

    View.prototype.publish = function() {
      var binding, _i, _len, _ref, _results;
      _ref = this.select(function(b) {
        return b.binder.publishes;
      });
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        _results.push(binding.publish());
      }
      return _results;
    };

    return View;

  })();

  bindEvent = function(el, event, handler, context) {
    var fn;
    fn = function(e) {
      return handler.call(context, e);
    };
    if (window.jQuery != null) {
      el = jQuery(el);
      if (el.on != null) {
        el.on(event, fn);
      } else {
        el.bind(event, fn);
      }
    } else if (window.addEventListener != null) {
      el.addEventListener(event, fn, false);
    } else {
      event = 'on' + event;
      el.attachEvent(event, fn);
    }
    return fn;
  };

  unbindEvent = function(el, event, fn) {
    if (window.jQuery != null) {
      el = jQuery(el);
      if (el.off != null) {
        return el.off(event, fn);
      } else {
        return el.unbind(event, fn);
      }
    } else if (window.removeEventListener) {
      return el.removeEventListener(event, fn, false);
    } else {
      event = 'on' + event;
      return el.detachEvent(event, fn);
    }
  };

  getInputValue = function(el) {
    var o, _i, _len, _results;
    switch (el.type) {
      case 'checkbox':
        return el.checked;
      case 'select-multiple':
        _results = [];
        for (_i = 0, _len = el.length; _i < _len; _i++) {
          o = el[_i];
          if (o.selected) {
            _results.push(o.value);
          }
        }
        return _results;
        break;
      default:
        return el.value;
    }
  };

  Rivets.binders = {
    enabled: function(el, value) {
      return el.disabled = !value;
    },
    disabled: function(el, value) {
      return el.disabled = !!value;
    },
    checked: {
      publishes: true,
      bind: function(el) {
        return this.currentListener = bindEvent(el, 'change', this.publish);
      },
      unbind: function(el) {
        return unbindEvent(el, 'change', this.currentListener);
      },
      routine: function(el, value) {
        if (el.type === 'radio') {
          return el.checked = el.value === value;
        } else {
          return el.checked = !!value;
        }
      }
    },
    unchecked: {
      publishes: true,
      bind: function(el) {
        return this.currentListener = bindEvent(el, 'change', this.publish);
      },
      unbind: function(el) {
        return unbindEvent(el, 'change', this.currentListener);
      },
      routine: function(el, value) {
        if (el.type === 'radio') {
          return el.checked = el.value !== value;
        } else {
          return el.checked = !value;
        }
      }
    },
    show: function(el, value) {
      return el.style.display = value ? '' : 'none';
    },
    hide: function(el, value) {
      return el.style.display = value ? 'none' : '';
    },
    html: function(el, value) {
      return el.innerHTML = value != null ? value : '';
    },
    value: {
      publishes: true,
      bind: function(el) {
        return this.currentListener = bindEvent(el, 'change', this.publish);
      },
      unbind: function(el) {
        return unbindEvent(el, 'change', this.currentListener);
      },
      routine: function(el, value) {
        var o, _i, _len, _ref, _results;
        if (el.type === 'select-multiple') {
          if (value != null) {
            _results = [];
            for (_i = 0, _len = el.length; _i < _len; _i++) {
              o = el[_i];
              _results.push(o.selected = (_ref = o.value, __indexOf.call(value, _ref) >= 0));
            }
            return _results;
          }
        } else {
          return el.value = value != null ? value : '';
        }
      }
    },
    text: function(el, value) {
      if (el.innerText != null) {
        return el.innerText = value != null ? value : '';
      } else {
        return el.textContent = value != null ? value : '';
      }
    },
    "on-*": {
      "function": true,
      routine: function(el, value) {
        if (this.currentListener) {
          unbindEvent(el, this.args[0], this.currentListener);
        }
        return this.currentListener = bindEvent(el, this.args[0], value, this.model);
      }
    },
    "each-*": {
      block: true,
      bind: function(el, collection) {
        return el.removeAttribute(['data', rivets.config.prefix, this.type].join('-').replace('--', '-'));
      },
      routine: function(el, collection) {
        var data, e, item, itemEl, m, n, previous, view, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _results;
        if (this.iterated != null) {
          _ref = this.iterated;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            view = _ref[_i];
            view.unbind();
            _ref1 = view.els;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              e = _ref1[_j];
              e.parentNode.removeChild(e);
            }
          }
        } else {
          this.marker = document.createComment(" rivets: " + this.type + " ");
          el.parentNode.insertBefore(this.marker, el);
          el.parentNode.removeChild(el);
        }
        this.iterated = [];
        if (collection) {
          _results = [];
          for (_k = 0, _len2 = collection.length; _k < _len2; _k++) {
            item = collection[_k];
            data = {};
            _ref2 = this.view.models;
            for (n in _ref2) {
              m = _ref2[n];
              data[n] = m;
            }
            data[this.args[0]] = item;
            itemEl = el.cloneNode(true);
            if (this.iterated.length > 0) {
              previous = this.iterated[this.iterated.length - 1].els[0];
            } else {
              previous = this.marker;
            }
            this.marker.parentNode.insertBefore(itemEl, (_ref3 = previous.nextSibling) != null ? _ref3 : null);
            _results.push(this.iterated.push(rivets.bind(itemEl, data)));
          }
          return _results;
        }
      }
    },
    "class-*": function(el, value) {
      var elClass;
      elClass = " " + el.className + " ";
      if (!value === (elClass.indexOf(" " + this.args[0] + " ") !== -1)) {
        return el.className = value ? "" + el.className + " " + this.args[0] : elClass.replace(" " + this.args[0] + " ", ' ').trim();
      }
    },
    "*": function(el, value) {
      if (value) {
        return el.setAttribute(this.type, value);
      } else {
        return el.removeAttribute(this.type);
      }
    }
  };

  Rivets.config = {
    preloadData: true
  };

  Rivets.formatters = {};

  rivets = {
    binders: Rivets.binders,
    formatters: Rivets.formatters,
    config: Rivets.config,
    configure: function(options) {
      var property, value;
      if (options == null) {
        options = {};
      }
      for (property in options) {
        value = options[property];
        Rivets.config[property] = value;
      }
    },
    bind: function(el, models) {
      var view;
      if (models == null) {
        models = {};
      }
      view = new Rivets.View(el, models);
      view.bind();
      return view;
    }
  };

  if (typeof module !== "undefined" && module !== null) {
    module.exports = rivets;
  } else {
    this.rivets = rivets;
  }

}).call(this);

});
require.register("segmentio-extend/index.js", function(exports, require, module){

module.exports = function extend (object) {
    // Takes an unlimited number of extenders.
    var args = Array.prototype.slice.call(arguments, 1);

    // For each extender, copy their properties on our object.
    for (var i = 0, source; source = args[i]; i++) {
        if (!source) continue;
        for (var property in source) {
            object[property] = source[property];
        }
    }

    return object;
};
});
require.register("wearefractal-mixer/dist/main.js", function(exports, require, module){
// Generated by CoffeeScript 1.4.0
(function() {
  var EventEmitter, Module, mixer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (typeof process !== "undefined" && process !== null) {
    EventEmitter = require('events').EventEmitter;
  } else {
    EventEmitter = require('emitter');
  }

  Module = (function(_super) {

    __extends(Module, _super);

    function Module(o) {
      this._ = {
        props: {}
      };
      if (o != null) {
        this.set(o);
      }
    }

    Module.prototype.get = function(k) {
      return this._.props[k];
    };

    Module.prototype.getAll = function() {
      return this._.props;
    };

    Module.prototype.set = function(k, v, silent) {
      var ky;
      if (k == null) {
        return;
      }
      if (typeof k === 'object') {
        for (ky in k) {
          v = k[ky];
          this.set(ky, v);
        }
        return this;
      } else {
        if (v == null) {
          return;
        }
        this._.props[k] = v;
        if (!silent) {
          this.emit("change", k, v);
          this.emit("change:" + k, v);
        }
        return this;
      }
    };

    Module.prototype.has = function(k) {
      return this._.props[k] != null;
    };

    Module.prototype.remove = function(k, silent) {
      delete this._.props[k];
      if (!silent) {
        this.emit("change", k);
        this.emit("change:" + k);
        this.emit("remove", k);
        this.emit("remove:" + k);
      }
      return this;
    };

    return Module;

  })(EventEmitter);

  mixer = {
    Module: Module,
    Emitter: EventEmitter
  };

  module.exports = mixer;

}).call(this);

});
require.register("anthonyshort-event-splitter/index.js", function(exports, require, module){
// Cached regex to split keys for `delegate`.
var delegateEventSplitter = /^(\S+)\s*(.*)$/;

// Split a string event like 'click .foo ul'
module.exports = function(str) {
  var match = str.match(delegateEventSplitter);
  return {
    name: match[1],
    selector: match[2]
  };
};
});
require.register("visionmedia-page.js/index.js", function(exports, require, module){

;(function(){

  /**
   * Perform initial dispatch.
   */

  var dispatch = true;

  /**
   * Base path.
   */

  var base = '';

  /**
   * Running flag.
   */

  var running;

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page();
   *
   * @param {String|Function} path
   * @param {Function} fn...
   * @api public
   */

  function page(path, fn) {
    // <callback>
    if ('function' == typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' == typeof fn) {
      var route = new Route(path);
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
    // show <path> with [state]
    } else if ('string' == typeof path) {
      page.show(path, fn);
    // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];

  /**
   * Get or set basepath to `path`.
   *
   * @param {String} path
   * @api public
   */

  page.base = function(path){
    if (0 == arguments.length) return base;
    base = path;
  };

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options){
    options = options || {};
    if (running) return;
    running = true;
    if (false === options.dispatch) dispatch = false;
    if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
    if (false !== options.click) window.addEventListener('click', onclick, false);
    if (!dispatch) return;
    page.replace(location.pathname + location.search, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function(){
    running = false;
    removeEventListener('click', onclick, false);
    removeEventListener('popstate', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @param {Boolean} dispatch
   * @return {Context}
   * @api public
   */

  page.show = function(path, state, dispatch){
    var ctx = new Context(path, state);
    if (false !== dispatch) page.dispatch(ctx);
    if (!ctx.unhandled) ctx.pushState();
    return ctx;
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @return {Context}
   * @api public
   */

  page.replace = function(path, state, init, dispatch){
    var ctx = new Context(path, state);
    ctx.init = init;
    if (null == dispatch) dispatch = true;
    if (dispatch) page.dispatch(ctx);
    ctx.save();
    return ctx;
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Object} ctx
   * @api private
   */

  page.dispatch = function(ctx){
    var i = 0;

    function next() {
      var fn = page.callbacks[i++];
      if (!fn) return unhandled(ctx);
      fn(ctx, next);
    }

    next();
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */

  function unhandled(ctx) {
    if (window.location.pathname + window.location.search == ctx.canonicalPath) return;
    page.stop();
    ctx.unhandled = true;
    window.location = ctx.canonicalPath;
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @param {String} path
   * @param {Object} state
   * @api public
   */

  function Context(path, state) {
    if ('/' == path[0] && 0 != path.indexOf(base)) path = base + path;
    var i = path.indexOf('?');
    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';
    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? path.slice(i + 1) : '';
    this.pathname = ~i ? path.slice(0, i) : path;
    this.params = [];
  }

  /**
   * Expose `Context`.
   */

  page.Context = Context;

  /**
   * Push state.
   *
   * @api private
   */

  Context.prototype.pushState = function(){
    history.pushState(this.state, this.title, this.canonicalPath);
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function(){
    history.replaceState(this.state, this.title, this.canonicalPath);
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @param {String} path
   * @param {Object} options.
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    this.path = path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(path
      , this.keys = []
      , options.sensitive
      , options.strict);
  }

  /**
   * Expose `Route`.
   */

  page.Route = Route;

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn){
    var self = this;
    return function(ctx, next){
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    }
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {String} path
   * @param {Array} params
   * @return {Boolean}
   * @api private
   */

  Route.prototype.match = function(path, params){
    var keys = this.keys
      , qsIndex = path.indexOf('?')
      , pathname = ~qsIndex ? path.slice(0, qsIndex) : path
      , m = this.regexp.exec(pathname);

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];

      var val = 'string' == typeof m[i]
        ? decodeURIComponent(m[i])
        : m[i];

      if (key) {
        params[key.name] = undefined !== params[key.name]
          ? params[key.name]
          : val;
      } else {
        params.push(val);
      }
    }

    return true;
  };

  /**
   * Normalize the given path string,
   * returning a regular expression.
   *
   * An empty array should be passed,
   * which will contain the placeholder
   * key names. For example "/user/:id" will
   * then contain ["id"].
   *
   * @param  {String|RegExp|Array} path
   * @param  {Array} keys
   * @param  {Boolean} sensitive
   * @param  {Boolean} strict
   * @return {RegExp}
   * @api private
   */

  function pathtoRegexp(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (path instanceof Array) path = '(' + path.join('|') + ')';
    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
          + (optional || '');
      })
      .replace(/([\/.])/g, '\\$1')
      .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  };

  /**
   * Handle "populate" events.
   */

  function onpopstate(e) {
    if (e.state) {
      var path = e.state.path;
      page.replace(path, e.state);
    }
  }

  /**
   * Handle "click" events.
   */

  function onclick(e) {
    if (1 != which(e)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;

    // ensure link
    var el = e.target;
    while (el && 'A' != el.nodeName) el = el.parentNode;
    if (!el || 'A' != el.nodeName) return;

    // ensure non-hash
    var href = el.href;
    var path = el.pathname + el.search;
    if (el.hash || '#' == el.getAttribute('href')) return;

    // check target
    if (el.target) return;

    // x-origin
    if (!sameOrigin(href)) return;

    // same page
    var orig = path;
    path = path.replace(base, '');
    if (base && orig == path) return;

    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || window.event;
    return null == e.which
      ? e.button
      : e.which;
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port) origin += ':' + location.port;
    return 0 == href.indexOf(origin);
  }

  /**
   * Expose `page`.
   */

  if ('undefined' == typeof module) {
    window.page = page;
  } else {
    module.exports = page;
  }

})();

});
require.register("dermis/dist/delegate.js", function(exports, require, module){
// Generated by CoffeeScript 1.4.0
(function() {
  var Delegate, splitEvents;

  splitEvents = require('event-splitter');

  Delegate = (function() {

    Delegate.prototype._binds = [];

    function Delegate(root, events, context) {
      this.root = root;
      this.events = events != null ? events : {};
      this.context = context != null ? context : {};
    }

    Delegate.prototype.bindEvent = function(selector, event, handler) {
      if (typeof handler === "string") {
        handler = this.context[handler];
      }
      $(this.root).on(event, selector, handler);
      this._binds.push([event, selector, handler]);
      return this;
    };

    Delegate.prototype.unbindEvent = function(selector, event, handler) {
      if (typeof handler === "string") {
        handler = this.context[handler];
      }
      $(this.root).off(event, selector, handler);
      return this;
    };

    Delegate.prototype.bind = function() {
      var evhandler, handler, name, selector, str, _ref, _ref1;
      _ref = this.events;
      for (str in _ref) {
        handler = _ref[str];
        if (typeof handler === 'object') {
          for (name in handler) {
            evhandler = handler[name];
            this.bindEvent(str, name, evhandler);
          }
        } else {
          _ref1 = splitEvents(str), name = _ref1.name, selector = _ref1.selector;
          this.bindEvent(selector, name, handler);
        }
      }
      return this;
    };

    Delegate.prototype.unbind = function() {
      var z, _i, _len, _ref;
      _ref = this._binds;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        z = _ref[_i];
        this.unbindEvent.apply(this, z);
      }
      this._binds = [];
      return this;
    };

    return Delegate;

  })();

  module.exports = Delegate;

}).call(this);

});
require.register("dermis/dist/makeElement.js", function(exports, require, module){
// Generated by CoffeeScript 1.4.0
(function() {

  module.exports = function(tagName, attributes, content) {
    var el;
    el = document.createElement(tagName);
    if (attributes) {
      $(el).attr(attributes);
    }
    if (content) {
      $(el).html(content);
    }
    return el;
  };

}).call(this);

});
require.register("dermis/dist/rivetsConfig.js", function(exports, require, module){
// Generated by CoffeeScript 1.4.0
(function() {

  module.exports = {
    adapter: {
      subscribe: function(obj, kp, cb) {
        if (obj._isCollection) {
          obj.on("add", function() {
            return cb[kp];
          });
          obj.on("remove", function() {
            return cb[kp];
          });
          obj.on("reset", function() {
            return cb[kp];
          });
        } else {
          kp = (kp === "" ? "change" : "change:" + kp);
          obj.on(kp, cb);
        }
      },
      unsubscribe: function(obj, kp, cb) {
        if (obj._isCollection) {
          obj.removeListener("add", function() {
            return cb[kp];
          });
          obj.removeListener("remove", function() {
            return cb[kp];
          });
          obj.removeListener("reset", function() {
            return cb[kp];
          });
        } else {
          kp = (kp === "" ? "change" : "change:" + kp);
          obj.removeListener(kp, cb);
        }
      },
      read: function(obj, kp) {
        if (obj._isCollection) {
          return obj[kp];
        } else {
          return obj.get(kp);
        }
      },
      publish: function(obj, kp, val) {
        if (obj._isCollection) {
          obj[kp] = val;
        } else {
          obj.set(kp, val);
        }
      }
    }
  };

}).call(this);

});
require.register("dermis/dist/Model.js", function(exports, require, module){
// Generated by CoffeeScript 1.4.0
(function() {
  var Model, mixer, rivets, rivetsConfig,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mixer = require('mixer');

  rivets = require('rivets');

  rivetsConfig = require('./rivetsConfig');

  Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    Model.prototype._isModel = true;

    Model.prototype.bind = function(el) {
      rivets.configure(rivetsConfig);
      return rivets.bind(el, this);
    };

    return Model;

  })(mixer.Module);

  module.exports = Model;

}).call(this);

});
require.register("dermis/dist/Collection.js", function(exports, require, module){
// Generated by CoffeeScript 1.4.0
(function() {
  var Collection, Emitter, Model, rivets, rivetsConfig,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Emitter = require('emitter');

  rivets = require('rivets');

  rivetsConfig = require('./rivetsConfig');

  Model = require('./Model');

  Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    Collection.prototype.model = Model;

    Collection.prototype.models = [];

    Collection.prototype._isCollection = true;

    Collection.prototype.push = function() {
      return this.add.apply(this, arguments);
    };

    Collection.prototype.add = function(o, opt) {
      var i, mod, _i, _len;
      if (opt == null) {
        opt = {};
      }
      if (Array.isArray(o)) {
        for (_i = 0, _len = o.length; _i < _len; _i++) {
          i = o[_i];
          this.add(i, opt);
        }
        return this;
      }
      if (o instanceof Model) {
        mod = o;
      } else {
        mod = new this.model(o);
      }
      this.models.push(mod);
      if (!opt.silent) {
        this.emit("add", mod);
      }
      return this;
    };

    Collection.prototype.remove = function(o, opt) {
      var i, idx, _i, _len;
      if (opt == null) {
        opt = {};
      }
      if (Array.isArray(o)) {
        for (_i = 0, _len = o.length; _i < _len; _i++) {
          i = o[_i];
          this.remove(i, opt);
        }
        return this;
      }
      idx = this.models.indexOf(o);
      if (idx !== -1) {
        this.models.splice(idx, 1);
        if (!opt.silent) {
          this.emit("remove", mod);
        }
      }
      return this;
    };

    Collection.prototype.each = function(fn) {
      return this.models.forEach(fn);
    };

    Collection.prototype.map = function(fn) {
      return this.models.map(fn);
    };

    Collection.prototype.filter = function(fn) {
      return this.models.filter(fn);
    };

    Collection.prototype.where = function(obj) {
      if (obj == null) {
        obj = {};
      }
      return this.models.filter(function(item) {
        var k, v;
        for (k in obj) {
          v = obj[k];
          if (item[k] !== v) {
            return false;
          }
        }
        return true;
      });
    };

    Collection.prototype.get = function(idx) {
      return this.models[idx];
    };

    Collection.prototype.pluck = function(attr) {
      return this.map(function(v) {
        return v[attr];
      });
    };

    Collection.prototype.first = function() {
      return this.models[0];
    };

    Collection.prototype.last = function() {
      return this.models[this.models.length - 1];
    };

    Collection.prototype.bind = function(el) {
      rivets.configure(rivetsConfig);
      return rivets.bind(el, this);
    };

    return Collection;

  })(Emitter);

  module.exports = Collection;

}).call(this);

});
require.register("dermis/dist/View.js", function(exports, require, module){
// Generated by CoffeeScript 1.4.0
(function() {
  var Delegate, Emitter, View, extend, guid, makeElement,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Emitter = require('emitter');

  guid = require('guid');

  Delegate = require('./delegate');

  extend = require('extend');

  makeElement = require('./makeElement');

  View = (function(_super) {

    __extends(View, _super);

    function View(opt) {
      if (opt == null) {
        opt = {};
      }
      this._id = guid();
      this._configure(opt);
      this._ensureElement();
      this.initialize.apply(this, arguments);
      this.eventBindings = new Delegate(this.$el, this.events, this);
      this.delegateEvents();
    }

    View.prototype.tagName = 'div';

    View.prototype.$ = function(sel) {
      return this.$el.find(sel);
    };

    View.prototype.initialize = function() {};

    View.prototype.render = function() {
      return this;
    };

    View.prototype.dispose = function() {
      this.undelegateEvents();
      return this;
    };

    View.prototype.remove = function() {
      this.dispose();
      this.$el.remove();
      return this;
    };

    View.prototype.setElement = function(el, delegate) {
      if (delegate == null) {
        delegate = true;
      }
      if (this.$el) {
        this.undelegateEvents();
      }
      this.$el = $(el);
      this.el = this.$el[0];
      if (delegate) {
        this.delegateEvents();
      }
      return this;
    };

    View.prototype.delegateEvents = function() {
      this.undelegateEvents();
      this.eventBindings.bind();
      return this;
    };

    View.prototype.undelegateEvents = function() {
      var _ref;
      if ((_ref = this.eventBindings) != null) {
        _ref.unbind();
      }
      return this;
    };

    View.prototype._configure = function(opt) {
      if (this.options) {
        this.options = this.extend({}, this.options, opt);
      }
      return this;
    };

    View.prototype._ensureElement = function() {
      var attr, virt;
      if (this.el) {
        this.setElement(this.el, false);
      } else {
        attr = extend({}, this.attributes);
        if (this.id) {
          attr.id = this.id;
        }
        if (this.className) {
          attr["class"] = this.className;
        }
        virt = makeElement(this.tagName, attr, this.content);
        this.setElement(virt, false);
      }
      return this;
    };

    return View;

  })(Emitter);

  module.exports = View;

}).call(this);

});
require.register("dermis/dist/Layout.js", function(exports, require, module){
// Generated by CoffeeScript 1.4.0
(function() {
  var Emitter, Layout, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Emitter = require('emitter');

  View = require('./View');

  Layout = (function(_super) {

    __extends(Layout, _super);

    function Layout() {
      this.clear = __bind(this.clear, this);

      this.show = __bind(this.show, this);

      this.set = __bind(this.set, this);

      this.get = __bind(this.get, this);

      this.$get = __bind(this.$get, this);

      this.$set = __bind(this.$set, this);
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.$regions = {};

    Layout.prototype._regions = {};

    Layout.prototype.wrap = function(name, vu) {
      var _this = this;
      return function() {
        var a;
        a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _this.set(name, vu);
        _this.show.apply(_this, [name, vu].concat(__slice.call(a)));
        return _this;
      };
    };

    Layout.prototype.render = function() {
      var name, select, v, _ref, _ref1;
      this.$el.empty();
      if (this.template != null) {
        this.$el.append(this.template.apply(this, arguments));
      }
      _ref = this.regions;
      for (name in _ref) {
        if (!__hasProp.call(_ref, name)) continue;
        select = _ref[name];
        this.$set(name, select);
      }
      if (this.views != null) {
        _ref1 = this.views;
        for (name in _ref1) {
          if (!__hasProp.call(_ref1, name)) continue;
          v = _ref1[name];
          this.set(name, v);
        }
      }
      this.emit("render", this);
      return this;
    };

    Layout.prototype.$set = function(name, selector) {
      return this.$regions[name] = this.$(selector);
    };

    Layout.prototype.$get = function(name) {
      return this.$regions[name];
    };

    Layout.prototype.get = function(name) {
      return this._regions[name];
    };

    Layout.prototype.set = function(name, nu) {
      if (!this.$regions[name]) {
        throw new Error("Invalid region");
      }
      this._regions[name] = nu;
      this.emit("change:" + name, nu);
      this.emit("change", name, nu);
      return this;
    };

    Layout.prototype.show = function() {
      var a, name, vu;
      name = arguments[0], a = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!this.$regions[name]) {
        throw new Error("Invalid region");
      }
      if (!this._regions[name]) {
        throw new Error("Region not set to a view");
      }
      this.clear(name);
      vu = this._regions[name];
      vu.setElement(vu.el);
      this.$regions[name].html(vu.render.apply(vu, a).el);
      this.emit("show:" + name);
      this.emit("show", name);
      return this;
    };

    Layout.prototype.clear = function(name) {
      var _ref, _ref1;
      if ((_ref = this._regions[name]) != null) {
        if (typeof _ref.remove === "function") {
          _ref.remove();
        }
      }
      if ((_ref1 = this._regions[name]) != null) {
        if (typeof _ref1.close === "function") {
          _ref1.close();
        }
      }
      this.emit("clear:" + name);
      this.emit("clear", name);
      return this;
    };

    return Layout;

  })(View);

  module.exports = Layout;

}).call(this);

});
require.register("dermis/dist/Router.js", function(exports, require, module){
// Generated by CoffeeScript 1.4.0
(function() {
  var Emitter, Router, page,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Emitter = require('emitter');

  page = require('page');

  Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.add = function(route, handler) {
      var fn, h, rt, _i, _len;
      if (typeof route === 'object') {
        for (rt in route) {
          if (!__hasProp.call(route, rt)) continue;
          h = route[rt];
          this.add(rt, h);
        }
        return;
      }
      if (Array.isArray(handler)) {
        for (_i = 0, _len = handler.length; _i < _len; _i++) {
          fn = handler[_i];
          this.add(route, fn);
        }
        return;
      }
      if (typeof handler === 'string') {
        handler = this[handler];
      }
      page(route, handler);
      return this;
    };

    Router.prototype.base = function() {
      page.base.apply(page, arguments);
      return this;
    };

    Router.prototype.show = function() {
      page.show.apply(page, arguments);
      return this;
    };

    Router.prototype.use = function() {
      page.apply(null, ['*'].concat(__slice.call(arguments)));
      return this;
    };

    Router.prototype.start = function() {
      page.start.apply(page, arguments);
      return this;
    };

    Router.prototype.stop = function() {
      page.stop.apply(page, arguments);
      return this;
    };

    return Router;

  })(Emitter);

  module.exports = Router;

}).call(this);

});
require.register("dermis/dist/Channel.js", function(exports, require, module){
// Generated by CoffeeScript 1.4.0
(function() {
  var Channel, Emitter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Emitter = require('emitter');

  Channel = (function(_super) {

    __extends(Channel, _super);

    function Channel() {
      return Channel.__super__.constructor.apply(this, arguments);
    }

    return Channel;

  })(Emitter);

  module.exports = Channel;

}).call(this);

});
require.register("dermis/dist/dermis.js", function(exports, require, module){
// Generated by CoffeeScript 1.4.0
(function() {
  var Channel, Router, dermis;

  Router = require('./Router');

  Channel = require('./Channel');

  dermis = {
    Layout: require('./Layout'),
    Model: require('./Model'),
    View: require('./View'),
    Collection: require('./Collection'),
    Channel: Channel,
    Router: Router,
    Emitter: require('emitter'),
    router: new Router,
    channel: new Channel
  };

  module.exports = dermis;

}).call(this);

});
require.alias("component-emitter/index.js", "dermis/deps/emitter/index.js");

require.alias("apily-guid/index.js", "dermis/deps/guid/index.js");

require.alias("mikeric-rivets/lib/rivets.js", "dermis/deps/rivets/lib/rivets.js");
require.alias("mikeric-rivets/lib/rivets.js", "dermis/deps/rivets/index.js");
require.alias("mikeric-rivets/lib/rivets.js", "mikeric-rivets/index.js");

require.alias("segmentio-extend/index.js", "dermis/deps/extend/index.js");

require.alias("wearefractal-mixer/dist/main.js", "dermis/deps/mixer/dist/main.js");
require.alias("wearefractal-mixer/dist/main.js", "dermis/deps/mixer/index.js");
require.alias("component-emitter/index.js", "wearefractal-mixer/deps/emitter/index.js");

require.alias("wearefractal-mixer/dist/main.js", "wearefractal-mixer/index.js");

require.alias("anthonyshort-event-splitter/index.js", "dermis/deps/event-splitter/index.js");

require.alias("visionmedia-page.js/index.js", "dermis/deps/page/index.js");

require.alias("dermis/dist/dermis.js", "dermis/index.js");

if (typeof exports == "object") {
  module.exports = require("dermis");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("dermis"); });
} else {
  window["dermis"] = require("dermis");
}})();