import React, { Component } from "react";
import { Text, View } from "react-native";

import { uploadImage } from "That/scr/lib";

import ImagePicker from "react-native-image-picker";
const pickerOptions = {
  mediaType: "photo",
  quality: 0.8
};
export default class PictuerUpload extends Component {
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
          console.log(response);
          if (response && response.path) {
            uploadImage(response.path, response.width, response.height, d => {
              console.log("got response", d);
              this.setState({
                image: d,
                imageLoading: false
              });
            });
          } else {
            this.setState({
              imageLoading: false,
              image: null
            });
          }
        }
      );
    });
  }
  render() {
    return (
      <View>
        {!this.state.imageLoading && !this.state.image ? null : null}

        {this.state.imageLoading && !this.state.image ? null : null}

        {this.state.image ? null : null}
      </View>
    );
  }
}
