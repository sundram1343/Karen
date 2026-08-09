import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import ChatHeader from '../Components/ChatHeader';
import NavDrawer from '../Components/NavDrawer';
import MessageBubble from '../Components/MessageBubble';
import TypingIndicator from '../Components/TypingIndicator';
import SuggestionChips from '../Components/SuggestionChips';
import ChatInput from '../Components/ChatInput';

const INITIAL_MESSAGES = [
  {
    id: '1',
    sender: 'user',
    text: 'Can you explain how the new generative architecture in Lumina AI improves response latency for creative workflows?',
    time: '10:43 AM',
    status: 'Read 10:43 AM',
  },
  {
    id: '2',
    sender: 'ai',
    textBefore: 'The new architecture leverages ',
    highlightText: 'StreamFlow 2.0',
    textAfter: ', a proprietary inference optimization that prioritizes token-by-token generation through a distributed mesh network.',
    metrics: {
      latentDelay: '-42%',
      throughput: '+120%',
    },
    secondaryText: 'This effectively eliminates the "thinking" pause during complex prompts, providing a near-instant feedback loop for high-intensity creative tasks.',
    time: '10:44 AM',
  },
  {
    id: '3',
    sender: 'user',
    text: "That's impressive. How do I enable the Pro-level rendering for my current thread?",
    time: '10:45 AM',
    status: 'Sent 10:45 AM',
  },
];

const Home = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
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

    // Simulated Lumina AI response
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
          {/* Time Indicator Divider */}
          <View style={styles.timeDividerContainer}>
            <View style={styles.timeDividerBadge}>
              <Text style={styles.timeDividerText}>TODAY, 10:42 AM</Text>
            </View>
          </View>

          {/* Messages */}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* AI Typing Indicator */}
          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* Suggestion Chips */}
        <SuggestionChips onSelectChip={handleSelectChip} />

        {/* Chat Input Bar */}
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