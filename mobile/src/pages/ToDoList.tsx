import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'
import { useTheme } from '@react-navigation/native'
import { StyleSheet, View, TouchableOpacity,  } from 'react-native'
import { Text, IconButton, Badge } from 'react-native-paper'
import { Theme } from 'react-native-paper/lib/typescript/types'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Task, TasksProvider } from '../interface/interfaces'
import { deleteTask, filterTasks, setNewRepeatDate, setTaskRepeater, setTaskStatus } from '../lib/tasksLib'
import { useTasks } from '../services/TasksProvider'
import AppSnackbar from '../components/Snackbar'
import TaskContainer from '../components/TaskContainer'
import { useTranslation } from 'react-i18next'
import { cancelNoti } from '../lib/notifications'
import LottieView from 'lottie-react-native'

const ToDoListScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const theme: any = useTheme()
  const styles = styleSheet(theme)
  const user = auth().currentUser
  const [render, setRender] = useState(0)
  const { tasks }: TasksProvider = useTasks()
  const [navigatorScreen, setNavigatorScreen] = useState('tasks')
  const [doneTasks, setDoneTasks] = useState<Task[]>([])
  const [pendingTasks, setPendingTasks] = useState<Task[]>([])
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarText, setSnackbarText] = useState('')

  const getReminderType = (ms: number) => {
    switch (ms) {
      case 3600000:
        return 'Hour'
      case 86400000:
        return 'Day'
      case 604800000:
        return 'Week'
      case 2592000000:
        return 'Month'
      default:
        return 'None'
    }
  }

  useEffect(() => {
    const [pending, done] = filterTasks(tasks!, user)
    setDoneTasks(done)
    setPendingTasks(pending)
  }, [tasks, render])

  const changeTaskStatus = async(id: string, status: boolean) => {
    const taskIndex = tasks!.map((task) => task.id ).indexOf(id)
    tasks![taskIndex].done = status
    tasks![taskIndex].doneDate = status == true ? new Date() : undefined
    setRender(render + 1)

    try {
      await setTaskStatus(id, status, user)
      if (tasks![taskIndex].repeat && status == true) {
        const repeatType = getReminderType(tasks![taskIndex].repeat!)
        setTaskRepeater(repeatType, tasks![taskIndex], t)
        setNewRepeatDate(id, user)
      }
    } catch (error) {
      setSnackbarText('An error has happen')
      setShowSnackbar(true)
    }
  }

  const deleteTaskHandler = async(id: string, state: boolean) => {
    const index = tasks!.map((task) => task.id ).indexOf(id)
    if (state == true) {
      const taskIndex = doneTasks!.map((task) => task.id ).indexOf(id)
      doneTasks.splice(taskIndex, 1)
      setDoneTasks(doneTasks)
    } else {
      const taskIndex = pendingTasks!.map((task) => task.id ).indexOf(id)
      pendingTasks.splice(taskIndex, 1)
      setPendingTasks(pendingTasks)
    }
    const task = tasks![index]
    if (task.notiId && task.notiId != 0) {
      console.log('Deleled noti')
      cancelNoti(task.notiId) 
    }
    setSnackbarText('Task deleted')
    setShowSnackbar(true)
    try {
      await deleteTask(id, user)
    } catch (error) {
      setSnackbarText('An error has happen')
      setShowSnackbar(true)
    }
  }

  return (
    <SafeAreaView>
      <View
        style={{ width: '100%', height: '100%' }}
      >
      <View style={styles.container}>
        
        <View style={styles.titleContainer}>
          <Text style={[styles.font, {fontSize: 32}]}>
            {t('To Do List')}
          </Text>
          <IconButton
            icon='plus'
            color={theme.colors.text}
            size={32}
            onPress={() => navigation.navigate('Create task')}
            style={{ backgroundColor: theme.colors.card }}
          />
        </View>

        <View style={styles.navigator}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.navigatorButton, navigatorScreen == 'tasks' && {backgroundColor: theme.colors.inactivePrimary}]}
            onPress={() => setNavigatorScreen('tasks')}
          >
            <Text style={[styles.font, {color: theme.colors.textPaper}, navigatorScreen == 'tasks' && styles.activeNavigatorText]}>
              {t('Tasks')}
            </Text>
            {tasks?.length != 0 && (
              <Badge style={{ position: 'absolute', top: 0 }}>
                {pendingTasks.length}
              </Badge>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.navigatorButton, navigatorScreen == 'done' && {backgroundColor: theme.colors.inactivePrimary}]}
            onPress={() => setNavigatorScreen('done')}
          >
            <Text style={[styles.font, {color: theme.colors.textPaper}, navigatorScreen == 'done' && styles.activeNavigatorText]}>
              {t('Done tasks')}
            </Text>
            {tasks?.length != 0 && (
              <Badge style={{ position: 'absolute', top: 0 }}>
                {doneTasks.length}
              </Badge>
            )}
          </TouchableOpacity>
        </View>

        {tasks?.length == 0 ? (
          <>
            <View style={{ width: '100%', height: 180, marginTop: 60 }}>
              <LottieView
                source={require('../assets/animations/todo-list.json')}
                autoPlay
                loop
              />
            </View>
            <View>
              <Text style={[styles.font, {color: theme.colors.textPaper, textAlign: 'center'}]}>
                {t("Start adding tasks to your list")}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.listContainer}>
            <View>
              <TaskContainer
                tasks={navigatorScreen == 'tasks' ? pendingTasks : doneTasks}
                changeStatus={changeTaskStatus}
                deleteTask={deleteTaskHandler}
                done={navigatorScreen == 'tasks' ? false : true}
              />
            </View>
          </View>
        )}

        <AppSnackbar
          visible={showSnackbar}
          setVisible={setShowSnackbar}
          text={snackbarText}
        />

      </View>
      </View>
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
  navigator: {
    width: '95%',
    marginTop: 15,
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  navigatorButton: {
    width: 130,
    height: 45,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100
  },
  activeNavigatorText: {
    color: theme.colors.primary,
  },
  listContainer: {
    width: '95%',
    marginTop: 15
  },
  tasksTitles: {
    fontSize: 28,
    marginTop: 10,
    marginBottom: 15
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