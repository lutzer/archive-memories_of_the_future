# Memories of the Future

## Setup IDE

1. Install cordova: `npm install -g cordova`
2. Install Android Sdk
3. add android Platform: `cordova platform add android `
4. Build project: `cordova build android`
5. Run on Device: `cordova run android`

### Debug in Android Studio 
* Open Android Studio and Import as Non-Android-Studio-Project.

## Setup Server

1. copy web/www to server
2. create tables in mysql database by running code in web/db_create.txt
3. setup web/www/api/config.php
4. create data/uploads dir on webserver and give chmod 777 permissions.
