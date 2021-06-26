import React, { useEffect, useState } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import { dateString, filterAssignments, timeString } from '../hooks/useDateTime'
import { Subject, Assignment, Settings, FirebaseError, SubjectProvider } from '../interface/interfaces'
import { createSubject } from '../lib/firestore'
import auth from '@react-native-firebase/auth'
import { createEvent } from '../lib/calendar'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useSubjectProvider } from '../services/SubjectsProvider'
import { createDummyAssignmentId } from '../hooks/createId'
import { getUserProvider } from '../lib/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { localProgamableNoti } from '../lib/notifications'
import { useTranslation } from 'react-i18next'
import AppSnackbar from '../components/Snackbar'

const CreateSubjectScreen = ({ route, navigation }: any) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const styles = styleSheet(theme)
  const user: any = auth().currentUser
  const provider = getUserProvider()
  const { render, setRender }: SubjectProvider = useSubjectProvider()
  let subject: Subject = route.params
  const [assignments, setAssignments] = useState<any>([])
  const [createLoad, setCreateLoad] = useState(false)
  const [googleSync, setGoogleSync] = useState( provider == 'google.com' ? true : false )
  const [snackbarText, setSnackbarText] = useState("")
  const [showSnackbar, setShowSnackbar] = useState(false)

  const getSettings = async() => {
    const stringSettings = await AsyncStorage.getItem('settings')
    const settings: Settings = JSON.parse(stringSettings!)
    setGoogleSync(settings.googleCalendarSync!)
  }

  useEffect(() => {
    getSettings()
  }, [user])

  useEffect(() => {
    const filteredAssignments = filterAssignments(route.params.assignments, t)
    setAssignments(filteredAssignments)
  }, [route.params.assignments])

  /*const createAssignmentsWithEvents = async() => {
    const googleUser = await GoogleSignin.getTokens()
    const accessToken = googleUser.accessToken
    const newAssignments: Assignment[] = await Promise.all(subject.assignments!.map(async(assignment: Assignment) => {
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
    return newAssignments
  }*/

  const createAssignments = async() => {
    const newAssignments: Assignment[] = await Promise.all(subject.assignments!.map(async(assignment: Assignment) => {
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
    return newAssignments
  }

  const createSubjectHandler = async() => {
    setCreateLoad(true)
    try {
      /*if (provider == 'google.com' && googleSync == true) {
        const newAssignments = await createAssignmentsWithEvents()
        subject.assignments = newAssignments
        const progress = {
          total: newAssignments.length,
          progress: 0
        }
        subject.progress = progress
        
        await createSubject(subject, user)
        setRender(render + 1)
      }*/
      const newAssignments = await createAssignments()
        subject.assignments = newAssignments
        const progress = {
          total: newAssignments.length,
          progress: 0
        }
        subject.progress = progress
        
        await createSubject(subject, user)
        setRender!(render! + 1)

      setCreateLoad(false)
      navigation.navigate('Home')
    } catch (e: any) {
      const error: FirebaseError = e
      if (error.message) {
        setSnackbarText(error.message)
        setShowSnackbar(true)
      } else {
        setSnackbarText(JSON.stringify(error))
        setShowSnackbar(true)
      }
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.nameContainer}>
        <Text style={[styles.font, {fontSize: 35}]}>{subject.name}</Text>
        <View style={[styles.colorChooser, {backgroundColor: subject.color.color}]}></View>
      </View>
      <View style={styles.assignmentsContainer}>
        {Object.keys(assignments).map((item, i) => {
          const date = item
          const orderAssignments: Assignment[] = assignments[item]
          return (
            <View key={i}>
              <Text style={[styles.font, {color: theme.colors.textPaper, fontSize: 16, marginLeft: '3%', marginBottom: 5}]}>
                {date}
              </Text>
              {orderAssignments.map((assignment: Assignment, i: number) => (
                <View style={styles.assignmentBox} key={i}>
                    <Text style={[styles.font, {fontSize: 20, marginLeft: 15}]}>{assignment.title}</Text>
                    <Text style={[styles.font, {fontSize: 14, marginLeft: 15}]}>{dateString(assignment.from, t)} - {timeString(assignment.from)}</Text>
              </View>
              ))}
            </View>
          )
        })}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          uppercase={false}
          loading={createLoad}
          style={[styles.addButton, { backgroundColor: subject.color.color, }]}
          onPress={createSubjectHandler}
          labelStyle={[styles.font, {fontSize: 16, letterSpacing: 0, color: theme.colors.background}]}
        >{t("Create subject")}</Button>
      </View>

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
    flex: 1,
  },
  nameContainer: {
    width: '95%',
    marginLeft: '3%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  font: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text
  },
  colorChooser: {
    width: 45,
    height: 45,
    borderRadius: 100,
    marginRight: '3%',
    borderWidth: 1,
    borderColor: theme.colors.surface
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
  buttonContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    marginBottom: 60
  },
  addButton: {
    width: 160,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    marginRight: '5%',
    elevation: 0
  },
})

export default CreateSubjectScreen