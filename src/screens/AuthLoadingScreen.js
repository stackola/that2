import React, { Component } from "react";
import { Text, View } from "react-native";
import firebase from "react-native-firebase";

export default class AuthLoadingScreen extends Component {
  componentDidMount() {
    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        var user = firebase.auth().currentUser;
        user
          .updateProfile({
            displayName: "Hans der Stecher27"
          })
          .then(() => {
            // Update successful.
            this.props.navigation.navigate("App");
          })
          .catch(function(error) {
            // An error happened.
          });
      });
  }
  render() {
    return (
      <View>
        <Text> auth loading </Text>
      </View>
    );
  }
}
