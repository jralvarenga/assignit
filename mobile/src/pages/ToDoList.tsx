import { useTheme } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'
import { Text, IconButton, TextInput, Checkbox, TouchableRipple, Button, Dialog, Portal } from 'react-native-paper'
import { Theme } from 'react-native-paper/lib/typescript/types'
import { SafeAreaView } from 'react-native-safe-area-context'
import ColorPicker from '../components/ColorPicker'
import { Task } from '../interface/interfaces'
import { getDoneTasks, getPendingTasks } from '../lib/tasksLib'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Animate } from 'react-native-entrance-animation'

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
  { id: "12", color: "text" },
]

const demoTasks: Task[] = [
  {
    title: "My task",
    color: { id: "11", color: "text" },
    done: true,
    id: 'higeqdfgoiryerf2iofwer',
    reminder: false
  },
  {
    title: "My task",
    color: { id: "9", color: "#5484ed" },
    done: false,
    id: 'higeqdfgoeiyerf2iofwer',
    reminder: false
  },
  {
    title: "My task",
    color: { id: "11", color: "#dc2127" },
    done: false,
    id: 'higeqdfgoiyewrf2iofwer',
    reminder: false
  },
  {
    title: "My task",
    color: { id: "11", color: "#dc2127" },
    done: false,
    id: 'higeqdfgoiyerqf2iofwer',
    reminder: false
  },
  {
    title: "My task",
    color: { id: "11", color: "text" },
    done: false,
    id: 'higeqdfgoiyerf2iferofwer',
    reminder: false
  },
  {
    title: "My task",
    color: { id: "11", color: "#dc2127" },
    done: false,
    id: 'higeqdfgoiyerf2iofwerfw',
    reminder: false
  },
  {
    title: "My task",
    color: { id: "11", color: "#dc2127" },
    done: true,
    id: 'higeqdfgoiyerf2iofwewjor',
    reminder: false
  },
  {
    title: "My task",
    color: { id: "11", color: "#dc2127" },
    done: true,
    id: 'higeqdfgoiyerf2iofwerfewf',
    reminder: false
  },
]

const ToDoListScreen = () => {
  const theme = useTheme()
  const styles = styleSheet(theme)
  const tasks = demoTasks
  const [doneTasks, setDoneTasks] = useState<any>([])
  const [pendingTasks, setPendingTasks] = useState<any>([])
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [newTaskColor, setNewTaskColor] = useState(colors[10])
  const [showTask, setShowTask] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task>()

  useEffect(() => {
    setDoneTasks( getDoneTasks(tasks) )
    setPendingTasks( getPendingTasks(tasks) )
  }, [])

  const taskColorHandler = (color: any) => {
    setNewTaskColor(color)
    setShowColorPicker(false)
  }

  const showTaskHandler = (task: Task) => {
    setSelectedTask(task)
    setShowTask(true)
  }

  return (
    <SafeAreaView>
      <ScrollView style={{ width: '100%', height: '100%' }}>
      <View style={styles.container}>
        
        <View style={styles.titleContainer}>
          <Text style={[styles.font, {fontSize: 32}]}>
            To Do List
          </Text>
        </View>

        <View style={[styles.addNewContainer]}>
          <TextInput
            mode="outlined"
            label="New task name"
            style={{ width: '50%' }}
            theme={{ colors: { primary: newTaskColor.color == 'text' ? theme.colors.card : newTaskColor.color } }}
          />
          <TouchableOpacity
            onPress={() => setShowColorPicker(true)}
            activeOpacity={0.7}
            style={[styles.colorChooser, {backgroundColor: newTaskColor.color == 'text' ? theme.colors.card : newTaskColor.color}]}
          />
          <IconButton
            icon='clock-outline'
            color={theme.colors.text}
            size={32}
            style={{ backgroundColor: theme.colors.card }}
          />
          <IconButton
            icon='plus'
            color={theme.colors.text}
            size={32}
            style={{ backgroundColor: theme.colors.card }}
          />
        </View>

        <View style={styles.listContainer}>
          {tasks.length == 0 ? (
            <Text style={[styles.font, {color: theme.colors.textPaper, marginTop: 15}]}>
              You don't have any task now😢
            </Text>
          ) : (
            <View>
              <Text style={[styles.font, styles.tasksTitles]}>Tasks</Text>
              {/* PENDING TASKS */}
              <View style={{ width: '100%' }}>
                {pendingTasks.map((task: Task, i: number) => (
                  <Animate right delay={50 * i} key={i}>
                  <TouchableRipple
                    borderless
                    rippleColor={theme.colors.card}
                    onPress={() => showTaskHandler(task)}
                    style={styles.taskContainer}
                  ><>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Checkbox
                        onPress={() => console.log('jaja')}
                        status={task.done ? 'checked' : 'unchecked'}
                        theme={{ colors: { primary: task.color.color } }}
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
              <Text style={[styles.font, styles.tasksTitles]}>Done</Text>
              {/* DONE TASKS */}
              <View style={{ width: '100%' }}>
                {doneTasks.map((task: Task, i: number) => (
                  <Animate right delay={50 * i} key={i}>
                  <TouchableRipple
                    borderless
                    rippleColor={theme.colors.card}
                    onPress={() => showTaskHandler(task)}
                    style={styles.taskContainer}
                  ><>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Checkbox
                        onPress={() => console.log('jaja')}
                        status={task.done ? 'checked' : 'unchecked'}
                        theme={{ colors: { primary: task.color.color == 'text' ? theme.colors.text : task.color.color } }}
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
            </View>
          )}
        </View>

        <ColorPicker
          visible={showColorPicker}
          setVisible={setShowColorPicker}
          colorPickerHandler={taskColorHandler}
        />
        
        <Portal>
        <Dialog visible={showTask} onDismiss={() => setShowTask(false)}>
          <Dialog.Title style={[styles.font, { fontSize: 25 }]}>
            {selectedTask?.title}
          </Dialog.Title>
          <Dialog.Content>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.font}>Is done:</Text>
              <Text style={styles.font}>{selectedTask?.done ? 'Yes' : 'No'}</Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              uppercase={false}
              //loading={loading}
              style={[styles.actionButtons, {marginLeft: 15}]}
              labelStyle={[styles.font, {fontSize: 16, color: theme.colors.accent, letterSpacing: 0}]}
              //onPress={() => setShowAddLinks(false)}
            >Delete</Button>
            <Button
              uppercase={false}
              style={[styles.actionButtons]}
              labelStyle={[styles.font, {fontSize: 16, letterSpacing: 0}]}
              onPress={() => setShowTask(false)}
            >Ok</Button>
            </Dialog.Actions>
        </Dialog>
        </Portal>

      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styleSheet = (theme: Theme | any) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.background
  },
  font: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text,
    fontSize: 16
  },
  titleContainer: {
    width: '95%',
    marginTop: 15,
    marginBottom: 10
  },
  addNewContainer: {
    width: '95%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  taskNameContainer: {
    width: '70%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorChooser: {
    width: 47,
    height: 47,
    borderRadius: 100,
    marginBottom: 5,
    borderColor: theme.colors.surface
  },
  addNewTask: {
    width: 120,
    height: 40,
    elevation: 0,
  },
  listContainer: {
    width: '95%',
  },
  tasksTitles: {
    fontSize: 28,
    marginTop: 10,
    marginBottom: 15
  },
  taskContainer: {
    width: '100%',
    height: 70,
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  showTaskContainer: {
    width: '95%',
    padding: 20,
    backgroundColor: theme.colors.background
  },
  actionButtons: {
    width: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
})

export default ToDoListScreen