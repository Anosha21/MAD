import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import all screens
import HomeScreen from '../screens/HomeScreen';
import WinterScreen from '../screens/WinterScreen';
import SummerScreen from '../screens/SummerScreen';
import PerfumesScreen from '../screens/PerfumesScreen';
import SaleScreen from '../screens/SaleScreen';
import WinterPretScreen from '../screens/WinterPretScreen';
import WinterUnstitchedScreen from '../screens/WinterUnstitchedScreen';
import SummerPretScreen from '../screens/SummerPretScreen';
import SummerUnstitchedScreen from '../screens/SummerUnstitchedScreen';
import MenPerfumesScreen from '../screens/MenPerfumesScreen';
import WomenPerfumesScreen from '../screens/WomenPerfumesScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: true,
          headerBackTitle: '',        // 👈 hide back text completely
          headerBackTitleVisible: false, // 👈 ensure no previous title shows
          headerStyle: {
            backgroundColor: '#FFFFFF',
            elevation: 2,
            shadowColor: '#6B21A8',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          headerTintColor: '#6B21A8',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
          cardStyle: { 
            flex: 1,
            backgroundColor: '#F8FAFC'
          }
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Winter" 
          component={WinterScreen} 
          options={{ title: 'Winter Collection' }}
        />
        <Stack.Screen 
          name="Summer" 
          component={SummerScreen} 
          options={{ title: 'Summer Collection' }}
        />
        <Stack.Screen 
          name="Perfumes" 
          component={PerfumesScreen} 
          options={{ title: 'Perfumes' }}
        />
        <Stack.Screen 
          name="Sale" 
          component={SaleScreen} 
          options={{ title: 'Sale' }}
        />
        <Stack.Screen 
          name="WinterPret" 
          component={WinterPretScreen} 
          options={{
            title: 'Winter Pret',
            headerBackTitle: '',       // 👈 this line ensures no “Winter Collection”
          }}
        />
        <Stack.Screen 
          name="WinterUnstitched" 
          component={WinterUnstitchedScreen} 
          options={{
            title: 'Winter Fabrics',
            headerBackTitle: '',
          }}
        />
        <Stack.Screen 
          name="SummerPret" 
          component={SummerPretScreen} 
          options={{
            title: 'Summer Pret',
            headerBackTitle: '',
          }}
        />
        <Stack.Screen 
          name="SummerUnstitched" 
          component={SummerUnstitchedScreen} 
          options={{
            title: 'Summer Fabrics',
            headerBackTitle: '',
          }}
        />
        <Stack.Screen 
          name="MenPerfumes" 
          component={MenPerfumesScreen} 
          options={{
            title: 'Men Perfumes',
            headerBackTitle: '',
          }}
        />
        <Stack.Screen 
          name="WomenPerfumes" 
          component={WomenPerfumesScreen} 
          options={{
            title: 'Women Perfumes',
            headerBackTitle: '',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;



