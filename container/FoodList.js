import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ReceiptInput from './ReceiptInput';  // 모달 컴포넌트 import
import HeaderRightIcon from './HeaderRightIcon'; // HeaderRightIcon 컴포넌트 import

export default function FoodList({ navigation }) {
  const [foods, setFoods] = useState([
    { id: '1', name: '양파', storage: 'room', expiry: '2024-08-15', image: require('../assets/onion.png') },
    { id: '2', name: '당근', storage: 'fridge', expiry: '2024-08-12', image: require('../assets/carrot1.png') },
    { id: '3', name: '파프리카', storage: 'freezer', expiry: '2024-07-29', image: require('../assets/pepper.png') },
    { id: '4', name: '청양고추', storage: 'fridge', expiry: '2024-09-03', image: require('../assets/chilli.png') },
  ]);

  const [checkedFoods, setCheckedFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);

  // 필터와 검색어에 따라 음식 목록 필터링
  const filteredFoods = foods.filter(food => 
    (filter === 'all' || food.storage === filter) &&
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortByExpiry = () => {
    const sorted = [...foods].sort((a, b) => new Date(a.expiry) - new Date(b.expiry));
    setFoods(sorted);
  };

  const sortByRegistration = () => {
    const sorted = [...foods].sort((a, b) => a.id.localeCompare(b.id));
    setFoods(sorted);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRightIcon 
          onSortByExpiry={sortByExpiry} 
          onSortByRegistration={sortByRegistration} 
        />
      ),
    });
  }, [navigation]);

  const toggleCheckbox = (foodId) => {
    if (checkedFoods.includes(foodId)) {
      setCheckedFoods(checkedFoods.filter(id => id !== foodId));
    } else {
      setCheckedFoods([...checkedFoods, foodId]);
    }
  };

  const handleConfirm = () => {
    const selectedFoods = foods.filter(food => checkedFoods.includes(food.id));

    // 네비게이션 경로 수정
    navigation.navigate('FoodListStack', {
      screen: 'SelectedIngredients',
      params: { selectedFoods },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>조회</Text>
        <TouchableOpacity style={styles.menuButton}>
          {/* Menu icon can be added here if needed */}
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterButtons}>
        <TouchableOpacity onPress={() => setFilter('all')} style={[styles.filterButton, filter === 'all' && styles.selected]}>
          <Text style={styles.filterButtonText}>전체</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('fridge')} style={[styles.filterButton, filter === 'fridge' && styles.selected]}>
          <Text style={styles.filterButtonText}>냉장</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('freezer')} style={[styles.filterButton, filter === 'freezer' && styles.selected]}>
          <Text style={styles.filterButtonText}>냉동</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('room')} style={[styles.filterButton, filter === 'room' && styles.selected]}>
          <Text style={styles.filterButtonText}>실온</Text>
        </TouchableOpacity>
      </View>

      {/* Food List */}
      <FlatList
        data={filteredFoods}
        renderItem={({ item }) => (
          <View style={styles.foodItem}>
            {/* 체크박스 */}
            <TouchableOpacity onPress={() => toggleCheckbox(item.id)}>
              <View style={styles.checkbox}>
                {checkedFoods.includes(item.id) ? (
                  <Text style={styles.checked}>✔️</Text>
                ) : (
                  <Text style={styles.unchecked}>⬜</Text>
                )}
              </View>
            </TouchableOpacity>
            
            {/* 식품 정보 */}
            <TouchableOpacity
              onPress={() => navigation.navigate('FoodDetail', { foodId: item.id })}
              style={styles.foodInfoContainer}
            >
              <Image source={item.image} style={styles.foodImage} />
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodExpiry}>유통기한: {item.expiry}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={styles.foodList}
      />

      {/* Add Button to Open Modal */}
      <TouchableOpacity onPress={openModal} style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* 확인 버튼 */}
      {checkedFoods.length > 0 && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>확인</Text>
        </TouchableOpacity>
      )}

      {/* Modal Component */}
      <ReceiptInput visible={modalVisible} onClose={closeModal} navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    marginTop: -5,
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 10,
  },
  searchContainer: {
    marginBottom: 20,
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
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterButton: {
    flex: 0.2,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: '#667080',
  },
  filterButtonText: {
    color: '#fff',
  },
  foodList: {
    marginBottom: 80,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: 'grey',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    fontSize: 18,
    color: '#667080',
  },
  unchecked: {
    fontSize: 18,
    color: '#ccc',
  },
  foodInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  foodImage: {
    width: 54,
    height: 56,
    marginRight: 16,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodExpiry: {
    fontSize: 12,
    color: '#888',
  },
  addButton: {
    position: 'absolute',
    right: 22,
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#667080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#667080',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
