import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Animate } from 'react-native-entrance-animation'
import { Checkbox, TouchableRipple, Text, useTheme } from 'react-native-paper'
import { Theme } from 'react-native-paper/lib/typescript/types'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Task } from '../interface/interfaces'

interface TaskContainerProps {
  tasks: Task[],
  showTask: Function,
  changeStatus: Function
}

const TaskContainer = ({ tasks, showTask, changeStatus }: TaskContainerProps) => {
  const { t } = useTranslation()
  const theme: any = useTheme()
  const styles = styleSheet(theme)

  return (
    tasks.length == 0 ? (
      <Text style={[styles.font, {color: theme.colors.textPaper, marginTop: 15}]}>
        {t("You don't have any task here")}
      </Text>
    ) : (
      <View style={{ width: '100%' }}>
        {tasks.map((task: Task, i: number) => (
          <Animate fade delay={i * 10} key={i}>
          <TouchableRipple
            borderless
            rippleColor={theme.colors.card}
            onPress={() => showTask(task)}
            style={styles.taskContainer}
          ><>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox.Item
                label=""
                onPress={() => changeStatus(task.id, !task.done)}
                status={task.done ? 'checked' : 'unchecked'}
                style={{ borderRadius: 20 }}
                color={task.color.color == 'text' ? theme.colors.text : task.color.color}
              />
              <Text style={[styles.font, { color: task.color.color == 'text' ? theme.colors.text : task.color.color, marginLeft: 15, fontSize: 20 }]}>
                {task.title}
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <MaterialIcons name="keyboard-arrow-up" size={30} color={theme.colors.text} />
            </TouchableOpacity>
          </></TouchableRipple>
          </Animate>
        ))}
      </View>
    )
    
  )
}

const styleSheet = (theme: Theme | any) => StyleSheet.create({
  taskContainer: {
    width: '100%',
    height: 70,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  font: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text,
    fontSize: 16
  },
})

export default TaskContainer