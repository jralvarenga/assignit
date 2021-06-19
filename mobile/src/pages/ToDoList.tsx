import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { Text, IconButton, TextInput } from 'react-native-paper'
import { Theme } from 'react-native-paper/lib/typescript/types'
import { SafeAreaView } from 'react-native-safe-area-context'
import ColorPicker from '../components/ColorPicker'

const colors = [
  { id: "1", color: "#a4bdfc" },
  { id: "2", color: "#7ae7bf" },
  { id: "3", color: "#dbadff" },
  { id: "4", color: "#ff887c" },
  { id: "5", color: "#fbd75b" },
  { id: "6", color: "#ffb878" },
  { id: "7", color: "#46d6db" },
  //{ id: "8", color: "#e1e1e1" },
  { id: "9", color: "#5484ed" },
  { id: "10", color: "#51b749" },
  { id: "11", color: "#dc2127" },
  { id: "12", color: "#ededed" },
]

const ToDoListScreen = () => {
  const theme = useTheme()
  const styles = styleSheet(theme)
  const [addNewTask, setAddNewTask] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [newTaskColor, setNewTaskColor] = useState(colors[10])

  const taskColorHandler = (color: any) => {
    setNewTaskColor(color)
    setShowColorPicker(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.titleContainer}>
        <Text style={[styles.font, {fontSize: 30}]}>
          To Do List
        </Text>
        {/*<IconButton
          icon={addIcon}
          color={theme.colors.text}
          size={30}
          style={{ backgroundColor: theme.colors.card }}
          onPress={() => {
            setAddNewTask(!addNewTask)
            showHideHandler()
          }}
        />*/}
      </View>

      <View style={[styles.addNewContainer, { flex: 1 }]}>
        <TextInput
          mode="outlined"
          label="New task name"
          style={{ width: '50%' }}
          theme={{ colors: { primary: newTaskColor.color } }}
        />
        <TouchableOpacity
          onPress={() => setShowColorPicker(true)}
          activeOpacity={0.7}
          style={[styles.colorChooser, {backgroundColor: newTaskColor.color}]}
        />
        <IconButton
          icon='clock-outline'
          color={theme.colors.text}
          size={32}
          style={{ backgroundColor: newTaskColor.color }}
        />
        <IconButton
          icon='plus'
          color={theme.colors.text}
          size={32}
          style={{ backgroundColor: newTaskColor.color }}
        />
      </View>

      <View style={styles.listContainer}></View>

      <ColorPicker
        visible={showColorPicker}
        setVisible={setShowColorPicker}
        colorPickerHandler={taskColorHandler}
      />

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
    flex: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
  },
  addNewContainer: {
    width: '95%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  taskNameContainer: {
    width: '70%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorChooser: {
    width: 47,
    height: 47,
    borderRadius: 100,
    marginBottom: 5,
    borderColor: theme.colors.surface
  },
  addNewTask: {
    width: 120,
    height: 40,
    elevation: 0,
  },
  listContainer: {
    flex: 6,
    width: '95%',
    backgroundColor: 'red'
  }
})

export default ToDoListScreen