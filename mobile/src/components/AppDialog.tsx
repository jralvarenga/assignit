import React, { FC, ReactChildren } from 'react'
import { StyleSheet } from 'react-native'
import { Dialog, Portal, useTheme } from 'react-native-paper'

interface AppDialogProps {
  visible: boolean,
  setVisible: Function,
  body: any,
  title: string,
  primaryLabel: any,
  secondaryLabel?: any | null
}

const AppDialog = ({ visible, setVisible, body, title, primaryLabel, secondaryLabel  }: AppDialogProps) => {
  const theme = useTheme()
  const styles = styleSheet(theme)

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={() => setVisible(false)}
      >
        <Dialog.Title style={[styles.font, { fontSize: 25 }]}>
          {title}
        </Dialog.Title>
        <Dialog.Content>
          {body}
        </Dialog.Content>
        <Dialog.Actions>
          {secondaryLabel}
          {primaryLabel}        
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

const styleSheet = (theme: any) => StyleSheet.create({
  font: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text,
    fontSize: 16
  },
})

export default AppDialog