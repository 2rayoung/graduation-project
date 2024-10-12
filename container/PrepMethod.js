import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import API_BASE_URL from './config'; // API_BASE_URL 가져오기

export default function PrepMethod({ route }) {
  const { foodId } = route.params;

  const [prepMethod, setPrepMethod] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false); // API 호출이 완료되었는지 여부를 저장

  // 예제 데이터
  const foods = [
    { id: '1', name: '양파' },
    { id: '2', name: '당근' },
    { id: '3', name: '파프리카' },
  ];

  const food = foods.find(f => f.id === foodId);

  useEffect(() => {
    if (food && !hasFetched) {
      fetchPrepMethod(food.name);  // 손질 방법 가져오기
    } else if (!food) {
      Alert.alert('오류', '해당 식품을 찾을 수 없습니다.');
      setLoading(false);
    }
    // hasFetched가 변경되지 않도록 의존성 배열에 추가하지 않음
  }, [food]);  // food가 변경될 때만 호출

  const fetchPrepMethod = async (name) => {
    if (hasFetched) return; // 이미 호출되었다면 중복 요청 방지

    try {
      const response = await fetch(`${API_BASE_URL}/api/recipes/handling?name=${encodeURIComponent(name)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.text();
        setPrepMethod(result);
        setHasFetched(true); // API 호출 완료 상태로 설정
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
