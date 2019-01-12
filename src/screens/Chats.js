import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from "react-native";
import firebase from "react-native-firebase";
import { getUID } from "That/src/lib";
import Header from "That/src/components/Header";
import colors from "That/src/colors";
import PostLoader from "That/src/components/PostLoader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { distanceInWordsStrict } from "date-fns";
export default class Chats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: []
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection("messages")
      .where("users", "array-contains", getUID())
      .get()
      .then(s => {
        this.setState({ chats: s._docs });
        //console.log(s);
      });
  }
  refresh() {
    let k = this.props.navigation.getParam("refreshKey", 0);
    this.props.navigation.replace({
      routeName: "Chats",
      refreshKey: (k + 1).toString()
    });
  }
  goToChat(id) {
    this.props.navigation.navigate({
      routeName: "Chat",
      params: { to: id },
      path: id
    });
  }
  render() {
    let color = "#1E88E5";
    return (
      <View style={{ flex: 1, backgroundColor: color, paddingTop: 4 }}>
        <Header color={color} path={"chats"} hideWatch={true} hideHome={true} />
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {
                this.refresh();
              }}
            />
          }
          ListHeaderComponent={
            <Text
              style={{
                color: colors.light,
                fontSize: 18,
                marginBottom: 8,
                paddingLeft: 8,
                paddingRight: 8
              }}
            >
              Messages
            </Text>
          }
          keyExtractor={i => {
            return i.id;
          }}
          data={this.state.chats}
          renderItem={i => {
            //console.log(i);
            return (
              <Message
                goToChat={id => {
                  this.goToChat(id);
                }}
                data={i.item._data}
                color={color}
              />
            );
          }}
          style={{ flex: 1 }}
        />
      </View>
    );
  }
}

function Message(props) {
  let color = props.color;
  let uid = getUID();
  return (
    <View
      style={{
        height: 80,
        backgroundColor: colors.light,
        borderRadius: 2,
        marginBottom: 8,
        marginRight: 8,
        marginLeft: 8,
        elevation: 1
      }}
    >
      <PostLoader
        loadingComponent={
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ActivityIndicator />
          </View>
        }
        path={
          "users/" +
          props.data.users.filter(i => {
            return i != uid;
          })[0]
        }
      >
        {u => {
          //console.log("got other user");
          return (
            <TouchableOpacity
              onPress={() => props.goToChat(u.id)}
              style={{ flex: 1, alignItems: "center", flexDirection: "row" }}
            >
              <View
                style={{
                  width: 80,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Icon name="message" size={25} color={color} />
              </View>
              <Text style={{ fontSize: 18 }}>{u && u.username}</Text>
              <Text
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  fontSize: 12
                }}
              >
                {distanceInWordsStrict(new Date(), props.data.updated)} ago
              </Text>
            </TouchableOpacity>
          );
        }}
      </PostLoader>
    </View>
  );
}
