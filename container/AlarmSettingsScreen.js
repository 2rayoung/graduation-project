import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Switch } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const ExpirationAlertScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState(5); // 기본값 5일 전
  const [isAlertEnabled, setIsAlertEnabled] = useState(false); // 알림 스위치 상태
  const [alertSet, setAlertSet] = useState(false); // 알림이 설정되었는지 여부
  const [alertPopupVisible, setAlertPopupVisible] = useState(false); // 팝업 상태

  // 모달 토글 함수
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  // 스위치 토글 함수
  const toggleAlertSwitch = () => setIsAlertEnabled(previousState => !previousState);

  // 저장 함수
  const saveAlertSettings = () => {
    setAlertSet(true);
    toggleModal();
    schedulePopup(); // 팝업 스케줄 설정
  };

  // 일정 시간이 지나면 팝업이 나타나도록 설정 (여기서는 5초 후 팝업)
  const schedulePopup = () => {
    setTimeout(() => {
      setAlertPopupVisible(true);
    }, 5000); // 5초 후 팝업 (실제 2일 후라면 2일을 초 단위로 변환)
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
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isAlertEnabled ? '#0000ff' : '#f4f3f4'}
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

      {/* 2일 후 팝업 (여기서는 5초 후) */}
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
