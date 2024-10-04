import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';

export default function RecipeRecommendationScreen({ navigation }) {
  const [search, setSearch] = useState(''); // 검색어 상태 추가

  const handlePress = (type) => {
    navigation.navigate('RecommendedList', { type });
  };

  const handleSearch = () => {
    if (search.trim()) {
      navigation.navigate('SearchResults', { searchQuery: search }); // 검색 결과 창으로 이동
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Title */}
      <View style={styles.header}>
        <Text style={styles.title}>레시피 추천</Text>
        <TouchableOpacity style={styles.menuButton}>
          {/* 필요한 경우 여기에 메뉴 버튼 또는 다른 아이콘을 추가할 수 있습니다. */}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          value={search} // 검색어 상태 바인딩
          onChangeText={setSearch} // 검색어 업데이트 함수
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.card} onPress={() => handlePress('인기 레시피')}>
        <Image source={require('../assets/thumbs_up.png')} style={styles.icon} />
        <Text style={styles.cardText}>인기 레시피</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => handlePress('오늘의 레시피')}>
        <Image source={require('../assets/sun.png')} style={styles.icon} />
        <Text style={styles.cardText}>오늘의 레시피</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => handlePress('내 식재료로 추천 레시피')}>
        <Image source={require('../assets/fridge.png')} style={styles.icon} />
        <Text style={styles.cardText}>내 식재료로 추천 레시피</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    marginTop: -5,
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuButton: {
    // 메뉴 버튼에 대한 스타일을 여기에 추가할 수 있습니다.
  },
  searchContainer: {
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
  },
  searchButton: {
    backgroundColor: '#667080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
