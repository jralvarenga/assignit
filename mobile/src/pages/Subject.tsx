import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useState } from 'react'
import { StyleSheet, View, TouchableOpacity, Dimensions, ScrollView, Linking } from 'react-native'
import { Text, Button, Dialog, IconButton, Menu, Portal, ProgressBar, Snackbar, TextInput, TouchableRipple, useTheme } from 'react-native-paper'
import { filterAssignments, timeString } from '../hooks/useDateTime'
import { Subject, Assignment, SubjectProvider } from '../interface/interfaces'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { changeLinks, deleteSubject } from '../lib/firestore'
import auth from '@react-native-firebase/auth'
import { deleteEvent } from '../lib/calendar'
import { useSubjectProvider } from '../services/SubjectsProvider'
import { getUserProvider } from '../lib/auth'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useTranslation } from 'react-i18next'
import AppSnackbar from '../components/Snackbar'

const devideWidth = Dimensions.get('window').width
const devideHeight = Dimensions.get('window').height

const SubjectScreen = ({ navigation, route }: any) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const styles = styleSheet(theme)
  const user = auth().currentUser
  const provider = getUserProvider()
  const navSubject: Subject = route.params
  const [loading, setLoading] = useState(false)
  const subjectProvider: SubjectProvider = useSubjectProvider()
  const { render, setRender }: SubjectProvider = subjectProvider
  const [snackbarText, setSnackbarText] = useState("")
  const [showSnackbar, setShowSnackbar] = useState(false)
  
  const [subject, setSubject] = useState<Subject>(navSubject)
  const [openMenu, setOpenMenu] = useState(false)
  const [datesAssignments, setDatesAssignments] = useState<any>({})
  const [showDeleteSubject, setShowDeleteSubject] = useState(false)

  const [showAddLinks, setShowAddLinks] = useState(false)
  const [newLink, setNewLink] = useState('')
  const [newReunion, setNewReunion] = useState('')

  const newLinkRef: any = useRef()
  const newReunionRef: any = useRef()

  const [showError, setShowError] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const filteredAssignments: any = filterAssignments(subject.assignments!, t)
    setDatesAssignments(filteredAssignments)
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="dots-vertical"
          color={theme.colors.text}
          size={30}
          onPress={() => setOpenMenu(true)}
        />
      ),
    })
  })

  const viewAssignment = (assignment: Assignment) => {
    navigation.navigate('Assignment', { assignment: assignment, subject: subject })
  }

  const newAssigment = () => {
    setOpenMenu(false)
    navigation.navigate('New Assigment', subject)
  }

  const showDeleteHandler = () => {
    setOpenMenu(false)
    setShowDeleteSubject(true)
  }

  const deleteSubjectHandler = async() => {
    setLoading(true)
    try {
      if (provider == 'google.com') {
        const googleUser = await GoogleSignin.getTokens()
        const accessToken = googleUser.accessToken
    
        subject.assignments!.map(async(assignment: Assignment) => {
          await deleteEvent(assignment.id, accessToken)
        })
      }

      await deleteSubject(subject, user)
      setLoading(false)
      setShowDeleteSubject(false)
      setRender!(render! + 1)
      navigation.navigate('Home')
    } catch (error: any) {
      if (error.message) {
        setSnackbarText(error.message)
        setShowSnackbar(true)
      } else {
        setSnackbarText(JSON.stringify(error))
        setShowSnackbar(true)
      }
    }
  }

  const goToStadistics = () => {
    setOpenMenu(false)
    navigation.navigate('Stadistics')
  }

  const goToLink = async(link: string | undefined) => {
    const supported = await Linking.canOpenURL(link!)
    if (supported) {
      Linking.openURL(link!)
    } else {
      setSnackbarText(t("There has been an error opening the link"))
      setShowSnackbar(true)
    }
  }

  const newLinkHandler = async() => {
    setLoading(true)
    try {
      await changeLinks(subject, user, 'link', newLink)
    } catch (error) {
      setSnackbarText(t("There has been an error opening the link"))
      setShowSnackbar(true)
    }
    setNewLink('')
    setSubject({
      ...subject,
      link: newLink
    })
    setLoading(false)
    setRender!(render! + 1)
  }

  const newReunionHandler = async() => {
    setLoading(true)
    try {
      await changeLinks(subject, user, 'reunion', newReunion)
    } catch (error) {
      setError(t("There has been an error opening the link"))
      setShowError(true)
    }
    setNewReunion('')
    setSubject({
      ...subject,
      reunion: newReunion
    })
    setLoading(false)
    setRender!(render! + 1)
  }

  return (
    <View style={styles.container} >
      <ScrollView>

        <View style={[styles.stadisticsContainer, { marginBottom: 15 }]}>
          <View style={{ width: '95%' }}>
            {subject.link != '' &&  (
              <TouchableRipple
                borderless
                rippleColor={theme.colors.surface}
                onPress={() => goToLink(subject.link)}
                style={[styles.linkContainer, {marginBottom: 10}]}
              >
                <>
                <Text style={[styles.font, { fontSize: 20 }]}>
                  {t("Go to link", { subject: subject.name })}
                </Text>
                <Feather name="external-link" size={30} color={theme.colors.text} />
                </>
              </TouchableRipple>
            )}
            {subject.reunion != '' && (
              <TouchableRipple
                borderless
                rippleColor={theme.colors.surface}
                onPress={() => goToLink(subject.reunion)}
                style={styles.linkContainer}
              >
                <>
                <Text style={[styles.font, { fontSize: 20 }]}>
                  {t("Go to reunion")}
                </Text>
                <MaterialIcons name="groups" size={30} color={theme.colors.text} />
                </>
              </TouchableRipple>
            )}
            <TouchableOpacity activeOpacity={0.7} onPress={() => setShowAddLinks(true)} style={{ width: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <Text style={[styles.font, {color: theme.colors.textPaper}]}>
                {t("Tap here to edit link")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.stadisticsContainer}>
          <TouchableOpacity onPress={goToStadistics} activeOpacity={0.7} style={{ width: '95%' }}>
            <Text style={[styles.font, { fontSize: 30, marginBottom: 10 }]}>
              {t("Progress")}
            </Text>
          </TouchableOpacity>
          <View style={{ width: '95%' }}>
            <ProgressBar progress={subject.progress!.progress} color={subject.color.color} />
            <View style={{ width: '100%' }}>
              <Text style={[styles.font, { textAlign: 'right', color: theme.colors.textPaper, marginTop: 10 }]}>
                {t("% Done", { porcent: (subject.progress!.progress * 100)!.toFixed(2) })}
              </Text>
            </View>
          </View>
          <View style={{ width: '95%' }}>
            <Text style={[styles.font, { marginTop: 15, marginBottom: 15, fontSize: 20 }]}>
              {subject.assignments?.length == 0 ? (
                t("You don't have anything pending")
              ) : (
                t("Assignments pending", { assignments: subject.assignments?.length } )
              )}
            </Text>
          </View>
        </View>

        <View style={styles.assignmentsContainer}>
          <View style={styles.assignmentsBox}>
            {Object.keys(datesAssignments).map((item, i) => {
              const date = item              
              const assignments: Assignment[] = datesAssignments[item]

              return (
                <View key={i}>
                  <Text style={[styles.font, {color: theme.colors.textPaper, fontSize: 16, marginLeft: '3%', marginBottom: 5, marginTop: 10}]}>
                    {date}
                  </Text>
                  {assignments.map((assimgment, i) => (
                    <TouchableOpacity key={i} onPress={() => viewAssignment(assimgment)} activeOpacity={0.7} style={styles.assignmentBox}>
                      <Text style={[styles.font, {fontSize: 20, marginLeft: 15}]}>{assimgment.title}</Text>
                      <Text style={[styles.font, {fontSize: 14, marginLeft: 15}]}>
                        {timeString(assimgment.from) == '0:00 am' ? (
                          t("All day")
                        ) : (
                          timeString(assimgment.from)
                        )}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )
            })}
            
          </View>
        </View>

        {/* subject menu */}
        <Menu
          visible={openMenu}
          onDismiss={() => setOpenMenu(false)}
          anchor={{ x: devideWidth, y: devideHeight * 0.07 }}
          style={{ width: 200 }}
        >
          <Menu.Item
            style={{ height: 60}}
            icon="plus"
            onPress={newAssigment}
            title={t("Add Assignment")}
            contentStyle={{ marginLeft: -10 }}
            titleStyle={[styles.font, {color: theme.colors.textPaper}]}
          />
          <Menu.Item
            style={{ height: 60}}
            icon="link"
            onPress={() => {
              setShowAddLinks(true)
              setOpenMenu(false)
            }}
            title={t("Add links")}
            contentStyle={{ marginLeft: -10 }}
            titleStyle={[styles.font, {color: theme.colors.textPaper}]}
          />
          <Menu.Item
            style={{ height: 60, borderRadius: 15 }}
            icon="trash-can"
            onPress={showDeleteHandler}
            title={t("Delete Subject")}
            contentStyle={{ marginLeft: -10 }}
            titleStyle={[styles.font, {color: theme.colors.textPaper}]}
          />
        </Menu>

        <Portal>
          <Dialog visible={showAddLinks} onDismiss={() => setShowAddLinks(false)}>
            <Dialog.Title style={[styles.font, { fontSize: 20, letterSpacing: 0 }]}>
              {t("Change or add subject links")}
            </Dialog.Title>
            <Dialog.Content>
              <Text style={[styles.font]}>{t("Subject link")}</Text>
              <TextInput
                mode="outlined"
                style={{ width: '100%', backgroundColor: theme.colors.surface }}
                value={newLink}
                ref={newLinkRef}
                onChangeText={(value: string) => setNewLink(value)}
                onSubmitEditing={newLinkHandler}
                theme={{ ...theme, colors: { primary: subject.color.color } }}
                label={subject.link!}
                onBlur={newLinkHandler}
              />
              <Text style={[styles.font, { marginTop: 10 }]}>{t("Reunion link")}</Text>
              <TextInput
                mode="outlined"
                ref={newReunionRef}
                style={{ width: '100%', backgroundColor: theme.colors.surface }}
                value={newReunion}
                onChangeText={(value: string) => setNewReunion(value)}
                onSubmitEditing={newReunionHandler}
                theme={{ ...theme, colors: { primary: subject.color.color } }}
                label={subject.reunion!}
                onBlur={newReunionHandler}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                uppercase={false}
                style={[styles.actionButtons, {marginLeft: 15}]}
                labelStyle={[styles.font, {fontSize: 16, letterSpacing: 0}]}
                onPress={() => setShowAddLinks(false)}
              >{t("Cancel")}</Button>
              <Button
                uppercase={false}
                loading={loading}
                style={[styles.actionButtons]}
                labelStyle={[styles.font, {fontSize: 16, color: theme.colors.primary, letterSpacing: 0}]}
                onPress={() => setShowAddLinks(false)}
              >Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog visible={showDeleteSubject} onDismiss={() => setShowDeleteSubject(false)}>
            <Dialog.Title style={[styles.font, { fontSize: 20, letterSpacing: 0 }]}>
              {t("¿Are you sure you want to delete subject?", { subject: subject.name })}
            </Dialog.Title>
            <Dialog.Content>
              <Text style={[styles.font, {color: theme.colors.textPaper, letterSpacing: 0}]}>
                {t("This will delete all your assignments and events from the calendar")}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                uppercase={false}
                style={[styles.actionButtons, {marginLeft: 15}]}
                labelStyle={[styles.font, {fontSize: 16, color: theme.colors.primary, letterSpacing: 0}]}
                onPress={() => setShowDeleteSubject(false)}
              >{t("Cancel")}</Button>
              <Button
                mode="contained"
                uppercase={false}
                loading={loading}
                style={[styles.actionButtons]}
                labelStyle={[styles.font, {fontSize: 16, color: theme.colors.background, letterSpacing: 0}]}
                onPress={deleteSubjectHandler}
              >{t("Delete")}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>

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
  stadisticsContainer: {
    flex: 1,
    alignItems: 'center'
  },
  assignmentsContainer: {
    height: '100%',
  },
  assignmentsBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 40
  },
  assignmentBox: {
    width: '95%',
    height: 80,
    marginLeft: '3%',
    backgroundColor: theme.colors.surface,
    display: 'flex',
    marginBottom: 10,
    justifyContent: 'center',
    borderRadius: 15
  },
  actionButtons: {
    width: 110,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  linkContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15
  }
})

export default SubjectScreen