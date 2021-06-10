# Env Variables Config.

## Web

Create an .env file in ./web with this variables:

````
API_KEY=xxxxxxxxxxxxxxxxx
AUTH_DOMAIN=xxxxxxxxxxxxxxxxx
PROYECT_ID=xxxxxxxxxxxxxxxxx
STORAGE_BUCKET=xxxxxxxxxxxxxxxxx
MESSAGING_SENDER_ID=xxxxxxxxxxxxxxxxx
APP_ID=xxxxxxxxxxxxxxxxx
MEASUREMENT_ID=xxxxxxxxxxxxxxxxx

API_KEY=xxxxxxxxxxxxxxxxx
CLIENT_KEY=xxxxxxxxxxxxxxxxx
````

You need to create a firebase proyect, create a web proyect and copy and paste the keys that firebase provides.

## Mobile

Create an .env file in ./web with this variables:

````
API_KEY=xxxxxxxxxxxxxxxxx
CLIENT_KEY=xxxxxxxxxxxxxxxxx
````

Also you need the files provided by firebase (google-services.json & GoogleService-info.plist)

- For android go to ./mobile/android/app and paste google-services.json
- For ios go to ./mobile/ios and paste GoogleService-info.plist