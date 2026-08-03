import { StyleSheet, Text, View } from 'react-native'
import React,{useState,useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './AuthScreens/Login'
import SignUp from './AuthScreens/SignUp'
const Stack = createStackNavigator();
const App = () => {
  const [token,setistoken]=useState(null);
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

  const AuthStack=()=>{
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='SignUp' component={SignUp} />
      </Stack.Navigator>
    )
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1}}>
        <NavigationContainer>
          {!token?<AuthStack/>:<AppStack/>}
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default App

const styles = StyleSheet.create({})