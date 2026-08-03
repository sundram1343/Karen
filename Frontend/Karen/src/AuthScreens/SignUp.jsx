import { StyleSheet, Text, View,Dimensions } from 'react-native'
import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
const {width,height}=Dimensions.get('window');
const SignUp = () => {
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.SignUpConatiner}>
            <Text style={styles.CreateText}>Create Account</Text>
        </View>
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
        alignItems:'center',
        height:'auto',
        width:width*0.89,
        marginHorizontal:'auto'
    },
    CreateText:{
        color:'#fff',
        fontSize:height*0.03,
        fontWeight:'bold',
        textAlign:'center',
        marginTop:height*0.02,
    }
})