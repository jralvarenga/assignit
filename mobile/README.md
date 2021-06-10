# Assignit

> Keep all your tasks or assigments organized.

## Proyect Description

Assignit is build in [React native](https://reactnative.dev/) with [Firebase](https://firebase.google.com/) ([React Native Firebase](https://rnfirebase.io/)), Also uses [Google Calendar API](https://developers.google.com/calendar)

To install all this run

````bash
yarn add

# or just

yarn
````

## Configuration

- This app uses Firebase for its backend, to configure firebase go [here](https://firebase.google.com/) and add an Android and IOS application
- You need to add the debug.keystore to ./android/app, once added get the SHA-1 and Key Hashes from the keystore for the Google sign in and Facebook sign in
- For Google sign in go to your firebase configuration and add the SHA-1 key
- For Facebook sign in go to [Facebook Console](https://developers.facebook.com/apps/?show_reminder=true), create and android and ios app and add the key hashes
- For more information, go to [Facebook Sign In](https://github.com/thebergamo/react-native-fbsdk-next/) and [Google Sign In](https://github.com/react-native-google-signin/google-signin)
- The api key for Google Calendar API go [here](https://console.cloud.google.com/) and select the proyect, go to API and Credentials and select calendar API

### Android

For Android all the config. is set properly for this proyect

## IOS

This proyect has been builded in Android so it needs to be configured from the begining for IOS

This dependencies need deep config in ./ios directory

- [React Native Firebase](https://rnfirebase.io/)
- [Facebook Sign In](https://github.com/thebergamo/react-native-fbsdk-next/)
- [Google Sign In](https://github.com/react-native-google-signin/google-signin)
- [Lottie files](https://github.com/lottie-react-native/lottie-react-native)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Push Notifications](https://github.com/zo0r/react-native-push-notification#readme)
- [React Native Splashscreen](https://github.com/crazycodeboy/react-native-splash-screen)
- App Splashscreen
- App Icon

## Development

### Android

1. Open ./android in [Android studio](https://developer.android.com/studio) and let it set up your proyect
2. Run your android simulator
3. Run in diferent terminals

````bash
yarn start
# and
yarn android
````

And you're all set

### IOS

This app is only development in android, so you need to set up the ios enviroment from zero and install all the dependencies needed