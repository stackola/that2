import React, { Children } from "react";
import Context from "./Context";
import Overlay from "./Overlay";
import { Text, View, TouchableOpacity, Image } from "react-native";
class Provider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { open: false, url: null };
  }

  closeOverlay(url) {
    this.ref && this.ref.closeOverlay(url);
  }

  openOverlay(url) {
    this.ref && this.ref.openOverlay(url);
  }

  render() {
    return (
      <Context.Provider
        value={{
          closeOverlay: () => {
            this.closeOverlay();
          },
          openOverlay: (i) => {
            this.openOverlay(i);
          }
        }}
      >
        {Children.only(this.props.children)}
        <Overlay ref={ref => (this.ref = ref)} />
      </Context.Provider>
    );
  }
}

export default Provider;
