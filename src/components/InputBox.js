import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  UIManager,
  LayoutAnimation
} from "react-native";

import colors from "That/src/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { post } from "That/src/lib";
import ImageUpload from "That/src/components/ImageUpload";
import ExpandingTextInput from "./Expanding";
export default class InputBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "",
      loading: false,
      image: null
    };
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  setInput(t) {
    if (!t || !this.state.input) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    this.setState(s => {
      return { ...s, input: t };
    });
  }
  isExpanded() {
    return this.state.input != "" || this.state.image;
  }
  setImage(i) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ image: i });
  }
  canSend() {
    return this.isExpanded();
  }
  send() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ loading: true }, () => {
      post(this.state.input, this.state.image, this.props.path).then(() => {
        this.setState({ loading: false, input: "", image: null });
      });
    });
  }
  render() {
    let isEx = this.isExpanded();
    return !this.state.loading ? (
      <View
        style={{
          flexDirection: "row",
          height: isEx ? 100 : 50,
          borderWidth: 1,
          borderColor: colors.light,
          backgroundColor: colors.light,
          margin: 8,
          borderRadius: 2
        }}
      >
        <View style={{ flex: 1 }}>
          <TextInput
            value={this.state.input}
            onChangeText={t => {
              this.setInput(t);
            }}
            multiline={true}
            style={{
              height: isEx ? 98 : 48,
              textAlignVertical: isEx ? "top" : "auto",
              flex: 1
            }}
          />
        </View>
        <ImageUpload
          isEx={isEx}
          color={this.props.color}
          setImage={i => {
            this.setImage(i);
          }}
        />

        <TouchableOpacity
          disabled={!this.canSend()}
          onPress={() => {
            this.send();
          }}
          style={{
            backgroundColor: this.canSend() ? colors.upvote : colors.disabled,
            justifyContent: "center",
            width: isEx ? 70 : 50,
            alignItems: "center"
          }}
        >
          <Icon
            name="send"
            size={20}
            color={this.canSend() ? colors.light : "#777"}
          />
        </TouchableOpacity>
      </View>
    ) : (
      <View
        style={{
          flexDirection: "row",
          height: 50,
          borderWidth: 1,
          borderColor: colors.light,
          backgroundColor: colors.light,
          margin: 8,
          borderRadius: 2,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }
}
