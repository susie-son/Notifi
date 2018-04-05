import React, { Component } from "react";
import { Font } from "expo";
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Footer, Radio, Right, Left, Label, Form, Item, Input, Container, Header, Body, Title, Content, Button, Text, List, ListItem } from 'native-base';
import {
  AppRegistry,
  StyleSheet,
  View,
  FlatList,
  AsyncStorage,
  TextInput,
  Keyboard,
  Platform,
  Modal,
  StatusBar,
  Dimensions,
  Alert,
  Image
} from "react-native";
import { Constants } from 'expo';

var good = ["\"Nice\"", "\"Wow\"", "\"Hey thats pretty good\""];
var gooda = ["-Michael Rosen","-Eddy Wally","-iDubbbz"];
var bad = ["\"Piss off\"", "\"WHAT ARE YOU?!?!, AN IDIOT SANDWICH\"", "\"IT'S RAW\""];
var bada = ["-Gordon Ramsay","-Gordon Ramsay","-Gordon Ramsay"];

const isAndroid = Platform.OS == "android";
const viewPadding = 10;

export default class TodoList extends Component {
  state = {
    tasks: [],
    text: "",
    date: "          ",
    isDateTimePickerVisible: false,
    modalVisible: false,
    modalVisible2: false,
    value: 0,
    loading: true,
    itemSelected: 'non-critical'
  };

  _onPressButton() {
    var x = Math.floor(Math.random() * 2);
    var y = Math.floor(Math.random() * 3);
    if(x===0) {
      Alert.alert(good[y],gooda[y])
    } else {
      Alert.alert(bad[y],bada[y])
    }
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    this.setState({ date: date });
    this._hideDateTimePicker();
  };

  changeTextHandler = text => {
    this.setState({ text: text });
  };

  addTask = () => {
    let notEmpty = this.state.text.trim().length > 0;

    if (notEmpty) {
      fetch(`https://saurav.lib.id/RemindIO@dev/write/?title=${this.state.text}&date=${String(this.state.date).substr(0,10)}`);
    }

    this.setState(
      prevState => {
        let { tasks, text } = prevState;
        return {
          tasks: tasks.concat({ key: tasks.length, text: text, date: String(this.state.date).substr(0,10) }),
          text: "",
          date: ""
        };
      },
      () => Tasks.save(this.state.tasks)
    );
  };

  deleteTask = i => {
    this.setState(
      prevState => {
        let tasks = prevState.tasks.slice();
        tasks.splice(i, 1);
        return { tasks: tasks };
      },
      () => Tasks.save(this.state.tasks)
    );
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setModalVisible2(visible) {
    this.setState({modalVisible2: visible});
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  componentDidMount() {
    Keyboard.addListener(
      isAndroid ? "keyboardDidShow" : "keyboardWillShow",
      e => this.setState({ viewPadding: e.endCoordinates.height + viewPadding })
    );

    Keyboard.addListener(
      isAndroid ? "keyboardDidHide" : "keyboardWillHide",
      () => this.setState({ viewPadding: viewPadding })
    );

    Tasks.all(tasks => this.setState({ tasks: tasks || [] }));
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <Container>
        <StatusBar barStyle="dark-content" hidden = {false}/>
        <Content>
          <Modal visible={true}>
          <Header>
            <Body>
              <Title>Notifi</Title>
            </Body>
          </Header>
          <View style={{flex: 1}}>
            <List
            dataArray={this.state.tasks}
            renderRow={(item, sectionID, rowID) =>
                <ListItem style={{flex: 1, width: Dimensions.get('window').width}}>
                  <Text style={{width: Dimensions.get('window').width / 2 - 30}}>{item.text}</Text>
                  <Text style={{width: Dimensions.get('window').width / 2 - 30}}>{String(item.date).substr(0,10)}</Text>
                  <Button transparent dark
                  onPress={() => this.deleteTask(rowID)}>
                    <Text>X</Text>
                  </Button>
                </ListItem>}>
            </List>
          </View>
          <Footer>
            <Button transparent light
            onPress={() => this.setModalVisible(!this.state.modalVisible)}>
              <Text>New</Text>
            </Button>
          </Footer>
          <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          />
          </Modal>
          <Modal animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <Header>
            <Body>
              <Title>Create</Title>
            </Body>
          </Header>
          <View style={{flex: 1}}>
            <List>
              <ListItem inline>
                <Label style={{fontSize: 20, marginRight: 30}}>Subscription:</Label>
                <Input
                placeholder="Enter Subscription"
                onChangeText={this.changeTextHandler}
                value={this.state.text}
                returnKeyType="done"
                returnKeyLabel="done"/>
              </ListItem>
              <ListItem>
                <Button style={{padding: 10, marginRight: 30}}
                onPress={() => {this._showDateTimePicker();}}>
                  <Text style={{fontSize: 18}}>Date</Text>
                </Button>
                <Label style={{fontSize: 20, height: 30}}>{String(this.state.date).substr(0,10)}</Label>
              </ListItem>
              <ListItem>
                <Text style={{fontSize: 20, marginRight: 30}}>Category:</Text>
                <Radio style={{marginRight: 10}}
                onPress={() => this.setState({ itemSelected: 'critical' })}
                selected={this.state.itemSelected == 'critical'}/>
                <Text style={{marginRight: 30}}>Critical</Text>
                <Radio style={{marginRight: 10}}
                onPress={() => this.setState({ itemSelected: 'non-critical' })}
                selected={this.state.itemSelected == 'non-critical'}/>
                <Text>Non-critical</Text>
              </ListItem>
            </List>
            <Button transparent light
            onPress={() => {
              this.setModalVisible2(!this.state.modalVisible2);
            }}>
              <Text></Text>
            </Button>
          </View>
          <Footer>
            <Button transparent light
            onPress={() => {this.addTask();
              this.setModalVisible(!this.state.modalVisible);
            }}>
              <Text>Remind me!</Text>
            </Button>
          </Footer>
          </Modal>
          <Modal animationType="slide"
          transparent={false}
          visible={this.state.modalVisible2}
          onRequestClose={() => {
            this.setModalVisible2(!this.state.modalVisible2);
          }}>
          <View style={styles.container}>
          <Image
          style={{width: 300, height: 300}}
          source={{uri: 'http://cultofthepartyparrot.com/parrots/rotatingparrot.gif'}}
          />
          <Text style={styles.paragraph}>
            Click the button for a surprise 😃
          </Text>
          <View style={{flexDirection: "row", justifyContent: "center"}}>
            <Button
            onPress={this._onPressButton}
            color="#51EA49">
              <Text>Click me</Text>
            </Button>
          </View>
          </View>
          </Modal>
        </Content>
      </Container>
    );
  }
}

let Tasks = {
  convertToArrayOfObject(tasks, callback) {
    return callback(
      tasks ? tasks.split("||").map((task, i) => ({ key: i, text: task })) : []
    );
  },
  convertToStringWithSeparators(tasks) {
    return tasks.map(task => task.text).join("||");
  },
  all(callback) {
    return AsyncStorage.getItem("TASKS", (err, tasks) =>
      this.convertToArrayOfObject(tasks, callback)
    );
  },
  save(tasks) {
    AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(tasks));
  }
};

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

AppRegistry.registerComponent("TodoList", () => TodoList);
