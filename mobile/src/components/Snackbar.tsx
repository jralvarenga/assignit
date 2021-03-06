import React from 'react'
import { StyleSheet } from 'react-native'
import { Text, Snackbar, Button, TouchableRipple, useTheme } from 'react-native-paper'

interface SnackbarProps {
  visible: boolean,
  setVisible: Function,
  text: string,
  addTheme?: any,
  addStyles?: any,
  label?: string
}

const AppSnackbar = ({ visible, setVisible, text, addTheme, addStyles, label }: SnackbarProps) => {
  const theme = useTheme()
  const styles = styleSheet(theme)

  return (
    <Snackbar 
      visible={visible}
      onDismiss={() => setVisible(false)}
      theme={{...theme, ...addTheme}}
      duration={3000}
      style={{ backgroundColor: theme.colors.accent, ...addStyles }}
      action={{
        label: label ? label : 'Ok',
        labelStyle: {
          ...styles.font,
          color: "#fff",
          letterSpacing: 0,
        },
      }}>
      <Text style={[styles.font, {color: "#fff"}]}>
        {text}
      </Text>
    </Snackbar>
  )
}

const styleSheet = (theme: any) => StyleSheet.create({
  font: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text,
    fontSize: 16
  }
})

export default AppSnackbar