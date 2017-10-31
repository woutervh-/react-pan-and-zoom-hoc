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
export default function panAndZoom<P extends PassedOnProps>(WrappedComponent: React.SFC<P> | React.ComponentClass<P> | string): React.ComponentClass<Overwrite<P, PanAndZoomHOCProps>>;
