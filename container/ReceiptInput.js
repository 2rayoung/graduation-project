import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ReceiptInput({ visible, onClose, navigation }) {

  // 사진 촬영 함수
  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.cancelled) {
      processImage(result.uri);
    }
  };

  // 갤러리에서 사진 선택 함수
  const handleChooseFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.cancelled) {
      processImage(result.uri);
    }
  };

  // 이미지를 백엔드로 전송하고 텍스트 추출하는 함수
  const processImage = async (imageUri) => {
    const formData = new FormData();
    formData.append('imageFile', {
      uri: imageUri,
      name: 'receipt.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await fetch('http://172.17.186.37:8080/api/vision/extract-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();
      
      // 텍스트 추출 결과를 AddFood 화면으로 전달
      navigation.navigate('AddFood', { extractedText: result });
    } catch (error) {
      console.error('이미지 처리 오류:', error);
      Alert.alert('오류', '이미지 처리 중 문제가 발생했습니다.');
    } finally {
      onClose();
    }
  };

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
            onPress={handleTakePhoto} // 카메라로 사진 찍기
          >
            <Text style={styles.buttonText}>카메라</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleChooseFromGallery} // 갤러리에서 사진 선택
          >
            <Text style={styles.buttonText}>갤러리</Text>
          </TouchableOpacity>

          {/* 직접 입력 추가 */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onClose();
              navigation.navigate('AddFood', { mode: 'manualInput' }); // 직접 입력 모드로 이동
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