import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import * as Application from 'expo-application'; // expo-application 사용
import API_BASE_URL from './config'; // API URL 가져오기

// 특정 foodId로 유통기한을 가져오는 함수
async function fetchExpirationDate(foodId) {
  try {
    console.log(`Fetching expiration date for foodId: ${foodId}`);
    const response = await axios.get(`${API_BASE_URL}/api/fooditems/details/${foodId}`);
    
    // 응답에서 expirationDate만 추출
    const expirationDate = response.data.expirationDate;
    console.log(`Expiration date for foodId ${foodId}: ${expirationDate}`);
    
    return expirationDate;
  } catch (error) {
    // 더 자세한 오류 로그를 출력하여 500 에러의 원인 파악
    if (error.response) {
      console.error(`Error response from server:`, error.response.data);
      console.error(`Status: ${error.response.status}`);
    } else if (error.request) {
      console.error(`No response received from server:`, error.request);
    } else {
      console.error(`Axios request error:`, error.message);
    }
    return null; // 오류 발생 시 null 반환
  }
}

// ExpirationAlertScreen 컴포넌트
const ExpirationAlertScreen = () => {
  const [selectedDays, setSelectedDays] = useState(3); // 기본값 3일 전
  const [isAlertEnabled, setIsAlertEnabled] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [foodId, setFoodId] = useState(1); // 예시로 foodId 1번 사용

  // 기기 ID 가져오기
  useEffect(() => {
    const getDeviceId = async () => {
      const id = await Application.getInstallationIdAsync(); // getInstallationIdAsync를 사용해 기기 ID 가져오기
      console.log('Device ID:', id);
    };
    getDeviceId();
  }, []);

  // 유통기한 데이터 가져오기
  useEffect(() => {
    fetchExpirationDate(foodId).then(date => {
      if (date) {
        setExpirationDate(date);
      } else {
        console.log('Failed to fetch expiration date.');
      }
    });
  }, [foodId]);

  // 푸시 알림 권한 요청
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      console.log('Expo Push Token:', token);
      setExpoPushToken(token);
    });
  }, []);

  // Expo 푸시 알림을 위한 권한 요청 함수
  async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    console.log('Notification permission status:', existingStatus);
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('푸시 알림 권한이 필요합니다!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id' // 여기에 실제 Expo 프로젝트 ID를 넣어야 합니다.
    })).data;
    console.log('Expo Push Token retrieved:', token);

    return token;
  }

  // 알림 스케줄 설정
  const scheduleNotification = (expirationDate, daysBefore) => {
    const alertDate = new Date(expirationDate);
    alertDate.setDate(alertDate.getDate() - daysBefore); // 유통기한 며칠 전에 알림 설정
    console.log('Scheduling notification for:', alertDate);

    Notifications.scheduleNotificationAsync({
      content: {
        title: '유통기한 임박',
        body: `유통기한이 ${daysBefore}일 남았습니다.`,
        sound: 'default',
      },
      trigger: { date: alertDate }, // 알림 트리거 날짜 설정
    });
  };

  const handleSaveAlert = () => {
    console.log('Saving alert, expirationDate:', expirationDate);
    if (expirationDate && isAlertEnabled) {
      console.log('Setting alert for expiration date:', expirationDate);
      scheduleNotification(expirationDate, selectedDays);
      Alert.alert("알림 설정", `유통기한 ${selectedDays}일 전에 알림이 설정되었습니다.`);
    } else {
      console.log('Alert not set, either expirationDate is missing or alert is disabled.');
      Alert.alert("오류", "알림을 설정하려면 푸시 알림을 활성화해야 합니다.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>유통기한 임박 알림 설정</Text>
      </View>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingText}>푸시 알림</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isAlertEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={() => {
            console.log('Switch toggled:', !isAlertEnabled);
            setIsAlertEnabled(!isAlertEnabled);
          }}
          value={isAlertEnabled}
        />
      </View>

      {isAlertEnabled && (
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>알림 받을 날짜 선택</Text>
          <RNPickerSelect
            onValueChange={(value) => {
              console.log('Selected days changed:', value);
              setSelectedDays(value);
            }}
            value={selectedDays}
            items={[
              { label: '1일 전', value: 1 },
              { label: '3일 전', value: 3 },
              { label: '5일 전', value: 5 },
              { label: '7일 전', value: 7 },
            ]}
            style={pickerSelectStyles}
            placeholder={{ label: '날짜를 선택하세요', value: null }}
          />
        </View>
      )}

      <TouchableOpacity
        onPress={handleSaveAlert}
        style={[styles.saveButton, { backgroundColor: isAlertEnabled ? '#2196F3' : '#B0BEC5' }]} // 푸시 알림이 켜져 있으면 활성화, 아니면 회색
        disabled={!isAlertEnabled} // 푸시 알림이 꺼져 있으면 비활성화
      >
        <Text style={styles.saveButtonText}>알림 저장</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExpirationAlertScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingText: {
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

// RNPickerSelect의 스타일을 정의
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    width: '100%',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: '#cccccc',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    width: '100%',
  },
};
