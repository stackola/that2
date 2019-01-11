import React, { Component } from 'react'
import { Text, View, ActivityIndicator} from 'react-native'

import colors from "../colors";
export default class Loading extends Component {
  render() {
    return (
      <View style={{
        backgroundColor: colors.light,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 4,
        marginBottom: 4,
        elevation: 1,
        borderRadius: 2,
        alignItems:'center',
        justifyContent:'center',
        minHeight:120,
      }}>
        <ActivityIndicator/>
      </View>
    )
  }
}
