import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Image } from 'react-native';
import FoodListScreen from '../container/FoodList';
import RecipeRecommendationScreen from '../container/RecipeRecommendation';
import StatisticsScreen from '../container/Statistics';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function FoodListStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FoodList" component={FoodListScreen} />
    </Stack.Navigator>
  );
}

function RecipeRecommendationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RecipeRecommendation" component={RecipeRecommendationScreen} />
    </Stack.Navigator>
  );
}

function StatisticsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Statistics" component={StatisticsScreen} />
    </Stack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="FoodList" 
        component={FoodListStack} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../assets/menu4.png')} style={{ width: size, height: size }} />
          ),
        }} 
      />
      <Tab.Screen 
        name="RecipeRecommendation" 
        component={RecipeRecommendationStack} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../assets/food.png')} style={{ width: size, height: size }} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Statistics" 
        component={StatisticsStack} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../assets/pie-chart.png')} style={{ width: size, height: size }} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
}
