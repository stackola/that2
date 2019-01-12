import React, { Component } from "react";
import {
  Text,
  View,
  UIManager,
  Platform,
  TouchableOpacity,
  LayoutAnimation,
  StatusBar
} from "react-native";
import firebase from "react-native-firebase";

import colors from "That/src/colors";
import { getColor, getUser, getDoc } from "That/src/lib";
export default class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { username: "" };
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        var user = getUser();
        getDoc("users/" + user.uid).then(snap => {
          console.log("got user snap", snap);
          if (snap.exists) {
            ///user has account.
            this.props.navigation.navigate("App");
          } else {
            ///user has no account;
            this.props.navigation.navigate("Auth");
            return;
          }
        });
      });
  }

  render() {
    let color = "#1E88E5";
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: color,
          paddingTop: 4,
          paddingLeft: 12,
          paddingRight: 12,
          justifyContent: "center"
        }}
      >
        <StatusBar
          animated={true}
          backgroundColor={color}
          barStyle="light-content"
        />
        <Text
          style={{
            color: colors.light,
            fontSize: 20,
            marginBottom: 12,
            textAlign: "center"
          }}
        >
          Loading . . .
        </Text>
      </View>
    );
  }
}
