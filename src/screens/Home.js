import React, { Component } from "react";
import { Text, View, ScrollView } from "react-native";
import firebase from "react-native-firebase";
import colors from "That/src/colors";
import PostList from "That/src/components/PostList";
import Header from "That/src/components/Header";
import { getColor } from "That/src/lib";
export default class Home extends Component {
  componentDidMount = () => {
    var user = firebase.auth().currentUser;
    console.log(user);
  };

  render() {
    let path = "groups/home";
    let color = getColor("1");
    return (
      <View style={{ flex: 1, backgroundColor: color, paddingTop: 4 }}>
        <PostList
          color={color}
          path={path}
          canPost={false}
          postInHeader={false}
          isHome={true}
        />
      </View>
    );
  }
}
