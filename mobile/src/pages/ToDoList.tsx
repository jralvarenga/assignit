import { useTheme } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'
import { Text, IconButton, TextInput, Checkbox, TouchableRipple, Button, Dialog, Portal, ActivityIndicator } from 'react-native-paper'
import { Theme } from 'react-native-paper/lib/typescript/types'
import { SafeAreaView } from 'react-native-safe-area-context'
import ColorPicker from '../components/ColorPicker'
import { Task, TasksProvider } from '../interface/interfaces'
import { addNewTask, deleteTask, filterTasks, setTaskStatus } from '../lib/tasksLib'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Animate } from 'react-native-entrance-animation'
import { useTasks } from '../services/TasksProvider'
import { createDummyAssignmentId } from '../hooks/createId'

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
  { id: "12", color: "text" },
]

const ToDoListScreen = () => {
  const theme = useTheme()
  const styles = styleSheet(theme)
  const user = auth().currentUser
  const { tasks, render, setRender, setTasks }: TasksProvider = useTasks()
  const [doneTasks, setDoneTasks] = useState<any[]>([])
  const [pendingTasks, setPendingTasks] = useState<any[]>([])
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskColor, setNewTaskColor] = useState(colors[10])
  const [createNewTaskLoad, setCreateNewTaskLoad] = useState(false)
  const [showTask, setShowTask] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task>()

  useEffect(() => {
    const [pending, done] = filterTasks(tasks!)
    setDoneTasks(done)
    setPendingTasks(pending)
  }, [render, tasks])

  const taskColorHandler = (color: any) => {
    setNewTaskColor(color)
    setShowColorPicker(false)
  }

  const showTaskHandler = (task: Task) => {
    setSelectedTask(task)
    setShowTask(true)
  }

  const createTaskHandler = async() => {
    if (newTaskTitle == '') {
      console.log('error')
      return
    }
    setCreateNewTaskLoad(true)
    const taskData: Task = {
      title: newTaskTitle,
      color: newTaskColor,
      id: createDummyAssignmentId(),
      done: false,
      reminder: false
    }
    pendingTasks.push(taskData)
    setPendingTasks(pendingTasks)
    setNewTaskTitle("")
    setNewTaskColor(colors[10])
    try {
      await addNewTask(taskData, user)
    } catch (error) {
      console.log(error)
    }
    setCreateNewTaskLoad(false)
  }

  const changeTaskStatus = async(id: string, status: boolean) => {
    setCreateNewTaskLoad(true)
    if (status == true) {
      const taskIndex = pendingTasks!.map((task) => task.id ).indexOf(id)
      tasks![taskIndex].done = status
      doneTasks.push(tasks![taskIndex])
      setDoneTasks(doneTasks)
      pendingTasks.splice(taskIndex, 1)
      setPendingTasks(pendingTasks)
    } else {
      const taskIndex = doneTasks!.map((task) => task.id ).indexOf(id)
      tasks![taskIndex].done = status
      pendingTasks.push(tasks![taskIndex])
      setPendingTasks(pendingTasks)
      doneTasks.splice(taskIndex, 1)
      setDoneTasks(doneTasks)
    }

    try {
      await setTaskStatus(id, status, user)
    } catch (error) {
      console.log(error)
    }
    setCreateNewTaskLoad(false)
  }

  const deleteTaskHandler = async(id: string, state: boolean) => {
    if (state == true) {
      const taskIndex = doneTasks!.map((task) => task.id ).indexOf(id)
      doneTasks.splice(taskIndex, 1)
      setDoneTasks(doneTasks)
    } else {
      const taskIndex = pendingTasks!.map((task) => task.id ).indexOf(id)
      pendingTasks.splice(taskIndex, 1)
      setPendingTasks(pendingTasks)
    }
    setShowTask(false)
    try {
      await deleteTask(id, user)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView>
      <ScrollView style={{ width: '100%', height: '100%' }}>
      <View style={styles.container}>
        
        <View style={styles.titleContainer}>
          <Text style={[styles.font, {fontSize: 32}]}>
            To Do List
          </Text>
          <ActivityIndicator size="small" animating={createNewTaskLoad} color={theme.colors.primary} />
        </View>

        <View style={[styles.addNewContainer]}>
          <TextInput
            mode="outlined"
            value={newTaskTitle}
            onChangeText={(value) => setNewTaskTitle(value)}
            label="New task name"
            style={{ width: '50%' }}
            theme={{ colors: { primary: newTaskColor.color == 'text' ? theme.colors.text : newTaskColor.color } }}
          />
          <TouchableOpacity
            onPress={() => setShowColorPicker(true)}
            activeOpacity={0.7}
            style={[styles.colorChooser, {backgroundColor: newTaskColor.color == 'text' ? theme.colors.card : newTaskColor.color}]}
          />
          <IconButton
            icon='clock-outline'
            color={theme.colors.text}
            size={32}
            style={{ backgroundColor: theme.colors.card }}
          />
          <IconButton
            icon='plus'
            color={theme.colors.text}
            size={32}
            onPress={createTaskHandler}
            style={{ backgroundColor: theme.colors.card }}
          />
        </View>

        <View style={styles.listContainer}>
          {tasks!.length == 0 ? (
            <Text style={[styles.font, {color: theme.colors.textPaper, marginTop: 15}]}>
              You don't have any task now😢
            </Text>
          ) : (
            <View>
              {/* PENDING TASKS */}
              {doneTasks.length != 0 && (
                <Text style={[styles.font, styles.tasksTitles]}>Tasks</Text>
              )}
              <View style={{ width: '100%' }}>
                {pendingTasks.map((task: Task, i: number) => (
                  <Animate right key={i}>
                  <TouchableRipple
                    borderless
                    rippleColor={theme.colors.card}
                    onPress={() => showTaskHandler(task)}
                    style={styles.taskContainer}
                  ><>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Checkbox
                        onPress={() => changeTaskStatus(task.id, true)}
                        status={task.done ? 'checked' : 'unchecked'}
                        theme={{ colors: { primary: task.color.color } }}
                      />
                      <Text style={[styles.font, { color: task.color.color == 'text' ? theme.colors.text : task.color.color, marginLeft: 15, fontSize: 20 }]}>
                        {task.title}
                      </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.7}>
                      <MaterialIcons name="keyboard-arrow-up" size={30} color={theme.colors.text} />
                    </TouchableOpacity>
                  </></TouchableRipple>
                  </Animate>
                ))}
              </View>
              {/* DONE TASKS */}
              {doneTasks.length != 0 && (
                <Text style={[styles.font, styles.tasksTitles]}>Done</Text>
              )}
              <View style={{ width: '100%' }}>
                {doneTasks.map((task: Task, i: number) => (
                  <Animate right key={i}>
                  <TouchableRipple
                    borderless
                    rippleColor={theme.colors.card}
                    onPress={() => showTaskHandler(task)}
                    style={styles.taskContainer}
                  ><>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Checkbox
                        onPress={() => changeTaskStatus(task.id, false)}
                        status={task.done ? 'checked' : 'unchecked'}
                        theme={{ colors: { primary: task.color.color == 'text' ? theme.colors.text : task.color.color } }}
                      />
                      <Text style={[styles.font, { color: task.color.color == 'text' ? theme.colors.text : task.color.color, marginLeft: 15, fontSize: 20 }]}>
                        {task.title}
                      </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.7}>
                      <MaterialIcons name="keyboard-arrow-up" size={30} color={theme.colors.text} />
                    </TouchableOpacity>
                  </></TouchableRipple>
                  </Animate>
                ))}
              </View>
            </View>
          )}
        </View>

        <ColorPicker
          visible={showColorPicker}
          setVisible={setShowColorPicker}
          colorPickerHandler={taskColorHandler}
        />
        
        <Portal>
        <Dialog visible={showTask} onDismiss={() => setShowTask(false)}>
          <Dialog.Title style={[styles.font, { fontSize: 25 }]}>
            {selectedTask?.title}
          </Dialog.Title>
          <Dialog.Content>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.font}>Is done:</Text>
              <Text style={styles.font}>{selectedTask?.done ? 'Yes' : 'No'}</Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              uppercase={false}
              style={[styles.actionButtons, {marginLeft: 15}]}
              labelStyle={[styles.font, {fontSize: 16, color: theme.colors.accent, letterSpacing: 0}]}
              onPress={() => deleteTaskHandler(selectedTask!.id, selectedTask!.done)}
            >Delete</Button>
            </Dialog.Actions>
        </Dialog>
        </Portal>

      </View>
      </ScrollView>
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
    width: '95%',
    marginTop: 15,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  addNewContainer: {
    width: '95%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
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
    width: '95%',
  },
  tasksTitles: {
    fontSize: 28,
    marginTop: 10,
    marginBottom: 15
  },
  taskContainer: {
    width: '100%',
    height: 70,
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  showTaskContainer: {
    width: '95%',
    padding: 20,
    backgroundColor: theme.colors.background
  },
  actionButtons: {
    width: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
})

export default ToDoListScreen