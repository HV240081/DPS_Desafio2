import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreens';
import DetailScreen from './screens/DetailScreens';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Platillos típicos' }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Detalles' }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
