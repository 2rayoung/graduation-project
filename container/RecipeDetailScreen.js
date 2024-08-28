import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, ScrollView } from 'react-native';

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipe } = route.params;

  const handleMaterialManagementPress = () => {
    navigation.navigate('MaterialManagement');
  };

  const handleVideoPress = () => {
    Linking.openURL('https://youtu.be/spjIN3vPVVY?si=uYDG8VWb0xRYRavA'); // 여기에 실제 비디오 URL을 추가하세요.
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>레시피 추천</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>재료:</Text>
        <Text style={styles.recipeText}>
          닭고기 30g (닭 정강이 또는 목){"\n"}
          양파 1/2개{"\n"}
          마늘 1/2쪽{"\n"}
          간장 1 큰술{"\n"}
          설탕 1 큰술{"\n"}
          참기름 1 작은술{"\n"}
          후추{"\n"}
          소금{"\n"}
          물 1컵{"\n"}
          통깨
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>레시피:</Text>
        <Text style={styles.recipeText}>
          1. 닭고기를 3cm 길이로 자르고, 양파와 마늘은 굵게 썰고, 대파는 4cm 길이로 자른다.{"\n"}
          2. 냄비에 양파, 마늘을 넣고 닭고기와 간장, 설탕, 참기름, 후추를 넣고 섞어준다.{"\n"}
          3. 물을 붓고 중불에서 끓인다.{"\n"}
          4. 국물이 반 정도 졸아들면 불을 끄고 통깨를 뿌린다.
        </Text>
      </View>
      <TouchableOpacity style={[styles.button, styles.videoButton]} onPress={handleVideoPress}>
        <Text style={styles.buttonText}>영상 보기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  recipeText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  videoButton: {
    backgroundColor: '#667080', // Tomato color for video button
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
