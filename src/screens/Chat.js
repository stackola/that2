import React, { Component } from "react";
import { Text, View, ScrollView, StatusBar } from "react-native";
import firebase from "react-native-firebase";
import colors from "That/src/colors";
import PostList from "That/src/components/PostList";
import Header from "That/src/components/Header";
import { getColor } from "That/src/lib";

import InputBox from "That/src/components/InputBox";
export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  loadOrMakeChat() {
    var user = firebase.auth().currentUser;
    firebase
      .firestore()
      .collection("messages")
      .where("users", "array-contains", user.displayName)
      .where("users", "array-contains", "Boii")
      .get()
      .then(d => {
        console.log("got chat", d);
        if (d._docs.length > 0) {
          console.log("chat exists");
        } else {
          console.log("cht not exist");
        }
      });
  }
  componentDidMount() {
    //console.log(user);
    this.loadOrMakeChat();
  }

  render() {
    let from = "Admin";
    let to = "Boiis";
    //console.log(path);
    let color = getColor("nope");
    return (
      <View style={{ flex: 1, backgroundColor: color, paddingTop: 4 }}>
        <StatusBar
          backgroundColor={color}
          barStyle="light-content"
          animated={true}
        />
        {/*
        <Header color={color} path={path} />
        <PostList
          color={color}
          path={path}
          header={
            <View>
              <InputBox path={path} color={color} />
            </View>
          }
        />
         */}
      </View>
    );
  }
}
