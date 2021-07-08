import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native'
import { Animate } from 'react-native-entrance-animation'
import { Checkbox, TouchableRipple, Text, useTheme, Chip } from 'react-native-paper'
import { SwipeListView } from 'react-native-swipe-list-view'
import { Theme } from 'react-native-paper/lib/typescript/types'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LottieView from 'lottie-react-native'
import { Task, TasksProvider } from '../interface/interfaces'
import { dateString } from '../hooks/useDateTime'
import { useTasks } from '../services/TasksProvider'

interface TaskContainerProps {
  tasks: Task[],
  changeStatus: Function,
  done: boolean,
  deleteTask: Function
}

const TaskContainer = ({ tasks, deleteTask, changeStatus, done }: TaskContainerProps) => {
  const { t } = useTranslation()
  const theme: any = useTheme()
  const styles = styleSheet(theme)
  const [refreshing, setRefreshing] = useState(false)
  const { getTasksHandler }: TasksProvider = useTasks()

  const getRepeatTime = (time: number) => {
    switch (time) {
      case 3600000:
        return t('Hour')
      case 86400000:
        return t('Day')
      case 604800000:
        return t('Week')
      case 2592000000:
        return t('Month')
      default:
        return t('None')
    }
  }

  const refreshScreen = useCallback( async() => {
    setRefreshing(true)
    await getTasksHandler!()
    setRefreshing(false)
  }, [])

  return (
    tasks.length == 0 ? (
      done ? (
        <View>
          <Text style={[styles.font, {color: theme.colors.textPaper, marginTop: 15}]}>
            {t("You don't have any task here")}
          </Text>
        </View>
      ) : (<>
        <View style={{ width: '100%', height: 180 }}>
          <LottieView
            source={require('../assets/animations/done-tasks.json')}
            autoPlay
            loop={false}
          />
        </View>
        <View>
          <Text style={[styles.font, {color: theme.colors.textPaper, textAlign: 'center'}]}>
            {t("You've done all your tasks")}
          </Text>
        </View></>
      )
    ) : (
      <View style={{ width: '100%', height: '100%', marginBottom: 50 }}>
        <SwipeListView
          data={tasks}
          keyExtractor={(item: Task) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshScreen}
              colors={[theme.colors.accent]}
              tintColor={theme.colors.accent}
              progressBackgroundColor={theme.colors.surface}
            />
          }
          renderItem={({ item }) => (
            <Animate fade>
              <TouchableRipple
                borderless
                rippleColor={theme.colors.card}
                //onPress={() => showTask(item)}
                style={styles.taskContainer}
              ><>
                <View style={{ width: '70%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox.Item
                    label=""
                    onPress={() => changeStatus(item.id, !item.done)}
                    status={item.done ? 'checked' : 'unchecked'}
                    style={{ borderRadius: 20 }}
                    color={item.color.color == 'text' ? theme.colors.primary : item.color.color}
                  />
                  <View>
                    <Text style={[
                      styles.font,
                      {
                        color: item.color.color == 'text' ? theme.colors.text : item.color.color,
                        textDecorationLine: done ? 'line-through' : 'none',
                      }
                    ]}>
                      {item.title}
                    </Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      {item.setTo && (
                        <Chip icon="calendar-clock">
                          <Text style={[styles.font, { fontSize: 12 }]}>{dateString(item.setTo, t)}</Text>
                        </Chip>
                      )}
                      {item.repeat && (<>
                        <Chip icon="update">
                          <Text style={[styles.font, { fontSize: 12 }]}>{t('Repeat')}</Text>
                        </Chip>
                        <Chip style={{ marginLeft: 5 }}>
                          <Text style={[styles.font, { fontSize: 12 }]}>{getRepeatTime(item.repeat)}</Text>
                        </Chip></>
                      )}
                    </View>
                  </View>
                </View>
                <TouchableOpacity activeOpacity={0.7} style={{ marginRight: 20 }}>
                  <MaterialIcons name="drag-indicator" size={26} color={theme.colors.text} />
                </TouchableOpacity>
              </></TouchableRipple>
          </Animate>
          )}
          renderHiddenItem={({ item }) => (
            <Animate fade delay={500} containerStyle={styles.rowBack}>
              <TouchableOpacity onPress={() => changeStatus(item.id, !item.done)} activeOpacity={0.7} style={[styles.hiddenItem, { backgroundColor: '#3bed6e' }]}>
                <MaterialCommunityIcons name="check" size={26} color='#fff' />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.id, item.done)} activeOpacity={0.7} style={[styles.hiddenItem, { backgroundColor: '#ff4d4d' }]}>
                <MaterialCommunityIcons name="trash-can" size={26} color='#fff' />
              </TouchableOpacity>
            </Animate>
          )}
          leftOpenValue={75}
          rightOpenValue={-75}
        />
      </View>
    )
    
  )
}

const styleSheet = (theme: Theme | any) => StyleSheet.create({
  taskContainer: {
    width: '100%',
    height: 70,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
  },
  font: {
    fontFamily: 'poppins-semibold',
    color: theme.colors.text,
    fontSize: 16
  },
  rowBack: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  hiddenItem: {
    width: 75,
    height: 70,
    borderRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default TaskContainer