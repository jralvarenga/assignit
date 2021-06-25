import { useTheme } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'
import { StyleSheet, View, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import { Text, IconButton, Button, Badge } from 'react-native-paper'
import { Theme } from 'react-native-paper/lib/typescript/types'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Task, TasksProvider } from '../interface/interfaces'
import { deleteTask, filterTasks, setTaskStatus } from '../lib/tasksLib'
import { useTasks } from '../services/TasksProvider'
import AppDialog from '../components/AppDialog'
import AppSnackbar from '../components/Snackbar'
import TaskContainer from '../components/TaskContainer'
import { dateString } from '../hooks/useDateTime'
import { useTranslation } from 'react-i18next'
import { cancelNoti } from '../lib/notifications'
import LottieView from 'lottie-react-native'

const ToDoListScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const theme: any = useTheme()
  const styles = styleSheet(theme)
  const user = auth().currentUser
  const [refreshing, setRefreshing] = useState(false)
  const [render, setRender] = useState(0)
  const { tasks, setTasks, getTasksHandler }: TasksProvider = useTasks()
  const [navigatorScreen, setNavigatorScreen] = useState('tasks')
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
    tasks![taskIndex].doneDate = status == true ? new Date() : undefined
    setRender(render + 1)

    try {
      await setTaskStatus(id, status, user)
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
    setShowTask(false)
    const task = tasks![index]
    if (task.notiId && task.notiId != 0) {
      console.log('Deleled noti')
      cancelNoti(task.notiId) 
    }
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
                showTask={showTaskHandler}
                done={navigatorScreen == 'tasks' ? false : true}
              />
            </View>
          </View>
        )}

        <AppDialog
          visible={showTask}
          setVisible={setShowTask}
          title={selectedTask?.title!}
          body={
            <View>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                {selectedTask?.done && (
                  <Text style={styles.font}>
                    {t('Finished task on', { date: dateString(selectedTask!.doneDate!, t) })}
                  </Text>
                )}
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
                {selectedTask?.setTo && (
                  <Text style={styles.font}>
                    {t('Set task to', { date: dateString(selectedTask!.setTo!, t) })}
                  </Text>
                )}
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
                {selectedTask?.reminder && (
                  <Text style={styles.font}>
                    {t('Remind me every time', { reminder: t(selectedTask?.reminder) })}
                  </Text>
                )}
              </View>
            </View>
          }
          primaryLabel={
            <Button
              uppercase={false}
              style={[styles.actionButtons, {marginLeft: 15}]}
              labelStyle={[styles.font, {fontSize: 16, color: theme.colors.accent, letterSpacing: 0}]}
              onPress={() => deleteTaskHandler(selectedTask!.id, selectedTask!.done)}
            >{t('Delete')}</Button>
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