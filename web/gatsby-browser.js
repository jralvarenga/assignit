import React from "react"
import { CssBaseline, ThemeProvider } from '@material-ui/core'
import { theme } from './src/services/theme'
import './src/styles/global.css' 

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {element}
  </ThemeProvider>
)