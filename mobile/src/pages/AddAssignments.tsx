import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View, Dimensions, BackHandler } from 'react-native'
import { DatePicker, TimePicker } from '../components/DateTimePicker'
import { Button, Text, IconButton, TextInput, Checkbox, Dialog, Portal, useTheme } from 'react-native-paper'
import { dateParams, dateString, timeParams, timeString, useDatetime } from '../hooks/useDateTime'
import { Assignment, Subject } from '../interface/interfaces'
import { createNotiId } from '../hooks/createId'
import { useTranslation } from 'react-i18next'
import AppSnackbar from '../components/Snackbar'
import { colorIsLightOrDark } from '../hooks/colorIsLightOrDark'

const deviceHeight = Dimensions.get('screen').height

const AddAssignmentsScreen = ({ route, navigation }: any) => {
  const { t }: any = useTranslation()
  const theme = useTheme()
  const styles = styleSheet(theme)
  const subject: Subject = route.params
  
  const [render, setRender] = useState(0)
  const [showGoBack, setShowGoBack] = useState(false)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [createLoad, setCreateLoad] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [allDayCheck, setAllDayCheck] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const [secondDatetime, setSecondDatetime] = useState(false)
  const [date, setSelectedDate, reset1] = useDatetime('date', t)
  const [time, setSelectedTime, reset2] = useDatetime('time', t)
  const [secondDate, setSelectedDate2, reset3] = useDatetime('date', t)
  const [secondTime, setSelectedTime2, reset4] = useDatetime('time', t)

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setShowGoBack(true)
        return true
      }
    )

    return () => backHandler.remove();
  }, [])

  const confirmGoBack = () => {
    setShowGoBack(false)
    navigation.goBack()
  }
  
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

  const addAssignment = () => {
    if (title == '') {
      setSnackbarMessage("Provide a assigment title")
      setShowSnackbar(true)
      return
    } if (date.string == 'Select date' || time.string == 'Select time') {
      setSnackbarMessage("Add a start date and time")
      setShowSnackbar(true)
      return
    }
    const fromDateParams = dateParams(date.date)
    const fromTimeParams = timeParams(time.time)
    const datetime1 = new Date(Date.UTC(fromDateParams.year, fromDateParams.month, fromDateParams.date, fromTimeParams.hour, fromTimeParams.minutes))
    
    
    const toDateParams = dateParams(secondDate.date)
    const toTimeParams = timeParams(secondTime.time)
    const datetime2 = new Date(Date.UTC(toDateParams.year, toDateParams.month, toDateParams.date, toTimeParams.hour, toTimeParams.minutes))
    const assignment: Assignment = {
      id: `${render + 1}`,
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
    setRender(render + 1)
  }

  const deleteAssignment = (id: number) => {
    const index = assignments.map((assignments: any) => assignments.id).indexOf(id)
    assignments.splice(index, 1)
    setAssignments(assignments)
    setRender(render + 1)
  }

  const createSubject = () => {
    if (assignments.length == 0) {
      setSnackbarMessage("You need to add at least 1 assignment")
      setShowSnackbar(true)
      return
    }
    setCreateLoad(true)
    const subjectData: Subject = {
      ...subject,
      assignments: assignments,

    }
    setCreateLoad(false)
    navigation.navigate('Create Subject', subjectData)
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          mode="contained"
          loading={createLoad}
          uppercase={false}
          style={[styles.addButton, { backgroundColor: subject.color.color, marginRight: 15 }]}
          onPress={createSubject}
          labelStyle={[styles.font, {letterSpacing: 0, color: colorIsLightOrDark(subject.color.color)}]}
        >{t("Create")}</Button>
      ),
    })
  })

  return (
    <ScrollView style={styles.container}>
      <View style={styles.newAssignments}>
        <Text style={[styles.font, { fontSize: 22, width: '95%', marginTop: 40 }]}>
          {t("Add assignments to", { subject: subject.name })}
        </Text>
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
            <View style={{ width: '55%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[styles.font, { fontSize: 16 }]}>{t("From")}:</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7} style={styles.pickedDatetime}>
                <Text style={styles.font}>{date.string}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} activeOpacity={0.7} style={styles.pickedDatetime}>
              <Text style={styles.font}>{time.string}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.selectedDatetime}>
            <View style={{ width: '55%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[styles.font, { fontSize: 16 }]}>{t("To")}:</Text>
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
              label={t("Description")}
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
            labelStyle={[styles.font, { letterSpacing: 0, color: colorIsLightOrDark(subject.color.color) }]}
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
        text={snackbarMessage}
      />

      { /* Notifications settings */ }
      <Portal>
        <Dialog visible={showGoBack} onDismiss={() => setShowGoBack(false)}>
          <Dialog.Title style={[styles.font, {fontSize: 25, letterSpacing: 0}]}>
            Wait!!
          </Dialog.Title>
          <Dialog.Content>
            <Text style={[styles.font, {color: theme.colors.textPaper}]}>
              {t("Are you sure you want to go back?, nothing has been saved yet")}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              uppercase={false}
              labelStyle={[styles.font, {letterSpacing: 0}]}
              onPress={() => setShowGoBack(false)}
            >{t("Cancel")}</Button>
            <Button
              mode="text"
              uppercase={false}
              style={[{marginLeft: 20}]}
              labelStyle={[styles.font, {letterSpacing: 0}]}
              onPress={confirmGoBack}
            >{t("Go back")}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    color: theme.colors.text,
    fontSize: 16
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
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 15,
    marginRight: '5%',
    elevation: 0
  },
  assignmentsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: 60,
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

export default AddAssignmentsScreen