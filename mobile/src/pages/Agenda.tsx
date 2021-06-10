import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet, ScrollView, FlatList } from 'react-native'
import { IconButton, TouchableRipple, Text, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import DatesContainer from '../components/DatesContainer'
import { colorIsLightOrDark } from '../hooks/colorIsLightOrDark'
import { Assignment, Subject, SubjectProvider } from '../interface/interfaces'
import { getDates, getDayString, groupAssigmentsAgenda, markedAssigments } from '../lib/agendaFunctions'
import { useSubjectProvider } from '../services/SubjectsProvider'

const translateMonthNames = (t: any): string[] => [t('January'),t('February'),t('March'),t('April'),t('May'),t('June'),t('Jule'),t('August'),t('September'),t('October'),t('November'),t('December')]

const AgendaScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const monthNames = translateMonthNames(t)
  
  const theme = useTheme()
  const styles = styleSheet(theme)
  const currentDate = new Date()
  
  const { subjects }: SubjectProvider = useSubjectProvider()

  const [year, setYear] = useState<number>(currentDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth())
  const [monthDates, setMonthDates] = useState<number[]>(getDates(currentDate.getMonth(), currentDate))
  const [selectedDate, setSelectedDate] = useState<number>(currentDate.getDate())
  const markedDates = markedAssigments(subjects!)

  const [stringDay, setStringDay] = useState( getDayString(currentDate, t) )
  const [dateAssigments, setDateAssigments] = useState<any>(undefined)

  const monthScrollRef = useRef<any>(null)
  const [monthDataSourceCords, setMonthDataSourceCords] = useState<number[]>([0,1,2,3,4,5,6,7,8,9,10,11,12])
  const dayScrollRef = useRef<any>(null)
  const [dayDataSourceCords, setDayDataSourceCords] = useState<number[]>([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])

  const monthScrollHandler = (index: number) => {
    monthScrollRef.current.scrollTo({
      x: monthDataSourceCords[index],
      y: 0,
      animated: true,
    })
  }

  const dayScrollHandler = (index: number) => {
    dayScrollRef.current.scrollTo({
      x: dayDataSourceCords[index],
      y: 0,
      animated: true,
    })
  }

  // Group today assigments in hour
  useEffect(() => {
    const groupedByHour = groupAssigmentsAgenda(subjects!, currentDate)
    if (groupedByHour != undefined) {
      setDateAssigments(groupedByHour)
    }
  }, [subjects])

  // Scroll to today
  useEffect(() => {
    setTimeout(() => {
      monthScrollHandler(currentDate.getMonth())
    }, 600)
  }, [monthDataSourceCords, monthScrollRef])
  useEffect(() => {
    setTimeout(() => {
      dayScrollHandler(currentDate.getDate())
    }, 600)
  }, [dayDataSourceCords, dayScrollRef])

  const selectMonthHandler = (month: number) => {
    const toDate = new Date(Date.UTC(year, month, selectedDate, currentDate.getHours(), currentDate.getMinutes() + currentDate.getTimezoneOffset()))

    const groupedByHour = groupAssigmentsAgenda(subjects!, toDate)
    if (groupedByHour != undefined) {
      setDateAssigments(groupedByHour)
    } else {
      setDateAssigments(undefined)
    }

    setSelectedMonth(month)
    const dates = getDates(month, currentDate)
    setMonthDates(dates)
    monthScrollHandler(month)
  }

  const selectDateHandler = (date: number) => {    
    const toDate = new Date(Date.UTC(year, selectedMonth, date, currentDate.getHours(), currentDate.getMinutes() + currentDate.getTimezoneOffset()))
    const stringDate = getDayString(toDate, t)

    const groupedByHour = groupAssigmentsAgenda(subjects!, toDate)
    if (groupedByHour != undefined) {
      setDateAssigments(groupedByHour)
    } else {
      setDateAssigments(undefined)
    }
  
    setStringDay(stringDate)
    setSelectedDate(date)
  }

  const returnToToday = () => {
    const toDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes() + currentDate.getTimezoneOffset()))
    const stringDate = getDayString(toDate, t)

    const groupedByHour = groupAssigmentsAgenda(subjects!, toDate)
    if (groupedByHour != undefined) {
      setDateAssigments(groupedByHour)
    } else {
      setDateAssigments(undefined)
    }

    setYear(currentDate.getFullYear())
    setSelectedMonth(currentDate.getMonth())
    setMonthDates(getDates(currentDate.getMonth(), currentDate))
    setSelectedDate(currentDate.getDate())
    setStringDay(stringDate)

    monthScrollHandler(currentDate.getMonth())
    dayScrollHandler(currentDate.getDate() - 1)
  }

  const goToAssignment = (assignment: Assignment) => {
    const index = subjects!.map((subject: Subject) => subject.id ).indexOf(assignment.subject);
    navigation.navigate('Assignment', { subject: subjects![index], assignment: assignment })
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.yearContainer}>
        <View style={{ width: '90%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={[styles.font, {fontSize: 40}]}>{year}</Text>
          </View>
          <IconButton
            icon="calendar-today"
            size={30}
            onPress={returnToToday}
            style={{ backgroundColor: theme.colors.surface }}
          />
        </View>
      </View>
      
      <View style={styles.monthsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={monthScrollRef}
        >
          <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', padding: 10 }}>
            {monthNames.map((month, i) => (
              <TouchableRipple
                key={i}
                borderless
                onLayout={(e) => {
                  const layout = e.nativeEvent.layout
                  // Get position of every month View
                  monthDataSourceCords[i] = layout.x;
                  setMonthDataSourceCords(monthDataSourceCords)
                }}
                onPress={() => selectMonthHandler(i)}
                rippleColor={theme.colors.surface}
                style={styles.monthBox}
              >
                {selectedMonth == i ? (
                  <Text style={[styles.font, {color: theme.colors.accent}]}>{month}</Text>
                ) : (
                  <Text style={[styles.font]}>{month}</Text>
                )}
              </TouchableRipple>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.daysContainer}>
        <DatesContainer
          dates={monthDates}
          month={selectedMonth}
          year={year}
          selectedDate={selectedDate}
          onSelectDate={selectDateHandler}
          scrollRef={dayScrollRef}
          dataSourceCords={dayDataSourceCords}
          setDataSourceCords={setDayDataSourceCords}
          markedDates={markedDates}
        />
      </View>

      <View style={styles.agendaContainer}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={[styles.font, { fontSize: 25, marginLeft: '5%' }]}>
            {stringDay}
          </Text>
        </View>
        <View style={{ flex: 3 }}>
          {dateAssigments != undefined ? (
            <FlatList
              data={Object.keys(dateAssigments)}
              keyExtractor={(item: any, i: number) => i.toString()}
              renderItem={({ item }) => {
                const assigments: any[] = dateAssigments[item]

                return (
                  <View style={styles.hourContainer}>
                    <View style={styles.hourBox}>
                      <Text style={[styles.font, {fontSize: 18}]}>
                        {item == '0:00 am' ? (
                          t('All day')
                        ) : (
                          item
                        )}
                      </Text>
                    </View>
                    <View style={styles.assignmentsContainer}>
                      <FlatList
                        data={assigments}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item: any, i: number) => i.toString()}
                        renderItem={({ item }) => (
                          <TouchableRipple
                            borderless
                            onPress={() => goToAssignment(item)}
                            rippleColor={theme.colors.surface}
                            style={[styles.assignmentBox, {backgroundColor: item.color}]}
                          >
                            <View>
                              <Text style={[styles.font, {fontSize: 23, marginLeft: 15, color: colorIsLightOrDark(item.color) }]}>
                                {item.title}
                              </Text>
                              <Text style={[styles.font, {fontSize: 14, marginLeft: 15, marginTop: -7, color: colorIsLightOrDark(item.color) }]}>
                                {item.subjectName}
                              </Text>
                            </View>
                          </TouchableRipple>
                        )}
                      />
                    </View>
                  </View>
                )
              }}
            />
          ) : (
            <View>
              <Text style={[styles.font, {fontSize: 20, color: theme.colors.textPaper, width: '100%', textAlign: 'center'}]}>
                {t("No Assigments this day")}
              </Text>
            </View>
          )}
          
        </View>
      </View>

    </SafeAreaView>
  )
}

const styleSheet = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  font: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text,
    fontSize: 16
  },
  yearContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthsContainer: {
    flex: 1,
  },
  monthBox: {
    minWidth: 120,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20
  },
  daysContainer: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  agendaContainer: {
    flex: 6,
  },
  hourContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  hourBox: {
    width: '25%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  assignmentsContainer: {
    width: '75%',
    display: 'flex',
  },

  assignmentBox: {
    width: '95%',
    height: 70,
    backgroundColor: theme.colors.surface,
    display: 'flex',
    marginBottom: 10,
    marginLeft: 5,
    justifyContent: 'center',
    borderRadius: 15
  },
})

export default AgendaScreen