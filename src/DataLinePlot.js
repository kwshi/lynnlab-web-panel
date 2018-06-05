import * as Victory from 'victory';
import React from 'react';
import * as plot from './plot.js';
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
            map(channel => [
                (
                    <Victory.VictoryLine
                      key={channel}
                      style={{
                          data: {
                              stroke: plot.colors[channel%4],
                          },
                      }}
                      data={this.props.log.slice(-this.props.plotEntries).map(entry => ({
                          x: entry.sample,
                          y: entry.mean[channel],
                      }))}/> 
                ),
                this.props.showErrorbars ?
                    (
                        <Victory.VictoryErrorBar
                          key={'' + channel + '-errorbar'}
                          style={{
                              data: {
                                  stroke: plot.colors[channel%4],
                              },
                          }}
                          borderWidth={0}
                          data={this.props.log.slice(-this.props.plotEntries).map(entry => ({
                              x: entry.sample,
                              y: entry.mean[channel],
                              errorY: entry.sem[channel],
                          }))}/>
                    ) :
                    false
            ]);

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
              </div>
              <div id="plot-container" className="container">
                <div className="plot-area">
                  <Victory.VictoryChart theme={plot.theme}>
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

