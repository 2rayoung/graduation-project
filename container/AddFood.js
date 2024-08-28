import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddFoodScreen({ route, navigation }) {
  const { mode } = route.params || {};
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [storageType, setStorageType] = useState('room');
  const [price, setPrice] = useState(''); // 가격 상태 추가

  useEffect(() => {
    if (mode === 'takePhoto') {
      handleTakePhoto();
    } else if (mode === 'chooseFromGallery') {
      handleChooseFromGallery();
    }
  }, [mode]);

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access camera was denied');
      return;
    }
    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      console.log('Photo URI:', result.uri);
    }
    navigation.setParams({ mode: null }); // Reset mode
  };

  const handleChooseFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access media library was denied');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      console.log('Gallery URI:', result.uri);
    }
    navigation.setParams({ mode: null }); // Reset mode
  };

  const handleManualInput = () => {
    const data = {
      foodName,
      quantity,
      expiryDate,
      storageType,
      price,
    };
    console.log('Manual Input Data:', data);
    Alert.alert('식품 추가 완료', '직접 입력이 완료되었습니다.');
    navigation.navigate('FoodList'); // Return to FoodList
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>식품 이름</Text>
      <TextInput
        style={styles.input}
        value={foodName}
        onChangeText={setFoodName}
        placeholder="식품 이름을 입력하세요."
      />
      <Text style={styles.label}>수량</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        placeholder="수량을 입력하세요."
        keyboardType="numeric"
      />
      <Text style={styles.label}>유통기한</Text>
      <TextInput
        style={styles.input}
        value={expiryDate}
        onChangeText={setExpiryDate}
        placeholder="유통기한을 입력하세요. (YYYY-MM-DD)"
      />
      <Text style={styles.label}>가격</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="가격을 입력하세요."
      />
      <Text style={styles.label}>보관 유형</Text>
      <View style={styles.pickerContainer}>
        <TouchableOpacity
          style={[styles.pickerButton, storageType === 'room' && styles.pickerButtonSelected]}
          onPress={() => setStorageType('room')}
        >
          <Text style={[styles.pickerButtonText, storageType === 'room' && styles.pickerButtonTextSelected]}>
            실온
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pickerButton, storageType === 'fridge' && styles.pickerButtonSelected]}
          onPress={() => setStorageType('fridge')}
        >
          <Text style={[styles.pickerButtonText, storageType === 'fridge' && styles.pickerButtonTextSelected]}>
            냉장
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pickerButton, storageType === 'freezer' && styles.pickerButtonSelected]}
          onPress={() => setStorageType('freezer')}
        >
          <Text style={[styles.pickerButtonText, storageType === 'freezer' && styles.pickerButtonTextSelected]}>
            냉동
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* 추가하기 버튼 */}
      <TouchableOpacity style={styles.addButton} onPress={handleManualInput}>
        <Text style={styles.addButtonText}>추가하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pickerButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  pickerButtonSelected: {
    backgroundColor: '#667080',
  },
  pickerButtonText: {
    color: 'gray',
  },
  pickerButtonTextSelected: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#667080', // 버튼의 배경색
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff', // 버튼 텍스트 색상
    fontSize: 18,
    fontWeight: 'bold',
  },
});
