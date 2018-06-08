import * as V from 'victory';
import React from 'react';
import * as plot from '../common/plot.js';

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
                <span className="input-section">
                  <label>maximum range:</label>
                  <input type="radio" name="bar-range" value="1" checked={this.props.rangeAuto}
                         onChange={this.props.updateRangeAuto}/>
                  <label>auto</label>
                  <input type="radio" name="bar-range" value="" checked={!this.props.rangeAuto}
                         onChange={this.props.updateRangeAuto}/>
                  <label>fixed</label>
                  <input type="number" name="bar-range-max" value={this.props.rangeMax}
                         onChange={this.props.updateRangeMax}
                         disabled={this.props.rangeAuto}/>
                </span>
              </div>
              <div id="bar-container" className="container">
                <div className="plot-area">
                  <V.VictoryChart theme={plot.theme} domainPadding={{x: 25}}
                                  domain={{
                                      y: (
                                          this.props.rangeAuto ?
                                              undefined :
                                              [0, this.props.rangeMax]
                                      ),
                                  }}>
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
                              this.props.log[this.props.log.length-1].data[channel].mean :
                              0,
                      }))}/>
                      {
                          this.props.showErrorbars ? (
                              <V.VictoryErrorBar
                                data={this.props.channels.map(channel => ({
                                    x: plot.channelLabels[channel],
                                    y: this.props.log.length > 0 ?
                                        this.props.log[this.props.log.length-1].data[channel].mean :
                                        0,
                                    errorY: this.props.log.length > 0 ?
                                        this.props.log[this.props.log.length-1].data[channel].sem :
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
