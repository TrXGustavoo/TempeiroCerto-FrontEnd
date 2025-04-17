import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import NovaReceita from '../screens/NovaReceita';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import EditarRecipeScreen from '../screens/EditarRecipeScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="NovaReceita" component={NovaReceita} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>   
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="EditarRecipe" component={EditarRecipeScreen} options={{ headerShown: false }}/>
        
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
