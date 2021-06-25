import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native'
import { DatePicker, TimePicker } from '../components/DateTimePicker'
import { Text, Button, IconButton, TextInput, Checkbox, useTheme } from 'react-native-paper'
import { dateParams, dateString, timeParams, timeString, useDatetime } from '../hooks/useDateTime'
import { Assignment, Settings, Subject, SubjectProvider } from '../interface/interfaces'
import { addNewAssigments, updateProgress } from '../lib/firestore'
import auth from '@react-native-firebase/auth'
import { createEvent } from '../lib/calendar'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useSubjectProvider } from '../services/SubjectsProvider'
import { addSubjectProgress } from '../hooks/subjectProgress'
import { createDummyAssignmentId, createNotiId } from '../hooks/createId'
import { getUserProvider } from '../lib/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { localProgamableNoti } from '../lib/notifications'
import { useTranslation } from 'react-i18next'
import AppSnackbar from '../components/Snackbar'

const deviceHeight = Dimensions.get('screen').height

const NewAssigmentScreen = ({ route, navigation }: any) => {
  const { t }: any = useTranslation()
  const theme = useTheme()
  const styles = styleSheet(theme)
  const user = auth().currentUser
  const provider = getUserProvider()
  const subjectProvider: SubjectProvider = useSubjectProvider()
  const { render, setRender }: SubjectProvider = subjectProvider
  const subject: Subject = route.params
  const [loading, setLoading] = useState(false)
  const [googleSync, setGoogleSync] = useState( provider == 'google.com' ? true : false )
  const [snackbarText, setSnackbarText] = useState("")
  const [showSnackbar, setShowSnackbar] = useState(false)
  
  const [screenRender, setScreenRender] = useState(0)
  const [assignments, setAssignments] = useState<Assignment[]>([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const [allDayCheck, setAllDayCheck] = useState(false)
  const [secondDatetime, setSecondDatetime] = useState(false)
  const [date, setSelectedDate, reset1] = useDatetime('date', t)
  const [time, setSelectedTime, reset2] = useDatetime('time', t)
  const [secondDate, setSelectedDate2, reset3] = useDatetime('date', t)
  const [secondTime, setSelectedTime2, reset4] = useDatetime('time', t)

  const getSettings = async() => {
    const stringSettings = await AsyncStorage.getItem('settings')
    const settings: Settings = JSON.parse(stringSettings!)
    setGoogleSync(settings.googleCalendarSync!)
  }

  useEffect(() => {
    getSettings()
  }, [user])
  
  const onDateChange = (selectedDate: Date) => {
    if (secondDatetime) {
      const currentDate = selectedDate || date
      setSelectedDate2(currentDate.toString(), t)
      setShowDatePicker(false)
      setSecondDatetime(false)
    } else {
      const currentDate = selectedDate || date
      setSelectedDate(currentDate.toString(), t)
      setSelectedDate2(currentDate.toString(), t)
      setShowDatePicker(false)
    }
  }
  const onTimeChange = (selectedTime: Date) => {
    if (secondDatetime) {
      const currentTime = selectedTime || time
      setSelectedTime2(currentTime.toString())
      setShowTimePicker(false)
      setSecondDatetime(false)
    } else {
      const currentTime = selectedTime || time
      setSelectedTime(currentTime.toString())
      setSelectedTime2(currentTime.toString())
      setShowTimePicker(false)
    }
  }

  const addAssignment = () => {
    const fromDateParams = dateParams(date.date)
    const fromTimeParams = timeParams(time.time)
    const datetime1 = new Date(Date.UTC(fromDateParams.year, fromDateParams.month, fromDateParams.date, fromTimeParams.hour, fromTimeParams.minutes))
    
    const toDateParams = dateParams(secondDate.date)
    const toTimeParams = timeParams(secondTime.time)
    const datetime2 = new Date(Date.UTC(toDateParams.year, toDateParams.month, toDateParams.date, toTimeParams.hour, toTimeParams.minutes))
    const assignment: Assignment = {
      id: `${screenRender + 1}`,
      subject: route.params.id,
      title: title,
      description: description,
      from: datetime1,
      to: datetime2,
      notiId: createNotiId()
    }
    assignments.push(assignment)
    setAssignments(assignments)
    setTitle("")
    setDescription("")
    reset1()
    reset2()
    reset3()
    reset4()
    setAllDayCheck(false)
    setScreenRender(screenRender + 1)
  }

  const allDayHandler = (state: boolean) => {
    if (state) {
      const time1 = new Date()
      const time2 = new Date()
      time1.setHours(0, 0, 0)
      time2.setHours(23, 59, 59)
      setSelectedTime(time1.toString())
      setSelectedTime2(time2.toString())
    } else {
      reset2()
      reset4()
    }
    setAllDayCheck(state)
  }

  const deleteAssignment = (id: number) => {
    const index = assignments.map((assignments: any) => assignments.id).indexOf(id)
    assignments.splice(index, 1)
    setAssignments(assignments)
    setScreenRender(screenRender + 1)
  }

  /*const createAssigmentsWithEvents = async() => {
    const googleUser = await GoogleSignin.getTokens()
    const accessToken = googleUser.accessToken
    const newAssigments: Assignment[] = await Promise.all(assignments!.map(async(assignment: Assignment) => {
      // Create noti
      const notiBody = {
        date: assignment.from,
        body: {
          id: assignment.notiId,
          title: subject.name,
          body: t("Assignment in 24 hours", { assignment: assignment.title })
        }
      }
      localProgamableNoti(notiBody)

      const result =  await createEvent(accessToken, assignment, subject)
      const eventId = await result.id
      if (eventId == undefined) {
        assignment.id = createDummyAssignmentId()
        return assignment
      } else {
        assignment.id = eventId
        return assignment
      }
    }))
    return newAssigments
  }*/

  const createAssigments = async() => {
    const newAssigments: Assignment[] = await Promise.all(assignments!.map(async(assignment: Assignment) => {
      // Create noti
      const notiBody = {
        date: assignment.from,
        body: {
          id: assignment.notiId,
          title: subject.name,
          body: t("Assignment in 24 hours", { assignment: assignment.title })
        }
      }
      localProgamableNoti(notiBody)
      
      assignment.id = createDummyAssignmentId()
      return assignment
    }))
    return newAssigments
  }

  const addNewAssigmentsHandler = async() => {
    setLoading(true)
    try {
      const newProgress = addSubjectProgress(subject, assignments.length)
      subject.progress = newProgress
      await updateProgress(subject, user)
      /*if (provider == 'google.com' && googleSync == true) {
        const newAssignments = await createAssigmentsWithEvents()
        await addNewAssigments(subject, newAssignments, user)
      }*/
      const newAssignments = await createAssigments()
      await addNewAssigments(subject, newAssignments, user)
      setLoading(false)
      setRender!(render! + 1)
      navigation.navigate('Home')
    } catch (error) {
      if (error.message) {
        setSnackbarText(error.message)
        setShowSnackbar(true)
      } else {
        setSnackbarText(JSON.stringify(error))
        setShowSnackbar(true)
      }
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
      headerRight: () => (
        <Button
          mode="contained"
          uppercase={false}
          style={[styles.addButton, { backgroundColor: subject.color.color, marginRight: 15 }]}
          onPress={addNewAssigmentsHandler}
          loading={loading}
          labelStyle={[styles.font, {letterSpacing: 0, color: theme.colors.background}]}
        >{t("Add")}</Button>
      ),
    })
  })

  return (
    <ScrollView style={styles.container}>
      <View style={styles.newAssignments}>
        <View style={styles.assignmentTitle}>
          <TextInput
            value={title}
            onChangeText={(value: string) => setTitle(value)}
            style={[styles.assignmentTitleInput, {borderRadius: 15 }]}
            underlineColor="transparent"
            label={t("Assignment title")}
            theme={{ colors: { primary: subject.color.color } }}
          />
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox
              status={allDayCheck ? 'checked' : 'unchecked'}
              color={subject.color.color}
              onPress={() => {
                allDayHandler(!allDayCheck);
              }}
            />
            <Text style={[styles.font]}>{t("All day")}</Text>
          </View>
        </View>
        <View style={styles.datesContainer}>
          <View style={styles.selectedDatetime}>
            <View style={{ width: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[styles.font, { fontSize: 16, marginRight: 20 }]}>{t("From")}:</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7} style={styles.pickedDatetime}>
                <Text style={styles.font}>{date.string}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} activeOpacity={0.7} style={styles.pickedDatetime}>
              <Text style={styles.font}>{time.string}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.selectedDatetime}>
            <View style={{ width: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[styles.font, { fontSize: 16, marginRight: 20 }]}>{t("To")}:</Text>
              <TouchableOpacity onPress={() => {setShowDatePicker(true); setSecondDatetime(true)}} activeOpacity={0.7} style={styles.pickedDatetime}>
                <Text style={styles.font}>{secondDate.string}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => {setShowTimePicker(true); setSecondDatetime(true)}} activeOpacity={0.7} style={styles.pickedDatetime}>
              <Text style={styles.font}>{secondTime.string}</Text>
            </TouchableOpacity>
          </View>
        </View>
          <View style={styles.descriptionContainer}>
            <TextInput
              value={description}
              onChangeText={(value: string) => setDescription(value)}
              style={{ width: '95%', borderRadius: 15 }}
              underlineColor="transparent"
              label="Description"
              multiline={true}
              numberOfLines={6}
              theme={{ colors: { primary: subject.color.color } }}
            />
          </View>
        <View style={styles.addCreateContainer}>
          <Button
            mode="contained"
            uppercase={false}
            style={[styles.addButton, { backgroundColor: subject.color.color }]}
            onPress={addAssignment}
            labelStyle={[styles.font, {letterSpacing: 0, color: theme.colors.background}]}
          >{t("Add")}</Button>
        </View>
      </View>
      <View style={styles.addedAssignments}>
        <View style={styles.assignmentsContainer}>
          {assignments.map((assignment: Assignment, i: number) => (
            <View style={styles.assignmentBox} key={i}>
              <View>
                <Text style={[styles.font, {fontSize: 20, marginLeft: 15}]}>{assignment.title}</Text>
                <Text style={[styles.font, {fontSize: 14, marginLeft: 15}]}>
                  {dateString(assignment.from, t)} - {timeString(assignment.from) == '0:00 am' ? ( t("All day") ) : ( timeString(assignment.from) )}
                </Text>
              </View>
              <IconButton
                icon="trash-can"
                style={{ marginRight: 10 }}
                onPress={() => deleteAssignment(+assignment.id)}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Datetime picker */}
      <DatePicker
        visible={showDatePicker}
        setVisible={setShowDatePicker}
        onConfirm={onDateChange}
      />
      <TimePicker
        visible={showTimePicker}
        setVisible={setShowTimePicker}
        onConfirm={onTimeChange}
      />

      <AppSnackbar
        visible={showSnackbar}
        setVisible={setShowSnackbar}
        text={snackbarText}
      />
    </ScrollView>
  )
}

const styleSheet = (theme: any) => StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  font: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text
  },
  newAssignments: {
    width: '100%',
    height: deviceHeight * 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addedAssignments: {
    width: '100%',
  },
  assignmentTitle: {
    width: '95%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  assignmentTitleInput: {
    width: '70%',
    fontFamily: 'poppins',
    fontSize: 16,
  },
  datesContainer: {
    width: '95%',
  },
  descriptionContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 15
  },
  selectedDatetime: {
    width: '100%',
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pickedDatetime: {
    padding: 7,
    borderRadius: 10,
    backgroundColor: theme.colors.surface
  },
  addCreateContainer: {
    width: '95%',
    alignItems: 'flex-end',
    marginTop: 20
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
  assignmentsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: 16,
    marginBottom: 15
  },
  assignmentBox: {
    width: '95%',
    height: 80,
    backgroundColor: theme.colors.surface,
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    marginLeft: '3%'
  },
})

export default NewAssigmentScreen