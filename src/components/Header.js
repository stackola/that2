import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import colors from "That/src/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { withNavigation } from "react-navigation";
class Header extends Component {
  getParentPath() {
    let p = this.props.path.split("/");
    p = p.slice(0, p.length - 2);
    return p.join("/");
  }
  goUp() {
    this.props.navigation.navigate({
      routeName: "Details",
      params: { path: this.getParentPath() },
      key: this.getParentPath()
    });
  }
  goHome() {
    this.props.navigation.navigate({
      routeName: "Home"
    });
  }
  canGoUp() {
    return this.props.path && this.props.path.split("/").length > 4;
  }
  canGoBack() {
    return !this.isHome();
  }
  canGoHome() {
    return !this.isHome();
  }
  isHome() {
    return this.props.path == "groups/home";
  }
  goBack() {
    this.props.navigation.goBack();
  }
  render() {
    return (
      <View
        style={{
          height: 30,
          flexDirection: "row",
          paddingLeft: 8,
          paddingRight: 8,
          marginBottom: 4
        }}
      >
        {this.canGoBack() && (
          <Button
            color={this.props.color}
            icon="arrow-left"
            onPress={() => {
              this.goBack();
            }}
          />
        )}

        {this.canGoUp() && (
          <Button
            color={this.props.color}
            icon="subdirectory-arrow-left"
            rotate={true}
            onPress={() => {
              this.goUp();
            }}
          />
        )}
        {this.canGoHome() && (
          <Button
            color={this.props.color}
            icon="home"
            onPress={() => {
              this.goHome();
            }}
          />
        )}
        <View style={{ flex: 1 }} />
        {!this.isHome() && (
          <Button color={this.props.color} icon="floppy" marginRight={false} />
        )}
      </View>
    );
  }
}

function Button(props) {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress();
      }}
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        backgroundColor: colors.light,
        borderRadius: 2,
        marginRight: props.marginRight !== false ? 4 : 0
      }}
    >
      <Icon
        color={props.color}
        size={20}
        name={props.icon}
        style={{ transform: props.rotate ? [{ rotate: "90deg" }] : [] }}
      />
    </TouchableOpacity>
  );
}
export default withNavigation(Header);
