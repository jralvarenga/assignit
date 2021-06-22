import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text, Button, Portal, TextInput, Dialog, useTheme } from 'react-native-paper'

interface ColorPickerProps {
  visible: boolean
  setVisible: Function
  colorPickerHandler: Function
}

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
  { id: "12", color: "#ededed" },
]

const ColorPicker = ({ visible, setVisible, colorPickerHandler }: ColorPickerProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const styles = styleSheet(theme)

  return (
    <Portal>
      <Dialog visible={visible!} onDismiss={() => setVisible!(false)}>
        <Dialog.Title style={[styles.font, {fontSize: 25, letterSpacing: 0}]}>
          {t("Choose a color")}
        </Dialog.Title>
        <Dialog.Content>
          <View style={styles.bottomSheet}>
            <View style={styles.availableColors}>
              {colors.map((picker, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => colorPickerHandler!(picker)}
                  activeOpacity={0.7}
                  style={[styles.colorChooser, {backgroundColor: picker.color}]}
                ></TouchableOpacity>
              ))}
            </View>
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  )
}

const styleSheet = (theme: any) => StyleSheet.create({
  bottomSheetHeader: {
    backgroundColor: theme.colors.surface,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 80
  },
  bottomSheet: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  font: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text,
    fontSize: 16
  },
  colorChooser: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: '3%',
    borderWidth: 1,
    marginBottom: 5,
    borderColor: theme.colors.background
  },
  availableColors: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
})

export default ColorPicker