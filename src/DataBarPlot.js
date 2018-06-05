import * as V from 'victory';
import React from 'react';
import * as plot from './plot.js';

export default class DataBarPlot extends React.Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        let ticks = this.props.channels.map(channel => plot.channelLabels[channel]);

        return (
            <div className="main-panel-box">
              <div id="bar-toolbar" className="toolbar">
                <span className="input-section">
                  <label htmlFor="show-errorbars">show errorbars:</label>
                  <input type="checkbox" name="show-errorbars" checked={this.props.showErrorbars}
                         onChange={this.props.updateShowErrorbars}/>
                </span>
              </div>
              <div id="bar-container" className="container">
                <div className="plot-area">
                  <V.VictoryChart theme={plot.theme} domainPadding={{x: 25}}>
                    <V.VictoryAxis crossAxis tickValues={ticks}
                                   label="channel"
                                   style={{
                                       grid: {
                                           stroke: 'none',
                                       },
                                       axis: {
                                           stroke: 'lightgray',
                                       },
                                   }}/>
                    <V.VictoryAxis dependentAxis
                                   label="counts per second"/>
                    <V.VictoryBar
                      data={this.props.channels.map(channel => ({
                          x: plot.channelLabels[channel],
                          y: this.props.log.length > 0 ?
                              this.props.log[this.props.log.length-1].mean[channel] :
                              0,
                      }))}/>
                      {
                          this.props.showErrorbars ? (
                              <V.VictoryErrorBar
                                data={this.props.channels.map(channel => ({
                                    x: plot.channelLabels[channel],
                                    y: this.props.log.length > 0 ?
                                        this.props.log[this.props.log.length-1].mean[channel] :
                                        0,
                                    errorY: this.props.log.length > 0 ?
                                        this.props.log[this.props.log.length-1].sem[channel] :
                                        0,
                                }))}/>
                          ) : false
                      }
            </V.VictoryChart>
                </div>
              </div>
            </div>
        );
    }
}
