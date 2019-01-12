import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Picker,
  ToastAndroid,
  StatusBar,
  TextInput,
  Platform,
  UIManager,
  LayoutAnimation
} from "react-native";
import colors from "That/src/colors";
import Header from "That/src/components/Header";
import PostList from "That/src/components/PostList";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { distanceInWordsStrict } from "date-fns";
import { getColor, getUID, report, getDoc } from "That/src/lib";

export default class MyProfile extends Component {
  constructor(props) {
    super(props);

    this.state = { user: null };
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    let uid = this.props.navigation.getParam("uid", null);
    getDoc("users/" + uid).then(u => {
      let d = u.data();
      this.setState({ user: d });
    });
  }
  sendReport() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  render() {
    let username = this.props.navigation.getParam("username", null);
    let uid = this.props.navigation.getParam("uid", null);
    let color = getColor(username);
    return (
      <View style={{ flex: 1, backgroundColor: color, paddingTop: 4 }}>
        <StatusBar
          animated={true}
          backgroundColor={color}
          barStyle="light-content"
        />
        <Header path={"report"} hideWatch={true} hideHome={true} />

        <PostList
          header={
            this.state.user ? (
              <View
                style={{
                  flexDirection: "row",
                  paddingRight: 8,
                  paddingLeft: 8,
                  paddingBottom: 4,
                  height: 80
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.light,
                      marginBottom: 0,
                      fontSize: 20
                    }}
                  >
                    {this.state.user.username}
                  </Text>
                  <Text style={{ color: colors.light, marginBottom: 12 }}>
                    Joined{" "}
                    {distanceInWordsStrict(new Date(), this.state.user.time)}{" "}
                    ago
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("Chat");
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: colors.light,
                      borderRadius: 2,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Icon name="envelope" color={color} size={30} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View />
            )
          }
          color={color}
          path={"users/" + uid}
          collection={"posts"}
          sort={"time"}
          pathExtractor={c => {
            return c._document._data.path;
          }}
          initialPathExtractor={c => {
            return c._data.path;
          }}
        />
      </View>
    );
  }
}
