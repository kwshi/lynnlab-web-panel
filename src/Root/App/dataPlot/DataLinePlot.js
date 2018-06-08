import * as Victory from 'victory';
import React from 'react';
import * as plot from '../plot.js';
import * as recharts from 'recharts';

export default class DataLinePlot extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }
    render() {

                
        let lines = this.props.channels.
            filter(channel => this.props.showChannels[channel]).
            map(channel => (data => [
                (
                    <Victory.VictoryLine
                      key={channel}
                      style={{data: {stroke: plot.colors[channel%4]}}}
                      data={data}/> 
                ),
                this.props.showErrorbars ?
                    (
                        <Victory.VictoryErrorBar
                          key={'' + channel + '-errorbar'}
                          style={{data: {stroke: plot.colors[channel%4]}}}
                          borderWidth={2}
                          data={data}/>
                    ) :
                    false
            ])(this.props.log.slice(-this.props.plotEntries).map(entry => ({
                x: entry.sample,
                y: entry.data[channel].mean,
                errorY: entry.data[channel].sem,
            }))));

        let channelSelect = this.props.channels.map(channel => [
            (
                <input key={channel} type="checkbox" name={channel}
                       checked={this.props.showChannels[channel]}
                       onChange={this.props.toggleChannel}/>
            ),
            (
                <span key={'' + channel + '-label'}
                      className="checkbox-label"
                      style={{color: plot.colors[channel % 4]}}>
                  {plot.channelLabels[channel]}
                </span>
            )
        ]);

        return (
            <div className="main-panel-box">
              <div id="plot-toolbar" className="toolbar">
                <span className="input-section">
                  <label>channels to plot:</label>
                  {channelSelect}
                </span>
                <span className="input-section">
                  <label htmlFor="plot-entries">maximum number of points to plot:</label>
                  <input type="number" name="plot-entries" value={this.props.plotEntries}
                         onChange={this.props.updatePlotEntries}/>
                </span>
                <span className="input-section">
                  <label htmlFor="show-errorbars">show errorbars:</label>
                  <input type="checkbox" name="show-errorbars"
                         checked={this.props.showErrorbars}
                         onChange={this.props.updateShowErrorbars}/>
                </span>
                <span className="input-section">
                  <label>plot range:</label>
                  <input type="radio" value="1" name="range-auto"
                         checked={this.props.rangeAuto}
                         onChange={this.props.updateRangeAuto}/>
                  <label>auto</label>
                  <input type="radio" value="" name="range-auto"
                         checked={!this.props.rangeAuto}
                         onChange={this.props.updateRangeAuto}/>
                  <label>fixed</label>
                  <label>min</label>
                  <input type="number" name="range-min"
                         value={this.props.rangeMin}
                         onChange={this.props.updateRangeMin}
                         disabled={this.props.rangeAuto}/>
                  <label>max</label>
                  <input type="number" name="range-max"
                         value={this.props.rangeMax}
                         onChange={this.props.updateRangeMax}
                         disabled={this.props.rangeAuto}/>
                </span>
              </div>
              <div id="plot-container" className="container">
                <div className="plot-area">
                  <Victory.VictoryChart
                    theme={plot.theme}
                    domain={{
                        y: (
                            this.props.rangeAuto ? undefined :
                                [this.props.rangeMin, this.props.rangeMax]
                        ),
                    }}>
                    <Victory.VictoryAxis
                      crossAxis
                      label="sample #"/>
                    <Victory.VictoryAxis
                      crossAxis dependentAxis
                      label="counts per second"/>
                    {lines}
                  </Victory.VictoryChart>
                </div>
              </div>
            </div>
        );

                   }
}

