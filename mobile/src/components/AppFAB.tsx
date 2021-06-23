import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { View } from 'react-native'
import { FAB, Portal } from 'react-native-paper'

const AppFAB = () => {
  const navigation = useNavigation()
  const [state, setState] = React.useState({ open: false })

  const onStateChange = ({ open }: any) => setState({ open })

  const { open } = state

  return (
    <Portal>
      <FAB.Group
        visible={true}
        style={{ marginBottom: 60 }}
        open={open}
        icon={'plus'}
        actions={[
          {
            icon: 'check-box-outline',
            label: 'New task',
            onPress: () => navigation.navigate('Create task'),
          },
          {
            icon: 'calendar-multiselect',
            label: 'New Subject',
            onPress: () => navigation.navigate('New Subject'),
            small: false,
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            console.log('xd')
          }
        }}
      />
    </Portal>
  )
}

export default AppFAB