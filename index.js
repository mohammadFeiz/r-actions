"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RActions = function RActions() {
  var _this = this;

  _classCallCheck(this, RActions);

  this.getValueByField = function (obj, field) {
    if (!field || field === null) {
      return undefined;
    }

    var fieldString = typeof field === 'function' ? field(obj) : field;

    if (!fieldString || typeof fieldString !== 'string') {
      console.error('r-actions.getValueByField() receive invalid field');
      return undefined;
    }

    var fields = fieldString.split('.');
    var value = obj[fields[0]];

    if (value === undefined) {
      return;
    }

    for (var i = 1; i < fields.length; i++) {
      value = value[fields[i]];

      if (value === undefined || value === null) {
        return;
      }
    }

    return value;
  };

  this.getCopy = function (obj) {
    return JSON.parse(JSON.stringify(obj));
  };

  this.setValueByField = function (obj, field, value) {
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
  };

  this.isMobile = function () {
    return 'ontouchstart' in document.documentElement;
  };

  this.eventHandler = function (selector, event, action) {
    var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'bind';
    var me = {
      mousedown: "touchstart",
      mousemove: "touchmove",
      mouseup: "touchend"
    };
    event = _this.isMobile() ? me[event] : event;
    var element = typeof selector === "string" ? selector === "window" ? (0, _jquery.default)(window) : (0, _jquery.default)(selector) : selector;
    element.unbind(event, action);

    if (type === 'bind') {
      element.bind(event, action);
    }
  };

  this.getClient = function (e) {
    var mobile = _this.isMobile();

    return mobile ? {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    } : {
      x: e.clientX,
      y: e.clientY
    };
  };

  this.getLineBySMA = function (_ref) {
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
  };

  this.getValueByRange = function (value, start, end) {
    var val;

    if (value === undefined) {
      return start;
    }

    var type = _typeof(value);

    if (type === 'function') {
      val = value(start, end);
    } else if (type === 'number') {
      val = value;
    } else {
      if (value.indexOf('%') !== -1) {
        var range = end - start;
        val = range * parseFloat(value) / 100 + start;
      } else {
        val = parseFloat(value);
      }
    }

    return val;
  };

  this.getPercentByValue = function (value, start, end) {
    return 100 * (value - start) / (end - start);
  };

  this.getValueByPercent = function (percent, start, end) {
    return start + percent * (end - start) / 100;
  };

  this.getStartByStep = function (start, step) {
    var a = Math.round((start - step) / step) * step;

    while (a < start) {
      a += step;
    }

    return a;
  };

  this.fix = function (number) {
    var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
    return parseFloat(number.toFixed(a));
  };

  this.searchComposite = function (model, query) {
    var childsProp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'childs';

    var searchRowRecursive = function searchRowRecursive(data, query) {
      if (_this.searchResult !== undefined) {
        return;
      }

      for (var i = 0; i < data.length; i++) {
        if (_this.searchResult !== undefined) {
          break;
        }

        var row = data[i];

        for (var prop in query) {
          var value = _this.getValueByField(row, prop);

          if (value !== query[prop]) {
            continue;
          }

          _this.searchResult = row;
          break;
        }

        if (row[childsProp] && row[childsProp].length) {
          searchRowRecursive(row[childsProp], query);
        }
      }
    };

    _this.searchResult = undefined;
    searchRowRecursive(model, query);
    return _this.searchResult;
  };

  this.convertFlatToComposite = function (model) {
    var idProp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'id';
    var parentIdProp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'parentId';

    var convertModelRecursive = function convertModelRecursive(model, parentId, parentObject) {
      for (var i = 0; i < model.length; i++) {
        var row = model[i];
        row._parent = _this.getValueByField(row, parentIdProp);

        if (row._parent !== parentId) {
          continue;
        }

        row._id = _this.getValueByField(row, idProp);
        row._childs = [];
        parentObject.push(row);
        convertModelRecursive(model, row._id, row._childs);
      }
    };

    var result = [];
    convertModelRecursive(model, undefined, result);
    return result;
  };

  this.compaire = function (a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  this.binarySearch = function (arr, value, field) {
    var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var start = 0,
        end = arr.length - 1;
    var startValue = field(arr[start]);
    var endValue = field(arr[end]);

    if (value < startValue) {
      return Math.abs(value - startValue) <= limit ? start : -1;
    }

    if (value > endValue) {
      return Math.abs(value - endValue) <= limit ? end : -1;
    }

    if (value === startValue) {
      return start;
    }

    if (value === endValue) {
      return end;
    }

    while (end - start > 1) {
      var mid = Math.floor((end + start) / 2);
      var mp = field(arr[mid]);
      var dif = value - mp;

      if (dif === 0) {
        return mid;
      }

      if (dif < 0) {
        end = mid;
      } //اگر مقدار در سمت چپ است
      else {
          start = mid;
        } //اگر مقدار در سمت راست است

    }

    var startDif = Math.abs(field(arr[start]) - value);
    var endDif = Math.abs(field(arr[end]) - value);

    if (startDif <= endDif) {
      return startDif <= limit ? start : -1;
    } else {
      return endDif <= limit ? end : -1;
    }
  }, this.compositeGenerator = function () {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    function msf(json, length, maxLevel) {
      var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
      var level = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var Length = random ? Math.floor(Math.random() * length) : length;
      var MaxLevel = random ? Math.ceil(Math.random() * maxLevel) : maxLevel;
      var Index = index !== '' ? index + ',' : '';

      for (var i = 0; i < Length; i++) {
        var obj = {
          nestedIndex: Index + i
        };
        json.push(obj);

        if (level < MaxLevel - 1) {
          var Fields = typeof fields === 'function' ? fields(obj.nestedIndex) : fields;

          for (var prop in Fields) {
            obj[prop] = Fields[prop];
          }

          var ChildsField = typeof ChildsField === 'function' ? childsField(obj.nestedIndex) : childsField;
          obj[ChildsField] = [];
          msf(obj[ChildsField], length, maxLevel, Index + i, level + 1);
        } else {
          var LeafFields = typeof leafFields === 'function' ? leafFields(obj.nestedIndex) : leafFields;

          for (var prop in LeafFields) {
            obj[prop] = LeafFields[prop];
          }
        }
      }
    }

    var model = [];
    var _x$length = x.length,
        length = _x$length === void 0 ? 3 : _x$length,
        _x$level = x.level,
        level = _x$level === void 0 ? 3 : _x$level,
        _x$fields = x.fields,
        fields = _x$fields === void 0 ? {} : _x$fields,
        _x$childsField = x.childsField,
        childsField = _x$childsField === void 0 ? 'childs' : _x$childsField,
        random = x.random,
        stringify = x.stringify,
        _x$leafFields = x.leafFields,
        leafFields = _x$leafFields === void 0 ? {} : _x$leafFields;
    msf(model, length, level);
    return stringify ? JSON.stringify(model) : model;
  };
};

exports.default = RActions;