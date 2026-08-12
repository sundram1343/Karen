import React,{useState} from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { BACKEND_URI } from '@env';
import axios from 'axios';
const ChatInput = ({ text, onChangeText, onSend }) => {
  const isSendDisabled = text.trim() === '';
  const [usermessage,setusermessage]=useState('');
  const [chatid,setchatid]=useState('');
  const [aimessage,setaimessage]=useState('');
  const senddata=async()=>{
      try{
        const res= await axios.post(BACKEND_URI+'/message/send',{
          usermessage,
          chatid,
        }
        ,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })
        setaimessage(res.data.message);
      }
      catch(err){
        console.log(err);
      }
  }
  return (
    <View style={styles.outerContainer}>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Text style={styles.actionIcon}>➕</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={onChangeText}
          placeholder="Message Karen..."
          placeholderTextColor="rgba(144, 143, 160, 0.6)"
          multiline={true}
          maxHeight={100}
        />

        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Text style={styles.actionIcon}>🎙️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sendBtn, isSendDisabled && styles.sendBtnDisabled]}
          onPress={senddata}
          disabled={isSendDisabled}
          activeOpacity={0.8}
        >
          <Text style={styles.sendIcon}>➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: 'rgba(11, 19, 38, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 42, 61, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 28,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
    color: '#908fa0',
  },
  textInput: {
    flex: 1,
    color: '#dae2fd',
    fontSize: 15,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6f00be',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8083ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  sendBtnDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
  },
  sendIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
