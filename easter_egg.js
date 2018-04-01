import React, { Component } from 'react';
import {Alert, Button, Text, View, StyleSheet, Image } from 'react-native';
import { Constants } from 'expo';
var good = ["\"Nice\"", "\"Wow\"", "\"Hey thats pretty good\""];
var gooda = ["-Michael Rosen","-Eddy Wally","-iDubbbz"];
var bad = ["\"Piss off\"", "\"WHAT ARE YOU?!?!, AN IDIOT SANDWICH\"", "\"IT'S RAW\""];
var bada = ["-Gordon Ramsay","-Gordon Ramsay","-Gordon Ramsay"];

export default class App extends Component {
  _onPressButton() 
  {
    var x = Math.floor(Math.random() * 2);
    var y = Math.floor(Math.random() * 3);
    if(x===0)
    {
      Alert.alert(good[y],gooda[y])
    }
    else
    {
      Alert.alert(bad[y],bada[y])
    }
  }
  render() {
    return (
      <View style={styles.container}>
      <Image
          style={{width: 200, height: 200}}
          source={{uri: 'http://cultofthepartyparrot.com/parrots/rotatingparrot.gif'}}
        />
        <Text style={styles.paragraph}>
          Click the button for a surprise 😃
        </Text>
        <Button
              onPress={this._onPressButton}
              title="Click me"
              color="#51EA49"
            />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
