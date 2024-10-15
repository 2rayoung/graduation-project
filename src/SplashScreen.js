import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent({ navigation }) {
  useEffect(() => {
    setTimeout(async () => {
      await SplashScreen.hideAsync();
      navigation.replace('Main'); // 스플래시 화면 후에 Main 탭 네비게이터로 이동
    }, 3000); // 스플래시 화면이 3초 동안 표시됩니다.
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="bounceIn"
        duration={2000}
        source={require('../assets/LOGO1.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});
