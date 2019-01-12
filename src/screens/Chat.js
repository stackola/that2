import React, { Component } from "react";
import { Text, View, ScrollView, StatusBar } from "react-native";
import firebase from "react-native-firebase";
import colors from "That/src/colors";
import PostList from "That/src/components/PostList";
import Header from "That/src/components/Header";
import { getColor, getUID } from "That/src/lib";

import InputBox from "That/src/components/InputBox";
import { getDoc } from "../lib";
export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }
  getPath(from, to) {
    return [from, to].sort().join("-");
  }
  loadOrMakeChat() {
    let from = getUID();
    let to = this.props.navigation.getParam("to", null);
    let path = this.getPath(from, to);
    firebase
      .firestore()
      .collection("messages")
      .doc(path)
      .set({
        users: [from, to],
        time: firebase.firestore.FieldValue.serverTimestamp(),
        updated: firebase.firestore.FieldValue.serverTimestamp(),
        comments: 0
      });
  }
  componentDidMount() {
    //console.log(user);
    let from = getUID();
    let to = this.props.navigation.getParam("to", null);
    getDoc("users/" + to).then(s => {
      console.log(s);
      this.setState({ user: s._data });
    });
    this.loadOrMakeChat();
  }

  render() {
    let from = getUID();
    let to = this.props.navigation.getParam("to", null);
    let path = "messages/" + this.getPath(from, to);
    //console.log(path);
    let color = getColor("nop2e");
    return (
      <View style={{ flex: 1, backgroundColor: color, paddingTop: 4 }}>
        <StatusBar
          backgroundColor={color}
          barStyle="light-content"
          animated={true}
        />

        <Header color={color} path={path} hideWatch={true} />
        <View
          style={{
            height: 40,
            justifyContent: "center",
            paddingLeft: 8,
            paddingRight: 8
          }}
        >
          <Text style={{ color: colors.light, fontSize: 18 }}>
            Messasge {this.state.user && this.state.user.username}
          </Text>
        </View>
        <PostList
          color={color}
          path={path}
          isMessage={true}
          header={
            <View>
              <InputBox path={path} color={color} isMessage={true} />
            </View>
          }
        />
      </View>
    );
  }
}
