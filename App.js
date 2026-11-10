import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Home';
import SelectVehicle from './Screens/SelectVehicle';
import AddPetrol from './Screens/AddPetrol';
import AddOilChange from './Screens/AddOilChange';
import History from './Screens/History';
const App = () => {
  const Stack = createNativeStackNavigator();
  const sos = {
    headerTintColor: '#FFFFFF',
    headerStyle: { backgroundColor: '#241536' },
    headerTitleStyle: { fontWeight: 'bold' },
  };
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={sos}>
        <Stack.Screen
          name="SelectVehicle"
          component={SelectVehicle}
          options={{ title: 'Select Vehicle' }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerTitleAlign: 'center', title: 'Trip Meter' }}
        />
        <Stack.Screen
          name="AddPetrol"
          component={AddPetrol}
          options={{ headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="AddOilChange"
          component={AddOilChange}
          options={{ headerTitleAlign: 'center', title: 'Add Oil Change' }}
        />
        <Stack.Screen
          name="History"
          component={History}
          options={{ headerTitleAlign: 'center', title: 'History' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
