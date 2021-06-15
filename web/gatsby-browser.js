import React from 'react'
//import { CssBaseline, ThemeProvider } from '@material-ui/core'
//import { theme } from './src/services/theme'
import 'firebase/auth'
import 'firebase/firestore'
import './src/styles/global.css' 

export const wrapRootElement = ({ element }) => (
  <>
    {element}
  </>
)