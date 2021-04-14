import { createMuiTheme } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';

// Create a theme instance.
const theme = createMuiTheme({
    palette: {
        background: {
            default: '#6d2177',
            dark: '#6d2177',
            paper: colors.common.white,
        },
        primary: {
            main: '#f44336',
        },
        secondary: {
            main: '#6d2177',
        },
        text: {
            primary: colors.red[50],
            secondary: colors.red[600],
        },
    },
});

export default theme;
