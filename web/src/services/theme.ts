import { createMuiTheme } from '@material-ui/core/styles'

export const theme = createMuiTheme({
  palette:{
    primary: {
      main: '#ec4242',
    },
    secondary: {
      main: '#ec4242',
    },
    text: {
      primary: '#353535',
      secondary: '#636363'
    },
    background: {
      default: "#fff",
      paper: "#ededed"
    },
  },
  typography: {
    fontSize: 16,
    fontFamily: "Poppins",
  }
})