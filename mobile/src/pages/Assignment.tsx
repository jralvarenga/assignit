import { GoogleSignin } from '@react-native-google-signin/google-signin'
import React, { useLayoutEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import { removeSubjectProgress } from '../hooks/subjectProgress'
import { dateString, timeString } from '../hooks/useDateTime'
import { Assignment, FirebaseError, Subject, SubjectProvider } from '../interface/interfaces'
import { deleteEvent } from '../lib/calendar'
import { deleteAssigment, updateProgress } from '../lib/firestore'
import { useSubjectProvider } from '../services/SubjectsProvider'
import auth from '@react-native-firebase/auth'
import { getUserProvider } from '../lib/auth'
import { cancelNoti } from '../lib/notifications'
import { useTranslation } from 'react-i18next'
import AppSnackbar from '../components/Snackbar'

const AssignmentScreen = ({ route, navigation }: any) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const styles = styleSheet(theme)
  const user = auth().currentUser
  const provider = getUserProvider()
  const subject: Subject = route.params.subject
  const assignment: Assignment = route.params.assignment
  const subjectProvider: SubjectProvider = useSubjectProvider()
  const { render, setRender, subjects }: SubjectProvider = subjectProvider
  const [loading, setLoading] = useState(false)
  const [snackbarText, setSnackbarText] = useState("")
  const [showSnackbar, setShowSnackbar] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    })
  })

  const removeAssigment = async() => {
    setLoading(true)
    try {
      const id = assignment.id
      if (provider == 'google.com') {
        const googleUser = await GoogleSignin.getTokens()
        const accessToken = googleUser.accessToken

        if (id.length != 15) {
          await deleteEvent(id, accessToken)
        }
      }
      cancelNoti(assignment.notiId)

      subject.progress = removeSubjectProgress(subject)
      await updateProgress(subject, user)

      await deleteAssigment(id, user, subject)
      setRender!(render! + 1)
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

  const goToSubject = () => {
    const id = assignment.subject
    const index = subjects!.map((subject: Subject) => subject.id ).indexOf(id)
    navigation.navigate('Subject', subjects![index])
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.body}>
        <View style={styles.titleContainer}>
          <Text style={[styles.font, {fontSize: 32}]}>{assignment.title}</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={goToSubject}>
            <Text style={[styles.font, {fontSize: 20, color: subject.color.color}]}>
              {subject.name}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.datesContainer}>
          <View style={styles.dateBox}>
            <Text style={[styles.font, { fontSize: 18 }]}>{t("From")}</Text>
            <Text style={[styles.font, { fontSize: 18 }]}>
              {t("Assignment datetime", { date: dateString(assignment.from, t), time: timeString(assignment.from) })}
            </Text>
          </View>
          <View style={styles.dateBox}>
            <Text style={[styles.font, { fontSize: 18 }]}>{t("To")}</Text>
            <Text style={[styles.font, { fontSize: 18 }]}>
              {t("Assignment datetime", { date: dateString(assignment.to, t), time: timeString(assignment.to) })}
            </Text>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          {assignment.description == '' ? (
            <View>
              <Text style={[styles.font, { fontSize: 20, color: theme.colors.textPaper }]}>
                {t("No description")}
              </Text>
            </View>
          ) : (
            <View>
              <Text style={[styles.font, { fontSize: 20 }]}>{t("Desciption")}</Text>
              <Text style={[styles.font, {color: theme.colors.textPaper, textAlign: 'justify', marginTop: 10}]}>
                {assignment.description}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.bottom}>
        <Button
          style={[styles.removeButton, {backgroundColor: subject.color.color}]}
          mode="contained"
          onPress={removeAssigment}
          uppercase={false}
          loading={loading}
          labelStyle={styles.removeLabel}
        >{t("Done")}
        </Button>
      </View>

      <AppSnackbar
        visible={showSnackbar}
        setVisible={setShowSnackbar}
        text={snackbarText}
      />
    </View>
  )
}

const styleSheet = (theme: any) => StyleSheet.create({
  container: {
    flex: 1
  },
  font: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text,
    fontSize: 16
  },
  body: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  datesContainer: {
    width: '90%',
    marginTop: 20
  },
  dateBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  descriptionContainer: {
    width: '90%',
    marginTop: 30
  },
  bottom: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  removeButton: {
    elevation: 0
  },
  removeLabel: {
    padding: 3,
    paddingLeft: 30,
    paddingRight: 30,
    fontFamily: 'poppins-bold',
    color: theme.colors.background,
    fontSize: 16,
    letterSpacing: 0,
  },
})

export default AssignmentScreen