import * as Victory from 'victory';
import React from 'react';


export default class DataPlot extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            channels: [0, 1],
        };
    }
    render() {
        let data = this.props.log.slice(-100).map(entry => ({
            x: entry.sample,
            y: entry.mean[0],
        }));
        let data2 = this.props.log.slice(-100).map(entry => ({
            x: entry.sample,
            y: entry.mean[1],
        }));

        let lines = this.state.channels.map(channel => (
                <Victory.VictoryLine
            key={channel}
            data={this.props.log.slice(-100).map(entry => ({
                x: entry.sample,
                y: entry.mean[channel],
            }))}/>
        ));

        return (
                <div>
                <div id="plot-toolbar" className="toolbar">
                <label>hi</label>
                </div>
                <div id="plot-container">
                <div id="plot-area">
                <Victory.VictoryChart
            width={800}
            height={500} theme={Victory.VictoryTheme.material}>
                
                <Victory.VictoryGroup 
            style={{
                data: {
                    strokeWidth: 2,
                },
            }}>
                {lines}
                <Victory.VictoryLegend
            data={[
                {name: 'hey', symbol: {fill: 'hotpink'}}
            ]}/>
                </Victory.VictoryGroup>
                </Victory.VictoryChart>
                </div>
                </div>
                </div>
        );
    }
}

