import React, { useState, useEffect, createContext } from 'react';
import { StyleSheet ,NativeModules,Button,View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './AuthScreens/Login';
import SignUp from './AuthScreens/SignUp';
import Home from './Home/Home';
//const { DeviceAutomation,AppLauncher } = NativeModules;
const Stack = createStackNavigator();
export const AuthContext = createContext();
  
/*const AuthStack = () => (
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
*/
const App = () => {
 const testType = () => {
    /*try{
    DeviceAutomation.typeWhenAppOpens(
      "com.android.chrome",
      "Search Google or type URL",
      "React Native tutorials"
    );

    setTimeout(() => {
      AppLauncher.openApp("Chrome");
    }, 300);
    }catch(err){
      console.log(err);
    }
    setTimeout(()=>{
      DeviceAutomation.pressEnter();
    },500);
    */
  };
  /*const [token, setistoken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const value = await AsyncStorage.getItem('authtoken');
        if (value) {
          setistoken(value);
        }
      } catch (err) {
        console.error('Error reading token', err);
      }
    };
    getToken();
  }, []);*/

  return (
    /*<AuthContext.Provider value={{ token, setistoken }}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.flexContainer}>
          <NavigationContainer>
            {!token ? <AuthStack /> : <AppStack />}
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthContext.Provider>*/
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Button
        title="Test Karen Click"
        onPress={testType}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: '#0b1326',
  },
});