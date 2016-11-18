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
            scaleFactor: 2,
            minScale: Number.EPSILON,
            maxScale: Number.POSITIVE_INFINITY
        };

        dx = 0;
        dy = 0;
        lockPosition = false;
        ds = 0;
        lockScale = false;

        componentWillReceiveProps(nextProps) {
            if (this.props.x !== nextProps.x && this.props.y !== nextProps.y) {
                this.dx = 0;
                this.dy = 0;
                this.lockPosition = true;
            }
            if (this.props.scale !== nextProps.scale) {
                this.ds = 0;
                this.lockScale = true;
            }
        }

        componentDidUpdate() {
            if (this.lockPosition) {
                this.lockPosition = false;
            }
            if (this.lockScale) {
                this.lockScale = false;
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
            const {x, y, scale, onPanAndZoom, scaleFactor, minScale, maxScale} = this.props;
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
                    onPanAndZoom(x + this.dx, y + this.dy, scale + this.ds);
                }
            }
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
            if (this.panning && !this.lockPosition) {
                const {x, y, scale, onPanMove} = this.props;
                const {clientX, clientY} = event;
                const {width, height} = this.element.getBoundingClientRect();
                const dx = clientX - this.panLastX;
                const dy = clientY - this.panLastY;
                this.panLastX = clientX;
                this.panLastY = clientY;
                const sdx = dx / (width * (scale + this.ds));
                const sdy = dy / (height * (scale + this.ds));
                this.dx += sdx; // change to - when bug is fixed
                this.dy += sdy;

                if (onPanMove) {
                    onPanMove(x + this.dx, y + this.dy, event);
                }
            }
        };

        handleMouseUp = (event) => {
            if (this.panning && !this.lockPosition) {
                const {x, y, scale, onPanEnd} = this.props;
                const {clientX, clientY} = event;
                const {width, height} = this.element.getBoundingClientRect();
                const dx = clientX - this.panLastX;
                const dy = clientY - this.panLastY;
                this.panLastX = clientX;
                this.panLastY = clientY;
                const sdx = dx / (width * (scale + this.ds));
                const sdy = dy / (height * (scale + this.ds));
                this.dx += sdx; // change to - when bug is fixed
                this.dy += sdy;
                this.panning = false;

                if (onPanEnd) {
                    onPanEnd(x + this.dx, y + this.dy, event);
                }
            }
        };

        getEventPosition(event) {
            const {scale} = this.props;
            const {clientX, clientY} = event;
            const {top, left, width, height} = this.element.getBoundingClientRect();
            const ex = clientX - left;
            const ey = clientY - top;
            const x = ex / (width * (scale + this.ds));
            const y = ey / (height * (scale + this.ds));
            return {x, y};
        }

        render() {
            const {children, x, y, scale, scaleFactor, minScale, maxScale, onPanStart, onPanMove, onPanEnd, onZoom, onPanAndZoom, ...other} = this.props;

            return <WrappedComponent x={x + this.dx} y={y + this.dy} scale={scale + this.ds} ref={ref => this.handleRef(ref)} {...other}>
                {children}
            </WrappedComponent>;
        }
    };
