import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const sampleRecipes = {
  '인기 레시피': ['제육볶음', '참치김치찌개'],
  '오늘의 레시피': ['계란말이', '불고기'],
  '내 식재료로 추천 레시피': ['감자전', '무생채'],
};

export default function RecommendedListScreen({ route, navigation }) {
  const { type } = route.params;
  const recipes = sampleRecipes[type] || [];

  const handlePress = (recipe) => {
    navigation.navigate('RecipeDetail', { recipe });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{type}</Text>
      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recipeItem} onPress={() => handlePress(item)}>
            <Text style={styles.recipeText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        style={styles.recipeList}
      />
    </View>
  );
}

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
    textAlign: 'center',
  },
  recipeList: {
    marginTop: 16,
  },
  recipeItem: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  recipeText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});
