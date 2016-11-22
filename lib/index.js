(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('panAndZoomHoc', ['exports', './panAndZoomHoc'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./panAndZoomHoc'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.panAndZoomHoc);
    global.panAndZoomHoc = mod.exports;
  }
})(this, function (exports, _panAndZoomHoc) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _panAndZoomHoc2 = _interopRequireDefault(_panAndZoomHoc);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _panAndZoomHoc2.default;
});