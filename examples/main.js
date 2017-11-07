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
        this.setState({x, y, scale});
    }

    handlePanMove = (x, y) => {
        this.setState({x, y});
    }

    render() {
        const {x, y, scale} = this.state;

        return <InteractiveDiv
            x={x}
            y={y}
            scale={scale}
            scaleFactor={Math.sqrt(1.5)}
            minScale={0.5}
            maxScale={2}
            onPanAndZoom={this.handlePanAndZoom}
            style={{width: 498, height: 498, border: '1px solid black', position: 'relative'}}
            onPanMove={this.handlePanMove}
        >
            <div style={{position: 'absolute', top: `${(y * 100) * scale}%`, left: `${(x * 100) * scale}%`, width: 50, height: 50, backgroundColor: 'black', transform: `scale(${scale})`, MozTransform: `scale(${scale})`}}/>
            <div style={{position: 'absolute', top: `${(y * 100 + 50) * scale}%`, left: `${(x * 100 + 50) * scale}%`, width: 50, height: 50, backgroundColor: 'black', transform: `scale(${scale})`, MozTransform: `scale(${scale})`}}/>
        </InteractiveDiv>;
    }
}

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(<App/>, container);
