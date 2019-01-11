import React, { Component } from "react";
import { Text, View, Image } from "react-native";

export default class Overlay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      url: null
    };
  }
  openOverlay(url) {
    this.setState({ open: true, url });
  }
  closeOverlay() {
    if (this.state.open) {
      this.setState({ open: false, url: null });
    }
  }
  render() {
    return this.state.open ? (
      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "hsla(0,0%,0%,0.5)"
        }}
      >
        <Image
          source={{ uri: this.state.url }}
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
          resizeMode="contain"
        />
      </View>
    ) : null;
  }
}
