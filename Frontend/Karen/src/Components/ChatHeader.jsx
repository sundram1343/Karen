import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

const ChatHeader = ({ onOpenDrawer }) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <TouchableOpacity style={styles.iconButton} onPress={onOpenDrawer} activeOpacity={0.7}>
          <Text style={styles.iconText}>☰</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>KAREN</Text>
          <View style={styles.statusContainer}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>ONLINE</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Text style={styles.iconText}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.8}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBc1cm2GIZ6IOnmdg9a2s_pOp2d-JgZE_OxdIEt7UfRRBJVc3EBmFxn8B3zkQIQHYVVWtMrHPSCKhdVYUasF18fRhL9JNGRL7-roFM51LLVJo23DhVaf6EoMeFXbKlmNdGsK-II64W52miBCfcKXOnWHQkp2g1JWfHRcnGBQHMoHVnnPt3Pd8tHvexV5rA_mfQ4zeZMRTRRSL8poo_IKUm3ZQj2uYHswSg8sj67ZuMCB7kKaXeZe6p',
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  header: {
    height: 64,
    backgroundColor: 'rgba(11, 19, 38, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 50,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#c7c4d7',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: '#c0c1ff',
    letterSpacing: -0.3,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4cd7f6',
    shadowColor: '#4cd7f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4cd7f6',
    letterSpacing: 1.2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(192, 193, 255, 0.3)',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});
