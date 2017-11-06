var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as React from 'react';
import * as ReactDOM from 'react-dom';
export default function panAndZoom(WrappedComponent) {
    return _a = class PanAndZoomHOC extends React.Component {
            constructor() {
                super(...arguments);
                this.dx = 0;
                this.dy = 0;
                this.ds = 0;
                this.element = null;
                this.handleWheel = (event) => {
                    const { onPanAndZoom, renderOnChange } = this.props;
                    const x = this.props.x;
                    const y = this.props.y;
                    const scale = this.props.scale;
                    const scaleFactor = this.props.scaleFactor;
                    const minScale = this.props.minScale;
                    const maxScale = this.props.maxScale;
                    if (x !== undefined && y !== undefined && scale !== undefined && scaleFactor !== undefined && minScale !== undefined && maxScale !== undefined) {
                        const { clientX, clientY, deltaY } = event;
                        const newScale = deltaY < 0 ? Math.min((scale + this.ds) * scaleFactor, maxScale) : Math.max((scale + this.ds) / scaleFactor, minScale);
                        const factor = newScale / (scale + this.ds);
                        if (this.element !== null && factor !== 1) {
                            const { top, left, width, height } = this.element.getBoundingClientRect();
                            const ex = clientX - left;
                            const ey = clientY - top;
                            const dx = (ex / width - 0.5) / (scale + this.ds);
                            const dy = (ey / height - 0.5) / (scale + this.ds);
                            const sdx = dx * (1 - 1 / factor);
                            const sdy = dy * (1 - 1 / factor);
                            this.dx += sdx;
                            this.dy += sdy;
                            this.ds = newScale - scale;
                            if (onPanAndZoom) {
                                onPanAndZoom(x + this.dx, y + this.dy, scale + this.ds, event);
                            }
                            if (renderOnChange) {
                                this.forceUpdate();
                            }
                        }
                    }
                    event.preventDefault();
                };
                this.panning = false;
                this.panLastX = 0;
                this.panLastY = 0;
                this.handleMouseDown = (event) => {
                    if (!this.panning) {
                        const { onPanStart } = this.props;
                        const { clientX, clientY } = event;
                        this.panLastX = clientX;
                        this.panLastY = clientY;
                        this.panning = true;
                        document.addEventListener('mousemove', this.handleMouseMove);
                        document.addEventListener('mouseup', this.handleMouseUp);
                        if (onPanStart) {
                            onPanStart(event);
                        }
                    }
                };
                this.handleMouseMove = (event) => {
                    if (this.panning && this.element) {
                        const { onPanMove, renderOnChange } = this.props;
                        const x = this.props.x;
                        const y = this.props.y;
                        const scale = this.props.scale;
                        if (x !== undefined && y !== undefined && scale !== undefined) {
                            const { clientX, clientY } = event;
                            const { width, height } = this.element.getBoundingClientRect();
                            const dx = clientX - this.panLastX;
                            const dy = clientY - this.panLastY;
                            this.panLastX = clientX;
                            this.panLastY = clientY;
                            const sdx = dx / (width * (scale + this.ds));
                            const sdy = dy / (height * (scale + this.ds));
                            this.dx -= sdx;
                            this.dy -= sdy;
                            if (onPanMove) {
                                onPanMove(x + this.dx, y + this.dy, event);
                            }
                            if (renderOnChange) {
                                this.forceUpdate();
                            }
                        }
                    }
                };
                this.handleMouseUp = (event) => {
                    if (this.panning && this.element) {
                        const { onPanEnd, renderOnChange } = this.props;
                        const x = this.props.x;
                        const y = this.props.y;
                        const scale = this.props.scale;
                        if (x !== undefined && y !== undefined && scale !== undefined) {
                            const { clientX, clientY } = event;
                            const { width, height } = this.element.getBoundingClientRect();
                            const dx = clientX - this.panLastX;
                            const dy = clientY - this.panLastY;
                            this.panLastX = clientX;
                            this.panLastY = clientY;
                            const sdx = dx / (width * (scale + this.ds));
                            const sdy = dy / (height * (scale + this.ds));
                            this.dx -= sdx;
                            this.dy -= sdy;
                            this.panning = false;
                            document.removeEventListener('mousemove', this.handleMouseMove);
                            document.removeEventListener('mouseup', this.handleMouseUp);
                            if (onPanEnd) {
                                onPanEnd(x + this.dx, y + this.dy, event);
                            }
                            if (renderOnChange) {
                                this.forceUpdate();
                            }
                        }
                    }
                };
            }
            componentWillReceiveProps(nextProps) {
                if (this.props.x !== nextProps.x || this.props.y !== nextProps.y) {
                    this.dx = 0;
                    this.dy = 0;
                }
                if (this.props.scale !== nextProps.scale) {
                    this.ds = 0;
                }
            }
            handleRef(ref) {
                if (this.element) {
                    this.element.removeEventListener('wheel', this.handleWheel);
                    this.element.removeEventListener('mousedown', this.handleMouseDown);
                    this.element = null;
                }
                if (ref) {
                    const element = ReactDOM.findDOMNode(ref);
                    element.addEventListener('wheel', this.handleWheel);
                    element.addEventListener('mousedown', this.handleMouseDown);
                    this.element = element;
                }
            }
            componentWillUnmount() {
                if (this.element) {
                    this.element.removeEventListener('wheel', this.handleWheel);
                    this.element.removeEventListener('mousedown', this.handleMouseDown);
                    this.element = null;
                }
                if (this.panning) {
                    document.removeEventListener('mousemove', this.handleMouseMove);
                    document.removeEventListener('mouseup', this.handleMouseUp);
                }
            }
            getElement() {
                return this.element;
            }
            render() {
                const _a = this.props, { children, scaleFactor, x: tempX, y: tempY, scale: tempScale, minScale, maxScale, onPanStart, onPanMove, onPanEnd, onZoom, onPanAndZoom, renderOnChange, passOnProps } = _a, other = __rest(_a, ["children", "scaleFactor", "x", "y", "scale", "minScale", "maxScale", "onPanStart", "onPanMove", "onPanEnd", "onZoom", "onPanAndZoom", "renderOnChange", "passOnProps"]);
                const x = this.props.x;
                const y = this.props.y;
                const scale = this.props.scale;
                if (x !== undefined && y !== undefined && scale !== undefined) {
                    const passedProps = passOnProps ? { x: x + this.dx, y: y + this.dy, scale: scale + this.ds } : {};
                    const AnyComponent = WrappedComponent;
                    return React.createElement(AnyComponent, Object.assign({ ref: (ref) => this.handleRef(ref) }, passedProps, other), children);
                }
                else {
                    return null;
                }
            }
        },
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
;
//# sourceMappingURL=panAndZoomHoc.js.map