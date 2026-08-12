import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import ChatHeader from '../Components/ChatHeader';
import NavDrawer from '../Components/NavDrawer';
import MessageBubble from '../Components/MessageBubble';
import TypingIndicator from '../Components/TypingIndicator';
import SuggestionChips from '../Components/SuggestionChips';
import ChatInput from '../Components/ChatInput';
const Home = () => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const handleSend = (overrideText) => {
    const textToSend = overrideText || inputText;
    if (!textToSend.trim()) return;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newUserMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: currentTime,
      status: `Sent ${currentTime}`,
    };
    setMessages((prev) => [...prev, newUserMsg]);
    if (!overrideText) setInputText('');
    setIsTyping(true);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    setTimeout(() => {
      const newAiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Pro-level rendering is now active for this thread. Model throughput optimized for maximum fidelity and high-intensity outputs.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newAiMsg]);
      setIsTyping(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1400);
  };
  const handleSelectChip = (chipText) => {
    setInputText(`How do I ${chipText.toLowerCase()} using Lumina AI?`);
  };
  const handleNewChat = () => {
    setMessages([]);
    setIsTyping(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader onOpenDrawer={() => setDrawerVisible(true)} />

      <NavDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSelectNewChat={handleNewChat}
      />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroller}
          contentContainerStyle={styles.chatScrollerContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {isTyping && <TypingIndicator />}
        </ScrollView>
        <SuggestionChips onSelectChip={handleSelectChip} />
        <ChatInput
          text={inputText}
          onChangeText={setInputText}
          onSend={() => handleSend()}
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