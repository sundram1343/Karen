import React,{useState} from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BACKEND_URI } from '@env';
const NavDrawer = ({ visible, onClose, onSelectNewChat, onSelectRecentTheread }) => {
  const [chat,setchat]=useState([]);
  const [showchats,setshowchats]=useState(false);
  const ChatRetreival=async()=>{
    try{
      const token=await AsyncStorage.getItem("authtoken");
      const res = await axios.get(BACKEND_URI+`/message/chats`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      setchat(res.data.chats);
    }catch(error){
      console.log("Error in retrieval",error);
    }
  }
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.drawerContainer}>
          <View style={styles.profileHeader}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrzIda6cn7300BgT3MHj3I7fmjqf5QhIBtMlpgMELJ1OEhhxsQVxHU5aIyC9w9zEerm3huVx7KLvT5W2KDm0MbMn26y_1z1qrvpBL64O8jWuNp_r_6fC2C4qJLMc0bjhEBHxx28JqfgrZ9htEnogSMZWrNd21eJ3YFB38FtFUENkZOLa1-sBx7MNJ0PZxUsj_l1ISWVUamduPAp5U5NIrWz2BQMeNC9vIhHOJnwx3KG-kUg_57NKki',
              }}
              style={styles.logoImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>KAREN</Text>
              <Text style={styles.userRole}>Creative User • Pro</Text>
            </View>
          </View>

          <View style={styles.navMenu}>
            <TouchableOpacity
              style={[styles.menuItem, styles.activeMenuItem]}
              onPress={() => {
                onSelectNewChat?.();
                onClose();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.menuIcon}>💬</Text>
              <Text style={styles.activeMenuText}>New Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {
    setshowchats(!showchats);
    if (!showchats) {
      ChatRetreival();
    }}} activeOpacity={0.7}>
              <Text style={styles.menuIcon}>🕒</Text>
              <Text style={styles.menuText}>Recent Threads</Text>
            </TouchableOpacity>
            <View style={styles.chatList}>
              {showchats&&chat.map((chat) => (
                <TouchableOpacity
                  key={chat._id}
                  style={styles.chatItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelectRecentTheread?.(chat._id);
                    onClose();
                  }}
                >
                  <Text style={styles.chatName}>
                    {chat.name || "New Chat"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuIcon}>🔖</Text>
              <Text style={styles.menuText}>Saved Prompts</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuIcon}>⚙️</Text>
              <Text style={styles.menuText}>Account Settings</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>LUMINA INTELLIGENCE V1.0.2</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NavDrawer;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  drawerContainer: {
    width: 290,
    backgroundColor: '#171f33',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 32,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 32,
    marginTop: 10,
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(192, 193, 255, 0.3)',
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#c0c1ff',
  },
  userRole: {
    fontSize: 12,
    color: '#908fa0',
    marginTop: 2,
  },
  navMenu: {
    flex: 1,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  activeMenuItem: {
    backgroundColor: '#6f00be',
  },
  menuIcon: {
    fontSize: 18,
  },
  menuText: {
    fontSize: 15,
    color: '#c7c4d7',
    fontWeight: '500',
  },
  activeMenuText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#908fa0',
    letterSpacing: 1,
    fontWeight: '600',
  },
  chatItem: {
  paddingVertical: 10,
  paddingHorizontal: 50,
  borderRadius: 8,
},

chatName: {
  fontSize: 14,
  color: '#c7c4d7',
},
});
