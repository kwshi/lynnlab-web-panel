import * as Redux from 'redux';


export const plottingReducer = (actions, initial) => {

    /*
      const showChannelsReducer = actionType => (
      (state = {
      0: true, 1: true, 2: false, 3: false,
      4: true, 5: false, 6: false, 7: false
      }, action) => (
      action.type == actionType ? {
      ...state,
      [action.channel]: action.enable,
      } : state
      )
      );
    */

    const groupReducer = (group, initial) => {

        const maxEntriesReducer = initial => (
            (state = initial, action) => (
                action.type == actions.SET_MAX_ENTRIES ?
                    action.entries :
                    state
            )
        );

        const showChannelsReducer = initial => (
            (state = initial, action) => {
                if (!(action.type == actions.SET_SHOW_CHANNEL ||
                      action.type == actions.RESET_SHOW_CHANNEL)) {
                    return state;
                }

                switch (action.type) {
                case actions.SET_SHOW_CHANNEL:
                    return {
                        ...state,
                        [action.channel]: action.enable,
                    };
                case actions.RESET_SHOW_CHANNELS:
                    return initial;
                default:
                    return state;
                }
            }
        );

        const errorbarsReducer = initial => (
            (state = initial, action) => (
                action.type == actions.SET_ERRORBARS ?
                    action.enable :
                    state
            )
        );

        const rangeReducer = initial => {
            return (state = initial, action) => {
                if (!(action.type == actions.SET_RANGE_AUTO ||
                      action.type == actions.SET_RANGE_MIN ||
                      action.type == actions.SET_RANGE_MAX ||
                      action.type == actions.RESET_RANGE) ||
                    action.group != group) {
                    return state;
                }
                
                switch (action.type) {
                case actions.SET_RANGE_AUTO:
                    return {...state, auto: action.auto};
                case actions.SET_RANGE_MIN:
                    return {...state, min: action.value};
                case actions.SET_RANGE_MAX:
                    return {...state, max: action.value};
                case actions.RESET_RANGE:
                    return initial;
                default:
                    return state;
                }
            };
        };
        
        return Redux.combineReducers({
            maxEntries: maxEntriesReducer(initial.maxEntries),
            showChannels: showChannelsReducer(initial.showChannels),
            errorbars: errorbarsReducer(initial.errorbars),
            range: rangeReducer(initial.range),
        });
        
    };

    return Redux.combineReducers({
        singles: groupReducer('SINGLES', initial.singles),
        coincidences: groupReducer('COINCIDENCES', initial.coincidences),
    });

};
