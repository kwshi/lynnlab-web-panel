
export const SET_MAX_ENTRIES = 'dataPlot/SET_MAX_ENTRIES';
export const SET_SHOW_CHANNEL = 'dataBar/SET_SHOW_CHANNEL';
export const RESET_SHOW_CHANNELS = 'dataBar/RESET_SHOW_CHANNELS';
export const SET_ERRORBARS = 'dataBar/SET_ERRORBARS';
export const SET_RANGE_AUTO = 'dataBar/SET_RANGE_AUTO';
export const SET_RANGE_MAX = 'dataBar/SET_RANGE_MAX';
export const RESET_RANGE = 'dataBar/RESET_RANGE';


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
    setErrorbars: enable => ({
        type: SET_ERRORBARS,
        group,
        enable,
    }),
    setRangeAuto: auto => ({
        type: SET_RANGE_AUTO,
        group,
        auto,
    }),
    setRangeMax: value => ({
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
