"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RActions =
/*#__PURE__*/
function () {
  function RActions() {
    _classCallCheck(this, RActions);
  }

  _createClass(RActions, [{
    key: "getValueByField",
    value: function getValueByField(obj, field) {
      if (!field) {
        return undefined;
      }

      var fields = (typeof field === 'function' ? field(obj) : field).split('.');
      var value = obj[fields[0]];

      if (value === undefined) {
        return;
      }

      for (var i = 1; i < fields.length; i++) {
        value = value[fields[i]];

        if (value === undefined) {
          return;
        }
      }

      return value;
    }
  }, {
    key: "setValueByField",
    value: function setValueByField(obj, field, value) {
      var fields = field.split('.');
      var node = obj;

      for (var i = 0; i < fields.length - 1; i++) {
        if (node[fields[i]] === undefined) {
          return;
        }

        node = node[fields[i]];
      }

      node[fields[fields.length - 1]] = value;
      return obj;
    }
  }, {
    key: "eventHandler",
    value: function eventHandler(selector, event, action) {
      var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'bind';
      var me = {
        mousedown: "touchstart",
        mousemove: "touchmove",
        mouseup: "touchend"
      };
      event = 'ontouchstart' in document.documentElement ? me[event] : event;
      var element = typeof selector === "string" ? selector === "window" ? (0, _jquery.default)(window) : (0, _jquery.default)(selector) : selector;
      element.unbind(event, action);

      if (type === 'bind') {
        element.bind(event, action);
      }
    }
  }, {
    key: "getClient",
    value: function getClient(e) {
      return {
        x: e.clientX === undefined ? e.changedTouches[0].clientX : e.clientX,
        y: e.clientY === undefined ? e.changedTouches[0].clientY : e.clientY
      };
    }
  }, {
    key: "getLineBySMA",
    value: function getLineBySMA(_ref) {
      var p1 = _ref.p1,
          measure = _ref.measure,
          angle = _ref.angle;
      return {
        p1: p1,
        p2: {
          x: p1.x + Math.cos(angle * Math.PI / 180) * measure,
          y: p1.y + Math.sin(angle * -1 * Math.PI / 180) * measure
        }
      };
    }
  }, {
    key: "getValueByRange",
    value: function getValueByRange(value, start, end) {
      var val;

      if (value === undefined) {
        return start;
      }

      if (typeof value === 'number') {
        val = value;
      } else {
        if (value.indexOf('%') !== -1) {
          var range = end - start;
          val = range * parseFloat(value) / 100 + start;
        } else {
          val = parseFloat(value);
        }
      }

      val = val > end ? end : val;
      val = val < start ? start : val;
      return val;
    }
  }, {
    key: "getStartByStep",
    value: function getStartByStep(start, step) {
      var a = Math.round((start - step) / step) * step;

      while (a < start) {
        a += step;
      }

      return a;
    }
  }]);

  return RActions;
}();

exports.default = RActions;