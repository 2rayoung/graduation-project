import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Device from 'expo-device';

export default function AddFoodScreen({ route, navigation }) {
  const { mode } = route.params || {};
  const [foodItems, setFoodItems] = useState([{ foodName: '', quantity: '', expiryDate: '', storageType: '' }]); // 시작할 때는 하나만

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...foodItems];
    updatedItems[index][field] = value;
    setFoodItems(updatedItems);
  };

  const addNewFoodItem = () => {
    setFoodItems([...foodItems, { foodName: '', quantity: '', expiryDate: '', storageType: '' }]);
  };

  const handleManualInput = async () => {
    const data = foodItems.map((item) => ({
      deviceId: Device.modelId || Device.osInternalBuildId || '',
      foodName: item.foodName || '',
      price: 0,
      quantity: parseFloat(item.quantity) || 0,
      expirationDate: item.expiryDate || '',
      registeredDate: new Date().toISOString(),
      storageMethod: item.storageType.toUpperCase(),
    }));

    try {
      const response = await fetch('http://172.17.186.37:8080/api/fooditems/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Alert.alert('식품 추가 완료', '식품이 성공적으로 추가되었습니다.');
        navigation.navigate('FoodList', { newFood: data });
      } else {
        const errorMessage = await response.text();
        console.error(`서버 응답 오류: ${response.status}, 메시지: ${errorMessage}`);
        Alert.alert('오류', `식품 추가 중 문제가 발생했습니다. 상태 코드: ${response.status}`);
      }
    } catch (error) {
      console.error('API 요청 오류:', error);
      Alert.alert('오류', '서버에 연결할 수 없습니다.');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {foodItems.map((item, index) => (
            <View key={index} style={styles.foodItemContainer}>
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>식품 이름</Text>
                  <TextInput
                    style={styles.input}
                    value={item.foodName}
                    onChangeText={(value) => handleInputChange(index, 'foodName', value)}
                    placeholder="식품 이름"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>수량</Text>
                  <TextInput
                    style={styles.input}
                    value={item.quantity}
                    onChangeText={(value) => handleInputChange(index, 'quantity', value)}
                    placeholder="수량"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>유통기한</Text>
                  <TextInput
                    style={styles.input}
                    value={item.expiryDate}
                    onChangeText={(value) => handleInputChange(index, 'expiryDate', value)}
                    placeholder="유통기한 (YYYY-MM-DD)"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>등록일자</Text>
                  <TextInput
                    style={styles.input}
                    value={new Date().toISOString().slice(0, 10)}
                    editable={false} // 등록일자는 현재 날짜로 고정
                  />
                </View>
              </View>

              <View style={styles.storageRow}>
                <TouchableOpacity
                  style={[
                    styles.storageButton,
                    item.storageType === 'REFRIGERATOR' && styles.storageButtonSelected,
                  ]}
                  onPress={() => handleInputChange(index, 'storageType', 'REFRIGERATOR')}
                >
                  <Text
                    style={[
                      styles.storageButtonText,
                      item.storageType === 'REFRIGERATOR' && styles.storageButtonTextSelected,
                    ]}
                  >
                    냉장
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.storageButton,
                    item.storageType === 'FREEZER' && styles.storageButtonSelected,
                  ]}
                  onPress={() => handleInputChange(index, 'storageType', 'FREEZER')}
                >
                  <Text
                    style={[
                      styles.storageButtonText,
                      item.storageType === 'FREEZER' && styles.storageButtonTextSelected,
                    ]}
                  >
                    냉동
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.storageButton,
                    item.storageType === 'ROOM_TEMPERATURE' && styles.storageButtonSelected,
                  ]}
                  onPress={() => handleInputChange(index, 'storageType', 'ROOM_TEMPERATURE')}
                >
                  <Text
                    style={[
                      styles.storageButtonText,
                      item.storageType === 'ROOM_TEMPERATURE' && styles.storageButtonTextSelected,
                    ]}
                  >
                    실온
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* + 버튼 추가 */}
          <TouchableOpacity style={styles.addNewButton} onPress={addNewFoodItem}>
            <Text style={styles.addNewButtonText}>+ 식품 추가</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 추가하기 버튼을 화면 하단에 고정 */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleManualInput}>
          <Text style={styles.addButtonText}>추가하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,  // 추가된 여백을 통해 버튼에 가려지지 않게 함
  },
  container: {
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  foodItemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
  },
  storageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  storageButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  storageButtonSelected: {
    backgroundColor: '#667080',
  },
  storageButtonText: {
    color: '#333',
  },
  storageButtonTextSelected: {
    color: '#fff',
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#667080',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addNewButton: {
    marginTop: 16,
    backgroundColor: '#667080',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addNewButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
