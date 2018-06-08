
export const SET_MAX_ENTRIES = 'dataPlot/SET_MAX_ENTRIES';
export const SET_SHOW_CHANNEL = 'dataPlot/SET_SHOW_CHANNEL';
export const RESET_SHOW_CHANNELS = 'dataPlot/RESET_SHOW_CHANNELS';
export const SET_ERRORBARS = 'dataPlot/SET_ERRORBARS';
export const SET_RANGE_AUTO = 'dataPlot/SET_RANGE_AUTO';
export const SET_RANGE_MIN = 'dataPlot/SET_RANGE_MIN';
export const SET_RANGE_MAX = 'dataPlot/SET_RANGE_MAX';
export const RESET_RANGE = 'dataPlot/RESET_RANGE';

export const setShowChannel = (channel, enable) => ({
    type: SET_SHOW_CHANNEL,
    channel,
    enable,
});


const actionGroup = group => ({
    setMaxEntries: entries => ({
        type: SET_MAX_ENTRIES,
        group,
        entries,
    }),
    resetShowChannels: () => ({
        type: RESET_SHOW_CHANNELS,
        group,
    }),
    setErrorbars: (enable) => ({
        type: SET_ERRORBARS,
        group,
        enable,
    }),
    setRangeAuto: (auto) => ({
        type: SET_RANGE_AUTO,
        group,
        auto,
    }),
    setRangeMin: (value) => ({
        type: SET_RANGE_MIN,
        group,
        value,
    }),
    setRangeMax: (value) => ({
        type: SET_RANGE_MAX,
        group,
        value,
    }),
    resetRange: () => ({
        type: RESET_RANGE,
        group,
    }),
});

export const singles = actionGroup('SINGLES');
export const coincidences = actionGroup('COINCIDENCES');
