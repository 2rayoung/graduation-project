import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ReceiptInput({ visible, onClose, navigation }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose} // Android의 뒤로가기 버튼에 대한 처리
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.label}>식품 추가</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onClose();
              navigation.navigate('AddFood', { mode: 'takePhoto' }); 
            }}
          >
            <Text style={styles.buttonText}>카메라</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onClose(); 
              navigation.navigate('AddFood', { mode: 'chooseFromGallery' });
            }}
          >
            <Text style={styles.buttonText}>갤러리</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onClose(); 
              navigation.navigate('AddFood', { mode: 'manualInput' });
            }}
          >
            <Text style={styles.buttonText}>직접 입력</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#667080',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeText: {
    color: 'red',
    marginVertical: 10,
  },
});
