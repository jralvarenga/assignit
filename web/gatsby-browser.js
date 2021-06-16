import React from 'react'
//import { CssBaseline, ThemeProvider } from '@material-ui/core'
//import { theme } from './src/services/theme'
import { AuthProvider } from './src/services/AuthProvider'
import './src/styles/global.css' 

export const wrapRootElement = ({ element }) => (
  <AuthProvider>
    {element}
  </AuthProvider>
)