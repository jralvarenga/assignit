import { DefaultTheme as PaperTheme, DarkTheme as PaperDarkTheme } from 'react-native-paper'
import { DefaultTheme as NavigatorTheme, DarkTheme as NavigatorDarkTheme } from '@react-navigation/native'

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      accent: string
      textPaper: string
      inactivePrimary: string
    }
  }
}

export const theme = {
  ...PaperTheme,
  ...NavigatorTheme,
  roundness: 15,
  dark: false,
  colors: {
    ...PaperTheme.colors,
    ...NavigatorTheme.colors,
    primary: '#ec4242',
    inactivePrimary: '#ffcac4',
    accent: '#ec4242',
    background: '#fff',
    surface: '#dedede',
    card: '#dedede',
    text: '#353535',
    textPaper: '#636363',
    placeholder: '#636363'
  },
  font: {
    regular: 'poppins',
    medium: 'poppins-semibold',
    bold: 'poppins-bold'
  }
}

// Dark

export const darkTheme = {
  ...PaperDarkTheme,
  ...NavigatorDarkTheme,
  roundness: 15,
  dark: true,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigatorDarkTheme.colors,
    primary: '#CFCFCF',//
    inactivePrimary: '#3B3B3B',//
    accent: '#FE6B6B',//
    background: '#1C1C1C',//
    surface: '#292929',
    card: '#292929',
    text: '#C9C9C9',
    textPaper: '#A2A2A2',
    placeholder: '#909090'
  },
  font: {
    regular: 'poppins',
    medium: 'poppins-semibold',
    bold: 'poppins-bold'
  }
}