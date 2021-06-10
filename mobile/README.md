## Configuration

Clone this repo and cd into ./mobile to start editing the react native app

To install the proyect dependencies run

````bash
yarn
````

### Global

- You need a firebase proyect to edit this proyect
- You need the Google Calendar API key to work in this proyect
- Configure Google and Facebook auth

### Android

- You need to add the google-services.json provided by firebase into ./android/app
- Open Android Studio, sync & configure the proyect, run ./gradre clean if necesary
- You need to create a debug.keystore to work in this proyect 
- And you're all set

### IOS

> Keep in mind this proyect has been built only for android at the moment, it needs to be configure for IOS

- You need to add the GoogleService-info.plist into ./ios/assignit
- Open XCode, sync & configure the ios proyect
- Configure all the RN dependencies that need an extra setup for ios
- You're all set

### Extra setup dependencies

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