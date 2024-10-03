import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert, Modal, TextInput } from 'react-native';
import * as Device from 'expo-device';
import API_BASE_URL from './config'; // API_BASE_URL 가져오기

export default function RecipeDetailScreen({ route }) {
  const { recipeDetails, recipeTitle } = route.params; 
  const [ingredients, instructions] = recipeDetails.split('\n\n'); 
  const [customRecipe, setCustomRecipe] = useState(null); 
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

  const handleSearchVideos = () => {
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(recipeTitle)}`;
    Linking.openURL(youtubeSearchUrl);
  };

  const handleCustomRecipe = async () => {
    try {
      const query = `?deviceId=${encodeURIComponent(deviceId)}&recipe=${encodeURIComponent(recipeTitle)}&menu=${encodeURIComponent(recipeTitle)}`;
      const response = await fetch(`${API_BASE_URL}/api/recipes/modify${query}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: ['carrot', 'onion'] }),  
      });

      const responseText = await response.text();
      setCustomRecipe(responseText);  
      setShowUseIngredientsButton(true); 
    } catch (error) {
      console.error('레시피 가져오기 오류:', error);
      Alert.alert('오류', '서버와 연결 중 문제가 발생했습니다.');
    }
  };

  const handleUseIngredients = async () => {
    try {
      if (!customRecipe) {
        Alert.alert('오류', '커스텀 레시피가 없습니다.');
        return;
      }
  
      // 방어 코드: customRecipe가 undefined일 때 split을 호출하지 않도록 처리
      if (typeof customRecipe !== 'string') {
        Alert.alert('오류', '레시피 정보가 잘못되었습니다.');
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
      <Text style={styles.title}>레시피 추천</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>재료:</Text>
        <Text style={styles.recipeText}>{ingredients}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>레시피:</Text>
        <Text style={styles.recipeText}>{instructions}</Text>
      </View>

      {customRecipe && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>내 재료로 만든 레시피:</Text>
          <Text style={styles.recipeText}>{customRecipe}</Text>
        </View>
      )}

      {!customRecipe && (
        <TouchableOpacity style={[styles.button, styles.customRecipeButton]} onPress={handleCustomRecipe}>
          <Text style={styles.buttonText}>내 재료로 만들기</Text>
        </TouchableOpacity>
      )}

      {showUseIngredientsButton && (
        <TouchableOpacity style={[styles.button, styles.useIngredientsButton]} onPress={handleUseIngredients}>
          <Text style={styles.buttonText}>재료 사용</Text>
        </TouchableOpacity>
      )}

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
            {/* 상단 제목과 X 버튼을 같은 선상에 배치하고 제목이 왼쪽, X 버튼이 오른쪽 */}
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
                    {/* 삭제 버튼을 오른쪽에 맞추어 정렬 */}
                    <View style={styles.deleteContainer}>
                      <TouchableOpacity onPress={() => handleDeleteIngredient(index)}>
                        <Text style={styles.deleteText}>삭제</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text>재료를 가져오는 중...</Text>
              )}
              {/* 하단에는 '사용' 버튼만 표시 */}
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
  scrollContainer: {
    paddingBottom: 20,
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
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 좌우 정렬
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
  deleteContainer: {
    marginLeft: 'auto', // 오른쪽에 정렬
  },
  deleteText: {
    color: '#ff4d4d',
    fontSize: 14,
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
    backgroundColor: '#ff4d4d',
  },
  videoButton: {
    backgroundColor: '#667080',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  useButton: {
    backgroundColor: '#4CAF50',
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
});
