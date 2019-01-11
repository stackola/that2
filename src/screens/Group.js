import React, { Component } from "react";
import { Text, View, ScrollView } from "react-native";
import firebase from "react-native-firebase";
import colors from "That/src/colors";
import PostList from "That/src/components/PostList";
import Header from "That/src/components/Header";

import {getColor} from "That/src/lib";
export default class Group extends Component {
  componentDidMount = () => {
    var user = firebase.auth().currentUser;
    console.log(user);
  };

  render() {
    let group = "home";
    let id = "MsbfLfF7Ym7LUcMSGLfA";
    let path = "groups/home";
    let color = getColor(path);
    return (
      <View style={{ flex: 1, backgroundColor: color, paddingTop: 4 }}>
        <Header color={color}/>
        <PostList color={color} path={path}/>
      </View>
    );
  }
}
