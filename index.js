"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function RActions() {
  return {
    getValueByField: function getValueByField(obj, field) {
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
    },
    setValueByField: function setValueByField(obj, field, value) {
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
    },
    eventHandler: function eventHandler(selector, event, action) {
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
    },
    getClient: function getClient(e) {
      return {
        x: e.clientX === undefined ? e.changedTouches[0].clientX : e.clientX,
        y: e.clientY === undefined ? e.changedTouches[0].clientY : e.clientY
      };
    },
    getLineBySMA: function getLineBySMA(_ref) {
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
    },
    getValueByRange: function getValueByRange(value, start, end) {
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
    },
    getStartByStep: function getStartByStep(start, step) {
      var a = Math.round((start - step) / step) * step;

      while (a < start) {
        a += step;
      }

      return a;
    }
  };
}

var _default = RActions;
exports.default = _default;