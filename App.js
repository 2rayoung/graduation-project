import React from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importing Screens (Ensure these paths are correct)
import AddFoodScreen from './container/AddFood';
import FoodDetailScreen from './container/FoodDetail';
import FoodListScreen from './container/FoodList';
import PrepMethodScreen from './container/PrepMethod';
import ReceiptInputScreen from './container/ReceiptInput';
import RecipeDetailScreen from './container/Recipes/RecipeDetailScreen';
import RecipeRecommendationScreen from './container/Recipes/RecipeRecommendation';
import RecommendedListScreen from './container/Recipes/RecommendedList';
import StatisticsScreen from './container/Statistics';
import StoreMethodScreen from './container/StoreMethod';
import SplashScreenComponent from './screens/SplashScreen';
import AlarmSettingsScreen from './container/AlarmSettingsScreen';
import RecipeSearchResultScreen from './container/Recipes/RecipeSearchResultScreen';
import CustomRecipeDetailScreen from './container/Recipes/CustomRecipeDetailScreen';
import RecipeByIngredientsScreen from './container/Recipes/RecipeByIngredientsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Food List Stack Navigator
function FoodListStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="FoodList" 
        component={FoodListScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('AlarmSettingsScreen')}>
              <Image
                source={require('./assets/settings-icon.png')}  // Ensure this image exists
                style={{ width: 24, height: 24, marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
          title: 'Food List',  // 상단에 Food List 제목 표시
          headerTitleAlign: 'center',  // 제목을 중앙 정렬
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
      />
      <Stack.Screen 
        name="AlarmSettingsScreen" 
        component={AlarmSettingsScreen} 
        options={{ title: '알림 설정' }} 
      />
    </Stack.Navigator>
  );
}

// Recipe Recommendation Stack Navigator
function RecipeRecommendationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="RecipeRecommendation" 
        component={RecipeRecommendationScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('AlarmSettingsScreen')}>
              <Image
                source={require('./assets/settings-icon.png')}  // Ensure this image exists
                style={{ width: 24, height: 24, marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="RecommendedList" component={RecommendedListScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      <Stack.Screen name="RecipeByIngredients" component={RecipeByIngredientsScreen} />
      <Stack.Screen name="SearchResults" component={RecipeSearchResultScreen} />
      <Stack.Screen 
        name="CustomRecipeDetailScreen" component={CustomRecipeDetailScreen} 
        />
      <Stack.Screen 
        name="AlarmSettingsScreen" 
        component={AlarmSettingsScreen} 
        options={{ title: '알림 설정' }} 
      />
    </Stack.Navigator>
  );
}

// Statistics Stack Navigator
function StatisticsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Statistics" 
        component={StatisticsScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('AlarmSettingsScreen')}>
              <Image
                source={require('./assets/settings-icon.png')}  // Ensure this image exists
                style={{ width: 24, height: 24, marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="AlarmSettingsScreen" 
        component={AlarmSettingsScreen} 
        options={{ title: '알림 설정' }} 
      />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator for main tabs
function MainTabs() {
  return (
    <Tab.Navigator>
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

// Main App Component
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
