import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, Button, ActivityIndicator, TouchableRipple, useTheme } from 'react-native-paper'
import { useSubjects } from '../hooks/useSubjects'
import { Subject, Assignment, SubjectProvider } from '../interface/interfaces'
import { dateString, getGreetingMessage, timeString } from '../hooks/useDateTime'
import { useSubjectProvider } from '../services/SubjectsProvider'
import { Animate } from 'react-native-entrance-animation'
import LottieView from 'lottie-react-native'
import { colorIsLightOrDark } from '../hooks/colorIsLightOrDark'
import AppSnackbar from '../components/Snackbar'

const windowHeight = Dimensions.get('window').height

interface AssignmentColor {
  color: string,
  title: string
  subject: string,
  description: string,
  id: string,
  from: Date,
  to: Date,
  notiId: number
}

const HomeScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const styles = styleSheet(theme)
  const currentDate = new Date()
  const { loading, subjects, refreshSubjects }: SubjectProvider = useSubjectProvider()
  const greetingMessage: string = getGreetingMessage(t)
  const [fullSubjects, setFullSubjects] = useState<Subject[]>([])
  const [userSubjects, assignments, nextWeekAssignments, pendingAssignments, setSubjects, setAssignments]: any = useSubjects()
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    setFullSubjects(subjects!)
    setSubjects(subjects)
    setAssignments(subjects)
  }, [subjects])

  const goToSubject = (id: string) => {
    const index = fullSubjects.map((subject: Subject) => subject.id ).indexOf(id)
    navigation.navigate('Subject', fullSubjects[index])
  }

  const goToAssignment = (assignment: Assignment) => {
    const index = subjects!.map((subject: Subject) => subject.id ).indexOf(assignment.subject)
    navigation.navigate('Assignment', { subject: subjects![index], assignment: assignment })
  }

  const showMessage = () => {
    setShowSnackbar(true)
  }

  const countLaterDays = (date: Date) => {
    const minus = currentDate.getTime() - date.getTime()
    return Math.round(minus/ (1000*60*60*24))
  }

  const refreshScreen = useCallback( async() => {
    setRefreshing(true)
    await refreshSubjects!()
    setRefreshing(false)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
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
        <View>
          <View style={styles.greetContainer}>
            <Text style={[styles.greetingMessage, {fontSize: 40}]}>{greetingMessage}</Text>
            {userSubjects.length == 0 || loading ? (
              <></>
            ) : assignments.length == 0 ? (
              <Animate fade delay={50}>
                <Text style={[styles.greetingMessage, {fontSize: 15, color: theme.colors.textPaper}]}>
                  {t("You don't have anything pending this week")}
                </Text>
              </Animate>
            ) : (
              <Animate fade delay={50}>
                <Text style={[styles.greetingMessage, {fontSize: 16, color: theme.colors.textPaper}]}>
                  {t('Assignments this week', { assignments: assignments.length })}
                </Text>
              </Animate>
            )}
          </View>
          {loading ? (
            <ActivityIndicator size="large" animating={true} color={theme.colors.primary} />
          ) : (
          
            <View style={styles.contentContainer}>
              
              {/* SUBJECTS SECTION */}
              {userSubjects.length == 0 ? (
                <View style={styles.addSubjects}>
                  <View style={{ width: '100%', height: 180 }}>
                    <LottieView
                      source={require('../assets/animations/austronaut.json')}
                      autoPlay
                      loop
                    />
                  </View>
                  <Text style={[styles.font, { fontSize: 25 }]}>
                    {t("Don't have any subjects😢")}
                  </Text>
                  <Button
                    mode="contained"
                    uppercase={false}
                    onPress={() => navigation.navigate('New Subject')}
                    style={{ backgroundColor: theme.colors.surface, marginTop: 10, elevation: 0 }}
                    labelStyle={[styles.font, { letterSpacing: 0 }]}
                  >{t("Create subject")}</Button>
                  <Text
                    style={[styles.font, { fontSize: 14, color: theme.colors.textPaper, textAlign: 'center', marginTop: 15 }]}
                    onPress={() => navigation.navigate('Settings')}
                  >{t("You can go to settings and create it there")}</Text>
                </View>
              ) : (
                <>
                {/* Subjects container */}
                <Animate fade delay={50}>
                  <TouchableOpacity onPress={() => navigation.navigate('New Subject')} activeOpacity={0.7} style={{ marginTop: 10 }}>
                    <Text style={[styles.font, {marginLeft: 15, fontSize: 30}]}>
                      {t('Subjects')}
                    </Text>
                  </TouchableOpacity>
                </Animate>
                <View style={styles.subjectsContainer}>
                  {userSubjects.map((subject: Subject, i: number) => (
                    <Animate fade delay={50 * i} containerStyle={[styles.subjectBox, {backgroundColor: subject.color.color}]} key={i}>
                      <TouchableRipple
                        borderless
                        rippleColor={theme.colors.surface}
                        onPress={() => goToSubject(subject.id)}
                        style={styles.touchableSubject}
                      >
                        <Text style={[styles.font, {fontSize: 16, color: colorIsLightOrDark(subject.color.color)}]}>
                          {subject.name}
                        </Text>
                      </TouchableRipple>
                    </Animate>
                  ))}
                </View>
                </>
              )}
              
              {/* AssignmentS SECTION */}
              {pendingAssignments.length != 0 && (
                <>
                <Animate fade delay={50}>
                    <View style={{ marginTop: 10 }}>
                      <Text style={[styles.font, {marginLeft: 15, fontSize: 30}]}>
                        {t("Late")}
                      </Text>
                    </View>
                  </Animate>
                  <View style={styles.assignmentsContainer}>
                    {pendingAssignments.map((assignment: AssignmentColor, i: number) => (
                      <Animate fade delay={50 * i} containerStyle={styles.assignmentBox} key={i}>
                        <TouchableRipple
                          borderless
                          rippleColor={theme.colors.surface}
                          onPress={() => goToAssignment(assignment)}
                          style={[styles.touchableAssignment, { backgroundColor: assignment.color }]}
                        >
                          <>
                          <Text style={[styles.font, {fontSize: 20, marginLeft: 15, color: colorIsLightOrDark(assignment.color)}]}>
                            {assignment.title}
                          </Text>
                          <Text style={[styles.font, {fontSize: 14, marginLeft: 15, color: colorIsLightOrDark(assignment.color)}]}>
                            {t('Count days late', { days: countLaterDays(assignment.from) })}
                          </Text>
                          </>
                        </TouchableRipple>
                      </Animate>
                    ))}
                  </View>
                </>
              )}

              {assignments.length == 0 && nextWeekAssignments == 0 && pendingAssignments == 0 && (
                <TouchableOpacity onPress={showMessage} activeOpacity={0.7} style={{ width: '100%', height: 200 }}>
                  <LottieView
                    source={require('../assets/animations/empty-box.json')}
                    autoPlay
                    loop
                  />
                </TouchableOpacity>
              )}

              {userSubjects.length == 0 ? (
                <></>
              ) : assignments.length == 0 ? (
                <></>
              ) : (
                <>
                {/* This week assignments */}
                  <Animate fade delay={50}>
                    <View style={{ marginTop: 10 }}>
                      <Text style={[styles.font, {marginLeft: 15, fontSize: 30}]}>
                        {t("This week")}
                      </Text>
                    </View>
                  </Animate>
                  <View style={styles.assignmentsContainer}>
                    {assignments.map((assignment: AssignmentColor, i: number) => (
                      <Animate fade delay={50 * i} containerStyle={styles.assignmentBox} key={i}>
                        <TouchableRipple
                          borderless
                          rippleColor={theme.colors.surface}
                          onPress={() => goToAssignment(assignment)}
                          style={[styles.touchableAssignment, { backgroundColor: assignment.color }]}
                        >
                          <>
                          <Text style={[styles.font, {fontSize: 20, marginLeft: 15, color: colorIsLightOrDark(assignment.color)}]}>
                            {assignment.title}
                          </Text>
                          <Text style={[styles.font, {fontSize: 14, marginLeft: 15, color: colorIsLightOrDark(assignment.color)}]}>
                            {timeString(assignment.from) == '0:00 am' ? (
                              t("Assignment all day datetime", { date: dateString(assignment.from, t) })
                            ) : (
                              t("Assignment datetime", { date: dateString(assignment.from, t), time: timeString(assignment.from) })
                            )}
                          </Text>
                          </>
                        </TouchableRipple>
                      </Animate>
                    ))}
                  </View>
                </>
              )}

              {/* Next week assignments */}
              {nextWeekAssignments.length != 0 && (
                <>
                <Animate fade delay={100}>
                  <View style={{ marginTop: 10 }}>
                    <Text style={[styles.font, {marginLeft: 15, fontSize: 30}]}>
                      {t("Next week")}
                    </Text>
                  </View>
                </Animate>
                <View style={styles.assignmentsContainer}>
                  {nextWeekAssignments.map((assignment: AssignmentColor, i: number) => (
                    <Animate fade delay={100 * i} containerStyle={styles.assignmentBox} key={i}>
                      <TouchableRipple
                        borderless
                        rippleColor={theme.colors.surface}
                        onPress={() => goToAssignment(assignment)}
                        style={[styles.touchableAssignment, { backgroundColor: assignment.color }]}
                      >
                        <>
                        <Text style={[styles.font, {fontSize: 20, marginLeft: 15, color: colorIsLightOrDark(assignment.color)}]}>
                          {assignment.title}
                        </Text>
                        <Text style={[styles.font, {fontSize: 14, marginLeft: 15, color: colorIsLightOrDark(assignment.color)}]}>
                          {timeString(assignment.from) == '0:00 am' ? (
                            t("Assignment all day datetime", { date: dateString(assignment.from, t) })
                          ) : (
                            t("Assignment datetime", { date: dateString(assignment.from, t), time: timeString(assignment.from) })
                          )}
                        </Text>
                        </>
                      </TouchableRipple>
                    </Animate>
                  ))}
                </View>
                </>
              )}
            </View>
          )}
        
          <AppSnackbar
            visible={showSnackbar}
            setVisible={setShowSnackbar}
            text={t("Don't have anything pending")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styleSheet = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  scrollView: {
    width: '100%',
  },
  greetContainer: {
    height: windowHeight * 0.25,
    display: 'flex',
    justifyContent: 'center',
    paddingRight: '3%',
  },
  contentContainer: {
    //height: windowHeight * 1,
    padding: '3%',
  },
  greetingMessage: {
    fontFamily: 'poppins-bold',
    color: theme.colors.primary,
    textAlign: 'right'
  },
  font: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text,
    fontSize: 16
  },
  subjectsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 16
  },
  subjectBox: {
    width: '45%',
    height: 70,
    marginBottom: 10,
    marginLeft: 10,
    borderRadius: 15
  },
  touchableSubject: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15
  },
  assignmentsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 15
  },
  assignmentBox: {
    width: '95%',
    height: 80,
    marginBottom: 10,
    borderRadius: 15
  },
  touchableAssignment: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 15
  },
  addSubjects: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
})

export default HomeScreen