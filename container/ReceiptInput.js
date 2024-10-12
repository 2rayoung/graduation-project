import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import API_BASE_URL from './config';  // config.js에서 API_BASE_URL 가져오기

export default function ReceiptInput({ visible, onClose, navigation }) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  // 권한 요청 함수
  const requestPermissions = async () => {
    const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    setHasGalleryPermission(galleryPermission.status === 'granted');
    setHasCameraPermission(cameraPermission.status === 'granted');

    if (galleryPermission.status !== 'granted' || cameraPermission.status !== 'granted') {
      Alert.alert('권한 필요', '앱이 정상적으로 작동하려면 카메라 및 갤러리 접근 권한이 필요합니다.');
    }
  };

  // 컴포넌트가 마운트될 때 권한 요청
  useEffect(() => {
    requestPermissions();  // 권한 요청
  }, []);

  // 사진 촬영 함수
  const handleTakePhoto = async () => {
    if (!hasCameraPermission) {
      Alert.alert('카메라 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.1,
    });

    if (!result.canceled) {
      console.log("Image captured successfully: ", result.assets[0].uri);  // 이미지 선택 결과를 로그로 확인
      processImage(result.assets[0].uri);
    } else {
      console.log("Image selection cancelled");
    }
  };

  // 갤러리에서 사진 선택 함수
  const handleChooseFromGallery = async () => {
    if (!hasGalleryPermission) {
      Alert.alert('갤러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 0.1,
    });

    console.log("ImagePicker result: ", result); // 전체 result 로그 출력

    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log("Image selected from gallery: ", result.assets[0].uri);  // 이미지 선택 결과를 로그로 확인
      processImage(result.assets[0].uri);
    } else {
      console.log("Image selection cancelled or no assets found");
    }
  };

  const processImage = async (imageUri) => {
    if (!imageUri) {
      console.error("Image URI is undefined");
      Alert.alert("오류", "이미지를 선택하지 않았습니다.");
      return;
    }
  
    const formData = new FormData();
    formData.append('imageFile', {
      uri: imageUri,
      name: 'receipt.jpg',
      type: 'image/jpeg',
    });
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/vision/extract-text`, {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json(); // 서버에서 JSON 형식의 텍스트 추출 결과 받기
        console.log('Extracted Text:', result);  // 추출된 텍스트 결과를 로그로 확인
        // 추출된 텍스트를 AddFood 화면으로 전달
        navigation.navigate('AddFood', { extractedText: result });
      } else {
        const errorText = await response.text();
        console.error('서버 응답 오류:', errorText);
        Alert.alert('오류', `서버 오류 발생: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('이미지 처리 오류:', error);
      Alert.alert('오류', '이미지 처리 중 문제가 발생했습니다.');
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