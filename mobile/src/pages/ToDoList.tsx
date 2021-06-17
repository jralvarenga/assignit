import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { Theme } from 'react-native-paper/lib/typescript/types'
import { SafeAreaView } from 'react-native-safe-area-context'

const ToDoListScreen = () => {

  return (
    <SafeAreaView>
      <Text>Hi</Text>
    </SafeAreaView>
  )
}

const styleSheet = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  }
})

export default ToDoListScreen