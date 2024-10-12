import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image } from 'react-native';
import axios from 'axios';
import ReceiptInput from './ReceiptInput';  // 모달 컴포넌트 import
import HeaderRightIcon from './HeaderRightIcon'; // HeaderRightIcon 컴포넌트 import
import SettingsModal from './SettingsModal'; // SettingsModal 컴포넌트 import
import API_BASE_URL from './config'; // API URL
import * as Device from 'expo-device'; // expo-device import

// 기본 Placeholder 이미지 URL
const placeholderImage = 'https://via.placeholder.com/150';

export default function FoodList({ navigation }) {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]); // 필터링된 식품 목록 상태 추가
  const [checkedFoods, setCheckedFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false); // ReceiptInput 모달 상태
  const [settingsModalVisible, setSettingsModalVisible] = useState(false); // 설정 모달 상태
  const [deviceId, setDeviceId] = useState(''); // 사용자 디바이스 ID 상태 추가

  // 사용자 디바이스 ID 가져오기
  useEffect(() => {
    const getDeviceId = () => {
      const id = Device.modelId || Device.osInternalBuildId || 'unknown-device';  // 디바이스 ID 가져오기
      setDeviceId(id);  // 상태 업데이트
    };

    getDeviceId();
  }, []);

  // 보관 방법별로 데이터 가져오기
  const fetchFoodData = async (storageMethod = 'all') => {
    try {
      let url = `${API_BASE_URL}/api/fooditems/${deviceId}`;
      if (storageMethod !== 'all') {
        url = `${API_BASE_URL}/api/fooditems/${deviceId}/storage/${storageMethod}`;
      }

      const response = await axios.get(url);
      if (response.status === 200) {
        setFoods(response.data);
        setFilteredFoods(response.data); // 초기 데이터로 필터링 목록 설정
      } else {
        Alert.alert('오류', '식품 데이터를 가져오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('식품 데이터를 가져오는 중 오류 발생:', error);
      Alert.alert('오류', '서버에 연결하는 데 실패했습니다.');
    }
  };

  // 디바이스 ID가 설정된 후 데이터 가져오기
  useEffect(() => {
    if (deviceId) {
      fetchFoodData();
    }
  }, [deviceId]);

  // 필터 버튼을 누를 때 보관 방법에 맞는 데이터를 가져옴
  const handleFilterChange = (storageMethod) => {
    setFilter(storageMethod);
    fetchFoodData(storageMethod);
  };

  // 필터와 검색어에 따라 음식 목록 필터링
  const applyFilterAndSearch = () => {
    let filtered = foods;

    if (filter !== 'all') {
      filtered = filtered.filter(food => food.storageMethod === filter);
    }

    if (search) {
      filtered = filtered.filter(food => 
        food.foodName.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredFoods(filtered);
  };

  // 등록 순서로 정렬 (필터된 데이터에서 정렬)
  const sortByRegistration = () => {
    const sorted = [...filteredFoods].sort((a, b) => a.foodId - b.foodId);
    setFilteredFoods(sorted);
  };

  // 유통기한 순서로 정렬 (필터된 데이터에서 정렬)
  const sortByExpiry = () => {
    const sorted = [...filteredFoods].sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
    setFilteredFoods(sorted);
  };

  const openModal = () => {
    setModalVisible(true);  // ReceiptInput 모달 열기 위한 상태 업데이트
  };

  const closeModal = () => {
    setModalVisible(false); // ReceiptInput 모달 닫기 위한 상태 업데이트
  };

  const toggleSettingsModal = () => {
    setSettingsModalVisible(!settingsModalVisible); // 설정 모달 열기/닫기
  };

  useEffect(() => {
    applyFilterAndSearch();
  }, [filter, search, foods]); // 필터와 검색어에 따라 필터링된 목록 업데이트

  const toggleCheckbox = (foodId) => {
    if (checkedFoods.includes(foodId)) {
      setCheckedFoods(checkedFoods.filter(id => id !== foodId));
    } else {
      setCheckedFoods([...checkedFoods, foodId]);
    }
  };

  const handleConfirm = () => {
    const selectedFoods = filteredFoods.filter(food => checkedFoods.includes(food.foodId));
    navigation.navigate('FoodListStack', {
      screen: 'SelectedIngredients',
      params: { selectedFoods },
    });
  };

  // 헤더에 설정 아이콘 추가 (설정 모달)
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleSettingsModal}>
          <Image
            source={require('../assets/settings-icon.png')}
            style={{ width: 24, height: 24, marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>조회</Text>
      </View>

      {/* 검색 바 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* 필터 버튼 */}
      <View style={styles.filterButtons}>
        <TouchableOpacity onPress={() => handleFilterChange('all')} style={[styles.filterButton, filter === 'all' && styles.selected]}>
          <Text style={styles.filterButtonText}>전체</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilterChange('REFRIGERATOR')} style={[styles.filterButton, filter === 'REFRIGERATOR' && styles.selected]}>
          <Text style={styles.filterButtonText}>냉장</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilterChange('FREEZER')} style={[styles.filterButton, filter === 'FREEZER' && styles.selected]}>
          <Text style={styles.filterButtonText}>냉동</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilterChange('ROOM_TEMPERATURE')} style={[styles.filterButton, filter === 'ROOM_TEMPERATURE' && styles.selected]}>
          <Text style={styles.filterButtonText}>실온</Text>
        </TouchableOpacity>

        {/* 정렬 버튼 (위아래 화살표) */}
        <HeaderRightIcon
          onSortByExpiry={sortByExpiry}
          onSortByRegistration={sortByRegistration}
        />
      </View>

      {/* 음식 목록 */}
      <FlatList
        data={filteredFoods}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>식품이 없습니다.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.foodItem}>
            {/* 체크박스 */}
            <TouchableOpacity onPress={() => toggleCheckbox(item.foodId)}>
              <View style={styles.checkbox}>
                {checkedFoods.includes(item.foodId) ? (
                  <Text style={styles.checked}>✔️</Text>
                ) : (
                  <Text style={styles.unchecked}>⬜</Text>
                )}
              </View>
            </TouchableOpacity>
            
            {/* 식품 정보 */}
            <TouchableOpacity
              onPress={() => navigation.navigate('FoodDetail', { foodId: item.foodId })}
              style={styles.foodInfoContainer}
            >
              <Image 
                source={{ uri: item.image || placeholderImage }}
                style={styles.foodImage} 
              />
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.foodName}</Text>
                <Text style={styles.foodExpiry}>유통기한: {item.expirationDate}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.foodId.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}  // 여유 공간 추가
        style={styles.foodList}
      />

      {/* 모달 열기 버튼 */}
      <TouchableOpacity onPress={openModal} style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* 확인 버튼 */}
      {checkedFoods.length > 0 && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>확인</Text>
        </TouchableOpacity>
      )}

      {/* 설정 모달 */}
      <SettingsModal
        modalVisible={settingsModalVisible}
        toggleModal={toggleSettingsModal}
        navigation={navigation}
      />

      {/* ReceiptInput 모달 */}
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
    flex: 1,
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
    zIndex: 1, // 버튼이 목록 위로 오도록 설정
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});
