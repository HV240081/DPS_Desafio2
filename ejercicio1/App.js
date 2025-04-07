import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PantallaInicio from './pantallas/Inicio';
import PantallaAgregarCita from './pantallas/PantallaAgregarCita';
import PantallaEditarCita from './pantallas/PantallaEditarCita';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen name="Inicio" component={PantallaInicio} />
        <Stack.Screen name="PantallaAgregarCita" component={PantallaAgregarCita} />
        <Stack.Screen name="PantallaEditarCita" component={PantallaEditarCita} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
