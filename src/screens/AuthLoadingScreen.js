import React, { Component } from "react";
import {
  Text,
  View,
  UIManager,
  Platform,
  TouchableOpacity,
  LayoutAnimation
} from "react-native";
import firebase from "react-native-firebase";

import colors from "That/src/colors";
import { getColor } from "That/src/lib";
export default class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {username:""};
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        var user = firebase.auth().currentUser;
        if (!user.displayName) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          this.props.navigation.navigate("Auth");
          return;
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.props.navigation.navigate("App");
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
