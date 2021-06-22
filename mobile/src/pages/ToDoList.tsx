import { useTheme } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'
import { StyleSheet, View, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import { Text, IconButton, TextInput, Checkbox, TouchableRipple, Button, Dialog, Portal, ActivityIndicator, Menu } from 'react-native-paper'
import { Theme } from 'react-native-paper/lib/typescript/types'
import { SafeAreaView } from 'react-native-safe-area-context'
import ColorPicker from '../components/ColorPicker'
import { Task, TasksProvider } from '../interface/interfaces'
import { addNewTask, deleteTask, filterTasks, setTaskReminder, setTaskStatus } from '../lib/tasksLib'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Animate } from 'react-native-entrance-animation'
import { useTasks } from '../services/TasksProvider'
import { createDummyAssignmentId } from '../hooks/createId'
import AppDialog from '../components/AppDialog'

const ToDoListScreen = () => {
  const theme: any = useTheme()
  const styles = styleSheet(theme)
  const user = auth().currentUser
  const [refreshing, setRefreshing] = useState(false)
  const { tasks, render, setRender, setTasks, getTasksHandler }: TasksProvider = useTasks()
  const [doneTasks, setDoneTasks] = useState<any[]>([])
  const [pendingTasks, setPendingTasks] = useState<any[]>([])
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskColor, setNewTaskColor] = useState({ id: "12", color: "text" },)
  const [createNewTaskLoad, setCreateNewTaskLoad] = useState(false)
  const [showRemindMe, setShowRemindMe] = useState(false)
  const [showReminderMenu, setShowReminderMenu] = useState(false)
  const [reminderChoice, setReminderChoice] = useState('None')
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
      reminder: false,
      notiId: 0
    }
    pendingTasks.push(taskData)
    tasks?.push(taskData)
    setPendingTasks(pendingTasks)
    setTasks!(tasks)
    setNewTaskTitle("")
    setNewTaskColor({ id: "12", color: "text" },)
    if (reminderChoice != 'None') {
      const notiId = setTaskReminder(reminderChoice, taskData)
      taskData.notiId = notiId
    }
    setReminderChoice('None')
    try {
      await addNewTask(taskData, user)
    } catch (error) {
      console.log(error)
    }
    setCreateNewTaskLoad(false)
  }

  const changeTaskStatus = async(id: string, status: boolean) => {
    const taskIndex = tasks!.map((task) => task.id ).indexOf(id)
    tasks![taskIndex].done = status
    if (status == true) {
      const pendingTaskIndex = pendingTasks!.map((task) => task.id ).indexOf(id)
      doneTasks.push(tasks![taskIndex])
      setDoneTasks(doneTasks)

      pendingTasks.splice(pendingTaskIndex, 1)
      setPendingTasks(pendingTasks)
    } else {
      const doneTaskIndex = doneTasks!.map((task) => task.id ).indexOf(id)
      doneTasks![doneTaskIndex].done = status
      pendingTasks.push(doneTasks![doneTaskIndex])
      setPendingTasks(pendingTasks)

      doneTasks.splice(doneTaskIndex, 1)
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

  const setReminderChoiceHandler = (choice: string) => {
    setReminderChoice(choice)
    setShowReminderMenu(false)
  }

  const refreshScreen = useCallback( async() => {
    setRefreshing(true)
    await getTasksHandler!()
    setRender!(render! + 1)
    setRefreshing(false)
  }, [])

  return (
    <SafeAreaView>
      <ScrollView style={{ width: '100%', height: '100%' }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshScreen}
            colors={[theme.colors.accent]}
            tintColor={theme.colors.accent}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      >
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
            style={{ width: '65%' }}
            theme={{ colors: { primary: newTaskColor.color == 'text' ? theme.colors.text : newTaskColor.color } }}
          />
          <TouchableOpacity
            onPress={() => setShowColorPicker(true)}
            activeOpacity={0.7}
            style={[styles.colorChooser, {backgroundColor: newTaskColor.color == 'text' ? theme.colors.card : newTaskColor.color}]}
          />
          {/*<IconButton
            icon='clock-outline'
            onPress={() => setShowRemindMe(true)}
            color={theme.colors.text}
            size={32}
            style={{ backgroundColor: theme.colors.card }}
          />*/}
          <IconButton
            icon='plus'
            color={theme.colors.text}
            size={32}
            onPress={createTaskHandler}
            style={{ backgroundColor: theme.colors.card }}
          />
        </View>
        <View style={{ width: '95%' }}>
          {reminderChoice != 'None' && (
            <Text style={[styles.font, {color: theme.colors.textPaper, fontSize: 14}]}>
              Remind me every {reminderChoice}
            </Text>
          )}
        </View>

        <View style={styles.listContainer}>
          {pendingTasks!.length == 0 && doneTasks.length == 0 ? (
            <Text style={[styles.font, {color: theme.colors.textPaper, marginTop: 15}]}>
              You don't have any task now😢
            </Text>
          ) : (
            <View>
              {/* PENDING TASKS */}
              {pendingTasks.length != 0 && (
                <Text style={[styles.font, styles.tasksTitles]}>Tasks</Text>
              )}
              <View style={{ width: '100%' }}>
                {pendingTasks.map((task: Task, i: number) => (
                  <Animate fade delay={i * 10} key={i}>
                  <TouchableRipple
                    borderless
                    rippleColor={theme.colors.card}
                    onPress={() => showTaskHandler(task)}
                    style={styles.taskContainer}
                  ><>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Checkbox.Item
                        label=""
                        onPress={() => changeTaskStatus(task.id, true)}
                        status={task.done ? 'checked' : 'unchecked'}
                        style={{ borderRadius: 20 }}
                        color={task.color.color == 'text' ? theme.colors.text : task.color.color}
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
                  <Animate fade delay={i * 10} key={i}>
                  <TouchableRipple
                    borderless
                    rippleColor={theme.colors.card}
                    onPress={() => showTaskHandler(task)}
                    style={styles.taskContainer}
                  ><>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Checkbox.Item
                        label=""
                        onPress={() => changeTaskStatus(task.id, false)}
                        status={task.done ? 'checked' : 'unchecked'}
                        style={{ borderRadius: 20 }}
                        color={task.color.color == 'text' ? theme.colors.text : task.color.color}
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

        <AppDialog
          visible={showTask}
          setVisible={setShowTask}
          title={selectedTask?.title!}
          body={
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.font}>Is done:</Text>
              <Text style={styles.font}>{selectedTask?.done ? 'Yes' : 'No'}</Text>
            </View>
          }
          primaryLabel={
            <Button
              uppercase={false}
              style={[styles.actionButtons, {marginLeft: 15}]}
              labelStyle={[styles.font, {fontSize: 16, color: theme.colors.accent, letterSpacing: 0}]}
              onPress={() => deleteTaskHandler(selectedTask!.id, selectedTask!.done)}
            >Delete</Button>
          }
        />

        <AppDialog
          visible={showRemindMe}
          setVisible={setShowRemindMe}
          title="Remind Me"
          body={
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.font}>Remind me every:</Text>
              <View>
                <Menu
                  visible={showReminderMenu}
                  onDismiss={() => setShowReminderMenu(false)}
                  anchor={
                    <TouchableOpacity onPress={() => setShowReminderMenu(true)}>
                      <Text style={styles.font}>
                        {reminderChoice}
                      </Text>
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item onPress={() => setReminderChoiceHandler('None')} title="None" />
                  <Menu.Item onPress={() => setReminderChoiceHandler('Hour')} title="Hour" />
                  <Menu.Item onPress={() => setReminderChoiceHandler('Day')} title="Day" />
                  <Menu.Item onPress={() => setReminderChoiceHandler('Week')} title="Week" />
                  <Menu.Item onPress={() => setReminderChoiceHandler('Month')}title="Month" />
                </Menu>
              </View>
            </View>
          }
          primaryLabel={
            <Button
              uppercase={false}
              style={[styles.actionButtons, {marginLeft: 15}]}
              labelStyle={[styles.font, {fontSize: 16, letterSpacing: 0}]}
              onPress={() => setShowRemindMe(false)}
            >Ok</Button>
          }
        />

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