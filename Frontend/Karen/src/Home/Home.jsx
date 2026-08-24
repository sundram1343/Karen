import React, { useState, useRef, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import ChatHeader from '../Components/ChatHeader';
import NavDrawer from '../Components/NavDrawer';
import MessageBubble from '../Components/MessageBubble';
import TypingIndicator from '../Components/TypingIndicator';
import ChatInput from '../Components/ChatInput';
import axios from 'axios';
import { AuthContext } from '../App';
import { BACKEND_URI } from '@env';
const Home = () => {
  const [message, setmessage] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [chatid, setchatid] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const scrollViewRef = useRef(null);
  const { token } = useContext(AuthContext);
  const handleSend = async (msg, file) => {
    if ((!msg || !msg.trim()) && !file) return;
    try {
      setIsTyping(true);
      const userMsg = {
        id: Date.now().toString(),
        sender: 'user',
        text: msg || '',
        file: file ? { filename: file.name || file.fileName || 'document' } : null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setmessage((prev) => [...prev, userMsg]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      let res;
      if (file) {
        const formData = new FormData();
        formData.append('usermessage', msg || '');
        if (chatid) {
          formData.append('chatid', chatid);
        }
        formData.append('file', {
          uri: file.uri,
          type: file.type || 'application/octet-stream',
          name: file.name || file.fileName || 'document',
        });
        res = await axios.post(BACKEND_URI + `/message/send`, formData, {
          headers: {
            Authorization: "Bearer " + token,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        res = await axios.post(BACKEND_URI + `/message/send`, {
          usermessage: msg || '',
          chatid,
        }, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
      }

      setchatid(res.data.chatid);
      const aiMsg = {
        id: res.data.newAImessage._id,
        sender: 'Karen',
        text: res.data.newAImessage.content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setmessage((prev) => [...prev, aiMsg]);
    }
    catch (error) {
      console.log("Error sending message:", error);
    }
    finally {
      setIsTyping(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };
  const handleRecentThread = async (id) => {
    setchatid(id);
    try {
      const res = await axios.get(BACKEND_URI + `/message/chat/${id}`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      const formattedMessages = res.data.messages.map((msg) => ({
        id: msg._id,
        sender: msg.sender,
        text: msg.content,
        file: msg.file,
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setmessage(formattedMessages);
    }
    catch(error){
      console.log("Error in retrieval",error);
    }
  }
  const handleNewChat = () => {
    setmessage([]);
    setchatid(null);
    setIsTyping(false);
    setSelectedFile(null);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader onOpenDrawer={() => setDrawerVisible(true)} />
      <NavDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSelectNewChat={handleNewChat}
        onSelectRecentTheread={handleRecentThread}
      />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroller}
          contentContainerStyle={styles.chatScrollerContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {message.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
        </ScrollView>
        <ChatInput
          onSend={handleSend}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1326',
  },
  keyboardContainer: {
    flex: 1,
  },
  chatScroller: {
    flex: 1,
  },
  chatScrollerContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  timeDividerContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  timeDividerBadge: {
    backgroundColor: 'rgba(19, 27, 46, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  timeDividerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#908fa0',
    letterSpacing: 0.5,
  },
});