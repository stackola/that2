import React, { PureComponent } from "react";
import firebase from "react-native-firebase";
import Loading from "That/src/components/Loading"
export default class ItemLoader extends PureComponent {
  constructor(p) {
    super(p);
    this.state = { loading: true, item: null };
   
  }
  subscribeToChanges() {
    ///console.log("GOTTA SUB!");
    let path = this.props.path;
    this.sub1 = firebase
      .firestore()
      .doc(path)
      .onSnapshot(snap => {
        this.setState({ item: snap.data(), loading: false });
      });
  }
  updateOnce() {
    let path = this.props.path;
    firebase
      .firestore()
      .doc(path)
      .get()
      .then(snap => {
        this.setState({ item: snap.data(), loading: false });
      });
  }
  componentDidMount() {
    //console.log(this.props.path);
    if (this.props.realtime) {
      //subscribe to item
      this.subscribeToChanges();
    } else {
      //fetch item once
      this.updateOnce();
    }
  }
  componentWillUnmount() {
    this.sub1 && this.sub1();
  }
  render() {
    return !this.state.loading ? (
      this.props.children(
        this.props.sanitize
          ? this.props.sanitize(this.state.item)
          : this.state.item
      )
    ) : this.props.loading == false ? null : this.props.loadingComponent ? (
      this.props.loadingComponent
    ) : (
      <Loading/>
    );
  }
}
