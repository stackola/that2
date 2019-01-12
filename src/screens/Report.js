import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Picker,
  ToastAndroid,
  StatusBar,
  TextInput,
  Platform,
  UIManager,
  LayoutAnimation
} from "react-native";
import colors from "That/src/colors";
import Header from "That/src/components/Header";
import { getColor, getUID, report } from "That/src/lib";

export default class Report extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reason: "illegal",
      moreInfo: "",
      loading: false
    };
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {}
  sendReport() {

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ loading: true }, () => {
      let path = this.props.navigation.getParam("path", null);
      report(path, this.state.reason, this.state.moreInfo).then(r => {
        console.log("report done", r);
        ToastAndroid.show("Thank you for your help.", ToastAndroid.SHORT, ToastAndroid.TOP);
        this.props.navigation.goBack();
      });
    });
  }

  render() {
    let path = this.props.navigation.getParam("path", null);
    let color = "#1E88E5"; //getColor("13");
    return (
      <View style={{ flex: 1, backgroundColor: color, paddingTop: 4 }}>
        <StatusBar
          animated={true}
          backgroundColor={color}
          barStyle="light-content"
        />
        <Header path={"report"} hideWatch={true} hideHome={true} />
        {!this.state.loading &&
        
        <ScrollView
          style={{ flex: 1, paddingTop: 8, paddingLeft: 8, paddingRight: 8 }}
        >
          <Text style={{ color: colors.light, marginBottom: 12, fontSize: 20 }}>
            Report a post
          </Text>
          <Text style={{ color: colors.light, marginBottom: 8 }}>
            Pick a reason:
          </Text>
          <Picker
            selectedValue={this.state.reason}
            style={{
              backgroundColor: colors.darkTransparent,
              color: colors.light,
              marginBottom: 12
            }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ reason: itemValue })
            }
          >
            <Picker.Item label="Illegal content" value="illegal" />
            <Picker.Item label="Violence or harassment" value="violence" />
            <Picker.Item label="Spam or advertisement" value="spam" />
            <Picker.Item label="Copyrighted content" value="copyright" />
            <Picker.Item label="Other" value="orhter" />
          </Picker>
          <Text style={{ color: colors.light, marginBottom: 8 }}>
            Provide more details:
          </Text>
          <TextInput
            onChangeText={t => {
              this.setState({ moreInfo: t });
            }}
            value={this.state.moreInfo}
            multiline={true}
            style={{
              textAlignVertical: "top",
              color: colors.light,
              height: 120,
              marginBottom: 12,
              backgroundColor: colors.darkTransparent
            }}
          />
          <TouchableOpacity
            onPress={() => {
              this.sendReport();
            }}
            style={{
              height: 60,
              backgroundColor: colors.darkTransparent,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text style={{ color: colors.light }}>Report</Text>
          </TouchableOpacity>
        </ScrollView>
        }
        {this.state.loading &&
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:colors.light, fontSize:20}}>Loading . . .</Text>
          </View>
        }
      </View>
    );
  }
}


