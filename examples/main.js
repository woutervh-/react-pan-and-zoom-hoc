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

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(<App/>, container);
