import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';

const FoodSelectionScreen = ({ navigation }) => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const foods = [
    { id: '1', name: '양파', expiration: '24-05-16' },
    { id: '2', name: '파프리카', expiration: '24-05-10' },
  ];

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  const handleRecipeRecommendation = () => {
    setModalVisible(false);
    navigation.navigate('RecipeDetail', { selectedFood }); // 선택한 음식과 함께 레시피 페이지로 이동
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>음식 목록</Text>
      <FlatList
        data={foods}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.foodItem}
            onPress={() => handleFoodSelect(item)}
          >
            <Text>{item.name}</Text>
            <Text>유통기한: {item.expiration}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* 음식 선택 후 표시되는 모달 */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>레시피 추천</Text>
            {selectedFood && (
              <View>
                <Text>{selectedFood.name}</Text>
                <Text>유통기한: {selectedFood.expiration}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.recipeButton}
              onPress={handleRecipeRecommendation}
            >
              <Text style={styles.buttonText}>레시피 추천 보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FoodSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  foodItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  recipeButton: {
    backgroundColor: '#667080',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
<<<<<<< HEAD
});
=======
});
>>>>>>> cd222376ff367cc164ee8483e2de7e352228f8f0
