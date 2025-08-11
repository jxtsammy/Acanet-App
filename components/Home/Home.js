import { View, Text, StyleSheet } from "react-native"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import Icon from "react-native-vector-icons/MaterialIcons"

import ChatList from "../Chatapp/ChaltList"
import MapScreen from "../Map/AppMap"
import MyNetwork from "../MyNetwork/MyNetworkList"
import Settings from "../Settings/SettingsScreen"

const Tab = createMaterialTopTabNavigator()

const BottomNavigation = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        headerShown: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#666",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "500",
          marginTop: 3,
        },
        tabBarIndicatorStyle: {
          backgroundColor: "transparent", // Hide the default indicator
        },
        tabBarPressColor: "transparent", // Remove press ripple effect
        swipeEnabled: true, // Enable swipe gestures
        animationEnabled: true, // Enable smooth animations
      }}
      tabBarPosition="bottom" // Position tabs at bottom
      initialRouteName="Chats"
    >
      <Tab.Screen
        name="Chats"
        component={ChatList}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <Icon name="chat-bubble" size={30} color={color} />
            
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Discover"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <Icon name="place" size={30} color={color} />
              
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Network"
        component={MyNetwork}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <Icon name="people" size={30} color={color} />
          
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <Icon name="settings" size={30} color={color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#000",
    height: 85,
    borderTopWidth: 0,
    elevation: 0,
    paddingTop: 10,
    paddingBottom: 5
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
})

export default BottomNavigation