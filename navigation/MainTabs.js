import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Image } from 'react-native';
import FoodListScreen from '../container/FoodList';
import RecipeRecommendationScreen from '../container/Recips/RecipeRecommendation';
import StatisticsScreen from '../container/Statistics';
import AlarmSettingsScreen from '../container/AlarmSettings'; // AlarmSettingsScreen 가져오기

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 스택 내비게이터로 FoodList 화면 관리
function FoodListStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FoodList" component={FoodListScreen} /> {/* 유효한 JSX 반환하는 컴포넌트 */}
    </Stack.Navigator>
  );
}

// 스택 내비게이터로 RecipeRecommendation 화면 관리
function RecipeRecommendationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RecipeRecommendation" component={RecipeRecommendationScreen} /> {/* 유효한 JSX 반환하는 컴포넌트 */}
    </Stack.Navigator>
  );
}

// 스택 내비게이터로 Statistics 화면 관리
function StatisticsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Statistics" component={StatisticsScreen} /> {/* 유효한 JSX 반환하는 컴포넌트 */}
    </Stack.Navigator>
  );
}

// 스택 내비게이터로 AlarmSettings 화면 관리
function AlarmSettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AlarmSettings" component={AlarmSettingsScreen} /> {/* AlarmSettingsScreen 추가 */}
    </Stack.Navigator>
  );
}

// 하단 탭 내비게이터 설정
export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="FoodList" 
        component={FoodListStack} 
        options={{
          tabBarIcon: ({ size }) => (
            <Image source={require('../assets/menu4.png')} style={{ width: size, height: size }} />
          ),
        }} 
      />
      <Tab.Screen 
        name="RecipeRecommendation" 
        component={RecipeRecommendationStack} 
        options={{
          tabBarIcon: ({ size }) => (
            <Image source={require('../assets/food.png')} style={{ width: size, height: size }} />
          ),
        }} 
      />
      <Tab.Screen 
        name="StatisticsStack"  // 수정: 'StatisticsStack' 네비게이터로 이동
        component={StatisticsStack} 
        options={{
          tabBarIcon: ({ size }) => (
            <Image source={require('../assets/pie-chart.png')} style={{ width: size, height: size }} />
          ),
        }} 
      />
      <Tab.Screen 
        name="AlarmSettings" // AlarmSettings 탭 추가
        component={AlarmSettingsStack} 
        options={{
          tabBarIcon: ({ size }) => (
            <Image source={require('../assets/alarm.png')} style={{ width: size, height: size }} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
}
