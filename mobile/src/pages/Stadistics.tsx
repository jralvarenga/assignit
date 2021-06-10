import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native'
import { ProgressChart } from 'react-native-chart-kit'
import { ProgressBar, Text, useTheme } from 'react-native-paper'
import { countAssignments, globalDistribution, pieData } from '../hooks/stadisticts'
import { Subject, SubjectProvider } from '../interface/interfaces'
import { useSubjectProvider } from '../services/SubjectsProvider'

const deviceWidth = Dimensions.get('screen').width

interface PieData {
  labels: string[],
  data: number[],

}

const hexToRgb = (hex: string, opacity: number) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  const rgb = result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null

  return `rgba(${rgb!.r}, ${rgb!.g}, ${rgb!.b}, ${opacity})`
}

const chartStyle = (theme: any) => ({
  backgroundColor: theme.colors.background,
  backgroundGradientFrom: theme.colors.background,
  backgroundGradientTo: theme.colors.background,
  color: (opacity = 1) => `${hexToRgb(theme.colors.accent, opacity)}`,
  labelColor: (opacity = 1) => `${hexToRgb(theme.colors.accent, opacity)}`,
  labelStyle: {
    fontFamily: 'poppins-bold'
  },
  style: {
    borderRadius: 16
  },
})

const StadisticsScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const styles = styleSheet(theme)
  const chartConfig = chartStyle(theme)
  const { subjects }: SubjectProvider = useSubjectProvider()
  const [pie, setPie] = useState<PieData>({
    labels: [""],
    data: [0]
  })

  const getDistribution = () => {
    const data = globalDistribution(subjects!)
    const distribution: PieData = pieData(data!)
    setPie(distribution)
  }

  useEffect(() => {
    getDistribution()
  }, [subjects])

  const goToSubject = (subject: Subject) => {
    navigation.navigate('Subject', subject)
  }

  if (subjects?.length == 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'  }}>
        <View style={{ width: '95%' }}>
          <Text style={[styles.font, { fontSize: 25, textAlign: 'center' }]}>
            {t("Start creating subjects and assignments to have stadistics")}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.body}>

          <View style={styles.topContainer}>
            <View style={{ width: '100%' }}>
              <ProgressChart
                data={pie}
                width={deviceWidth - 45}
                height={220}
                strokeWidth={16}
                radius={32}
                chartConfig={chartConfig}
                hideLegend={false}
              />
            </View>
            <View>
              <Text style={[styles.font, {fontSize: 23}]}>
                {t("Count subjects and assignments", { assignments: countAssignments(subjects!), subjects: subjects?.length })}
              </Text>
            </View>
          </View>

          <View style={styles.subjectsContainer}>
            {subjects?.map((subject, i) => (
              <TouchableOpacity onPress={() => goToSubject(subject)} activeOpacity={0.7} style={styles.subjectBox} key={i}>
                <Text style={[styles.font, {fontSize: 25}]}>{subject.name}</Text>
                <Text style={[styles.font, {fontSize: 16}]}>
                  {subject.progress!.progress == 1 ? (
                    t("You've completed this subject")
                  ) : (
                    t("Count assignments in subject", { active: subject.assignments?.length, total: subject.progress?.total })
                  )}
                </Text>
                <View style={{ marginTop: 10 }}>
                  <ProgressBar progress={subject.progress!.progress} color={subject.color.color} />
                </View>
                <View style={{ width: '100%' }}>
                  <Text style={[styles.font, { textAlign: 'right', color: theme.colors.textPaper, marginTop: 10 }]}>
                    {t("% Done", { porcent: (subject.progress!.progress * 100)!.toFixed(2) })}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
        </View>
      </ScrollView>
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
    flex: 1,
    alignItems: 'center'
  },
  topContainer: {
    width: '95%',
    display: 'flex',
  },
  subjectsContainer: {
    width: '95%',
    marginTop: 40
  },
  subjectBox: {
    width: '100%',
    marginBottom: 10
  }
})

export default StadisticsScreen