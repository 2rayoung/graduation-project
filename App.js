import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Image } from 'react-native';

import AddFoodScreen from './container/AddFood';
import FoodDetailScreen from './container/FoodDetail';
import FoodListScreen from './container/FoodList';
import HeaderRightIcon from './container/HeaderRightIcon'; // HeaderRightIcon import qilingan
import MaterialManagementScreen from './container/MaterialManagement';
import PrepMethodScreen from './container/PrepMethod';
import ReceiptInputScreen from './container/ReceiptInput';
import RecipeDetailScreen from './container/RecipeDetailScreen'; // RecipeDetailScreen import qilindi
import RecipeRecommendationScreen from './container/RecipeRecommendation';
import RecommendedListScreen from './container/RecommendedList';
import StatisticsScreen from './container/Statistics';
import StoreMethodScreen from './container/StoreMethod';
import SplashScreenComponent from './screens/SplashScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function FoodListStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#F5F5F5' }, // 헤더 배경색
        headerTintColor: '#000000', // 헤더 텍스트 색상
        headerTitleStyle: { fontWeight: 'bold' }, // 헤더 텍스트 스타일
      }}
    >
      <Stack.Screen 
        name="FoodList" 
        component={FoodListScreen}
        options={({ navigation }) => ({
          headerRight: () => <HeaderRightIcon navigation={navigation} />, // HeaderRightIcon qo'shildi
        })}
      />
      <Stack.Screen 
        name="FoodDetail" 
        component={FoodDetailScreen} 
      />
      <Stack.Screen 
        name="AddFood" 
        component={AddFoodScreen} 
      />
      <Stack.Screen 
        name="PrepMethod" 
        component={PrepMethodScreen} 
      />
      <Stack.Screen 
        name="StoreMethod" 
        component={StoreMethodScreen} 
      />
      <Stack.Screen 
        name="ReceiptInput" 
        component={ReceiptInputScreen} 
      />
      <Stack.Screen 
        name="MaterialManagement" 
        component={MaterialManagementScreen} 
      />

      <Stack.Screen 
        name="RecipeDetail" // Bu yerda RecipeDetail qo'shildi
        component={RecipeDetailScreen} 
        options={({ navigation }) => ({
          headerRight: () => <HeaderRightIcon navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}

function RecipeRecommendationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#F5F5F5' }, // 헤더 배경색
        headerTintColor: '#000000', // 헤더 텍스트 색상
        headerTitleStyle: { fontWeight: 'bold' }, // 헤더 텍스트 스타일
      }}
    >
      <Stack.Screen 
        name="RecipeRecommendation" 
        component={RecipeRecommendationScreen}
      />
      <Stack.Screen 
        name="RecommendedList" 
        component={RecommendedListScreen} 
      />
      <Stack.Screen 
        name="MaterialManagement" 
        component={MaterialManagementScreen} 
      />
      <Stack.Screen 
        name="RecipeDetail" // Bu yerda RecipeDetail qo'shildi
        component={RecipeDetailScreen} 
      />
    </Stack.Navigator>
  );
}

function StatisticsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#F5F5F5' }, // 헤더 배경색
        headerTintColor: '#000000', // 헤더 텍스트 색상
        headerTitleStyle: { fontWeight: 'bold' }, // 헤더 텍스트 스타일
      }}
    >
      <Stack.Screen 
        name="Statistics" 
        component={StatisticsScreen} 
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
      tabBarActiveTintColor: '#000000',   // 선택된 탭의 아이콘 및 텍스트 색상
      tabBarInactiveTintColor: 'lightgray', // 비활성화된 탭의 아이콘 및 텍스트 색상
  }}
>
      <Tab.Screen 
        name="FoodListStack" 
        component={FoodListStack} 
        options={{
          tabBarIcon: ({ size }) => (
            <Image source={require('./assets/menu4.png')} style={{ width: size, height: size }} />
          ),
          tabBarLabel: 'Food List',
          headerShown: false,
        }} 
      />
      <Tab.Screen 
        name="RecipeRecommendationStack" 
        component={RecipeRecommendationStack} 
        options={{
          tabBarIcon: ({ size }) => (
            <Image source={require('./assets/food.png')} style={{ width: size, height: size }} />
          ),
          tabBarLabel: 'Recipes',
          headerShown: false,
        }} 
      />
      <Tab.Screen 
        name="StatisticsStack" 
        component={StatisticsStack} 
        options={{
          tabBarIcon: ({ size }) => (
            <Image source={require('./assets/pie-chart.png')} style={{ width: size, height: size }} />
          ),
          tabBarLabel: 'Statistics',
          headerShown: false,
        }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen 
          name="Splash" 
          component={SplashScreenComponent} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabs} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
