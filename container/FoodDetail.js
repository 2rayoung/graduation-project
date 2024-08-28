import Slider from '@react-native-community/slider';
import React from 'react';
import { Alert, Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function FoodDetail({ route, navigation }) {
  const { foodId } = route.params;
  const [consumptionValue, setConsumptionValue] = React.useState(0);

  const foods = [
    { id: '1', name: '양파', expiry: '2024-08-15', image: require('../assets/onion.png') },
    { id: '2', name: '당근', expiry: '2024-08-12', image: require('../assets/carrot1.png') },
    { id: '3', name: '파프리카', expiry: '2024-07-29', image: require('../assets/pepper.png') },
  ];

  const food = foods.find(f => f.id === foodId);

  if (!food) {
    return (
      <View style={styles.container}>
        <Text>식품 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const handleConsume = async () => {
    try {
      const response = await fetch('https://your-backend-url/api/foods/consume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foodId: food.id }),
      });
      if (response.ok) {
        Alert.alert('소비 완료', `${food.name}를(을) 소비했습니다.`);
        navigation.navigate('FoodList');
      } else {
        Alert.alert('오류', '소비 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '소비 처리 중 오류가 발생했습니다.');
    }
  };

  const handleDispose = async () => {
    try {
      const response = await fetch('https://your-backend-url/api/foods/dispose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foodId: food.id }),
      });
      if (response.ok) {
        Alert.alert('음식물 배출', `${food.name}를(을) 배출했습니다.`);
        navigation.navigate('FoodList');
      } else {
        Alert.alert('오류', '배출 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '배출 처리 중 오류가 발생했습니다.');
    }
  };

  const handlePrepMethod = () => {
    navigation.navigate('PrepMethod', { foodId });
  };

  const handleStoreMethod = () => {
    navigation.navigate('StoreMethod', { foodId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>식품 정보</Text>
      </View>
      <View style={styles.foodInfoContainer}>
        <Image source={food.image} style={styles.foodImage} />
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{food.name}</Text>
          <Text style={styles.foodExpiry}>유통기한: {food.expiry}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>소비/배출</Text>
        <Slider
          value={consumptionValue}
          onValueChange={setConsumptionValue}
          minimumValue={0}
          maximumValue={100}
          step={1}
          style={styles.slider}
        />
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
    backgroundColor: '#fff',
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
