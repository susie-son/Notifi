import React, { Component } from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  AsyncStorage,
  Button,
  TextInput,
  Keyboard,
  Platform
} from "react-native";

const isAndroid = Platform.OS == "android";
const viewPadding = 10;

export default class TodoList extends Component {
  state = {
    tasks: [],
    text: "",
    date: "",
    isDateTimePickerVisible: false
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    this.setState({ date: date });
    this._hideDateTimePicker();
    this.addTask();
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
    return (
      <View
      style={[styles.container, { paddingBottom: this.state.viewPadding }]}
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
      <Text style={styles.listItem}>
      {item.text}
      </Text>
      <Text style={styles.listItem}>
      {String(item.date).substr(0,10)}
      </Text>
      <Button style={styles.btn} title="X" onPress={() => this.deleteTask(index)} />
      </View>
      <View style={styles.hr} />
      </View>}
      />
      <TextInput
      style={styles.textInput}
      onChangeText={this.changeTextHandler}
      onSubmitEditing={this._showDateTimePicker}
      value={this.state.text}
      placeholder="Add Subscriptions"
      returnKeyType="done"
      returnKeyLabel="done"
      />
      <DateTimePicker
      isVisible={this.state.isDateTimePickerVisible}
      onConfirm={this._handleDatePicked}
      onCancel={this._hideDateTimePicker}
      />
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
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#90CAF9",
      padding: viewPadding,
      paddingTop: 50
    },
    title: {
      fontSize: 40
    },
    list: {
      width: "100%"
    },
    listItem: {
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
      justifyContent: "space-between",
      backgroundColor: "#FFFFFF"
    },
    textInput: {
      height: 40,
      fontSize: 20,
      paddingRight: 10,
      paddingLeft: 10,
      borderColor: "gray",
      backgroundColor: "#FFFFFF",
      borderWidth: isAndroid ? 0 : 1,
      width: "100%"
    },
    btn: {
      padding: 10
    }
  });

  AppRegistry.registerComponent("TodoList", () => TodoList);
