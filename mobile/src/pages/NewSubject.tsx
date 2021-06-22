import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Text, Button, Portal, TextInput, Dialog, useTheme } from 'react-native-paper'
import ColorPicker from '../components/ColorPicker'
import { createSubjectId } from '../hooks/createId'
import { Subject } from '../interface/interfaces'

const colors = [
  { id: "1", color: "#a4bdfc" },
  { id: "2", color: "#7ae7bf" },
  { id: "3", color: "#dbadff" },
  { id: "4", color: "#ff887c" },
  { id: "5", color: "#fbd75b" },
  { id: "6", color: "#ffb878" },
  { id: "7", color: "#46d6db" },
  //{ id: "8", color: "#e1e1e1" },
  { id: "9", color: "#5484ed" },
  { id: "10", color: "#51b749" },
  { id: "11", color: "#dc2127" },
]

const NewSubjectScreen = ({ navigation }: any) => {
  const { t }: any = useTranslation()
  const theme = useTheme()
  const styles = styleSheet(theme)
  const [subjectName, setSubjectName] = useState('')
  const [subjectLink, setSubjectLink] = useState('')
  const [reunionLink, setReunionLink] = useState('')
  const [subjectColor, setSubjectColor] = useState(colors[Math.floor(Math.random() * colors.length)])
  const [error, setError] = useState(false)
  const [titleErrorMessage, setTitleErrorMessage] = useState<string>(t("Subject name"))
  const [showColorPicker, setShowColorPicker] = useState(false)

  const subjectNameRef: any = useRef()
  const reunionLinkRef: any = useRef()
  const subjectLinkRef: any = useRef()

  const subjectColorHandler = (color: any) => {
    setSubjectColor(color)
    setShowColorPicker(false)
  }

  const continueToAdd = () => {
    if (subjectName == '') {
      setTitleErrorMessage(t("Provide a subject name"))
      setError(true)
      return
    }

    const id = createSubjectId(subjectName)
    const subjectData: Subject = {
      name: subjectName,
      color: subjectColor,
      reunion: reunionLink,
      link: subjectLink,
      id: id
    }
    navigation.navigate('Add Assignments', subjectData)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ display: 'flex', alignItems: 'center' }}>

        <View style={{ width: '90%', marginTop: 20 }}>
          <Text style={[styles.font, { fontSize: 26 }]}>
            {t("Input your subject info")}
          </Text>
        </View>

        <View style={{ width: '90%', marginTop: 20 }}>
          <View style={styles.subjectNameContainer}>
            <TextInput
              value={subjectName}
              onChangeText={(value: string) => setSubjectName(value)}
              style={[styles.font, { width: '80%' }]}
              ref={subjectNameRef}
              error={error}
              label={titleErrorMessage}
              mode="outlined"
              theme={{ colors: { primary: subjectColor.color } }}
            />
            <TouchableOpacity
              onPress={() => setShowColorPicker(true)}
              activeOpacity={0.7}
              style={[styles.colorChooser, {backgroundColor: subjectColor.color}]}
            />
          </View>
          <TextInput
            value={subjectLink}
            onChangeText={(value: string) => setSubjectLink(value)}
            style={[styles.font, { width: '100%', marginTop: 10 }]}
            ref={subjectLinkRef}
            error={error}
            label={t('Subject link')}
            mode="outlined"
            onSubmitEditing={() => reunionLinkRef.current.focus()}
            returnKeyType="next"
            theme={{ colors: { primary: subjectColor.color } }}
          />
          <TextInput
            value={reunionLink}
            onChangeText={(value: string) => setReunionLink(value)}
            style={[styles.font, { width: '100%', marginTop: 10 }]}
            ref={reunionLinkRef}
            error={error}
            label={t("Reunion link")}
            mode="outlined"
            theme={{ colors: { primary: subjectColor.color } }}
          />
        </View>

        <View style={styles.bottom}>
          <Button
            mode="contained"
            onPress={continueToAdd}
            uppercase={false}
            style={[styles.continueButton, {backgroundColor: subjectColor.color}]}
            labelStyle={[styles.font, {
              width: '100%',
              height: 50,
              marginTop: 10,
              color: theme.colors.background,
              fontSize: 16,
              letterSpacing: 0
            }]}
          >{t("Continue")}</Button>
        </View>

        <ColorPicker
          visible={showColorPicker}
          setVisible={setShowColorPicker}
          colorPickerHandler={subjectColorHandler}
        />

      </View>
    </ScrollView>
  )
}

const styleSheet = (theme: any) => StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.background,
  },
  font: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text,
    fontSize: 16
  },
  subjectNameContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  colorChooser: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: '3%',
    borderWidth: 1,
    marginBottom: 5,
    borderColor: theme.colors.surface
  },
  bottom: {
    width: '95%',
    display: 'flex',
    alignItems: 'flex-end',
    marginTop: 30
  },
  continueButton: {
    width: 150,
    height: 50,
    marginRight: '3%',
    marginBottom: '10%',
    elevation: 0,
  },
})

export default NewSubjectScreen