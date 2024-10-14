import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import API_BASE_URL from './config';  // config.js에서 API_BASE_URL 가져옴

export default function StoreMethod({ route }) {
  const { name } = route.params;  // 식재료 이름 받아옴

  const [storeMethod, setStoreMethod] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (name) {
      fetchStoreMethod(name);  // 보관 방법 가져오기
    }
  }, [name]);

  const fetchStoreMethod = async (name) => {
    try {
      // API 요청 URL에 이름을 쿼리 파라미터로 전달
      const url = `${API_BASE_URL}/api/recipes/storage?name=${encodeURIComponent(name)}`;
      console.log(`보관 방법 요청 URL: ${url}`);

      const response = await fetch(url, {
        method: 'POST',  // POST 요청
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('API 응답 상태:', response.status);

      if (response.ok) {
        const result = await response.text();
        console.log('API 응답 데이터:', result);  // 받은 보관 방법 데이터 로그로 출력
        setStoreMethod(result);  // 보관 방법 설정
      } else {
        const errorText = await response.text();
        console.log('오류 응답 내용:', errorText);  // 오류 응답 내용 로그 출력
        Alert.alert('오류', `보관 방법을 가져오는 중 문제가 발생했습니다. 상태 코드: ${response.status}, 오류 메시지: ${errorText}`);
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
      <Text style={styles.title}>{name} 보관 방법</Text>  {/* 식재료 이름 출력 */}
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
