"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
function panAndZoom(WrappedComponent) {
    return _a = /** @class */ (function (_super) {
            __extends(PanAndZoomHOC, _super);
            function PanAndZoomHOC() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.dx = 0;
                _this.dy = 0;
                _this.ds = 0;
                _this.element = null;
                _this.handleWheel = function (event) {
                    var _a = _this.props, onPanAndZoom = _a.onPanAndZoom, renderOnChange = _a.renderOnChange;
                    var x = _this.props.x;
                    var y = _this.props.y;
                    var scale = _this.props.scale;
                    var scaleFactor = _this.props.scaleFactor;
                    var minScale = _this.props.minScale;
                    var maxScale = _this.props.maxScale;
                    if (x !== undefined && y !== undefined && scale !== undefined && scaleFactor !== undefined && minScale !== undefined && maxScale !== undefined) {
                        var clientX = event.clientX, clientY = event.clientY, deltaY = event.deltaY;
                        var newScale = deltaY < 0 ? Math.min((scale + _this.ds) * scaleFactor, maxScale) : Math.max((scale + _this.ds) / scaleFactor, minScale);
                        var factor = newScale / (scale + _this.ds);
                        if (_this.element !== null && factor !== 1) {
                            var _b = _this.element.getBoundingClientRect(), top_1 = _b.top, left = _b.left, width = _b.width, height = _b.height;
                            var ex = clientX - left;
                            var ey = clientY - top_1;
                            var dx = (ex / width - 0.5) / (scale + _this.ds);
                            var dy = (ey / height - 0.5) / (scale + _this.ds);
                            var sdx = dx * (1 - 1 / factor);
                            var sdy = dy * (1 - 1 / factor);
                            _this.dx += sdx;
                            _this.dy += sdy;
                            _this.ds = newScale - scale;
                            if (onPanAndZoom) {
                                onPanAndZoom(x + _this.dx, y + _this.dy, scale + _this.ds, event);
                            }
                            if (renderOnChange) {
                                _this.forceUpdate();
                            }
                        }
                    }
                    event.preventDefault();
                };
                _this.panning = false;
                _this.panLastX = 0;
                _this.panLastY = 0;
                _this.handleMouseDown = function (event) {
                    if (!_this.panning) {
                        var onPanStart = _this.props.onPanStart;
                        var clientX = event.clientX, clientY = event.clientY;
                        _this.panLastX = clientX;
                        _this.panLastY = clientY;
                        _this.panning = true;
                        document.addEventListener('mousemove', _this.handleMouseMove);
                        document.addEventListener('mouseup', _this.handleMouseUp);
                        if (onPanStart) {
                            onPanStart(event);
                        }
                    }
                };
                _this.handleMouseMove = function (event) {
                    if (_this.panning && _this.element) {
                        var _a = _this.props, onPanMove = _a.onPanMove, renderOnChange = _a.renderOnChange;
                        var x = _this.props.x;
                        var y = _this.props.y;
                        var scale = _this.props.scale;
                        if (x !== undefined && y !== undefined && scale !== undefined) {
                            var clientX = event.clientX, clientY = event.clientY;
                            var _b = _this.element.getBoundingClientRect(), width = _b.width, height = _b.height;
                            var dx = clientX - _this.panLastX;
                            var dy = clientY - _this.panLastY;
                            _this.panLastX = clientX;
                            _this.panLastY = clientY;
                            var sdx = dx / (width * (scale + _this.ds));
                            var sdy = dy / (height * (scale + _this.ds));
                            _this.dx -= sdx;
                            _this.dy -= sdy;
                            if (onPanMove) {
                                onPanMove(x + _this.dx, y + _this.dy, event);
                            }
                            if (renderOnChange) {
                                _this.forceUpdate();
                            }
                        }
                    }
                };
                _this.handleMouseUp = function (event) {
                    if (_this.panning && _this.element) {
                        var _a = _this.props, onPanEnd = _a.onPanEnd, renderOnChange = _a.renderOnChange;
                        var x = _this.props.x;
                        var y = _this.props.y;
                        var scale = _this.props.scale;
                        if (x !== undefined && y !== undefined && scale !== undefined) {
                            var clientX = event.clientX, clientY = event.clientY;
                            var _b = _this.element.getBoundingClientRect(), width = _b.width, height = _b.height;
                            var dx = clientX - _this.panLastX;
                            var dy = clientY - _this.panLastY;
                            _this.panLastX = clientX;
                            _this.panLastY = clientY;
                            var sdx = dx / (width * (scale + _this.ds));
                            var sdy = dy / (height * (scale + _this.ds));
                            _this.dx -= sdx;
                            _this.dy -= sdy;
                            _this.panning = false;
                            document.removeEventListener('mousemove', _this.handleMouseMove);
                            document.removeEventListener('mouseup', _this.handleMouseUp);
                            if (onPanEnd) {
                                onPanEnd(x + _this.dx, y + _this.dy, event);
                            }
                            if (renderOnChange) {
                                _this.forceUpdate();
                            }
                        }
                    }
                };
                return _this;
            }
            PanAndZoomHOC.prototype.componentWillReceiveProps = function (nextProps) {
                if (this.props.x !== nextProps.x || this.props.y !== nextProps.y) {
                    this.dx = 0;
                    this.dy = 0;
                }
                if (this.props.scale !== nextProps.scale) {
                    this.ds = 0;
                }
            };
            PanAndZoomHOC.prototype.handleRef = function (ref) {
                if (this.element) {
                    this.element.removeEventListener('wheel', this.handleWheel);
                    this.element.removeEventListener('mousedown', this.handleMouseDown);
                    this.element = null;
                }
                if (ref) {
                    var element = ReactDOM.findDOMNode(ref);
                    element.addEventListener('wheel', this.handleWheel);
                    element.addEventListener('mousedown', this.handleMouseDown);
                    this.element = element;
                }
            };
            PanAndZoomHOC.prototype.componentWillUnmount = function () {
                if (this.element) {
                    this.element.removeEventListener('wheel', this.handleWheel);
                    this.element.removeEventListener('mousedown', this.handleMouseDown);
                    this.element = null;
                }
                if (this.panning) {
                    document.removeEventListener('mousemove', this.handleMouseMove);
                    document.removeEventListener('mouseup', this.handleMouseUp);
                }
            };
            PanAndZoomHOC.prototype.getElement = function () {
                return this.element;
            };
            PanAndZoomHOC.prototype.render = function () {
                var _this = this;
                var _a = this.props, children = _a.children, scaleFactor = _a.scaleFactor, tempX = _a.x, tempY = _a.y, tempScale = _a.scale, minScale = _a.minScale, maxScale = _a.maxScale, onPanStart = _a.onPanStart, onPanMove = _a.onPanMove, onPanEnd = _a.onPanEnd, onZoom = _a.onZoom, onPanAndZoom = _a.onPanAndZoom, renderOnChange = _a.renderOnChange, passOnProps = _a.passOnProps, other = __rest(_a, ["children", "scaleFactor", "x", "y", "scale", "minScale", "maxScale", "onPanStart", "onPanMove", "onPanEnd", "onZoom", "onPanAndZoom", "renderOnChange", "passOnProps"]);
                var x = this.props.x;
                var y = this.props.y;
                var scale = this.props.scale;
                if (x !== undefined && y !== undefined && scale !== undefined) {
                    var passedProps = passOnProps ? { x: x + this.dx, y: y + this.dy, scale: scale + this.ds } : {};
                    var AnyComponent = WrappedComponent;
                    return React.createElement(AnyComponent, __assign({ ref: function (ref) { return _this.handleRef(ref); } }, passedProps, other), children);
                }
                else {
                    return null;
                }
            };
            return PanAndZoomHOC;
        }(React.Component)),
        _a.propTypes = {
            x: React.PropTypes.number,
            y: React.PropTypes.number,
            scale: React.PropTypes.number,
            scaleFactor: React.PropTypes.number,
            minScale: React.PropTypes.number,
            maxScale: React.PropTypes.number,
            renderOnChange: React.PropTypes.bool,
            passOnProps: React.PropTypes.bool,
            onPanStart: React.PropTypes.func,
            onPanMove: React.PropTypes.func,
            onPanEnd: React.PropTypes.func,
            onZoom: React.PropTypes.func,
            onPanAndZoom: React.PropTypes.func
        },
        _a.defaultProps = {
            x: 0.5,
            y: 0.5,
            scale: 1,
            scaleFactor: Math.sqrt(2),
            minScale: Number.EPSILON,
            maxScale: Number.POSITIVE_INFINITY,
            renderOnChange: false,
            passOnProps: false
        },
        _a;
    var _a;
}
exports.default = panAndZoom;
;
//# sourceMappingURL=panAndZoomHoc.js.map