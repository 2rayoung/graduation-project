//재료 선택시 레시피 추천 화면
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';

// Fake API URL 설정
const FAKE_API_URL = 'https://jsonplaceholder.typicode.com';

export default function SelectedIngredientsScreen({ route, navigation }) {
  const { selectedFoods } = route.params; // 네비게이션에서 전달된 파라미터 받기
  const [apiLog, setApiLog] = useState(''); // API 호출 로그 상태 관리

  const handleRecipeRecommendation = async () => {
    try {
      // Fake API 호출 로그 업데이트
      const apiUrl = `${FAKE_API_URL}/posts?_limit=1`;
      setApiLog(`Fake API 호출됨: ${apiUrl}`); // 화면에 로그로 표시될 상태

      // Fake API를 호출하여 임의의 레시피 데이터 가져오기
      const response = await fetch(apiUrl);
      const data = await response.json();

      // 임의로 첫 번째 레시피를 선택하여 RecipeDetailScreen으로 이동
      const recommendedRecipe = {
        title: data[0].title || '추천 레시피',
        body: data[0].body || '레시피 설명이 없습니다.',
      };

      // RecipeDetailScreen으로 네비게이션 및 데이터 전달
      navigation.navigate('RecipeDetail', { recipe: recommendedRecipe });

    } catch (error) {
      Alert.alert('Error', '레시피 추천을 가져오는 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>선택된 재료</Text>
      {selectedFoods.map((food) => (
        <View key={food.id} style={styles.foodItem}>
          <Image source={food.image} style={styles.foodImage} />
          <View style={styles.foodInfo}>
            <Text style={styles.foodName}>{food.name}</Text>
            <Text style={styles.foodExpiry}>유통기한: {food.expiry}</Text>
          </View>
        </View>
      ))}

      {/* 레시피 추천받기 버튼 */}
      <TouchableOpacity style={styles.recipeButton} onPress={handleRecipeRecommendation}>
        <Text style={styles.recipeButtonText}>레시피 추천받기</Text>
      </TouchableOpacity>

      {/* Fake API 호출 로그 표시 */}
      {apiLog ? (
        <View style={styles.logContainer}>
          <Text style={styles.logText}>{apiLog}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5', // 밝은 배경색
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fafafa', // 더 밝은 배경색으로 변경
    borderRadius: 12, // 더 부드러운 곡선
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // 그림자 효과 추가
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  foodExpiry: {
    fontSize: 12,
    color: '#888',
  },
  recipeButton: {
    marginTop: 'auto',
    backgroundColor: '#667080', // 버튼의 어두운 배경
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  logText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
  },
});

