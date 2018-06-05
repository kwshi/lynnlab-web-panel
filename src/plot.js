
export const colors = [
    'steelblue',
    'darkorange',
    'limegreen',
    'crimson',
];

export const channelLabels = [
    'C0 (A)',
    'C1 (B)',
    'C2 (A\')',
    'C3 (B\')',
    'C4',
    'C5',
    'C6',
    'C7',
];

    
export const theme = {
    chart: {
        width: 800,
        height: 500,
        padding: 50,
    },
    axis: {
        style: {
            axis: {
                stroke: 'none',
                strokeWidth: 2,
            },
            grid: {
                stroke: 'lightgray',
                strokeWidth: 2,
            },
            tickLabels: {
                fontFamily: 'Roboto',
                fontSize: 10,
                padding: 5,
            },
            axisLabel: {
                fontFamily: 'Roboto',
                fontSize: 10,
                fontWeight: 'bold',
                padding: 40,
            },
        },
        padding: 50,
    },
    line: {
        style: {
            data: {
                stroke: colors[0],
                strokeWidth: 2,
                strokeLinejoin: 'round',
            },
        },
    },
    errorbar: {
        style: {
            data: {
                stroke: 'black',
                opacity: .5,
                strokeWidth: 2,
            },
        },
        borderWidth: 5,
    },
    bar: {
        style: {
            data: {
                fill: colors[0],
                width: 50
            },
        },
        padding: 50,
    },
    
};
