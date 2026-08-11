import { StyleSheet, Text, View,Image,Dimensions,TextInput,Pressable } from 'react-native'
import React,{useState,useContext} from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import LoginScreenLogo from '../assets/LoginScreen.png'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BACKEND_URI } from '@env'
import { AuthContext } from '../App'
const {width,height}=Dimensions.get('window');
const Login = () => {
    const navigation=useNavigation();
    const {setistoken}=useContext(AuthContext);
    const [email,setemail]=useState('');
    const [password,setpassword]=useState('');
    const handle=async ()=>{
        if(email.trim()===''||password.trim()===''){
            alert('Need all fields to be filled');
            return;
        }
        try{
            console.log('Sending request to:', BACKEND_URI+'/auth/login');
            const res= await axios.post(BACKEND_URI+'/auth/login',{
                email:email,
                password:password
            });
            const token=res.data.token;
            await AsyncStorage.setItem('authtoken',token);
            setistoken(token);
        }
        catch(error){
            console.log('Error in login:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Network error or server not reachable');
            }
        }
    }
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.LogoConatiner}>
            <Image source={LoginScreenLogo} style={styles.logo} alt='Logo'/>
        </View>
        <Text style={styles.WelcomeText}>Welcome Back</Text>
        <View style={styles.LoginContainer}>
        <Text style={styles.Label}>Email Address</Text>
        <TextInput
            style={styles.LabelInput}
            value={email}
            onChangeText={setemail}
            placeholder='Enter the email'
        />
        <Text style={styles.Label}>Password</Text>
        <TextInput
            style={styles.LabelInput}
            value={password}
            onChangeText={setpassword}
            placeholder='Enter the password'
            secureTextEntry={true}
        />
        <Text style={styles.ForgotPassword}>Forgot Password</Text>
        <Pressable style={styles.LoginButton} onPress={handle}>
            <Text style={styles.LoginButtonText}>Login In</Text>
        </Pressable>
        </View>
        <Pressable style={styles.NewTextContainer} onPress={()=>navigation.navigate('SignUp')}>
            <Text style={styles.NewText}>New here?<Text style={styles.CreateText}>Create Account</Text></Text>
        </Pressable>
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#0b1325',
    },
    LogoConatiner:{
        alignItems:'center',
        marginTop:height*0.04,
    },
    logo:{
        height:height*0.08,
        width:width*0.16,
        borderRadius:20,
    },
    WelcomeText:{
        fontSize:height*0.03,
        fontWeight:'bold',
        color:'#fff',
        textAlign:'center',
        marginTop:height*0.02,
    },
    LoginContainer:{
        marginTop:height*0.1,
        paddingHorizontal:width*0.05,
        backgroundColor:'#131c2f',
        height:'auto',
        width:width*0.89,
        borderRadius:20,
        marginHorizontal:'auto'
    },
    Label:{
        color:'#fff',
        fontSize:height*0.018,
        marginTop:height*0.02,
        marginLeft:height*0.01
    },
    LabelInput:{
        borderWidth:1,
        borderColor:'#252f4aff',
        borderRadius:10,
        color:'#fff',
        marginTop:height*0.01,
        paddingHorizontal:width*0.05,
        paddingVertical:height*0.01,
    },
    ForgotPassword:{
        color:'#fff',
        fontSize:height*0.018,
        marginTop:height*0.02,
        marginLeft:height*0.01,
        textAlign:'right',
    },
    LoginButton:{
        backgroundColor:'#c0c1ff',
        marginTop:height*0.03,
        borderRadius:10,
        marginBottom:height*0.04
    },
    LoginButtonText:{
        color:'#000',
        fontSize:height*0.02,
        fontWeight:'bold',
        textAlign:'center',
        paddingVertical:height*0.01,
    },
    NewText:{
        textAlign:'center',
        marginTop:height*0.02,
        fontSize:height*0.02,
        color:'#b7a295',
    },
    CreateText:{
        fontWeight:'bold'
    }
})