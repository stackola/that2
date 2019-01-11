import React from "react";

import Context from "./Context";

function withOverlay(WrappedComponent) {
  class Enhanced extends React.PureComponent {
    render() {
      return (
        <Context.Consumer>
          {functions => (
            <WrappedComponent
              {...this.props}
              openOverlay={functions.openOverlay}
              closeOverlay={functions.closeOverlay}
            />
          )}
        </Context.Consumer>
      );
    }
  }
  return Enhanced;
}

export default withOverlay;
