/// <reference types="react" />
import * as React from 'react';
export declare type Diff<T extends string, U extends string> = ({
    [P in T]: P;
} & {
    [P in U]: never;
} & {
    [x: string]: never;
})[T];
export declare type Omit<T, K extends keyof T> = {
    [P in Diff<keyof T, K>]: T[P];
};
export declare type Overwrite<T, U> = Pick<T, keyof Omit<T & U, keyof U>> & U;
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
export interface WithElement {
    getElement: () => Element | null;
}
export default function panAndZoom<P extends PassedOnProps>(WrappedComponent: React.SFC<P> | React.ComponentClass<P> | string): {
    new (props?: Overwrite<P, PanAndZoomHOCProps> | undefined, context?: any): {
        dx: number;
        dy: number;
        ds: number;
        element: Element | null;
        componentWillReceiveProps(nextProps: PanAndZoomHOCProps): void;
        handleRef(ref: Element | React.Component<any, {}> | null): void;
        componentWillUnmount(): void;
        handleWheel: (event: WheelEvent) => void;
        panning: boolean;
        panLastX: number;
        panLastY: number;
        handleMouseDown: (event: MouseEvent) => void;
        handleMouseMove: (event: MouseEvent) => void;
        handleMouseUp: (event: MouseEvent) => void;
        getElement(): Element | null;
        render(): JSX.Element | null;
        setState<K extends string>(f: (prevState: any, props: Overwrite<P, PanAndZoomHOCProps>) => Pick<any, K>, callback?: (() => any) | undefined): void;
        setState<K extends string>(state: Pick<any, K>, callback?: (() => any) | undefined): void;
        forceUpdate(callBack?: (() => any) | undefined): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<Overwrite<P, PanAndZoomHOCProps>>;
        state: any;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    propTypes: {
        x: React.Requireable<any>;
        y: React.Requireable<any>;
        scale: React.Requireable<any>;
        scaleFactor: React.Requireable<any>;
        minScale: React.Requireable<any>;
        maxScale: React.Requireable<any>;
        renderOnChange: React.Requireable<any>;
        passOnProps: React.Requireable<any>;
        onPanStart: React.Requireable<any>;
        onPanMove: React.Requireable<any>;
        onPanEnd: React.Requireable<any>;
        onZoom: React.Requireable<any>;
        onPanAndZoom: React.Requireable<any>;
    };
    defaultProps: {
        x: number;
        y: number;
        scale: number;
        scaleFactor: number;
        minScale: number;
        maxScale: number;
        renderOnChange: boolean;
        passOnProps: boolean;
    };
};
