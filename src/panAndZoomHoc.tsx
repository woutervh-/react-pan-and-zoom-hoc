import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

export interface PanAndZoomHOCProps {
    x?: number;
    y?: number;
    scale?: number;
    scaleFactor?: number;
    minScale?: number;
    maxScale?: number;
    renderOnChange?: boolean;
    passOnProps?: boolean;
    ignorePanOutside?: boolean;
    onPanStart?: (event: MouseEvent | TouchEvent) => void;
    onPanMove?: (x: number, y: number, event: MouseEvent | TouchEvent) => void;
    onPanEnd?: (x: number, y: number, event: MouseEvent | TouchEvent) => void;
    onZoom?: (x: number | undefined, y: number | undefined, scale: number | undefined, event: WheelEvent) => void;
    onPanAndZoom?: (x: number, y: number, scale: number, event: WheelEvent) => void;
}

export default function panAndZoom<P>(WrappedComponent: React.SFC<P> | React.ComponentClass<P> | string): React.ComponentClass<Overwrite<P, PanAndZoomHOCProps>> {
    return class PanAndZoomHOC extends React.PureComponent<PanAndZoomHOCProps, never> {
        static propTypes = {
            x: PropTypes.number,
            y: PropTypes.number,
            scale: PropTypes.number,
            scaleFactor: PropTypes.number,
            minScale: PropTypes.number,
            maxScale: PropTypes.number,
            renderOnChange: PropTypes.bool,
            passOnProps: PropTypes.bool,
            ignorePanOutside: PropTypes.bool,
            onPanStart: PropTypes.func,
            onPanMove: PropTypes.func,
            onPanEnd: PropTypes.func,
            onZoom: PropTypes.func,
            onPanAndZoom: PropTypes.func
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

        dx: number = 0;
        dy: number = 0;
        ds: number = 0;
        element: Element | null = null;

        componentWillReceiveProps(nextProps: PanAndZoomHOCProps) {
            if (this.props.x !== nextProps.x || this.props.y !== nextProps.y) {
                this.dx = 0;
                this.dy = 0;
            }
            if (this.props.scale !== nextProps.scale) {
                this.ds = 0;
            }
        }

        componentWillUnmount() {
            if (this.panning) {
                document.removeEventListener('mousemove', this.handleMouseMove);
                document.removeEventListener('mouseup', this.handleMouseUp);
                document.removeEventListener('touchmove', this.handleMouseMove);
                document.removeEventListener('touchend', this.handleMouseUp);
            }
        }

        handleWheel = (event: WheelEvent) => {
            const { onPanAndZoom, renderOnChange, onZoom } = this.props;
            const x: number | undefined = this.props.x;
            const y: number | undefined = this.props.y;
            const scale: number | undefined = this.props.scale;
            const scaleFactor: number | undefined = this.props.scaleFactor;
            const minScale: number | undefined = this.props.minScale;
            const maxScale: number | undefined = this.props.maxScale;

            if (x !== undefined && y !== undefined && scale !== undefined && scaleFactor !== undefined && minScale !== undefined && maxScale !== undefined) {
                const { deltaY } = event;
                const newScale = deltaY < 0 ? Math.min((scale + this.ds) * scaleFactor, maxScale) : Math.max((scale + this.ds) / scaleFactor, minScale);
                const factor = newScale / (scale + this.ds);

                if (factor !== 1) {
                    const target = ReactDOM.findDOMNode(this);
                    if (target !== null && 'getBoundingClientRect' in target) {
                        const { top, left, width, height } = target.getBoundingClientRect();
                        const { clientX, clientY } = this.normalizeTouchPosition(event, target as HTMLElement);
                        const dx = (clientX / width - 0.5) / (scale + this.ds);
                        const dy = (clientY / height - 0.5) / (scale + this.ds);
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
            }

            if (onZoom) {
                onZoom(x, y, scale, event);
            }

            event.preventDefault();
        };

        panning = false;
        panLastX = 0;
        panLastY = 0;

        handleMouseDown = (event: MouseEvent) => {
            if (!this.panning) {
                const { onPanStart } = this.props;
                const target = ReactDOM.findDOMNode(this);
                if (target !== null && 'getBoundingClientRect' in target) {
                    const { clientX, clientY } = this.normalizeTouchPosition(event, target);
                    this.panLastX = clientX;
                    this.panLastY = clientY;
                    this.panning = true;

                    document.addEventListener('mousemove', this.handleMouseMove);
                    document.addEventListener('mouseup', this.handleMouseUp);
                    document.addEventListener('touchmove', this.handleMouseMove);
                    document.addEventListener('touchend', this.handleMouseUp);

                    if (onPanStart) {
                        onPanStart(event);
                    }
                }
            }
        };

        handleMouseMove = (event: MouseEvent | TouchEvent) => {
            if (this.panning) {
                const { onPanMove, renderOnChange, ignorePanOutside } = this.props;
                const x: number | undefined = this.props.x;
                const y: number | undefined = this.props.y;
                const scale: number | undefined = this.props.scale;

                if (x !== undefined && y !== undefined && scale !== undefined) {
                    const target = ReactDOM.findDOMNode(this);
                    if (target !== null && 'getBoundingClientRect' in target) {
                        const { clientX, clientY } = this.normalizeTouchPosition(event, target);
                        const { width, height } = target.getBoundingClientRect();

                        if (!ignorePanOutside || 0 <= clientX && clientX <= width && 0 <= clientY && clientY <= height) {
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
                }
            }
        };

        handleMouseUp = (event: MouseEvent | TouchEvent) => {
            if (this.panning) {
                const { onPanEnd, renderOnChange, ignorePanOutside } = this.props;
                const x: number | undefined = this.props.x;
                const y: number | undefined = this.props.y;
                const scale: number | undefined = this.props.scale;

                document.removeEventListener('mousemove', this.handleMouseMove);
                document.removeEventListener('mouseup', this.handleMouseUp);
                document.removeEventListener('touchmove', this.handleMouseMove);
                document.removeEventListener('touchend', this.handleMouseUp);

                if (x !== undefined && y !== undefined && scale !== undefined) {
                    const target = ReactDOM.findDOMNode(this);
                    if (target !== null && 'getBoundingClientRect' in target) {
                        try {
                            const { clientX, clientY } = this.normalizeTouchPosition(event, target);
                            const { width, height } = target.getBoundingClientRect();

                            if (!ignorePanOutside || 0 <= clientX && clientX <= width && 0 <= clientY && clientY <= height) {
                                const dx = clientX - this.panLastX;
                                const dy = clientY - this.panLastY;
                                this.panLastX = clientX;
                                this.panLastY = clientY;
                                const sdx = dx / (width * (scale + this.ds));
                                const sdy = dy / (height * (scale + this.ds));
                                this.dx -= sdx;
                                this.dy -= sdy;
                            }
                        } catch (error) {
                            // Happens when touches are used
                        }
                    }

                    this.panning = false;

                    if (onPanEnd) {
                        onPanEnd(x + this.dx, y + this.dy, event);
                    }

                    if (renderOnChange) {
                        this.forceUpdate();
                    }
                }
            }
        };

        normalizeTouchPosition(event: MouseEvent | TouchEvent, parent: Element) {
            const position = {
                clientX: ('targetTouches' in event) ? event.targetTouches[0].pageX : event.clientX,
                clientY: ('targetTouches' in event) ? event.targetTouches[0].pageY : event.clientY
            };

            while ((parent as HTMLElement).offsetParent) {
                position.clientX -= (parent as HTMLElement).offsetLeft - parent.scrollLeft;
                position.clientY -= (parent as HTMLElement).offsetTop - parent.scrollTop;
                parent = (parent as HTMLElement).offsetParent;
            }

            return position;
        }

        render() {
            const { children, scaleFactor, x: tempX, y: tempY, scale: tempScale, minScale, maxScale, onPanStart, onPanMove, onPanEnd, onZoom, onPanAndZoom, renderOnChange, passOnProps, ignorePanOutside, ...other } = this.props;
            const x: number | undefined = this.props.x;
            const y: number | undefined = this.props.y;
            const scale: number | undefined = this.props.scale;

            if (x !== undefined && y !== undefined && scale !== undefined) {
                const passedProps = passOnProps ? { x: x + this.dx, y: y + this.dy, scale: scale + this.ds } : {};

                return (
                    <WrappedComponent
                        {...passedProps}
                        {...other}
                        onMouseDown={this.handleMouseDown}
                        onTouchStart={this.handleMouseDown}
                        onWheel={this.handleWheel}
                    >
                        {children}
                    </WrappedComponent>
                );
            } else {
                return null;
            }
        }
    } as any as React.ComponentClass<Overwrite<P, PanAndZoomHOCProps>>;
};
