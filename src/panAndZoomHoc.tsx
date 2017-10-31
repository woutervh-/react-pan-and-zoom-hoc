import * as React from 'react';
import * as ReactDOM from 'react-dom';

export type Diff<T extends string, U extends string> = ({[P in T]: P} & {[P in U]: never} & {[x: string]: never})[T];
export type Omit<T, K extends keyof T> = {[P in Diff<keyof T, K>]: T[P]};
export type Overwrite<T, U> = Pick<T, keyof Omit<T & U, keyof U>> & U;

export interface PanAndZoomHOCProps {
    x?: number;
    y?: number;
    scale?: number;
    scaleFactor?: number;
    minScale?: number;
    maxScale?: number;
    renderOnChange?: boolean;
    passOnProps?: boolean;
    onPanStart?: (event: MouseEvent) => void;
    onPanMove?: (x: number, y: number, event: MouseEvent) => void;
    onPanEnd?: (x: number, y: number, event: MouseEvent) => void;
    onZoom?: any;
    onPanAndZoom?: (x: number, y: number, scale: number, event: WheelEvent) => void;
}

export interface PassedOnProps {
    x?: number;
    y?: number;
    scale?: number;
}

export default function panAndZoom<P extends PassedOnProps>(WrappedComponent: React.ComponentClass<P>): React.ComponentClass<Overwrite<P, PanAndZoomHOCProps>> {
    return class PanAndZoomHOC extends React.Component<Overwrite<P, PanAndZoomHOCProps>, any> {
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

        handleRef(ref: React.ReactInstance | null) {
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

        handleWheel = (event: WheelEvent) => {
            const {onPanAndZoom, renderOnChange} = this.props;
            const x: number | undefined = this.props.x;
            const y: number | undefined = this.props.y;
            const scale: number | undefined = this.props.scale;
            const scaleFactor: number | undefined = this.props.scaleFactor;
            const minScale: number | undefined = this.props.minScale;
            const maxScale: number | undefined = this.props.maxScale;

            if (x !== undefined && y !== undefined && scale !== undefined && scaleFactor !== undefined && minScale !== undefined && maxScale !== undefined) {
                const {clientX, clientY, deltaY} = event;
                const newScale = deltaY < 0 ? Math.min((scale + this.ds) * scaleFactor, maxScale) : Math.max((scale + this.ds) / scaleFactor, minScale);
                const factor = newScale / (scale + this.ds);

                if (this.element !== null && factor !== 1) {
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
            }

            event.preventDefault();
        };

        panning = false;
        panLastX = 0;
        panLastY = 0;

        handleMouseDown = (event: MouseEvent) => {
            if (!this.panning) {
                const {onPanStart} = this.props;
                const {clientX, clientY} = event;
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

        handleMouseMove = (event: MouseEvent) => {
            if (this.panning && this.element) {
                const {onPanMove, renderOnChange} = this.props;
                const x: number | undefined = this.props.x;
                const y: number | undefined = this.props.y;
                const scale: number | undefined = this.props.scale;

                if (x !== undefined && y !== undefined && scale !== undefined) {
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
            }
        };

        handleMouseUp = (event: MouseEvent) => {
            if (this.panning && this.element) {
                const {onPanEnd, renderOnChange} = this.props;
                const x: number | undefined = this.props.x;
                const y: number | undefined = this.props.y;
                const scale: number | undefined = this.props.scale;

                if (x !== undefined && y !== undefined && scale !== undefined) {
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

        getElement(): Element | null {
            return this.element;
        }

        render() {
            const {children, scaleFactor, x: tempX, y: tempY, scale: tempScale, minScale, maxScale, onPanStart, onPanMove, onPanEnd, onZoom, onPanAndZoom, renderOnChange, passOnProps, ...other} = this.props;
            const x: number | undefined = this.props.x;
            const y: number | undefined = this.props.y;
            const scale: number | undefined = this.props.scale;

            if (x !== undefined && y !== undefined && scale !== undefined) {
                const passedProps: PassedOnProps = passOnProps ? {x: x + this.dx, y: y + this.dy, scale: scale + this.ds} : {};
                const AnyComponent = WrappedComponent as React.ComponentClass<any>;

                return <AnyComponent ref={(ref: React.ReactInstance | null) => this.handleRef(ref)} {...passedProps} {...other}>
                    {children}
                </AnyComponent>;
            } else {
                return null;
            }
        }
    };
};
