import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { withNavigation } from "react-navigation";
import colors from "../colors";
import { getUID } from "That/src/lib";

function Button(props) {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress();
      }}
      style={{
        flex: 1,
        height: 40,
        backgroundColor: colors.light,
        borderRadius: 2,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Text style={{ color: props.color }}>{props.text}</Text>
    </TouchableOpacity>
  );
}

export class HomeButtons extends Component {
  toMessages() {
    this.props.navigation.navigate("Chats");
  }
  toProfile() {
    this.props.navigation.navigate({
      routeName: "Profile",
      params: { uid: getUID() }
    });
  }
  toPosts() {
    this.props.navigation.navigate("MyPosts");
  }
  render() {
    return (
      <View
        style={{
          paddingLeft: 8,
          paddingRight: 8,
          marginBottom: 4,
          flexDirection: "row"
        }}
      >
        <Button
          color={this.props.color}
          text={"My profile"}
          onPress={() => {
            this.toProfile();
          }}
        />
        <View style={{ width: 4 }} />
        <Button
          color={this.props.color}
          text={"Messages"}
          onPress={() => {
            this.toMessages();
          }}
        />
        <View style={{ width: 4 }} />
        <Button
          color={this.props.color}
          text={"Watched posts"}
          onPress={() => {
            this.toPosts();
          }}
        />
      </View>
    );
  }
}

export default withNavigation(HomeButtons);
