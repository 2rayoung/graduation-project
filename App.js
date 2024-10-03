import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

import AddFoodScreen from './container/AddFood';
import FoodDetailScreen from './container/FoodDetail';
import FoodListScreen from './container/FoodList';
import HeaderRightIcon from './container/HeaderRightIcon'; 
import PrepMethodScreen from './container/PrepMethod';
import ReceiptInputScreen from './container/ReceiptInput';
import RecipeDetailScreen from './container/RecipeDetailScreen';
import RecipeRecommendationScreen from './container/RecipeRecommendation';
import RecommendedListScreen from './container/RecommendedList';
import StatisticsScreen from './container/Statistics';
import StoreMethodScreen from './container/StoreMethod';
import SplashScreenComponent from './screens/SplashScreen';
import AlarmSettingsScreen from './container/AlarmSettingsScreen'; // 알림 설정 화면 추가
import SelectedIngredientsScreen from './container/SelectedIngredients'; // 선택된 재료 화면 추가

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function FoodListStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#F5F5F5' }, 
        headerTintColor: '#000000', 
        headerTitleStyle: { fontWeight: 'bold' }, 
      }}
    >
      <Stack.Screen 
        name="FoodList" 
        component={FoodListScreen}
        options={({ navigation }) => ({
          headerRight: () => <HeaderRightIcon navigation={navigation} />, 
        })}
      />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
      <Stack.Screen name="AddFood" component={AddFoodScreen} />
      <Stack.Screen name="PrepMethod" component={PrepMethodScreen} />
      <Stack.Screen name="StoreMethod" component={StoreMethodScreen} />
      <Stack.Screen name="ReceiptInput" component={ReceiptInputScreen} />

      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetailScreen}
        options={({ navigation }) => ({
          headerRight: () => <HeaderRightIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen 
        name="SelectedIngredients" 
        component={SelectedIngredientsScreen} 
        options={{ title: '선택된 재료' }}  // 선택된 재료 화면 추가
      />
    </Stack.Navigator>
  );
}

function RecipeRecommendationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#F5F5F5' }, 
        headerTintColor: '#000000', 
        headerTitleStyle: { fontWeight: 'bold' }, 
      }}
    >
      <Stack.Screen name="RecipeRecommendation" component={RecipeRecommendationScreen} />
      <Stack.Screen name="RecommendedList" component={RecommendedListScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}

function StatisticsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#F5F5F5' }, 
        headerTintColor: '#000000', 
        headerTitleStyle: { fontWeight: 'bold' }, 
      }}
    >
      <Stack.Screen 
        name="Statistics" 
        component={StatisticsScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('AlarmSettingsScreen')}>
              <Image
                source={require('./assets/settings-icon.png')} 
                style={{ width: 24, height: 24, marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="AlarmSettingsScreen" 
        component={AlarmSettingsScreen} 
        options={{ title: '알림 설정' }}  // 알림 설정 스크린 추가
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#000000',   
        tabBarInactiveTintColor: 'lightgray', 
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
