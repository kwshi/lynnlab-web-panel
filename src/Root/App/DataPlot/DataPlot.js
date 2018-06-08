import * as Victory from 'victory';
import React from 'react';
import * as plot from '../common/plot.js';


export const DataPlot = ({log, state, props, on}) => {
    
    let lines = props.channels.
        filter(channel => state.showChannels[channel]).
    map(channel => (data => [
        (
        <Victory.VictoryLine
          key={channel}
          style={{data: {stroke: plot.colors[channel%4]}}}
          data={data}/> 
    ),
        state.errorbars ?
            (
            <Victory.VictoryErrorBar
              key={'' + channel + '-errorbar'}
              style={{data: {stroke: plot.colors[channel%4]}}}
              borderWidth={2}
              data={data}/>
        ) :
            false
    ])(log.slice(-state.maxEntries).map(entry => ({
        x: entry.sample,
        y: entry.data[channel].mean,
        errorY: entry.data[channel].sem,
    }))));

let channelSelect = props.channels.map(channel => [
    (
    <input key={channel} type="checkbox" name={channel}
           checked={state.showChannels[channel]}
           onChange={event => on.setShowChannel(channel, event.target.checked)}/>
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
          <input type="number" name="plot-entries" value={state.maxEntries}
                 onChange={event => on.setMaxEntries(event.target.value)}/>
        </span>
        <span className="input-section">
          <label htmlFor="show-errorbars">show errorbars:</label>
          <input type="checkbox" name="show-errorbars"
                 checked={state.errorbars}
                 onChange={event => on.setErrorbars(event.target.checked)}/>
        </span>
        <span className="input-section">
          <label>plot range:</label>
          <input type="radio" value="1" name="range-auto"
                 checked={state.range.auto}
                 onChange={event => event.target.checked && on.setRangeAuto(true)}/>
            <label>auto</label>
            <input type="radio" value="" name="range-auto"
                   checked={!state.range.auto}
                   onChange={event => event.target.checked && on.setRangeAuto(false)}/>
              <label>fixed</label>
              <label>min</label>
              <input type="number" name="range-min"
                     value={state.range.min}
                     disabled={state.range.auto}
                     onChange={event => on.setRangeMin(event.target.value)}/>
                <label>max</label>
                <input type="number" name="range-max"
                       value={state.range.max}
                       disabled={state.range.auto}
                       onChange={event => on.setRangeMax(event.target.value)}/>
        </span>
      </div>
      <div id="plot-container" className="container">
        <div className="plot-area">
          <Victory.VictoryChart
            theme={plot.theme}
            domain={{
                y: (
                    state.range.auto ? undefined :
                        [state.range.min, state.range.max]
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

};


