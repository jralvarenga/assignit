import React from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

interface DateTimePickerProps {
  visible: boolean,
  setVisible: Function,
  onConfirm: any
}

export const DatePicker = ({ visible, setVisible, onConfirm }: DateTimePickerProps) => (
  <DateTimePickerModal
    isVisible={visible}
    mode="date"
    is24Hour={true}
    display="default"
    onConfirm={onConfirm}
    onCancel={() => setVisible(false)}
  />
)

export const TimePicker = ({ visible, setVisible, onConfirm }: DateTimePickerProps) => (
  <DateTimePickerModal
    isVisible={visible}
    mode="time"
    is24Hour={true}
    display="default"
    onConfirm={onConfirm}
    onCancel={() => setVisible(false)}
  />
)