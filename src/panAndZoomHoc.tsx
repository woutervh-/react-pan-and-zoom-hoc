import * as PropTypes from 'prop-types';
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
    onZoom?: (x: number | undefined, y: number | undefined, scale: number | undefined, event: WheelEvent) => void;
    onPanAndZoom?: (x: number, y: number, scale: number, event: WheelEvent) => void;
    [id: string]: any;
}

export interface PassedOnProps {
    x?: number;
    y?: number;
    scale?: number;
}

export default function panAndZoom<P extends PassedOnProps>(WrappedComponent: React.SFC<P> | React.ComponentClass<P> | string): React.ComponentClass<Overwrite<P, PanAndZoomHOCProps>> {
    return class PanAndZoomHOC extends React.PureComponent<Overwrite<P, PanAndZoomHOCProps>, any> {
        static propTypes = {
            x: PropTypes.number,
            y: PropTypes.number,
            scale: PropTypes.number,
            scaleFactor: PropTypes.number,
            minScale: PropTypes.number,
            maxScale: PropTypes.number,
            renderOnChange: PropTypes.bool,
            passOnProps: PropTypes.bool,
            onPanStart: PropTypes.func,
            onPanMove: PropTypes.func,
            onPanEnd: PropTypes.func,
            onZoom: PropTypes.func,
            onPanAndZoom: PropTypes.func
        };

        static defaultProps = {
            x: 0,
            y: 0,
            scale: 1,
            scaleFactor: Math.sqrt(1.5),
            minScale: Number.EPSILON,
            maxScale: Number.POSITIVE_INFINITY,
            renderOnChange: false,
            passOnProps: false
        };

        dx: number = 0;
        dy: number = 0;
        ds: number = 0;

        componentWillReceiveProps(nextProps: PanAndZoomHOCProps) {
            if (this.props.x !== nextProps.x || this.props.y !== nextProps.y) {
                this.dx = 0;
                this.dy = 0;
            }
            if (this.props.scale !== nextProps.scale) {
                this.ds = 0;
            }
        }

        handleWheel = (event: WheelEvent) => {
            const {onPanAndZoom, renderOnChange, onZoom} = this.props;
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

                if (event.currentTarget && factor !== 1) {
                    const target = event.currentTarget as Element;
                    const {top, left, width, height} = target.getBoundingClientRect();
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
                const {onPanStart} = this.props;
                const {clientX, clientY} = this.normalizeTouchPosition(event, event.currentTarget as HTMLElement);
                this.panLastX = clientX;
                this.panLastY = clientY;
                this.panning = true;

                if (onPanStart) {
                    onPanStart(event);
                }
            }
        };

        handleMouseMove = (event: MouseEvent) => {
            if (this.panning && event.currentTarget) {
                const {onPanMove, renderOnChange} = this.props;
                const x: number | undefined = this.props.x;
                const y: number | undefined = this.props.y;
                const scale: number | undefined = this.props.scale;

                if (x !== undefined && y !== undefined && scale !== undefined) {
                    const {clientX, clientY} = this.normalizeTouchPosition(event, event.currentTarget as HTMLElement);
                    const target = event.currentTarget as Element;
                    const {width, height} = target.getBoundingClientRect();
                    const dx = clientX - this.panLastX;
                    const dy = clientY - this.panLastY;
                    this.panLastX = clientX;
                    this.panLastY = clientY;
                    const sdx = dx / (width * (scale + this.ds));
                    const sdy = dy / (height * (scale + this.ds));
                    this.dx -= sdx;
                    this.dy -= sdy;

                    if (onPanMove) {
                        onPanMove(x - this.dx, y - this.dy, event);
                    }

                    if (renderOnChange) {
                        this.forceUpdate();
                    }
                }
            }
        };

        handleMouseUp = (event: MouseEvent) => {
            if (this.panning && event.currentTarget) {
                const {onPanEnd, renderOnChange} = this.props;
                const x: number | undefined = this.props.x;
                const y: number | undefined = this.props.y;
                const scale: number | undefined = this.props.scale;

                if (x !== undefined && y !== undefined && scale !== undefined) {
                    const {clientX, clientY} = this.normalizeTouchPosition(event, event.currentTarget as HTMLElement);
                    const target = event.currentTarget as Element;
                    const {width, height} = target.getBoundingClientRect();
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
            }
        };

        handleTouchEnd = (event: React.SyntheticEvent<HTMLElement>) => {
            if (this.panning && event.currentTarget) {
                this.panning = false;
            }
        };

        normalizeTouchPosition(event: any, parent: HTMLElement) {
            const position = {} as {clientX: number, clientY: number};

            position.clientX = (event.targetTouches) ? event.targetTouches[0].pageX : event.clientX;
            position.clientY = (event.targetTouches) ? event.targetTouches[0].pageY : event.clientY;

            while(parent.offsetParent){
                position.clientX -= parent.offsetLeft - parent.scrollLeft;
                position.clientY -= parent.offsetTop - parent.scrollTop;

                parent = parent.offsetParent as HTMLElement;
            }

            return position;
        }

        render() {
            const {children, scaleFactor, x: tempX, y: tempY, scale: tempScale, minScale, maxScale, onPanStart, onPanMove, onPanEnd, onZoom, onPanAndZoom, renderOnChange, passOnProps, ...other} = this.props;
            const x: number | undefined = this.props.x;
            const y: number | undefined = this.props.y;
            const scale: number | undefined = this.props.scale;

            if (x !== undefined && y !== undefined && scale !== undefined) {
                const passedProps: PassedOnProps = passOnProps ? {x: x + this.dx, y: y + this.dy, scale: scale + this.ds} : {};
                const AnyComponent = WrappedComponent as React.ComponentClass<any>;

                return (
                    <WrappedComponent
                      {...passedProps}
                      {...other}
                      onMouseDown={this.handleMouseDown}
                      onMouseMove={this.handleMouseMove}
                      onMouseUp={this.handleMouseUp}
                      onTouchStart={this.handleMouseDown}
                      onTouchMove={this.handleMouseMove}
                      onTouchEnd={this.handleTouchEnd}
                      onWheel={this.handleWheel}
                    >
                        {children}
                    </WrappedComponent>
                );
            } else {
                return null;
            }
        }
    };
};
