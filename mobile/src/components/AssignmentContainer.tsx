import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { TouchableRipple, Text, useTheme } from 'react-native-paper'
import { Theme } from 'react-native-paper/lib/typescript/types'
import { colorIsLightOrDark } from '../hooks/colorIsLightOrDark'
import { dateString, timeString } from '../hooks/useDateTime'
import { AssignmentColor, Subject } from '../interface/interfaces'

interface AssignmentContainerProps {
  assignment: AssignmentColor,
  subject?: Subject,
  goToAssignment: Function,
  late?: boolean
}

const AssignmentContainer = ({ assignment, goToAssignment, late }: AssignmentContainerProps) => {
  const currentDate = new Date()
  const { t } = useTranslation()
  const theme: any = useTheme()
  const styles = styleSheet(theme)

  const countLaterDays = (date: Date) => {
    const minus = currentDate.getTime() - date.getTime()
    return Math.round(minus/ (1000*60*60*24))
  }

  return (
    <TouchableRipple
      borderless
      rippleColor={theme.colors.surface}
      onPress={() => goToAssignment(assignment)}
      style={[styles.touchableAssignment, { backgroundColor: assignment.color }]}
    >
      <>
      <Text style={[styles.boldFont, {fontSize: 20, marginLeft: 15, color: colorIsLightOrDark(assignment.color)}]}>
        {assignment.title}
      </Text>
      {late ? (
        <Text style={[styles.font, {fontSize: 14, marginLeft: 15, color: colorIsLightOrDark(assignment.color)}]}>
          {t('Count days late', { days: countLaterDays(assignment.from) })}
        </Text>
      ) : (
        <Text style={[styles.font, {fontSize: 14, marginLeft: 15, color: colorIsLightOrDark(assignment.color)}]}>
          {timeString(assignment.from) == '0:00 am' ? (
            t("Assignment all day datetime", { date: dateString(assignment.from, t) })
          ) : (
            t("Assignment datetime", { date: dateString(assignment.from, t), time: timeString(assignment.from) })
          )}
        </Text>
      )}
      </>
    </TouchableRipple>
  )
}

const styleSheet = (theme: Theme) => StyleSheet.create({
  boldFont: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text,
    fontSize: 16
  },
  font: {
    fontFamily: 'poppins-semibold',
    color: theme.colors.text,
    fontSize: 16
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
})

export default AssignmentContainer