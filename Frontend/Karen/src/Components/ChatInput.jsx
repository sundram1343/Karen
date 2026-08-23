import React,{useState,useEffect} from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import {
  start,
  stop,
  requestPermissions,
  isAvailable,
  addSpeechResultListener,
  addSpeechErrorListener,
  addSpeechEndListener,
}from '@dbkable/react-native-speech-to-text';
import {
  pick,
  types,
  keepLocalCopy,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker'
const ChatInput = ({ onSend }) => {
  const [usermessage,setusermessage]=useState('');
  const [listening,setListening]=useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasfile,sethasfile]=useState(false);
  const isSendDisabled = usermessage.trim() === ''&& !hasfile;
  useEffect(()=>{
    const resultListener = addSpeechResultListener((result) => {
      setusermessage(result.transcript);
    });
    const errorListener = addSpeechErrorListener((error) => {
      console.error('Speech error:', error);
      setListening(false);
    });
    const endListener = addSpeechEndListener(() => {
      setListening(false);
    });
    return () => {
      resultListener.remove();
      errorListener.remove();
      endListener.remove();
    };
  },[])
  const senddata=async()=>{
    onSend(usermessage,selectedFile);
    setusermessage('');
    setSelectedFile(null);
    sethasfile(false);
  }
  const handlestart= async()=>{
    try{
      const available=await isAvailable();
      if (!available) {
        alert('Speech recognition not available');
        return;
      }
      const isGranted = await requestPermissions();
      if (!isGranted) {
        console.log("Microphone permission denied");
        return;
      }
      await start({ language: 'en-US' });
      setListening(true);
    }catch(error){
      console.log(error);
    }
  }
  const handlestop = async () => {
    await stop();
    setListening(false);
    onSend();
    setusermessage('');
  };
   const pickDocument = async () => {
    try {
      const [file] = await pick({
        type: [types.allFiles],
        allowMultiSelection: false,
      });
      if (!file) {
        return;
      }
      const [localCopy] = await keepLocalCopy({
        files: [
          {
            uri: file.uri,
            fileName: file.name || 'document',
          },
        ],
        destination: 'cachesDirectory',
      });
      if (localCopy.status === 'error') {
        throw new Error('Could not copy the selected file');
      }
      const fileToUpload = {
        ...file,
        uri: localCopy.localUri,
        displayName: file.name || file.fileName || 'document',
      };
      setSelectedFile(fileToUpload);
      sethasfile(true);
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      ) {
        return;
      }
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Could not select the document.');
    }
  };
  return (
    <View style={styles.outerContainer}>
      <View style={[styles.inputContainer,hasfile&&styles.inputContainerWithFile]}>
        {hasfile && (
          <View style={styles.filePreview}>
            <Text>{selectedFile.name || selectedFile.fileName}</Text>
            <TouchableOpacity onPress={() => {setSelectedFile(null);sethasfile(false);}}>
              <Text>❌</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.actionBtn} onPress={pickDocument} activeOpacity={0.7}>
          <Text style={styles.actionIcon}>➕</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          value={usermessage}
          onChangeText={setusermessage}
          placeholder="Message Karen..."
          placeholderTextColor="rgba(144, 143, 160, 0.6)"
          multiline={true}
          maxHeight={100}
        />
        <TouchableOpacity onPress={listening?handlestop:handlestart} style={styles.actionBtn} activeOpacity={0.7}>
          <Text style={styles.actionIcon}>{listening? '⏹️':'🎙️'}</Text>
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
  inputContainerWithFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 42, 61, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 28,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 8,
  }
});
