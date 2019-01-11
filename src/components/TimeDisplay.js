import React, { PureComponent } from "react";
import { Text, View } from "react-native";

import { distanceInWordsStrict, differenceInSeconds } from "date-fns";
export default class TimeDisplay extends PureComponent {
  constructor(p) {
    super(p);
    this.state = { x: 0 };
  }
  updateState() {
    let wait = 1000 * 60;
    let distance = differenceInSeconds(new Date(), this.props.time);
    if (distance < 60) {
      console.log(distance);
      wait = 4000;
    }
    if (distance > 60 * 60) {
      return;
    }
    this.ct = setTimeout(() => {
      this.setState({ x: this.state.x + 1 });
      this.updateState();
    }, wait);
  }
  componentDidMount() {
    this.updateState();
  }
  componentWillUnmount() {
    if (this.ct) {
      clearTimeout(this.ct);
    }
  }
  render() {
    return <Text style={this.props.style}>{distanceInWordsStrict(this.props.time, new Date())}</Text>;
  }
}
