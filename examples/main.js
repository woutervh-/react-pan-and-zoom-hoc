import React from 'react';
import ReactDOM from 'react-dom';
import panAndZoomHoc from '../lib/panAndZoomHoc';

const InteractiveDiv = panAndZoomHoc('div');

class App extends React.Component {
    state = {
        x: 0.5,
        y: 0.5,
        scale: 1
    };

    handlePanAndZoom = (x, y, scale) => {
        this.setState({ x, y, scale });
    }

    handlePanMove = (x, y) => {
        this.setState({ x, y });
    }

    transformPoint({ x, y }) {
        return {
            x: 0.5 + this.state.scale * (x - this.state.x),
            y: 0.5 + this.state.scale * (y - this.state.y)
        };
    }

    render() {
        const { x, y, scale } = this.state;

        const p1 = this.transformPoint({x: 0.5, y: 0.5});

        return <InteractiveDiv
            x={x}
            y={y}
            scale={scale}
            scaleFactor={Math.sqrt(2)}
            minScale={0.5}
            maxScale={2}
            onPanAndZoom={this.handlePanAndZoom}
            ignorePanOutside
            style={{ width: 500, height: 500, boxSizing: 'border-box', border: '1px solid black', position: 'relative' }}
            onPanMove={this.handlePanMove}
        >
            {/* Viewport */}
            <div style={{ position: 'absolute', width: 500, height: 500, boxSizing: 'border-box', border: '1px dashed blue', transform: `translate(${(x - 0.5) * 500}px, ${(y - 0.5) * 500}px) scale(${1 / scale})` }} />
            {/* Objects - original position and zoom */}
            <div style={{ position: 'absolute', width: 50, height: 50, backgroundColor: 'lightgrey', transform: `translate(250px, 250px) translate(-25px, -25px)` }} />
            <div style={{ position: 'absolute', width: 50, height: 50, backgroundColor: 'lightgrey', transform: `translate(250px, 250px) translate(25px, 25px)` }} />
            {/* Objects */}
            <div style={{ position: 'absolute', width: 50 * this.state.scale, height: 50 * this.state.scale, backgroundColor: 'black', transform: `translate(${p1.x * 500}px, ${p1.y * 500}px) translate(${-25 * scale}px, ${-25 * scale}px)` }} />
            <div style={{ position: 'absolute', width: 50 * this.state.scale, height: 50 * this.state.scale, backgroundColor: 'black', transform: `translate(${p1.x * 500}px, ${p1.y * 500}px) translate(${25 * scale}px, ${25 * scale}px)` }} />
            {/* Axes */}
            <div style={{ position: 'absolute', width: 1, height: 500, backgroundColor: 'red', transform: 'translateX(250px)' }} />
            <div style={{ position: 'absolute', width: 500, height: 1, backgroundColor: 'red', transform: 'translateY(250px)' }} />
        </InteractiveDiv>;
    }
}

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(<App />, container);
