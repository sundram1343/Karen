import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './AuthScreens/Login';
import SignUp from './AuthScreens/SignUp';
import Home from './Home/Home';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="SignUp" component={SignUp} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={Home} />
  </Stack.Navigator>
);

const App = () => {
  const [token, setistoken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const value = await AsyncStorage.getItem('token');
        if (value) {
          setistoken(value);
        }
      } catch (err) {
        console.error('Error reading token', err);
      }
    };
    getToken();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.flexContainer}>
        <NavigationContainer>
          {!token ? <AuthStack /> : <AppStack />}
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: '#0b1326',
  },
});