import React, { Component } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "That/src/redux/actions";
import { bindActionCreators } from "redux";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar
} from "react-native";
import firebase from "react-native-firebase";
import colors from "That/src/colors";
import PostList from "That/src/components/PostList";
import HomeButtons from "That/src/components/HomeButtons";
import InputBox from "That/src/components/InputBox";
import Header from "That/src/components/Header";
import { getColor, getUID } from "That/src/lib";

class Home extends Component {
  componentDidMount() {
    this.props.userSubscribe(() => {});
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        // Process your notification as required
        console.log(notification);
        const N = new firebase.notifications.Notification()
          .setNotificationId(notification._notificationId)
          .setTitle(notification._title)
          .setBody(notification._body)
          .setData(notification._data);
        N.android.setChannelId("test-channel");
        N.android.setSmallIcon("ic_launcher");
        if (N._data.byUser == getUID()) {
          console.log("not showing notification");
          return;
        }
        firebase.notifications().displayNotification(N);
      });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification = notificationOpen.notification;
        this.notiClicked(notification);
      });

    firebase
      .notifications()
      .getInitialNotification()
      .then(notificationOpen => {
        if (notificationOpen) {
          // App was opened by a notification
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          // Get information about the notification that was opened
          const notification = notificationOpen.notification;
          this.notiClicked(notification);
        }
      });
  }
  notiClicked(noti) {
    console.log("clicked on noti!", noti);
    let data = noti._data;
    if (data.type == "reply") {
      this.props.navigation.navigate({
        routeName: "Details",
        params: { path: data.path },
        key: data.path
      });
    }
  }
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  render() {
    let path = "groups/dresden";
    let color = "#1E88E5"; //getColor("13");
    return (
      <View style={{ flex: 1, backgroundColor: color, paddingTop: 4 }}>
        <StatusBar
          animated={true}
          backgroundColor={color}
          barStyle="light-content"
        />
        <PostList
          color={color}
          path={path}
          canPost={true}
          postInHeader={false}
          header={
            <View style={{}}>
              <InputBox path={path} color={color} />
              <HomeButtons color={color} />
            </View>
          }
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

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
