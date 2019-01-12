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
    let username = getUser().displayName;
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
            <View
            style={{
              flexDirection: "row",
              paddingRight: 8,
              paddingLeft: 8,
              paddingBottom: 4
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: colors.light, marginBottom: 0, fontSize: 20 }}
              >
                {username}
              </Text>
              <Text style={{ color: colors.light, marginBottom: 12 }}>
                Joined 2 days ago
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
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
          }
            color={color}
            path={"users/" + username}
            collection={"posts"}
            header={<View />}
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
