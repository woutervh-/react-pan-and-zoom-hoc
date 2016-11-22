import React from 'react';
import ReactDOM from 'react-dom';

export default WrappedComponent =>
    class PanAndZoomHOC extends React.Component {
        static propTypes = {
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
        };

        static defaultProps = {
            x: 0.5,
            y: 0.5,
            scale: 1,
            scaleFactor: Math.sqrt(2),
            minScale: Number.EPSILON,
            maxScale: Number.POSITIVE_INFINITY,
            renderOnChange: false,
            passOnProps: false
        };

        dx = 0;
        dy = 0;
        ds = 0;

        componentWillReceiveProps(nextProps) {
            if (this.props.x !== nextProps.x || this.props.y !== nextProps.y) {
                this.dx = 0;
                this.dy = 0;
            }
            if (this.props.scale !== nextProps.scale) {
                this.ds = 0;
            }
        }

        element = null;

        handleRef(ref) {
            if (this.element) {
                this.element.removeEventListener('wheel', this.handleWheel);
                this.element.removeEventListener('mousedown', this.handleMouseDown);
                this.element.removeEventListener('mousemove', this.handleMouseMove);
                this.element.removeEventListener('mouseup', this.handleMouseUp);
                this.element = null;
            }

            if (ref) {
                this.element = ReactDOM.findDOMNode(ref);
                this.element.addEventListener('wheel', this.handleWheel);
                this.element.addEventListener('mousedown', this.handleMouseDown);
                this.element.addEventListener('mousemove', this.handleMouseMove);
                this.element.addEventListener('mouseup', this.handleMouseUp);
            }
        }

        componentWillUnmount() {
            if (this.element) {
                this.element.removeEventListener('wheel', this.handleWheel);
                this.element.removeEventListener('mousedown', this.handleMouseDown);
                this.element.removeEventListener('mousemove', this.handleMouseMove);
                this.element.removeEventListener('mouseup', this.handleMouseUp);
                this.element = null;
            }
        }

        handleWheel = (event) => {
            const {x, y, scale, onPanAndZoom, scaleFactor, minScale, maxScale, renderOnChange} = this.props;
            const {clientX, clientY, deltaY} = event;
            const newScale = deltaY < 0 ? Math.min((scale + this.ds) * scaleFactor, maxScale) : Math.max((scale + this.ds) / scaleFactor, minScale);
            const factor = newScale / (scale + this.ds);

            if (factor !== 1) {
                const {top, left, width, height} = this.element.getBoundingClientRect();
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

            event.preventDefault();
        };

        panning = false;
        panLastX = 0;
        panLastY = 0;

        handleMouseDown = (event) => {
            if (!this.panning) {
                const {onPanStart} = this.props;
                const {clientX, clientY} = event;
                this.panLastX = clientX;
                this.panLastY = clientY;
                this.panning = true;

                if (onPanStart) {
                    onPanStart(event);
                }
            }
        };

        handleMouseMove = (event) => {
            if (this.panning) {
                const {x, y, scale, onPanMove, renderOnChange} = this.props;
                const {clientX, clientY} = event;
                const {width, height} = this.element.getBoundingClientRect();
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
        };

        handleMouseUp = (event) => {
            if (this.panning) {
                const {x, y, scale, onPanEnd, renderOnChange} = this.props;
                const {clientX, clientY} = event;
                const {width, height} = this.element.getBoundingClientRect();
                const dx = clientX - this.panLastX;
                const dy = clientY - this.panLastY;
                this.panLastX = clientX;
                this.panLastY = clientY;
                const sdx = dx / (width * (scale + this.ds));
                const sdy = dy / (height * (scale + this.ds));
                this.dx -= sdx;
                this.dy -= sdy;
                this.panning = false;

                if (onPanEnd) {
                    onPanEnd(x + this.dx, y + this.dy, event);
                }

                if (renderOnChange) {
                    this.forceUpdate();
                }
            }
        };

        getElement() {
            return this.element;
        }

        render() {
            const {children, x, y, scale, scaleFactor, minScale, maxScale, onPanStart, onPanMove, onPanEnd, onZoom, onPanAndZoom, renderOnChange, passOnProps, ...other} = this.props;
            const passedProps = passOnProps ? {x: x + this.dx, y: y + this.dy, scale: scale + this.ds} : {};

            return <WrappedComponent ref={ref => this.handleRef(ref)} {...passedProps} {...other}>
                {children}
            </WrappedComponent>;
        }
    };
