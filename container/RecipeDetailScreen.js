//레시피 선택시 상태 페이지
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert, Modal, TextInput } from 'react-native';
import * as Device from 'expo-device';
import API_BASE_URL from './config'; // API_BASE_URL 가져오기

export default function RecipeDetailScreen({ route }) {
  const { recipeDetails, recipeTitle } = route.params;  // 전달된 레시피 세부 정보와 제목
  const [ingredients, instructions] = recipeDetails.split('\n\n');  // \n\n로 구분된 재료와 레시피 분리
  const [customRecipe, setCustomRecipe] = useState(null);  // "내 재료로 만들기"로 받은 커스텀 레시피
  const [deviceId, setDeviceId] = useState(''); 
  const [showUseIngredientsButton, setShowUseIngredientsButton] = useState(false); 
  const [showModal, setShowModal] = useState(false); 
  const [parsedIngredients, setParsedIngredients] = useState([]); 
  const [editedIngredients, setEditedIngredients] = useState([]); 

  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = Device.modelId || Device.osInternalBuildId || 'unknown-device';
      setDeviceId(id);
    };
    fetchDeviceId();
  }, []);

  // 유튜브 레시피 영상 검색
  const handleSearchVideos = () => {
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(recipeTitle)}`;
    Linking.openURL(youtubeSearchUrl);
  };

  // "내 재료로 만들기" 버튼 클릭 시, 백엔드에서 커스텀 레시피를 받아오는 함수
  const handleCustomRecipe = async () => {
    try {
      const query = `?deviceId=${encodeURIComponent(deviceId)}&recipe=${encodeURIComponent(recipeTitle)}&menu=${encodeURIComponent(recipeTitle)}`;
      const response = await fetch(`${API_BASE_URL}/api/recipes/modify${query}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: ['carrot', 'onion'] }),  // 예시로 재료 리스트
      });

      const responseText = await response.text();
      setCustomRecipe(responseText);  
      setShowUseIngredientsButton(true); 
    } catch (error) {
      console.error('레시피 가져오기 오류:', error);
      Alert.alert('오류', '내 재료로 레시피를 가져오는 중 오류가 발생했습니다.');
    }
  };

  // "재료 사용" 버튼 클릭 시, 재료를 사용하여 백엔드에 전달하는 함수
  const handleUseIngredients = async () => {
    try {
      if (!customRecipe) {
        Alert.alert('오류', '커스텀 레시피가 없습니다.');
        return;
      }
  
      // "재료:" 부분만 추출
      const ingredientsSection = customRecipe.split('재료:')[1]?.split('요리과정:')[0]?.trim();
  
      if (!ingredientsSection) {
        Alert.alert('오류', '재료 정보를 찾을 수 없습니다.');
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/api/recipes/parse-ingredients?ingredientsSection=${encodeURIComponent(ingredientsSection)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const ingredientsJson = await response.json();
      setParsedIngredients(Object.entries(ingredientsJson));
      setEditedIngredients(Object.entries(ingredientsJson));
      setShowModal(true);
    } catch (error) {
      console.error('재료 파싱 오류:', error);
      Alert.alert('오류', '재료를 파싱하는 중 문제가 발생했습니다.');
    }
  };

  const handleDeleteIngredient = (index) => {
    const updatedIngredients = editedIngredients.filter((_, i) => i !== index);
    setEditedIngredients(updatedIngredients);
  };

  const handleEditIngredient = (index, delta) => {
    const updatedIngredients = [...editedIngredients];
    const currentAmount = parseFloat(updatedIngredients[index][1]);
    const newAmount = currentAmount + delta;

    if (newAmount > 0) { 
      updatedIngredients[index][1] = newAmount.toFixed(2);
      setEditedIngredients(updatedIngredients);
    }
  };

  const handleConsumeIngredients = async () => {
    try {
      const body = {};
      editedIngredients.forEach(([name, amount]) => {
        body[name] = amount;
      });

      const query = `?deviceId=${encodeURIComponent(deviceId)}`;
      const response = await fetch(`${API_BASE_URL}/api/fooditems/consume-ingredients${query}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(`서버 오류: 상태 코드 ${response.status}, 응답 내용: ${responseText}`);
      }

      Alert.alert('성공', '재료를 성공적으로 사용했습니다.');
      setShowModal(false); 
    } catch (error) {
      console.error('재료 사용 오류:', error);
      Alert.alert('오류', '재료를 사용하는 중 문제가 발생했습니다.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipeTitle}</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>재료:</Text>
        <Text style={styles.recipeText}>{ingredients}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>레시피:</Text>
        <Text style={styles.recipeText}>{instructions}</Text>
      </View>

      {/* 커스텀 레시피가 있을 경우 출력 */}
      {customRecipe && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>내 재료로 만든 레시피:</Text>
          <Text style={styles.recipeText}>{customRecipe}</Text>
        </View>
      )}

      {/* 내 재료로 만들기 버튼 */}
      {!customRecipe && (
        <TouchableOpacity style={[styles.button, styles.customRecipeButton]} onPress={handleCustomRecipe}>
          <Text style={styles.buttonText}>내 재료로 만들기</Text>
        </TouchableOpacity>
      )}

      {/* 재료 사용 버튼 */}
      {showUseIngredientsButton && (
        <TouchableOpacity style={[styles.button, styles.useIngredientsButton]} onPress={handleUseIngredients}>
          <Text style={styles.buttonText}>재료 사용</Text>
        </TouchableOpacity>
      )}

      {/* 레시피 영상 보기 버튼 */}
      <TouchableOpacity style={[styles.button, styles.videoButton]} onPress={handleSearchVideos}>
        <Text style={styles.buttonText}>레시피 영상 보기</Text>
      </TouchableOpacity>

      {/* 모달 창 */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>사용할 재료 목록</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {editedIngredients.length > 0 ? (
                editedIngredients.map(([ingredient, amount], index) => (
                  <View key={index} style={styles.ingredientRow}>
                    <Text style={styles.recipeText}>{ingredient}</Text>
                    <View style={styles.amountContainer}>
                      <TouchableOpacity onPress={() => handleEditIngredient(index, -1)}>
                        <Text style={styles.amountButton}>-</Text>
                      </TouchableOpacity>
                      <TextInput
                        style={styles.input}
                        value={amount.toString()}
                        keyboardType="numeric"
                        editable={false}
                      />
                      <TouchableOpacity onPress={() => handleEditIngredient(index, 1)}>
                        <Text style={styles.amountButton}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteIngredient(index)}>
                      <Text style={styles.deleteText}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text>재료를 가져오는 중...</Text>
              )}

              <TouchableOpacity style={[styles.button, styles.useButton]} onPress={handleConsumeIngredients}>
                <Text style={styles.buttonText}>사용</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  customRecipeButton: {
    backgroundColor: '#667080',
  },
  useIngredientsButton: {
    backgroundColor: '#E03333',
  },
  videoButton: {
    backgroundColor: '#667080',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginHorizontal: 10,
    width: 50,
    textAlign: 'center',
  },
  amountButton: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  deleteText: {
    color: '#ff4d4d',
    fontSize: 14,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  useButton: {
    backgroundColor: '#4CAF50',
  },
});
