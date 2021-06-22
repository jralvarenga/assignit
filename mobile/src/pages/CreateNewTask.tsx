import React, { useLayoutEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import { Theme } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import { useTheme, TextInput, Divider, Button, Menu, IconButton } from 'react-native-paper'
import ColorPicker from '../components/ColorPicker'
import { DatePicker } from '../components/DateTimePicker'
import AppSnackbar from '../components/Snackbar'
import { createDummyAssignmentId, createNotiId } from '../hooks/createId'
import { Task, TasksProvider } from '../interface/interfaces'
import { useTasks } from '../services/TasksProvider'
import { addNewTask, setTaskReminder } from '../lib/tasksLib'
import { dateParams, dateString } from '../hooks/useDateTime'
import { useTranslation } from 'react-i18next'
import { localProgamableNoti } from '../lib/notifications'

const CreateNewTask = ({ navigation }: any) => {
  const { t } = useTranslation()
  const user = auth().currentUser
  const theme: any = useTheme()
  const styles = styleSheet(theme)
  const { tasks, setTasks, setRender, render }: TasksProvider = useTasks()
  const [createTaskLoad, setCreateTaskLoad] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskColor, setNewTaskColor] = useState({ id: "12", color: "text" })
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [taskDate, setTaskDate] = useState<Date | undefined>()
  const [showReminderType, setShowReminderType] = useState(false)
  const [reminderType, setReminderType] = useState<string | undefined>()
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarText, setSnackbarText] = useState('')

  const taskColorHandler = (color: any) => {
    setNewTaskColor(color)
    setShowColorPicker(false)
  }

  const setTaskDateHandler = (date: Date) => {
    const dateData = dateParams(date)
    const taskDate = new Date(Date.UTC(dateData.year, dateData.month, dateData.date))
    taskDate.setMinutes( taskDate.getMinutes() + taskDate.getTimezoneOffset() )
    setTaskDate(taskDate)
  }

  const createTaskHandler = async() => {
    if (newTaskTitle == '') {
      setSnackbarText('Set a title for the task')
      setShowSnackbar(true)
      return
    }
    setCreateTaskLoad(true)
    const taskData: Task = {
      title: newTaskTitle,
      color: newTaskColor,
      id: createDummyAssignmentId(),
      done: false,
      notiId: 0
    }
    if (taskDate) {
      const notiId = createNotiId()
      const notiBody = {
        date: taskDate,
        body: {
          id: notiId,
          title: `${taskData.title}`,
          body: `You have to do this task`
        }
      }
      localProgamableNoti(notiBody)
      taskData.notiId = notiId
      taskData.setTo = taskDate
    }
    if (reminderType) {
      const notiId = setTaskReminder(reminderType, taskData)
      taskData.notiId = notiId
      taskData.reminder = reminderType
    }
    try {
      await addNewTask(taskData, user)
    } catch (error) {
      setSnackbarText('An error has happen')
      setShowSnackbar(true)
    }
    //setTasks!( tasks!.push(taskData) )
    setRender!(render! + 1)
    setCreateTaskLoad(false)
    navigation.goBack()
  }

  const setReminderTypeHandler = (type: string | undefined) => {
    setReminderType(type)
    setShowReminderType(false)
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
      headerRight: () => (
        <Button
          mode="contained"
          uppercase={false}
          loading={createTaskLoad}
          style={[styles.addButton, { backgroundColor: newTaskColor.color == 'text' ? theme.colors.primary : newTaskColor.color, marginRight: 15 }]}
          onPress={createTaskHandler}
          labelStyle={[styles.font, {letterSpacing: 0, color: theme.colors.background}]}
        >Add</Button>
      ),
    })
  })

  return (
    <View>
      <ScrollView style={{ width: '100%', height: '100%' }}>
        <View style={styles.container}>

          <View style={styles.addTitleContainer}>
            <TextInput
              mode="outlined"
              value={newTaskTitle}
              onChangeText={(value) => setNewTaskTitle(value)}
              label="Add task title"
              style={{ width: '80%' }}
              theme={{ colors: { primary: newTaskColor.color == 'text' ? theme.colors.text : newTaskColor.color } }}
            />
            <TouchableOpacity
              onPress={() => setShowColorPicker(true)}
              activeOpacity={0.7}
              style={[styles.colorChooser, {backgroundColor: newTaskColor.color == 'text' ? theme.colors.card : newTaskColor.color}]}
            />
          </View>
          <Divider />

          <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7} style={styles.selectedDatetime}>
            {taskDate ? (
              <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.font, {fontSize: 20}]}>
                  To {dateString(taskDate, t)}
                </Text>
                <IconButton
                  icon="cancel"
                  color={theme.colors.text}
                  size={28}
                  style={{ backgroundColor: theme.colors.card }}
                  onPress={() => setTaskDate(undefined)}
                />
              </View>
            ) : (
              <Text style={[styles.font, { fontSize: 20 }]}>
                Set a date
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.selectedDatetime}>
            <Menu
              visible={showReminderType}
              onDismiss={() => setShowReminderType(false)}
              anchor={
                reminderType ? (
                  <Text onPress={() => setShowReminderType(true)} style={[styles.font, {fontSize: 20}]}>
                    Remind me every {reminderType}
                  </Text>
                ) : (
                  <Text onPress={() => setShowReminderType(true)} style={[styles.font, { fontSize: 20, marginRight: 20 }]}>
                    Remind task
                  </Text>
                )
              }
            >
              <Menu.Item onPress={() => setReminderTypeHandler(undefined)} title="None" />
              <Menu.Item onPress={() => setReminderTypeHandler('Hour')} title="Hour" />
              <Menu.Item onPress={() => setReminderTypeHandler('Day')} title="Day" />
              <Menu.Item onPress={() => setReminderTypeHandler('Week')} title="Week" />
              <Menu.Item onPress={() => setReminderTypeHandler('Month')} title="Month" />
            </Menu>
          </View>

          <ColorPicker
            visible={showColorPicker}
            setVisible={setShowColorPicker}
            colorPickerHandler={taskColorHandler}
          />

          <AppSnackbar
            visible={showSnackbar}
            setVisible={setShowSnackbar}
            text={snackbarText}
          />

          <DatePicker
            visible={showDatePicker}
            setVisible={setShowDatePicker}
            onConfirm={setTaskDateHandler}
          />

        </View>
      </ScrollView>
    </View>
  )
}

const styleSheet = (theme: Theme) => StyleSheet.create({
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
  addTitleContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  colorChooser: {
    width: 47,
    height: 47,
    borderRadius: 100,
    marginBottom: 5,
    borderColor: theme.colors.card
  },
  selectedDatetime: {
    width: '90%',
    marginTop: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pickedDatetime: {
    padding: 7,
    borderRadius: 10,
  },
  addButton: {
    width: 100,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    marginRight: '5%',
  },
})

export default CreateNewTask