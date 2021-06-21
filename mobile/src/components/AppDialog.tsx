import React, { ReactChildren } from 'react'
import { Dialog, Portal } from 'react-native-paper'

interface AppDialogProps {
  visible: boolean,
  setVisible: Function,
  body: ReactChildren,
  title: string,
  primaryLabel: string,
  secondaryLabel: string | null
}

const AppDialog = ({ visible, setVisible, body, title, primaryLabel, secondaryLabel  }: AppDialogProps) => (
  <Portal>
    <Dialog
      visible={visible}
      onDismiss={() => setVisible}
    >
      {title && (
        <Dialog.Title style={[styles.font, { fontSize: 25 }]}>
          {title}
        </Dialog.Title>
      )}
      <Dialog.Content>
        {body}
      </Dialog.Content>
      <Dialog.Actions>
        
      </Dialog.Actions>
    </Dialog>
  </Portal>
)