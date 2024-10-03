// RecipeSearchScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecipeSearchScreen = ({ route }) => {
  const { recipeInfo } = route.params; // 검색 결과를 받아옴

  return (
    <View style={styles.container}>
      <Text style={styles.title}>검색 결과</Text>
      {/* 여기서 recipeInfo를 사용하여 결과를 표시 */}
      <Text>{recipeInfo ? JSON.stringify(recipeInfo) : '검색 결과가 없습니다.'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default RecipeSearchScreen;
