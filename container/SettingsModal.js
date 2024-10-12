import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

export default function SettingsModal({ modalVisible, toggleModal, navigation }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={toggleModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>설정</Text>
          <TouchableOpacity onPress={() => {
            toggleModal(); // 모달 닫기
            setTimeout(() => {
              navigation.navigate('AlarmSettingsScreen'); // 알림 설정 화면으로 이동
            }, 300); // 모달 애니메이션 완료 후 화면 이동
          }}>
            <Text style={{ marginVertical: 10 }}>알림설정</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.closeButton}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 15,
  },
  closeButton: {
    color: 'red',
    marginTop: 20,
  },
});
