"use client"
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    typography: {
        fontFamily: 'Fenix',
    },
    palette: {
        primary: {
            main: "#164296",
        },
        secondary: {
            main: "rgba(22, 66, 150, 0.1)"
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