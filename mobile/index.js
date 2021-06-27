import { AppRegistry, Linking } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import PushNotification from 'react-native-push-notification'
// Import language support
import './i18n'

// PUSH NOTIFICATIONS
PushNotification.configure({
  onRegister: (token) => {
    console.log("TOKEN:", token)
  },
  onNotification: (notification) => {
    console.log("NOTIFICATION:", notification)

    if (notification.data['gcm.n.analytics_data']['google.c.a.c_l'] == 'rate_app') {
      Linking.openURL('https://play.google.com/store/apps/details?id=com.assignit')
    }
  },
  onAction: (notification) => {
    console.log("ACTION:", notification.action)
    console.log("NOTIFICATION:", notification)
  },
  onRegistrationError: (err) => {
    console.error(err.message, err)
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
})

PushNotification.createChannel({
  channelId: "assignit_channel_1",
  channelName: "Assignit channel",
},
(created) => console.log(`Notifications channel created '${created}'`)
)

AppRegistry.registerComponent(appName, () => App)
