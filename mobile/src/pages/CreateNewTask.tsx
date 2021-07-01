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
import { addNewTask, setTaskRepeater } from '../lib/tasksLib'
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
  const [showrepeatType, setShowrepeatType] = useState(false)
  const [repeatType, setRepeatType] = useState<string | undefined>()
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarText, setSnackbarText] = useState('')

  const getMilisecondsRepeater = (type: string) => {
    switch (type) {
      case 'Hour':
        return 3600000
      case 'Day':
        return 86400000
      case 'Week':
        return 604800000
      case 'Month':
        return  2592000000
      default:
        return 0
    }
  }

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
    if (repeatType) {
      const repeatDate = new Date()
      repeatDate.setMinutes( repeatDate.getMinutes() + repeatDate.getTimezoneOffset() )
      repeatDate.setMinutes(0)
      //const notiId = setTaskRepeater(repeatType, taskData)
      //taskData.notiId = notiId
      taskData.repeat = getMilisecondsRepeater(repeatType)
      taskData.repeatDate = repeatDate 
    }
    if (taskDate && !repeatType) {
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

  const setRepeatTypeHandler = (type: string | undefined) => {
    setTaskDate(undefined)
    setRepeatType(type)
    setShowrepeatType(false)
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
          labelStyle={[styles.font, {letterSpacing: 0, color: theme.colors.background }]}
        >{t('Add')}</Button>
      ),
    })
  })

  return (
    <View>
      <ScrollView style={{ width: '100%', height: '100%' }}>
        <View style={styles.container}>

          <View style={styles.addTitleContainer}>
            <TextInput
              value={newTaskTitle}
              onChangeText={(value) => setNewTaskTitle(value)}
              label={t("Add task title")}
              style={{ width: '80%', borderRadius: 15 }}
              underlineColor="transparent"
              theme={{ colors: { primary: newTaskColor.color == 'text' ? theme.colors.primary : newTaskColor.color } }}
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
                  {t('Set task to', { date: dateString(taskDate, t) })}
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
                {t('Set a date')}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.selectedDatetime}>
            <Menu
              visible={showrepeatType}
              onDismiss={() => setShowrepeatType(false)}
              anchor={
                repeatType ? (
                  <Text onPress={() => setShowrepeatType(true)} style={[styles.font, {fontSize: 20}]}>
                    {t("Repeat task every time", { repeat: t(repeatType) })}
                  </Text>
                ) : (
                  <Text onPress={() => setShowrepeatType(true)} style={[styles.font, { fontSize: 20, marginRight: 20 }]}>
                    {t('Repeat task')}
                  </Text>
                )
              }
            >
              <Menu.Item onPress={() => setRepeatTypeHandler(undefined)} title={t("None")} />
              <Menu.Item onPress={() => setRepeatTypeHandler('Hour')} title={t("Hour")} />
              <Menu.Item onPress={() => setRepeatTypeHandler('Day')} title={t("Day")} />
              <Menu.Item onPress={() => setRepeatTypeHandler('Week')} title={t("Week")} />
              <Menu.Item onPress={() => setRepeatTypeHandler('Month')} title={t("Month")} />
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
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    marginRight: '5%',
    elevation: 0
  },
})

export default CreateNewTask