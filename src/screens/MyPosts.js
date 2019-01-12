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
import { getColor, getUID, getUser, report } from "That/src/lib";

export default class MyProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {}
  sendReport() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  render() {
    let uid = getUser().uid;
    let color = getColor(uid);
    return (
      <View style={{ flex: 1, backgroundColor: color, paddingTop: 4 }}>
        <StatusBar
          animated={true}
          backgroundColor={color}
          barStyle="light-content"
        />
        <Header path={"report"} hideWatch={true} hideHome={true} />

        <PostList
          color={color}
          path={"users/" + uid}
          collection={"saved"}
          header={<View />}
          reSort={false}
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
