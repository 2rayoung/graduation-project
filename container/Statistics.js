import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { G, Line, Circle, Text as SVGText } from 'react-native-svg';
import { useIsFocused } from '@react-navigation/native';

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
    // 헤더에 설정 아이콘 추가
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
        paddingRight: 20, // 오른쪽 여백 추가
      },
    });
  }, [navigation]);

  const toggleModal = () => {
    setModalVisible(!modalVisible); // 모달을 여닫는 함수
  };

  const fetchData = () => {
    const consumption = [
      { key: 1, amount: 66.9, svg: { fill: '#600080' }, label: '채소' },
      { key: 2, amount: 19.8, svg: { fill: '#9900cc' }, label: '과일' },
      { key: 3, amount: 9.5, svg: { fill: '#c61aff' }, label: '유제품' },
      { key: 4, amount: 3.8, svg: { fill: '#d966ff' }, label: '기타' },
    ];

    const disposal = [
      { key: 1, amount: 45.3, svg: { fill: '#ff0000' }, label: '채소' },
      { key: 2, amount: 30.5, svg: { fill: '#ff6666' }, label: '과일' },
      { key: 3, amount: 15.2, svg: { fill: '#ff9999' }, label: '유제품' },
      { key: 4, amount: 9.0, svg: { fill: '#ffcccc' }, label: '기타' },
    ];

    const cost = [
      { key: 1, amount: 50.0, svg: { fill: '#008080' }, label: '채소' },
      { key: 2, amount: 25.0, svg: { fill: '#66b2b2' }, label: '과일' },
      { key: 3, amount: 15.0, svg: { fill: '#99cccc' }, label: '유제품' },
      { key: 4, amount: 10.0, svg: { fill: '#cce6e6' }, label: '기타' },
    ];

    setConsumptionData(consumption);
    setDisposalData(disposal);
    setCostData(cost);
  };

  const data = [consumptionData, disposalData, costData][selectedIndex];

  const Labels = ({ slices }) => {
    return slices.map((slice, index) => {
      const { labelCentroid, data } = slice;
      return (
        <G key={index}>
          <Line
            x1={labelCentroid[0]}
            y1={labelCentroid[1]}
            x2={labelCentroid[0]}
            y2={labelCentroid[1]}
            stroke={data.svg.fill}
          />
          <Circle
            cx={labelCentroid[0]}
            cy={labelCentroid[1]}
            r={15}
            fill="white"
          />
          <SVGText
            x={labelCentroid[0]}
            y={labelCentroid[1]}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={10}
            stroke={data.svg.fill}
            fill={data.svg.fill}
          >
            {data.amount}%
          </SVGText>
        </G>
      );
    });
  };

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
        <TouchableOpacity 
          style={[styles.filterButton, selectedIndex === 1 && styles.selected]}
          onPress={() => setSelectedIndex(1)}
        >
          <Text style={styles.filterButtonText}>배출</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, selectedIndex === 2 && styles.selected]}
          onPress={() => setSelectedIndex(2)}
        >
          <Text style={styles.filterButtonText}>비용</Text>
        </TouchableOpacity>
      </View>

      <PieChart
        style={{ height: 200 }}
        valueAccessor={({ item }) => item.amount}
        data={data}
        spacing={0}
        outerRadius={'95%'}
      >
        <Labels />
      </PieChart>

      <View style={styles.legendContainer}>
        {data.map((item) => (
          <View key={item.key} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.svg.fill }]} />
            <Text style={styles.legendLabel}>{item.amount}% {item.label}</Text>
          </View>
        ))}
      </View>

      {/* 설정 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>설정</Text>
            {/* "유통기한" 클릭 시 AlarmSettingsScreen으로 이동 */}
            <TouchableOpacity onPress={() => {
              toggleModal(); // 모달 닫기
              setTimeout(() => {
                navigation.navigate('AlarmSettingsScreen'); // 화면 이동
              }, 300); // 모달 애니메이션 완료 후 화면 이동
            }}>
              <Text style={{ marginVertical: 10 }}>알림설정</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.closeButton}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginTop: -10,
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
    fontWeight: 'bold',
  },
  legendContainer: {
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColor: {
    width: 15,
    height: 15,
    marginRight: 10,
  },
  legendLabel: {
    fontSize: 16,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    color: 'red',
    marginTop: 20,
  },
});
