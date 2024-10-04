import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import API_BASE_URL from './config'; // API_BASE_URL 가져오기

export default function PrepMethod({ route }) {
  const { foodId } = route.params;

  const [prepMethod, setPrepMethod] = useState('');
  const [loading, setLoading] = useState(true);

  // 예제 데이터
  const foods = [
    { id: '1', name: '양파' },
    { id: '2', name: '당근' },
    { id: '3', name: '파프리카' },
  ];

  const food = foods.find(f => f.id === foodId);

  useEffect(() => {
    if (food) {
      fetchPrepMethod(food.name);
    } else {
      Alert.alert('오류', '해당 식품을 찾을 수 없습니다.');
      setLoading(false);
    }
  }, [food]);

  const fetchPrepMethod = async (name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recipes/handling?name=${encodeURIComponent(name)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.text(); // 서버로부터 손질 방법 텍스트를 받아옴
        setPrepMethod(result);
      } else {
        Alert.alert('오류', '손질 방법을 가져오는 중 문제가 발생했습니다.');
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

  if (!prepMethod) {
    return (
      <View style={styles.container}>
        <Text>손질 방법을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{food.name} 손질 방법</Text>
      <Text style={styles.content}>{prepMethod}</Text>
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
