import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from "react-native";

import { uploadImage } from "That/src/lib";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "That/src/colors";
import ImagePicker from "react-native-image-picker";
const pickerOptions = {
  mediaType: "photo",
  quality: 0.8
};
export default class ImageUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      imageLoading: false
    };
  }

  pickPicture(showRemove) {
    this.setState({ imageLoading: true }, () => {
      ImagePicker.showImagePicker(
        {
          ...pickerOptions,
          customButtons: showRemove
            ? [
                ...(pickerOptions.customButtons || []),
                { name: "remove", title: "Remove image" }
              ]
            : [...(pickerOptions.customButtons || [])]
        },
        response => {
          if (response && response.path) {
            uploadImage(response.path, response.width, response.height, d => {
              console.log("got response", d);
              this.props.setImage(d);
              this.setState({
                image: d,
                imageLoading: false
              });
            });
          } else {
            console.log(response);
            if (
              (!this.state.image && response.didCancel) ||
              (this.state.image && response.customButton)
            ) {
              this.props.setImage(null);
              this.setState({
                imageLoading: false,
                image: null
              });
            }
          }
        }
      );
    });
  }
  render() {
    return (
      <View style={{}}>
        {!this.state.imageLoading && !this.state.image ? (
          <TouchableOpacity
            onPress={() => {
              this.pickPicture(false);
            }}
            style={{
              flex: 1,
              backgroundColor: this.props.color,
              justifyContent: "center",
              width: this.props.isEx ? 70 : 50,
              alignItems: "center"
            }}
          >
            <Icon name="camera" color={colors.light} size={20} />
          </TouchableOpacity>
        ) : null}

        {this.state.imageLoading && !this.state.image ? (
          <View
            style={{
              width: this.props.isEx ? 70 : 50,
              flex: 1,
              backgroundColor: colors.dark,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ActivityIndicator />
          </View>
        ) : null}

        {this.state.image ? (
          <TouchableOpacity
            onPress={() => {
              this.pickPicture(true);
            }}
            style={{
              width: this.props.isEx ? 70 : 50,
              flex: 1,
              backgroundColor: colors.dark
            }}
          >
            <Image
              resizeMode="cover"
              style={{ width: this.props.isEx ? 70 : 50, flex: 1 }}
              source={{ uri: this.state.image.url }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}
