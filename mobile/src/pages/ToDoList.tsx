import { useTheme } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, IconButton } from 'react-native-paper'
import { Theme } from 'react-native-paper/lib/typescript/types'
import { SafeAreaView } from 'react-native-safe-area-context'

const ToDoListScreen = () => {
  const theme = useTheme()
  const styles = styleSheet(theme)

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.titleContainer}>
        <Text style={[styles.font, {fontSize: 30}]}>
          To Do List
        </Text>
        <IconButton
          icon="plus"
          color={theme.colors.text}
          size={30}
          style={{ backgroundColor: theme.colors.card }}
          onPress={() => console.log('Pressed')}
        />
      </View>

      <View style={styles.listContainer}></View>

    </SafeAreaView>
  )
}

const styleSheet = (theme: Theme | any) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.background
  },
  font: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text,
    fontSize: 16
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
  },
  listContainer: {
    flex: 6,
    width: '95%',
    backgroundColor: 'red'
  }
})

export default ToDoListScreen