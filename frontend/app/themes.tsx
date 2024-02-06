"use client"
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    typography: {
        fontFamily: 'Fenix',
    },
    palette: {
        primary: {
            main: "#359D49",
        },
        secondary: {
            main: "#c8d6cf"
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: 'Fenix',
                }
            }
        },

    }
});