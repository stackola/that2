import React, { PureComponent } from "react";
import firebase from "react-native-firebase";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground
} from "react-native";
import colors from "../colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { distanceInWordsStrict } from "date-fns";
import { withNavigation } from "react-navigation";
import TimeDisplay from "./TimeDisplay";

import { withOverlay } from "That/src/components/overlay";
class Post extends PureComponent {
  isSelf() {
    return this.props.userId == firebase.auth().currentUser.uid;
  }
  render() {
    let isImage = !!this.props.image;
    //console.log("render post");
    let isHome = this.props.isHome || this.props.isBaseGroup;
    return (
      <ImageBackground
        source={{ uri: this.props.image }}
        style={{
          backgroundColor: colors.light,
          width: "auto",
          height: "auto",
          marginLeft: 8,
          marginRight: 8,
          marginTop: 4,
          marginBottom: 4,
          borderRadius: 2,
          elevation: 1
        }}
        resizeMode="cover"
      >
        <TouchableOpacity
          activeOpacity={isImage ? 0.7 : 0.5}
          onPressOut={() => {
            this.props.closeOverlay();
          }}
          onLongPress={() => {
            isImage && this.props.openOverlay(this.props.image);
          }}
          disabled={!this.props.linkToSelf || this.props.isMessage}
          onPress={() => {
            if (this.props.linkToSelf) {
              this.props.navigation.navigate({
                routeName: "Details",
                params: { path: this.props.path },
                key: this.props.path
              });
            }
          }}
          style={{
            flex: 1,
            flexDirection: "row",
            backgroundColor: isImage ? "hsla(0,0%,0%,0.7)" : "none"
          }}
        >
          {!this.props.isMessage && (
            <View
              style={{
                width: 80,
                alignItems: "center",
                height: isHome ? 80 : 120,
                justifyContent: "center"
              }}
            >
              <Text style={{ fontSize: 25, color: this.props.color }}>
                {this.props.comments}
              </Text>
              <Icon name="face" color={this.props.color} size={25} />
            </View>
          )}
          <View
            style={{
              flex: 1,
              padding: 8,
              justifyContent: isHome ? "center" : "flex-start"
            }}
          >
            <Text
              style={{
                fontSize: 18,
                flex: isHome ? 0 : 1,
                paddingBottom: isHome ? 0 : 8,
                color: isImage ? colors.light : colors.text
              }}
            >
              {this.props.text}
            </Text>
            {!isHome && !this.props.isBaseGroup && (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => {
                    this.props.navigation.navigate({
                      routeName: "Profile",
                      params: {
                        username: this.props.username,
                        uid: this.props.userId
                      },
                      key: this.props.username
                    });
                  }}
                >
                  <Text
                    style={{
                      color: isImage ? colors.light : colors.text,
                      fontWeight: this.isSelf() ? "bold" : "normal",
                      textDecorationLine: this.isSelf() ? "underline" : "none"
                    }}
                  >
                    {this.props.username}
                  </Text>
                </TouchableOpacity>
                <TimeDisplay
                  style={{ color: isImage ? colors.light : colors.text }}
                  time={this.props.updated}
                  key={this.props.updated}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

export default withOverlay(withNavigation(Post));
