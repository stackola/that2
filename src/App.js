import React from "react";
import { Text, View } from "react-native";
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import Home from "./screens/Home";
import Details from "./screens/Details";
import Chat from "./screens/Chat";
import Report from "./screens/Report";
import SignInScreen from "./screens/SignInScreen";
import MyPosts from "./screens/MyPosts";
import MyProfile from "./screens/MyProfile";
import Profile from "./screens/Profile";
import AuthLoadingScreen from "./screens/AuthLoadingScreen";

import { OverlayProvider } from "./components/overlay/";

import { Provider } from "react-redux";

import store from "That/src/redux/store";

class OtherScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Other!</Text>
      </View>
    );
  }
}

const AppStack = createStackNavigator(
  {
    Home: Home,
    Details: Details,
    Report: Report,
    MyProfile: MyProfile,
    Profile: Profile,
    MyPosts: MyPosts,
    Chat: Chat
    /*
  SingleComment: SingleComment,
  Events: Events,
  EditProfile: EditProfile,
  Group: Group,
  ImageView: ImageView,
  Profile: Profile,
  CreateGroup: CreateGroup,
  Messages: Messages,
  Message: Message,*/
  },
  { defaultNavigationOptions: { header: null } }
);
const AuthStack = createStackNavigator(
  { SignIn: SignInScreen },
  { defaultNavigationOptions: { header: null } }
);

let Navigator = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
export default class MainApp extends React.Component {
  render() {
    return (
      <OverlayProvider>
        <Provider store={store}>
          <Navigator />
        </Provider>
      </OverlayProvider>
    );
  }
}
