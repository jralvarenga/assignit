import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { TouchableRipple, useTheme } from 'react-native-paper'
import { Animate } from 'react-native-entrance-animation'

interface DatesContainerProps {
  dates: number[],
  month?: number,
  year?: number,
  markedDates?: any,
  selectedDate: number,
  onSelectDate?: Function,
  scrollRef: any,
  dataSourceCords: number[],
  setDataSourceCords: Function,
  YYMMDDDate?: string,
  currentYYMMDD?: string
}

const translateDayNames = (t: any): string[] => [t('Su.'),t('Mon.'),t('Thue.'),t('Wed.'),t('Thur.'),t('Fri.'),t('Sat.')]

const DatesContainer = ({ dates, month, year, selectedDate, onSelectDate, scrollRef, dataSourceCords, setDataSourceCords, markedDates }: DatesContainerProps) => {
  const { t } = useTranslation()
  const dayNames = translateDayNames(t)
  
  const theme = useTheme()
  const styles = styleSheet(theme)
  const currentDate = new Date()

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      ref={scrollRef}
    >
      <View style={styles.container}>
        {dates!.map((date, i) => {
          const YMD = `${year}-${month!}-${date}`
          const completeDate = new Date(Date.UTC(year!, month!, date, currentDate.getHours(), currentDate.getMinutes() + currentDate.getTimezoneOffset()))
          const markers = markedDates[YMD]

          return (
            <View
              key={i}
              onLayout={(e) => {
                const layout = e.nativeEvent.layout
                // Get position of every day View
                dataSourceCords[i] = layout.x
                
                setDataSourceCords(dataSourceCords)
              }}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            >
              {completeDate.getDay() == 0 ? (
                <View style={styles.weekSeparator} />
              ) : ( <></> )}
              {selectedDate == date ? (
                <TouchableRipple
                  borderless
                  onPress={() => onSelectDate!(date)}
                  rippleColor={theme.colors.surface}
                  style={[styles.dateBox, { backgroundColor: theme.colors.inactivePrimary }]}
                >
                  <View>
                    <View style={[styles.dayIdBox]}>
                      <Text style={[styles.font, {color: theme.colors.accent}]}>{date}</Text>
                      <Text style={[styles.font, {color: theme.colors.accent, fontSize: 12, fontFamily: 'poppins', marginTop: -10}]}>
                        {dayNames[completeDate.getDay()]}
                      </Text>
                    </View>
                  </View>
                </TouchableRipple>
              ) : (
                <TouchableRipple
                  borderless
                  onPress={() => onSelectDate!(date)}
                  rippleColor={theme.colors.surface}
                  style={styles.dateBox}
                >
                  <View>
                    <View style={[styles.dayIdBox]}>
                      <Text style={[styles.font]}>{date}</Text>
                      <Text style={[styles.font, {fontSize: 12, fontFamily: 'poppins', marginTop: -10}]}>
                        {dayNames[completeDate.getDay()]}
                      </Text>
                    </View>
                    {markers != undefined ? (
                      <View style={styles.markerContainer}>
                        {markers.map((item: any, i: number) => (
                          <View key={i} style={[styles.markerView,{ backgroundColor: item.color }]} />
                        ))}
                      </View>
                    ) : ( <></> )}
                  </View>
                </TouchableRipple>
              )}
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

const styleSheet = (theme: any) => StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  font: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text,
    fontSize: 16
  },
  dateBox: {
    width: 70,
    height: 70,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginRight: 5,
    marginLeft: 5
  },
  dayIdBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5
  },
  weekSeparator: {
    width: 10,
    height: 10,
    borderRadius: 100,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: theme.colors.surface
  },
  markerContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  markerView: {
    width: 7,
    height: 7,
    marginLeft: 1,
    marginRight: 1,
    marginBottom: 2,
    borderRadius: 100,
  }
})

export default DatesContainer