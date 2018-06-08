import * as V from 'victory';
import React from 'react';
import * as plot from '../common/plot.js';

export const DataBar = ({props, state, log, on}) => {    
    let ticks = props.channels.map(channel => plot.channelLabels[channel]);

    return (
        <div className="main-panel-box">
          <div id="bar-toolbar" className="toolbar">
            <span className="input-section">
              <label htmlFor="show-errorbars">show errorbars:</label>
              <input type="checkbox" name="show-errorbars" checked={state.errorbars}
                     onChange={event => on.setErrorbars(event.target.checked)}/>
            </span>
            <span className="input-section">
              <label>maximum range:</label>
              <input type="radio" name="bar-range" value="1" checked={state.range.auto}
                     onChange={event => event.target.checked && on.setRangeAuto(true)}/>
                <label>auto</label>
                <input type="radio" name="bar-range" value="" checked={!state.range.auto}
                       onChange={event => event.target.checked && on.setRangeAuto(false)}/>
                <label>fixed</label>
                <input type="number" name="bar-range-max" value={state.range.max}
                       disabled={state.range.auto}
                       onChange={event => on.setRangeMax(event.target.value)}/>
            </span>
          </div>
          <div id="bar-container" className="container">
            <div className="plot-area">
              <V.VictoryChart theme={plot.theme} domainPadding={{x: 25}}
                              domain={{
                                  y: (
                                      state.range.auto ?
                                          undefined :
                                          [0, state.range.max]
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
                  data={props.channels.map(channel => ({
                      x: plot.channelLabels[channel],
                      y: log.length > 0 ?
                          log[log.length-1].data[channel].mean :
                          0,
                  }))}/>
                  {
                      state.errorbars ? (
                          <V.VictoryErrorBar
                             data={props.channels.map(channel => ({
                                 x: plot.channelLabels[channel],
                                 y: log.length > 0 ?
                                     log[log.length-1].data[channel].mean :
                                     0,
                                 errorY: log.length > 0 ?
                                     log[log.length-1].data[channel].sem :
                                     0,
                            }))}/>
                      ) : false
                  }
        </V.VictoryChart>
            </div>
            </div>
            </div>
    );
};
