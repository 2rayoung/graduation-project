import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import API_BASE_URL from './config';

export default function FoodDetail({ route, navigation }) {
  const { foodId } = route.params;  // FoodList에서 전달된 식재료 ID
  const [food, setFood] = useState(null);  // DB에서 가져온 식재료 정보를 저장할 상태
  const [consumptionValue, setConsumptionValue] = useState(0);  // 소비할 식재료 양

  const placeholderImage = 'https://via.placeholder.com/150'; // 기본 Placeholder 이미지 URL

  // 식재료 정보를 DB에서 가져오는 함수
  const fetchFoodDetail = async () => {
    try {
      console.log(`API 요청 URL: ${API_BASE_URL}/api/fooditems/details/${foodId}`);
      const response = await axios.get(`${API_BASE_URL}/api/fooditems/details/${foodId}`);
      console.log('API 응답:', response); // API에서 받은 전체 응답 로그
      console.log('응답 데이터:', response.data); // 응답 데이터 로그

      if (response.status === 200 && response.data) {
        // 배열 데이터를 객체 형태로 변환하여 사용
        const [id, foodName, price, quantity, expirationDate] = response.data;
        setFood({
          foodId: id,
          foodName: foodName || '식품 이름 없음',
          quantity: quantity || 0,
          expirationDate: expirationDate || '정보 없음',
          price: price || '정보 없음',
        });
      } else {
        console.log('API에서 유효한 데이터를 받지 못했습니다.');
        Alert.alert('오류', '식품 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error); // API 요청 중 에러 로그
      Alert.alert('오류', '식품 정보를 불러오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchFoodDetail();  // 컴포넌트가 처음 렌더링될 때 식재료 정보 가져오기
  }, [foodId]);

  if (!food) {
    return (
      <View style={styles.container}>
        <Text>식품 정보를 불러오는 중입니다...</Text>
      </View>
    );
  }

  const handleConsume = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/fooditems/quantity`, null, {
        params: {
          foodItemId: food.foodId,
          quantityToUpdate: consumptionValue,
          consumptionType: 'CONSUMED'
        }
      });
      if (response.status === 200) {
        Alert.alert('소비 완료', `${food.foodName} ${consumptionValue}개를 소비했습니다.`, [
          { text: '확인', onPress: () => navigation.navigate('FoodList', { refresh: true }) }
        ]);
        fetchFoodDetail();
      } else {
        Alert.alert('오류', '소비 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('소비 처리 중 오류 발생:', error);
      Alert.alert('오류', '소비 처리 중 오류가 발생했습니다.');
    }
  };

  const handleDispose = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/fooditems/quantity`, null, {
        params: {
          foodItemId: food.foodId,
          quantityToUpdate: consumptionValue,  // 사용자가 선택한 수량만큼 배출
          consumptionType: 'DISCARDED'
        }
      });
      if (response.status === 200) {
        Alert.alert('음식물 배출', `${food.foodName} ${consumptionValue}개를 배출했습니다.`, [
          { text: '확인', onPress: () => navigation.navigate('FoodList', { refresh: true }) }
        ]);
        fetchFoodDetail();
      } else {
        Alert.alert('오류', '배출 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('배출 처리 중 오류 발생:', error);
      Alert.alert('오류', '배출 처리 중 오류가 발생했습니다.');
    }
  };

  // "손질 방법" 버튼 클릭 시 손질 방법 화면으로 이동
  const handlePrepMethod = () => {
    navigation.navigate('PrepMethod', { foodId: food.foodName });
  };

  const handleStoreMethod = () => {
    navigation.navigate('StoreMethod', { foodId: food.foodName });
  };

  // food.quantity가 숫자인지 확인하고 숫자로 변환
  const quantity = parseFloat(food.quantity);
  const isQuantityValid = !isNaN(quantity);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>식품 정보</Text>
      </View>
      <View style={styles.foodInfoContainer}>
        <Image source={{ uri: placeholderImage }} style={styles.foodImage} />
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{food.foodName}</Text>
          <Text style={styles.foodExpiry}>유통기한: {food.expirationDate}</Text>
          <Text style={styles.foodQuantity}>갯수: {isQuantityValid ? food.quantity.toString() : '정보 없음'}</Text>
          <Text style={styles.foodPrice}>가격: {food.price !== '정보 없음' ? `${food.price}원` : '정보 없음'}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>소비/배출</Text>
        {isQuantityValid ? (
          <Slider
            value={consumptionValue}
            onValueChange={setConsumptionValue}
            minimumValue={0}
            maximumValue={quantity}  // 유효한 수량만 Slider에 설정
            step={1}
            style={styles.slider}
          />
        ) : (
          <Text>유효한 수량 정보가 없습니다.</Text>
        )}
        <View style={styles.sliderValueContainer}>
          <Text style={styles.sliderValue}>{consumptionValue}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleConsume} style={styles.actionButton}>
          <Text style={styles.buttonText}>소비 완료</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDispose} style={styles.actionButton}>
          <Text style={styles.buttonText}>음식물 배출</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>식품 관리 방법</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handlePrepMethod} style={styles.actionButton}>
            <Text style={styles.buttonText}>손질 방법</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleStoreMethod} style={styles.actionButton}>
            <Text style={styles.buttonText}>보관 방법</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

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
  foodInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  foodImage: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  foodExpiry: {
    fontSize: 14,
    color: '#888',
  },
  foodQuantity: {
    fontSize: 14,
    color: '#888',
  },
  foodPrice: {
    fontSize: 14,
    color: '#888',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  slider: {
    marginBottom: 8,
  },
  sliderValueContainer: {
    alignItems: 'flex-end',
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  actionButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#667080',
    alignItems: 'center',
    flex: 1,
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});