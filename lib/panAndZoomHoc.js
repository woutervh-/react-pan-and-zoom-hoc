(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define('panAndZoomHoc', ['exports', 'react', 'react-dom'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('react'), require('react-dom'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.react, global.reactDom);
        global.panAndZoomHoc = mod.exports;
    }
})(this, function (exports, _react, _reactDom) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    function _objectWithoutProperties(obj, keys) {
        var target = {};

        for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue;
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
            target[i] = obj[i];
        }

        return target;
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    exports.default = function (WrappedComponent) {
        var _class, _temp2;

        return _temp2 = _class = function (_React$Component) {
            _inherits(PanAndZoomHOC, _React$Component);

            function PanAndZoomHOC() {
                var _ref;

                var _temp, _this, _ret;

                _classCallCheck(this, PanAndZoomHOC);

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PanAndZoomHOC.__proto__ || Object.getPrototypeOf(PanAndZoomHOC)).call.apply(_ref, [this].concat(args))), _this), _this.dx = 0, _this.dy = 0, _this.ds = 0, _this.element = null, _this.handleWheel = function (event) {
                    var _this$props = _this.props,
                        x = _this$props.x,
                        y = _this$props.y,
                        scale = _this$props.scale,
                        onPanAndZoom = _this$props.onPanAndZoom,
                        scaleFactor = _this$props.scaleFactor,
                        minScale = _this$props.minScale,
                        maxScale = _this$props.maxScale,
                        renderOnChange = _this$props.renderOnChange;
                    var clientX = event.clientX,
                        clientY = event.clientY,
                        deltaY = event.deltaY;

                    var newScale = deltaY < 0 ? Math.min((scale + _this.ds) * scaleFactor, maxScale) : Math.max((scale + _this.ds) / scaleFactor, minScale);
                    var factor = newScale / (scale + _this.ds);

                    if (factor !== 1) {
                        var _this$element$getBoun = _this.element.getBoundingClientRect(),
                            top = _this$element$getBoun.top,
                            left = _this$element$getBoun.left,
                            width = _this$element$getBoun.width,
                            height = _this$element$getBoun.height;

                        var ex = clientX - left;
                        var ey = clientY - top;
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

                    event.preventDefault();
                }, _this.panning = false, _this.panLastX = 0, _this.panLastY = 0, _this.handleMouseDown = function (event) {
                    if (!_this.panning) {
                        var onPanStart = _this.props.onPanStart;
                        var clientX = event.clientX,
                            clientY = event.clientY;

                        _this.panLastX = clientX;
                        _this.panLastY = clientY;
                        _this.panning = true;

                        if (onPanStart) {
                            onPanStart(event);
                        }
                    }
                }, _this.handleMouseMove = function (event) {
                    if (_this.panning) {
                        var _this$props2 = _this.props,
                            x = _this$props2.x,
                            y = _this$props2.y,
                            scale = _this$props2.scale,
                            onPanMove = _this$props2.onPanMove,
                            renderOnChange = _this$props2.renderOnChange;
                        var clientX = event.clientX,
                            clientY = event.clientY;

                        var _this$element$getBoun2 = _this.element.getBoundingClientRect(),
                            width = _this$element$getBoun2.width,
                            height = _this$element$getBoun2.height;

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
                }, _this.handleMouseUp = function (event) {
                    if (_this.panning) {
                        var _this$props3 = _this.props,
                            x = _this$props3.x,
                            y = _this$props3.y,
                            scale = _this$props3.scale,
                            onPanEnd = _this$props3.onPanEnd,
                            renderOnChange = _this$props3.renderOnChange;
                        var clientX = event.clientX,
                            clientY = event.clientY;

                        var _this$element$getBoun3 = _this.element.getBoundingClientRect(),
                            width = _this$element$getBoun3.width,
                            height = _this$element$getBoun3.height;

                        var dx = clientX - _this.panLastX;
                        var dy = clientY - _this.panLastY;
                        _this.panLastX = clientX;
                        _this.panLastY = clientY;
                        var sdx = dx / (width * (scale + _this.ds));
                        var sdy = dy / (height * (scale + _this.ds));
                        _this.dx -= sdx;
                        _this.dy -= sdy;
                        _this.panning = false;

                        if (onPanEnd) {
                            onPanEnd(x + _this.dx, y + _this.dy, event);
                        }

                        if (renderOnChange) {
                            _this.forceUpdate();
                        }
                    }
                }, _temp), _possibleConstructorReturn(_this, _ret);
            }

            _createClass(PanAndZoomHOC, [{
                key: 'componentWillReceiveProps',
                value: function componentWillReceiveProps(nextProps) {
                    if (this.props.x !== nextProps.x || this.props.y !== nextProps.y) {
                        this.dx = 0;
                        this.dy = 0;
                    }
                    if (this.props.scale !== nextProps.scale) {
                        this.ds = 0;
                    }
                }
            }, {
                key: 'handleRef',
                value: function handleRef(ref) {
                    if (this.element) {
                        this.element.removeEventListener('wheel', this.handleWheel);
                        this.element.removeEventListener('mousedown', this.handleMouseDown);
                        this.element.removeEventListener('mousemove', this.handleMouseMove);
                        this.element.removeEventListener('mouseup', this.handleMouseUp);
                        this.element = null;
                    }

                    if (ref) {
                        this.element = _reactDom2.default.findDOMNode(ref);
                        this.element.addEventListener('wheel', this.handleWheel);
                        this.element.addEventListener('mousedown', this.handleMouseDown);
                        this.element.addEventListener('mousemove', this.handleMouseMove);
                        this.element.addEventListener('mouseup', this.handleMouseUp);
                    }
                }
            }, {
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    if (this.element) {
                        this.element.removeEventListener('wheel', this.handleWheel);
                        this.element.removeEventListener('mousedown', this.handleMouseDown);
                        this.element.removeEventListener('mousemove', this.handleMouseMove);
                        this.element.removeEventListener('mouseup', this.handleMouseUp);
                        this.element = null;
                    }
                }
            }, {
                key: 'getElement',
                value: function getElement() {
                    return this.element;
                }
            }, {
                key: 'render',
                value: function render() {
                    var _this2 = this;

                    var _props = this.props,
                        children = _props.children,
                        x = _props.x,
                        y = _props.y,
                        scale = _props.scale,
                        scaleFactor = _props.scaleFactor,
                        minScale = _props.minScale,
                        maxScale = _props.maxScale,
                        onPanStart = _props.onPanStart,
                        onPanMove = _props.onPanMove,
                        onPanEnd = _props.onPanEnd,
                        onZoom = _props.onZoom,
                        onPanAndZoom = _props.onPanAndZoom,
                        renderOnChange = _props.renderOnChange,
                        passOnProps = _props.passOnProps,
                        other = _objectWithoutProperties(_props, ['children', 'x', 'y', 'scale', 'scaleFactor', 'minScale', 'maxScale', 'onPanStart', 'onPanMove', 'onPanEnd', 'onZoom', 'onPanAndZoom', 'renderOnChange', 'passOnProps']);

                    var passedProps = passOnProps ? { x: x + this.dx, y: y + this.dy, scale: scale + this.ds } : {};

                    return _react2.default.createElement(
                        WrappedComponent,
                        _extends({ ref: function ref(_ref2) {
                                return _this2.handleRef(_ref2);
                            } }, passedProps, other),
                        children
                    );
                }
            }]);

            return PanAndZoomHOC;
        }(_react2.default.Component), _class.propTypes = {
            x: _react2.default.PropTypes.number,
            y: _react2.default.PropTypes.number,
            scale: _react2.default.PropTypes.number,
            scaleFactor: _react2.default.PropTypes.number,
            minScale: _react2.default.PropTypes.number,
            maxScale: _react2.default.PropTypes.number,
            renderOnChange: _react2.default.PropTypes.bool,
            passOnProps: _react2.default.PropTypes.bool,
            onPanStart: _react2.default.PropTypes.func,
            onPanMove: _react2.default.PropTypes.func,
            onPanEnd: _react2.default.PropTypes.func,
            onZoom: _react2.default.PropTypes.func,
            onPanAndZoom: _react2.default.PropTypes.func
        }, _class.defaultProps = {
            x: 0.5,
            y: 0.5,
            scale: 1,
            scaleFactor: Math.sqrt(2),
            minScale: Number.EPSILON,
            maxScale: Number.POSITIVE_INFINITY,
            renderOnChange: false,
            passOnProps: false
        }, _temp2;
    };
});