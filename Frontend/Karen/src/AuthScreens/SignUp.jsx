import { StyleSheet, Text, View,Dimensions, TextInput, Pressable } from 'react-native'
import React,{useState,useEffect} from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useNavigation } from '@react-navigation/native';
import { BACKEND_URI } from '../config/env';
import axios from 'axios';
const {width,height}=Dimensions.get('window');
const SignUp = () => {
    const navigation=useNavigation();
    const [isLoading,setIsLoading]=useState(false);
    const [Name,setisName]=useState('');
    const [Email,setisEmail]=useState('');
    const [Password,setisPassword]=useState('');
    const [ConfirmPassword,setisConfirmPassword]=useState('');
    const handleLogin=async()=>{
        if(Name.trim()===''||Email.trim()===''||Password.trim()===''||ConfirmPassword.trim()===''){
            alert("Please fill all the fields")
            return;
        }
        if(Password.length<8){
            alert("Password must be at least 8 characters long")
            return;
        }
        if(Password!=ConfirmPassword){
            alert("Passwords do not match")
            return;
        }
        setIsLoading(true);
        try{
            const res=await axios.post(`${BACKEND_URI}/auth/register`,{
                name:Name,
                email:Email,
                password:Password
            });
            const token=res.data.token;
            await AsyncStorage.setItem('authtoken',token);
            console.log("Backend URI:", BACKEND_URI);
            alert("User Created Successfully");
            setIsLoading(false);
            navigation.navigate('Home');
        }
        catch (error) {
            setIsLoading(false);
            if (error.response && error.response.data) {
                alert(error.response.data.message);
                console.log("Server error:", error.response);
            } else {
                alert("Network error or server not reachable");
                console.log("Axios error:", error.message);
            }
        }
    }
  return (
    <SafeAreaView style={styles.container}>
        {isLoading?(<View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#c0c1ff" />
        </View>):(
        <View style={styles.SignUpConatiner}>
            <Text style={styles.CreateText}>Create Account</Text>
            <Text style={styles.Label}>Name</Text>
            <TextInput
                style={styles.LabelInput}
                value={Name}
                onChangeText={setisName}
                placeholder='Enter the name'
            />
            <Text style={styles.Label}>Email</Text>
            <TextInput
                style={styles.LabelInput}
                value={Email}
                keyboardType='email'
                onChangeText={setisEmail}
                placeholder='Enter the Email'
            />
            <Text style={styles.Label}>Password</Text>
            <TextInput
                style={styles.LabelInput}
                value={Password}
                onChangeText={setisPassword}
                placeholder='Enter the Password'
            />
            <Text style={styles.Label}>Confirm Password</Text>
            <TextInput
                style={styles.LabelInput}
                value={ConfirmPassword}
                onChangeText={setisConfirmPassword}
                placeholder='Enter the Confirm Password'
            />
            <View style={styles.BouncyCheckboxContainer}>
                <BouncyCheckbox
                    size={20}
                    fillColor="#4f5875ff"
                    unfillColor="#fff"
                    iconStyle={{ borderColor: "#fff" }}
                />
                <Text style={styles.CheckboxText}>I agree to the terms and conditions</Text>
            </View>
            <Pressable style={styles.SignUpButton} onPress={handleLogin}>
                <Text style={styles.SignUpButtonText}>Sign Up</Text>
            </Pressable>
            <Pressable style={styles.AlreadyContainer} onPress={()=>navigation.navigate('Login')}>
                <Text style={styles.AlreadyText}>Already have an account?<Text style={styles.LoginText}>Login</Text></Text>
            </Pressable>
        </View>)}
    </SafeAreaView>
  )
}

export default SignUp

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#131a2e',
    },
    SignUpConatiner:{
        marginTop:height*0.1,
        height:'auto',
        width:width*0.89,
        marginHorizontal:'auto',
        backgroundColor:'#131c2f',
        borderRadius:20,
    },
    CreateText:{
        color:'#fff',
        fontSize:height*0.03,
        fontWeight:'bold',
        textAlign:'center',
        marginTop:height*0.02,
    },
    Label:{
        color:'#fff',
        fontSize:height*0.018,
        marginTop:height*0.02,
        marginLeft:height*0.01,
    },
    LabelInput:{
        borderWidth:1,
        borderColor:'#252f4aff',
        borderRadius:10,
        color:'#fff',
        marginTop:height*0.01,
        paddingHorizontal:width*0.05,
        paddingVertical:height*0.01,
        marginLeft:height*0.01,
        width:width*0.8,
    },
    BouncyCheckboxContainer:{
        flexDirection:'row',
        marginTop:height*0.01,
        marginLeft:height*0.01,
    },
    CheckboxText:{
        color:'#848bb0ff',
        fontSize:height*0.018,
    },
    SignUpButton:{
        backgroundColor:'#c0c1ff',
        marginTop:height*0.03,
        borderRadius:10,
        marginBottom:height*0.04,
        width:width*0.85,
        marginLeft:height*0.01,
    },
    SignUpButtonText:{
        color:'#000',
        fontSize:height*0.02,
        fontWeight:'bold',
        textAlign:'center',
        paddingVertical:height*0.01,
    },
    AlreadyText:{
        textAlign:'center',
        fontSize:height*0.02,
        color:'#b7a295',
    },
    LoginText:{
        fontWeight:'bold',
        marginBottom:height*0.05
    },
    AlreadyContainer:{
        marginBottom:height*0.05
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})