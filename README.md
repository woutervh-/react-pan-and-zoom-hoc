# react-pan-and-zoom-hoc

React HOC that helps with panning and zooming elements

## Installation

Built as a UMD module.

**Node**

```bash
npm install --save react-pan-and-zoom-hoc
```

**Browser**

Include `lib/panAndZoomHoc.js` with RequireJS.

## Building

```bash
git clone https://github.com/woutervh-/react-pan-and-zoom-hoc.git
npm install
npm run build
```

## Options

* `x` (number, default: `0.5`): initial x-coordinate that represents the horizontal center of the viewport.
* `y` (number, default `0.5`): initial y-coordinate that represents the vertical center of the viewport.
* `scale` (number, default `1`): initial scale of the viewport.
* `scaleFactor` (number, default `√2`): when zooming in or out, use this factor to multiply the scale by.
* `minScale` (number, default: `Number.EPSILON`): minimal allowed value for the scale.
* `maxScale` (number, default: `Number.POSITIVE_INFINITY`): maximal allowed value for the scale.
* `renderOnChange` (boolean, default: `false`): if `true`, when panning or zooming, it will force a re-render of the component.
* `passOnProps` (boolean, default: `false`): if `true`, will pass on the `x`, `y`, and `scale` props to the wrapped component. If `renderOnChange` is also set to `true` this will cause the props (with updated values) to be passed on every time a pan or zoom event occurs.
* `onPanStart` (function): invoked when the component starts to pan. Receives the following arguments:
    * `event` (MouseEvent): original event which triggered the panning to start.
* `onPanMove` (function): invoked when the component pans in the x or y direction. Receives the following arguments:
    * `x` (number): new x-coordinate.
    * `y` (number): new y-coordinate.
    * `event` (MouseEvent): original event which triggered the panning movement.
* `onPanEnd` (function): invoked when the component stop panning. Receives the following arguments:
    * `x` (number): new x-coordinate.
    * `y` (number): new y-coordinate.
    * `event` (MouseEvent): original event which triggered the panning to stop.
* `onZoom` (function): currently not used, reserved for future use.
* `onPanAndZoom` (function): invoked when the component pans and zooms (for example when the mouse wheel is used). Receives the following arguments:
    * `x` (number): new x-coordinate.
    * `y` (number): new y-coordinate.
    * `scale` (number): new scale value.
    * `event` (MouseEvent): original event which triggered the pan/zoom event.

## Unmanaged example

```js
import React from 'react';
import panAndZoomHoc from 'react-pan-and-zoom-hoc';

class Figure extends React.Component {
    render() {
        const {x, y, scale, width, height, ...other} = this.props;
        return <div style={{width, height, overflow: 'hidden', border: '1px solid black'}}>
            <img style={{transform: `scale(${scale}, ${scale}) translate(${(0.5 - x) * width}px, ${(0.5 - y) * height}px`}} width={width} height={height} {...other}/>
        </div>;
    }
}

const PannableAndZoomableFigure = panAndZoomHoc(Figure);

class App extends React.Component {
    render() {
        return <PannableAndZoomableFigure
            renderOnChange={true}
            passOnProps={true}
            src="http://lorempixel.com/400/200/"
            width={400}
            height={200}
        />;
    }
}
```

## Managed example

```js
import React from 'react';
import panAndZoomHoc from '../src/panAndZoomHoc';

const InteractiveDiv = panAndZoomHoc('div');

class App extends React.Component {
    state = {
        x: 0.5,
        y: 0.5,
        scale: 1
    };

    handlePanAndZoom(x, y, scale) {
        this.setState({x, y, scale});
    }

    handlePanMove(x, y) {
        this.setState({x, y});
    }

    render() {
        const {x, y, scale} = this.state;

        return <InteractiveDiv
            x={x}
            y={y}
            scale={scale}
            scaleFactor={Math.sqrt(2)}
            minScale={1}
            maxScale={2 ** 18}
            onPanAndZoom={(x, y, scale) => this.handlePanAndZoom(x, y, scale)} style={{width: 250, height: 250, border: '1px solid black', position: 'relative'}}
            onPanMove={(x, y) => this.handlePanMove(x, y)}
        >
            <div style={{position: 'absolute', top: `${y * 100}%`, left: `${x * 100}%`, width: 1, height: 1, backgroundColor: 'black'}}/>
        </InteractiveDiv>;
    }
}
```
