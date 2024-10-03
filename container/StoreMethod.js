import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import API_BASE_URL from './config';  // config.js에서 API_BASE_URL 가져옴

export default function StoreMethod({ route }) {
  const { foodId } = route.params;

  const [storeMethod, setStoreMethod] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false); // API 호출이 완료되었는지 여부를 저장

  const foods = [
    { id: '1', name: '양파' },
    { id: '2', name: '당근' },
    { id: '3', name: '파프리카' },
  ];

  const food = foods.find(f => f.id === foodId);

  useEffect(() => {
    if (food && !hasFetched) { // 보관 방법이 없고 아직 API 호출이 완료되지 않았을 때만 요청
      fetchStoreMethod(food.name);
    } else if (!food) {
      Alert.alert('오류', '해당 식품을 찾을 수 없습니다.');
      setLoading(false);
    }
  }, [food, hasFetched]); // hasFetched가 추가되어 중복 호출을 방지

  const fetchStoreMethod = async (name) => {
    if (hasFetched) return; // 중복 요청을 방지

    try {
      const response = await fetch(`${API_BASE_URL}/api/recipes/storage?name=${encodeURIComponent(name)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.text();
        setStoreMethod(result);
        setHasFetched(true); // API 호출 완료 상태로 설정
      } else {
        Alert.alert('오류', '보관 방법을 가져오는 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('API 요청 오류:', error);
      Alert.alert('오류', '서버에 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (!storeMethod) {
    return (
      <View style={styles.container}>
        <Text>보관 방법을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{food.name} 보관 방법</Text>
      <Text style={styles.content}>{storeMethod}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
  },
});
