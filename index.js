import { AppRegistry } from 'react-native';
import App from './App'; // App.js 파일의 경로
import { name as appName } from './app.json'; // app.json 파일의 이름

AppRegistry.registerComponent(appName, () => App);
