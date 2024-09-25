import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView, Alert } from 'react-native';

export default function RecipeDetailScreen({ route }) {
  const { recipeDetails, recipeTitle } = route.params;  // 전달된 레시피 세부 정보와 제목
  const [ingredients, instructions] = recipeDetails.split('\n\n');  // \n\n로 구분된 재료와 레시피 분리
  const [customRecipe, setCustomRecipe] = useState(null);  // "내 재료로 만들기"로 받은 커스텀 레시피

  // 유튜브 레시피 영상 검색
  const handleSearchVideos = () => {
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(recipeTitle)}`;
    Linking.openURL(youtubeSearchUrl); 
  };

  // "내 재료로 만들기" 버튼 클릭 시, 백엔드에서 커스텀 레시피를 받아오는 함수
  const handleCustomRecipe = async () => {
    try {
      const response = await fetch('http://172.17.186.37:8080/api/custom-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: ['carrot', 'onion'] }),  // 예시로 재료 리스트
      });

      const result = await response.json();
      setCustomRecipe(result.customRecipe);  // 백엔드에서 받은 커스텀 레시피 저장
    } catch (error) {
      console.error('레시피 가져오기 오류:', error);
      Alert.alert('오류', '내 재료로 레시피를 가져오는 중 오류가 발생했습니다.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipeTitle}</Text>
      <Text style={styles.title}>레시피 추천</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>재료:</Text>
        <Text style={styles.recipeText}>
          {ingredients}  {/* 백엔드에서 가져온 재료 출력 */}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>레시피:</Text>
        <Text style={styles.recipeText}>
          {instructions}  {/* 백엔드에서 가져온 레시피 출력 */}
        </Text>
      </View>

      {/* 커스텀 레시피가 있을 경우 출력 */}
      {customRecipe && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>내 재료로 만든 레시피:</Text>
          <Text style={styles.recipeText}>
            {customRecipe}  {/* 커스텀 레시피 출력 */}
          </Text>
        </View>
      )}

      {/* 내 재료로 만들기 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleCustomRecipe}>
        <Text style={styles.buttonText}>내 재료로 만들기</Text>
      </TouchableOpacity>

      {/* 제육볶음 레시피 영상 보기 버튼 */}
      <TouchableOpacity style={[styles.button, styles.videoButton]} onPress={handleSearchVideos}>
        <Text style={styles.buttonText}>레시피 영상 보기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  recipeText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#667080',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  videoButton: {
    backgroundColor: '#667080',  // 다른 색상을 사용하여 구분
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
