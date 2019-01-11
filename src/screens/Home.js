import React, { Component } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
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
    let color = '#1E88E5';//getColor("13");
    return (
      <View style={{ flex: 1, backgroundColor: color, paddingTop: 4 }}>
        <PostList
          color={color}
          path={path}
          canPost={true}
          postInHeader={false}
          isHome={true}
          footer={
            <TouchableOpacity
              onPress={() => {
                firebase
                  .auth()
                  .signOut()
                  .then(() => {
                    firebase
                      .auth()
                      .signInAnonymously()
                      .then(() => {
                        this.props.navigation.navigate("Auth");
                      });
                  });
              }}
              style={{ height: 40 }}
            />
          }
        />
      </View>
    );
  }
}
