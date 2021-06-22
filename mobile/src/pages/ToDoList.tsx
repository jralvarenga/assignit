import { useTheme } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'
import { StyleSheet, View, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import { Text, IconButton, Checkbox, TouchableRipple, Button } from 'react-native-paper'
import { Theme } from 'react-native-paper/lib/typescript/types'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Task, TasksProvider } from '../interface/interfaces'
import { deleteTask, filterTasks, setTaskStatus } from '../lib/tasksLib'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Animate } from 'react-native-entrance-animation'
import { useTasks } from '../services/TasksProvider'
import AppDialog from '../components/AppDialog'
import AppSnackbar from '../components/Snackbar'

const ToDoListScreen = ({ navigation }: any) => {
  const theme: any = useTheme()
  const styles = styleSheet(theme)
  const user = auth().currentUser
  const [refreshing, setRefreshing] = useState(false)
  const [render, setRender] = useState(0)
  const { tasks, setTasks, getTasksHandler }: TasksProvider = useTasks()
  const [doneTasks, setDoneTasks] = useState<Task[]>([])
  const [pendingTasks, setPendingTasks] = useState<Task[]>([])
  const [showTask, setShowTask] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task>()
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarText, setSnackbarText] = useState('')

  useEffect(() => {
    const [pending, done] = filterTasks(tasks!)
    setDoneTasks(done)
    setPendingTasks(pending)
  }, [tasks, render])

  const showTaskHandler = (task: Task) => {
    setSelectedTask(task)
    setShowTask(true)
  }

  const changeTaskStatus = async(id: string, status: boolean) => {
    const taskIndex = tasks!.map((task) => task.id ).indexOf(id)
    tasks![taskIndex].done = status
    setRender(render + 1)

    try {
      await setTaskStatus(id, status, user)
    } catch (error) {
      setSnackbarText('An error has happen')
      setShowSnackbar(true)
    }
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
      setSnackbarText('An error has happen')
      setShowSnackbar(true)
    }
  }

  const refreshScreen = useCallback( async() => {
    setRefreshing(true)
    await getTasksHandler!()
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
          <IconButton
            icon='plus'
            color={theme.colors.text}
            size={32}
            onPress={() => navigation.navigate('Create task')}
            style={{ backgroundColor: theme.colors.card }}
          />
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

        <AppDialog
          visible={showTask}
          setVisible={setShowTask}
          title={selectedTask?.title!}
          body={
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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

        <AppSnackbar
          visible={showSnackbar}
          setVisible={setShowSnackbar}
          text={snackbarText}
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