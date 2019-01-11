import React, { Component } from "react";
import { Text, View, ScrollView, StatusBar } from "react-native";
import firebase from "react-native-firebase";
import colors from "That/src/colors";
import PostList from "That/src/components/PostList";
import Header from "That/src/components/Header";
import { getColor } from "That/src/lib";
export default class Details extends Component {
  componentDidMount = () => {
    var user = firebase.auth().currentUser;
    console.log(user);
  };

  render() {
    let path = this.props.navigation.getParam("path", null);
    console.log(path);
    let color = getColor(path);
    return (
      <View style={{ flex: 1, backgroundColor: color, paddingTop: 4 }}>
        <StatusBar
          backgroundColor={color}
          barStyle="light-content"
          animated={true}
        />
        <Header color={color} path={path} />
        <PostList color={color} path={path} />
      </View>
    );
  }
}
