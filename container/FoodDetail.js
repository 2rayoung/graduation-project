import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Switch, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device'; // Device 모듈을 사용하여 기기 여부 확인
import axios from 'axios';
import API_BASE_URL from './config'; // API URL

// 푸시 알림을 보내는 함수
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: '유통기한 임박',
    body: '유통기한이 임박한 식품이 있습니다!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

const ExpirationAlertScreen = ({ route }) => {
  const { foodId } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState(5); // 기본값 5일 전
  const [isAlertEnabled, setIsAlertEnabled] = useState(false); // 알림 스위치 상태
  const [alertSet, setAlertSet] = useState(false); // 알림이 설정되었는지 여부
  const [alertPopupVisible, setAlertPopupVisible] = useState(false); // 팝업 상태
  const [expoPushToken, setExpoPushToken] = useState(''); // Expo 푸시 토큰
  const [notification, setNotification] = useState(false);
  const [expirationDate, setExpirationDate] = useState(null); // 유통기한 상태
  const notificationListener = useRef();
  const responseListener = useRef();

  // 푸시 알림 권한 요청 및 토큰 등록
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // 알림 리스너 설정
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // 알림에 대한 응답 리스너 설정
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // 유통기한 데이터 가져오기
  useEffect(() => {
    const fetchExpirationDate = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/fooditems/details/${foodId}`);
        if (response.status === 200 && response.data) {
          setExpirationDate(response.data.expirationDate);
        } else {
          console.log('API에서 유효한 데이터를 받지 못했습니다.');
          Alert.alert('오류', '식품 정보를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        Alert.alert('오류', '식품 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };

    if (foodId) {
      fetchExpirationDate();
    }
  }, [foodId]);

  // Expo 푸시 알림을 위한 권한 요청 함수
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {  // 물리적 기기 여부 확인
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('푸시 알림 권한이 필요합니다!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'e2b2db6b-aaf1-4a4c-881c-7772d81a71ef' // 여기에 Project ID 사용
      })).data;
      console.log(token);
    } else {
      alert('푸시 알림은 실제 기기에서만 사용할 수 있습니다.');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  // 모달 토글 함수
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  // 스위치 토글 함수
  const toggleAlertSwitch = () => setIsAlertEnabled(previousState => !previousState);

  // 저장 함수 (푸시 알림 발송 포함)
  const saveAlertSettings = async () => {
    setAlertSet(true);
    toggleModal();

    if (expirationDate) {
      const alertTime = new Date(expirationDate);
      alertTime.setDate(alertTime.getDate() - selectedDays);
      const currentTime = new Date();

      const timeDifference = alertTime - currentTime;

      if (timeDifference > 0) {
        // 설정된 시간 후에 푸시 알림 보내기
        setTimeout(async () => {
          await sendPushNotification(expoPushToken);
          schedulePopup(); // 팝업 스케줄 설정
        }, timeDifference);
      } else {
        alert('유통기한이 이미 지났거나 알림을 보낼 수 없습니다.');
      }
    }
  };

  // 일정 시간이 지나면 팝업이 나타나도록 설정 (여기서는 2초 후 팝업)
  const schedulePopup = () => {
    setTimeout(() => {
      setAlertPopupVisible(true);
    }, 2000); // 2초 후 팝업
  };

  // 팝업 닫기 함수
  const closeAlertPopup = () => {
    setAlertPopupVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* 알림 설정 */}
      <Text style={styles.title}>유통기한 임박 알림</Text>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingText}>푸시 알림</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#969696' }}
          thumbColor={isAlertEnabled ? '#667080' : '#f4f3f4'}
          onValueChange={toggleAlertSwitch}
          value={isAlertEnabled}
        />
      </View>

      {/* 알림 받을 날짜 선택 */}
      {isAlertEnabled && (
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>알림 받을 날짜 선택</Text>
          <TouchableOpacity onPress={toggleModal} style={styles.selectButton}>
            <Text>{selectedDays}일 전</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 알림 설정된 정보 표시 */}
      {alertSet && isAlertEnabled && (
        <View style={styles.alertInfo}>
          <Text style={styles.alertText}>
            유통기한 {selectedDays}일 전에 알림이 설정되었습니다.
          </Text>
        </View>
      )}

      {/* 알림 날짜 선택 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>알림 받을 날짜 선택</Text>
            
            {/* Picker 사용하여 날짜 선택 */}
            <RNPickerSelect
              onValueChange={(value) => setSelectedDays(value)}
              items={[
                { label: '1일 전', value: 1 },
                { label: '2일 전', value: 2 },
                { label: '3일 전', value: 3 },
                { label: '4일 전', value: 4 },
                { label: '5일 전', value: 5 },
                { label: '6일 전', value: 6 },
                { label: '7일 전', value: 7 },
                { label: '8일 전', value: 8 },
                { label: '9일 전', value: 9 },
                { label: '10일 전', value: 10 },
              ]}
              placeholder={{ label: '날짜 선택', value: null }}
              style={pickerSelectStyles}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveAlertSettings} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 팝업 모달 */}
      <Modal
        transparent={true}
        visible={alertPopupVisible}
        animationType="slide"
        onRequestClose={closeAlertPopup}
      >
        <View style={styles.popupContainer}>
          <View style={styles.popupContent}>
            <Text style={styles.popupText}>유통기한이 임박한 식품이 있습니다.</Text>
            <TouchableOpacity onPress={closeAlertPopup} style={styles.popupButton}>
              <Text style={styles.popupButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ExpirationAlertScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  settingText: {
    fontSize: 18,
    fontWeight: '500',
  },
  selectButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: '#667080',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#667080',
    padding: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  alertInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  alertText: {
    fontSize: 16,
    color: '#0000ff',
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popupContent: {
    width: 350,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  popupText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  popupButton: {
    backgroundColor: '#667080',
    padding: 10,
    borderRadius: 5,
  },
  popupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});