import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-svg-charts';
import { G, Text as SVGText } from 'react-native-svg';
import { useIsFocused } from '@react-navigation/native';
import * as Device from 'expo-device'; 
import axios from 'axios';
import API_BASE_URL from './config'; 

const getCurrentMonth = () => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};
=======
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { useIsFocused } from '@react-navigation/native';
import SettingsModal from './SettingsModal'; // 설정 모달 컴포넌트 가져오기

export default function StatisticsScreen({ navigation }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [consumptionData, setConsumptionData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태 추가
  const isFocused = useIsFocused();
>>>>>>> cd222376ff367cc164ee8483e2de7e352228f8f0

// InquiryScreen - 여기에서 상품 통계가 표시됩니다.
export default function InquiryScreen({ route }) {
  const [filteredData, setFilteredData] = useState([]); 
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth().month);
  const [selectedType, setSelectedType] = useState('CONSUMED');
  const [selectedTab, setSelectedTab] = useState('소비'); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [deviceId, setDeviceId] = useState('');  
  const isFocused = useIsFocused(); 

  // 장치 ID를 얻는 hook
  useEffect(() => {
    const getDeviceId = () => {
      const id = Device.modelId || Device.osInternalBuildId || 'unknown-device';
      setDeviceId(id);  // 장치 ID를 상태에 저장
    };
    getDeviceId(); // 장치 ID를 얻기
  }, []);

  // API를 통해 데이터를 가져오고 화면 포커스를 감시
  useEffect(() => {
    if ((route.params?.refresh || isFocused) && deviceId) {
      fetchConsumptionDataByType(selectedMonth, selectedType, deviceId, setFilteredData, setLoading, setError);
    }
  }, [route.params?.refresh, isFocused, selectedMonth, selectedType, deviceId]);

<<<<<<< HEAD
  // API를 통해 데이터를 가져오는 함수
  const fetchConsumptionDataByType = async (month, consumptionType, deviceId, setFilteredData, setLoading, setError) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.get(`${API_BASE_URL}/api/consumption-records/${deviceId}/month/type`, {
        params: { year: 2024, month, consumptionType }
      });
      console.log('소비 유형:', selectedType);  

      const transformedData = response.data.map((item, index) => ({
        key: `${item[0]}_${index}`, 
        productName: item[0], // 고유 키: 상품명 + 인덱스
        value: item[1],
        price: item[2], 
        svg: { fill: getRandomColor() }
      }));
  
      setFilteredData(transformedData);
    } catch (error) {
      console.log("오류:", error);  
      setError('데이터를 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 랜덤 색상을 생성하는 함수
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
=======
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleModal}>
          <Image
            source={require('../assets/settings-icon.png')} // 경로 확인 필요
            style={{ width: 24, height: 24}}
          />
        </TouchableOpacity>
      ),
      headerRightContainerStyle: {
        paddingRight: 20,
      },
    });
  }, [navigation]);

  const toggleModal = () => {
    setModalVisible(!modalVisible); // 모달 열고 닫기 상태
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

  const data = [consumptionData][selectedIndex]; // 필요에 맞게 수정
>>>>>>> cd222376ff367cc164ee8483e2de7e352228f8f0

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    if (tab === '소비') {
      setSelectedType('CONSUMED'); // 소비 유형
    } else if (tab === '폐기') {
      setSelectedType('DISCARDED'); // 폐기 유형
    }
  };

  // PieChart에 라벨을 생성하는 함수
  const Labels = ({ slices }) => slices.map((slice, index) => {
    const { pieCentroid, data } = slice;
    return (
      <G key={index}>
        <SVGText
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill="white"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={12}
          fontWeight="bold"
          stroke="black"
          strokeWidth={0.5}
        >
          {data.productName} {/* 상품명 표시 */}
        </SVGText>
      </G>
    );
  });

  return (
<<<<<<< HEAD
    <FlatList
      style={styles.container}
      ListHeaderComponent={(
        <View>
          <Text style={styles.header}>통계 및 조회</Text>
  
          {/* 월 선택 */} 
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>월을 선택하세요:</Text>
            <Picker
              selectedValue={selectedMonth}
              style={styles.picker}
              onValueChange={setSelectedMonth}
            >
              {[...Array(12).keys()].map(i => (
                <Picker.Item key={i} label={`${i + 1}월`} value={i + 1} />
              ))}
            </Picker>
          </View>
  
          {/* '소비'와 '폐기' 선택 버튼 */}
          <View style={styles.tabContainer}>
            {['소비', '폐기'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, selectedTab === tab && styles.activeTabButton]}
                onPress={() => handleTabChange(tab)}
              >
                <Text style={styles.tabText}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
  
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" /> 
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text> 
          ) : filteredData.length === 0 ? (
            <Text style={styles.noDataText}>데이터가 없습니다</Text> 
          ) : (
            <View>
              {/* PieChart */}
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>{selectedTab} 차트</Text>
                <PieChart
                  style={{ height: 250 }}
                  data={filteredData}
                  innerRadius="50%"
                  outerRadius="90%"
                  labelRadius="110%"
                >
                  <Labels />
                </PieChart>
              </View>
            </View>
          )}
        </View>
      )}
      data={filteredData}
      keyExtractor={(item) => item.key}  // React에 고유 키 부여
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>
            {item.productName}: {item.value} 개  {/* 사용자에게 상품명 표시 */}
          </Text>
          <Text style={styles.listItemCost}>가격: {item.price || 0}원</Text>
        </View>
      )}
    />
=======
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

      {/* 설정 모달 */}
      <SettingsModal
        modalVisible={modalVisible}
        toggleModal={toggleModal} // 모달 열기/닫기 함수
        navigation={navigation}
      />
    </ScrollView>
>>>>>>> cd222376ff367cc164ee8483e2de7e352228f8f0
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  filterContainer: { marginBottom: 20 },
  filterLabel: { fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
  picker: { height: 50, width: '100%' },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  tabButton: { padding: 10, borderRadius: 8, backgroundColor: '#ddd' },
  activeTabButton: { backgroundColor: '#888' },
  tabText: { fontSize: 16, color: '#fff' },
  chartContainer: { marginBottom: 20, padding: 10, backgroundColor: '#fff', borderRadius: 10 },
  chartTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  noDataText: { fontSize: 18, color: '#FF6347', textAlign: 'center', marginVertical: 20 },
  listItem: { padding: 15, backgroundColor: '#fff', borderRadius: 10, marginBottom: 10 },
  listItemText: { fontSize: 16, fontWeight: '600' },
  listItemCost: { fontSize: 14, color: '#444', marginTop: 5 },
  errorText: { color: 'red', textAlign: 'center', marginVertical: 20 },
=======
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
>>>>>>> cd222376ff367cc164ee8483e2de7e352228f8f0
});
