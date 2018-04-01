import React, { Component } from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import {
  AppRegistry,
  Text,
  View,
  FlatList,
  AsyncStorage,
  TextInput,
  Keyboard,
  Platform,
  Button,
  Modal,
  StyleSheet
} from "react-native";

const isAndroid = Platform.OS == "android";
const viewPadding = 10;

var radio_props = [
  {label: 'Critical', value: 1 },
  {label: 'Non-critical', value: 0 }
];

export default class TodoList extends Component {
  state = {
    tasks: [],
    text: "",
    date: "",
    isDateTimePickerVisible: false,
    modalVisible: false,
    value: 0
  };

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
      this.readData();
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

  readData() {

  }

  render() {
    //this.readData();
    return (
      <View
      style={styles.container}
      >
      <Text style={styles.title}>
      RemindIO
      </Text>
      <FlatList
      style={styles.list}
      data={this.state.tasks}
      renderItem={({ item, index }) =>
      <View>
      <View style={styles.listItemCont}>
      <Text style={styles.text, styles.listItem}>
      {item.text}
      </Text>
      <Text style={styles.text, styles.listItem }>
      {String(item.date).substr(0,10)}
      </Text>
      <Button title="X" onPress={() => this.deleteTask(index)} />
      </View>
      <View style={styles.hr}/>
      </View>}
      />
      <Button title="New" style={styles.btn, styles.bottom} onPress={() => this.setModalVisible(!this.state.modalVisible)} />
      <DateTimePicker
      isVisible={this.state.isDateTimePickerVisible}
      onConfirm={this._handleDatePicked}
      onCancel={this._hideDateTimePicker}
      />
      <Modal animationType="slide"
      transparent={false}
      visible={this.state.modalVisible}
      onRequestClose={() => {
        this.setModalVisible(!this.state.modalVisible);
      }}>
      <View style={styles.whitespace}>
      <View style={styles.container}>
      <Text style={styles.title}>Create</Text>
      <Text style={styles.text}>Name</Text>
      <TextInput
      style={styles.textInput}
      onChangeText={this.changeTextHandler}
      value={this.state.text}
      placeholder="Add Subscriptions"
      returnKeyType="done"
      returnKeyLabel="done"
      />
      <View style={styles.whitespace}/>
      <Button title="Due Date" style={styles.btn} onPress={() => {
        this._showDateTimePicker();
      }}/>
      <Text style={styles.text}>{String(this.state.date).substr(0,10)}</Text>
      <View style={styles.whitespace}/>
      <Text style={styles.text}>Category</Text>
      <RadioForm
      radio_props={radio_props}
      initial={1}
      animation="false"
      onPress={(value) => {this.setState({value:value})}}
      />
      <View style={styles.whitespace}/>
      <Button title="Remind me!" style={styles.btn, styles.bottom} onPress={() => {
        this.addTask();
        this.setModalVisible(!this.state.modalVisible);
      }}/>
      </View>
      </View>
      </Modal>
      </View>
    );
  }
}

let Tasks = {
  convertToArrayOfObject(tasks, callback) {
    return callback(
      tasks ? tasks.split("||").map((task, i, date) => ({ key: i, text: task, date: date})) : []
    );
  },
  convertToStringWithSeparators(tasks) {
    return tasks.map(task => task.text).join("||");
  },
  all(callback) {
    return AsyncStorage.getItem("TASKS", (err, tasks) =>
    this.convertToArrayOfObject(tasks, callback));
  },
  save(tasks) {
    AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(tasks));}
  };

  const styles = StyleSheet.create({
    bottom: {
      vertical-align: baseline
    }
    container: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5FCFF",
      padding: 20,
      paddingTop: 50
    },
    title: {
      fontSize: 30
    },
    list: {
      width: "100%"
    },
    listItem: {
      paddingTop: 2,
      paddingBottom: 2,
      fontSize: 20
    },
    text: {
      padding: 10,
      fontSize: 20
    },
    hr: {
      height: 1,
      backgroundColor: "gray"
    },
    listItemCont: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    textInput: {
      height: 40,
      fontSize: 20,
      paddingRight: 10,
      paddingLeft: 10,
      borderColor: "gray",
      borderWidth: isAndroid ? 0 : 1,
      width: "100%"
    },
    btn: {
      padding: 30
    },
    whitespace: {
      padding: 30
    }});

    AppRegistry.registerComponent("TodoList", () => TodoList);
