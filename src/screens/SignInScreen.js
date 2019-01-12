import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  Platform,
  UIManager,
  TouchableOpacity,
  LayoutAnimation,
  StatusBar
} from "react-native";
import firebase from "react-native-firebase";
import colors from "That/src/colors";
import { getColor, makeUser } from "That/src/lib";
import { getUID } from "../lib";
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      error: false,
      notificationPermissions: null,
      notificationsEnabled: false
    };
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  login() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ loading: true, error: false }, () => {
      let username = this.state.username;
      makeUser({
        username: username,
        notificationsEnabled: this.state.notificationsEnabled
      })
        .then(r => {
          this.props.navigation.navigate("App");
        })
        .catch(err => {
          console.log(err);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          this.setState({ loading: false, error: true });
        });
    });
  }
  componentDidMount() {}

  turnOnNotifications() {
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          this.setState({ notificationPermissions: true }, () => {
            this.enableNotifications();
          });
        } else {
          firebase
            .messaging()
            .requestPermission()
            .then(() => {
              this.setState({ notificationPermissions: true }, () => {
                this.enableNotifications();
              });
            })
            .catch(error => {
              // User has rejected permissions
            });
        }
      });
  }
  enableNotifications() {
    this.setState({ notificationsEnabled: true }, () => {
      //this.setToken();
      const channel = new firebase.notifications.Android.Channel(
        "test-channel",
        "General",
        firebase.notifications.Android.Importance.Max
      ).setDescription("General Notifications like replies");

      firebase.notifications().android.createChannel(channel);
      firebase.messaging().subscribeToTopic("messages-to-" + getUID());
    });
  }
  disableNotifications() {
    this.setState({ notificationsEnabled: false }, () => {
      //this.setToken();
      firebase.notifications().android.deleteChannel("test-channel");
      firebase
        .messaging()
        .unsubscribeFromTopic("messages-to-" + getUID())
        .then(r => {});
    });
  }
  render() {
    let color = this.state.username ? getColor(this.state.username) : "#1E88E5";
    return !this.state.loading ? (
      <View
        style={{
          flex: 1,
          backgroundColor: color,
          paddingTop: 4,
          paddingLeft: 12,
          paddingRight: 12,
          justifyContent: "center"
        }}
      >
        <StatusBar
          animated={false}
          backgroundColor={color}
          barStyle="light-content"
        />
        <Text
          style={{
            color: colors.light,
            fontSize: 20,
            marginBottom: 12,
            textAlign: "center"
          }}
        >
          join that
        </Text>
        <TextInput
          value={this.state.username}
          placeholder={"Username"}
          onChangeText={t => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            this.setState({ username: t, error: false });
          }}
          placeholderTextColor={colors.light}
          style={{
            textAlign: "center",

            height: 50,
            color: colors.light,
            backgroundColor: colors.darkTransparent
          }}
        />
        {(!this.state.notificationsEnabled ||
          !this.state.notificationPermissions) && (
          <TouchableOpacity
            onPress={() => {
              this.turnOnNotifications();
            }}
            style={{
              height: 50,
              fontSize: 18,
              backgroundColor: colors.darkTransparent,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8
            }}
          >
            <Text style={{ color: colors.light }}>Enable notifications</Text>
          </TouchableOpacity>
        )}
        {this.state.notificationsEnabled && this.state.notificationPermissions && (
          <TouchableOpacity
            onPress={() => {
              this.disableNotifications();
            }}
            style={{
              height: 50,
              fontSize: 18,
              backgroundColor: colors.darkTransparent,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8
            }}
          >
            <Text style={{ color: colors.light }}>Notifications enabled</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            this.login();
          }}
          style={{
            height: 50,
            fontSize: 18,
            backgroundColor: "hsla(0,0%,0%,0.3)",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 8
          }}
        >
          <Text style={{ color: colors.light }}>Continue</Text>
        </TouchableOpacity>
        {this.state.error && (
          <View
            style={{
              height: 50,
              fontSize: 18,
              backgroundColor: "hsla(0,80%,40%,0.3)",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8
            }}
          >
            <Text style={{ color: colors.light }}>
              Username invalid or taken
            </Text>
          </View>
        )}
      </View>
    ) : (
      <View
        style={{
          flex: 1,
          backgroundColor: color,
          paddingTop: 4,
          paddingLeft: 12,
          paddingRight: 12,
          justifyContent: "center"
        }}
      >
        <StatusBar
          animated={true}
          backgroundColor={color}
          barStyle="light-content"
        />
        <Text
          style={{
            color: colors.light,
            fontSize: 20,
            marginBottom: 12,
            textAlign: "center"
          }}
        >
          Loading . . .
        </Text>
      </View>
    );
  }
}
