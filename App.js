import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FindInfo from './components/GettingStarted/FindInfo';
import GetConnected from './components/GettingStarted/GetConnected';
import LecturerRegisterInfo from './components/GettingStarted/LectuerRegisterInfo';
import StudentRegisterInfo from './components/GettingStarted/StudentRegisterInfo';
import Login from './components/SignInOptions/Login';
import LectuerRegistration from './components/SignInOptions/UserRegistration/LectuerRegistration';
import StudentRegistration from './components/SignInOptions/UserRegistration/StudentRegistration';
import Home from './components/Home/Home';
import MyNetwork from './components/MyNetwork/MyNetworkList';
import AddNetwork from './components/MyNetwork/SearchUsers';
import Map from './components/Map/AppMap';
import Location from './components/ToggleLocation/Location';
import Acassist from './components/AiChat/AiChat';
import ChatInterface from './components/Chatapp/ChatInterface';
import ChatList from './components/Chatapp/ChaltList';
import Settings from './components/Settings/SettingsScreen';
import AboutApp from './components/Settings/AboutApp';
import HelpCenter from './components/Settings/HelpCenter';
import SendFeedback from './components/Settings/SendFeedback';
import LanguageSettings from './components/Settings/LanguageSettings';
import PrivacySettings from './components/Settings/PrivacySettings';
import PersonalInfo from './components/Settings/PersonalInfo'
import PasswordSettings from './components/Settings/PasswordSettings'
import Notifications from './components/MyNetwork/Notifications'
import VideoCall from './components/Chatapp/VideoCall'
import VoiceCall from './components/Chatapp/VoiceCall'

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="FindInfo"
        screenOptions={{
          headerShown: false, // Show header
        }}>
        <Stack.Screen
          name="FindInfo"
          component={FindInfo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GetConnected"
          component={GetConnected}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LecturerRegisterInfo"
          component={LecturerRegisterInfo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentRegisterInfo"
          component={StudentRegisterInfo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LectuerRegistration"
          component={LectuerRegistration}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentRegistration"
          component={StudentRegistration}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyNetwork"
          component={MyNetwork}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddNetwork"
          component={AddNetwork}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Map"
          component={Map}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Location"
          component={Location}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Acassist"
          component={Acassist}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatInterface"
          component={ChatInterface}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatList"
          component={ChatList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AboutApp"
          component={AboutApp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HelpCenter"
          component={HelpCenter}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SendFeedback"
          component={SendFeedback}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LanguageSettings"
          component={LanguageSettings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PrivacySettings"
          component={PrivacySettings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PersonalInfo"
          component={PersonalInfo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PasswordSettings"
          component={PasswordSettings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoCall"
          component={VideoCall}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VoiceCall"
          component={VoiceCall}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
