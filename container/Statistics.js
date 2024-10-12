import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { G, Line, Circle, Text as SVGText } from 'react-native-svg';
import { useIsFocused } from '@react-navigation/native';
import SettingsModal from './SettingsModal'; // 설정 모달 컴포넌트 가져오기

export default function StatisticsScreen({ navigation }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [consumptionData, setConsumptionData] = useState([]);
  const [disposalData, setDisposalData] = useState([]);
  const [costData, setCostData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태 추가
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleModal}>
          <Image
            source={require('../assets/settings-icon.png')}
            style={{ width: 28, height: 28 }}
          />
        </TouchableOpacity>
      ),
      headerRightContainerStyle: {
        paddingRight: 20, 
      },
    });
  }, [navigation]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const fetchData = () => {
    const consumption = [
      { key: 1, amount: 66.9, svg: { fill: '#600080' }, label: '채소' },
      { key: 2, amount: 19.8, svg: { fill: '#9900cc' }, label: '과일' },
      { key: 3, amount: 9.5, svg: { fill: '#c61aff' }, label: '유제품' },
      { key: 4, amount: 3.8, svg: { fill: '#d966ff' }, label: '기타' },
    ];
    setConsumptionData(consumption);
  };

  const data = [consumptionData, disposalData, costData][selectedIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>통계</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, selectedIndex === 0 && styles.selected]}
          onPress={() => setSelectedIndex(0)}
        >
          <Text style={styles.filterButtonText}>소비</Text>
        </TouchableOpacity>
      </View>

      <PieChart
        style={{ height: 200 }}
        valueAccessor={({ item }) => item.amount}
        data={data}
        outerRadius={'95%'}
      />

      {/* 설정 모달 사용 */}
      <SettingsModal
        modalVisible={modalVisible}
        toggleModal={toggleModal}
        navigation={navigation}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  filterButton: {
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
    fontWeight: 'bold',
  },
});
