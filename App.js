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
  TouchableHighlight
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

  render() {
    return (
      <View>
      <Text>
      RemindIO
      </Text>
      <FlatList
      data={this.state.tasks}
      renderItem={({ item, index }) =>
      <View>
      <View>
      <Text>
      {item.text}
      </Text>
      <Text>
      {String(item.date).substr(0,10)}
      </Text>
      <Button title="X" onPress={() => this.deleteTask(index)} />
      </View>
      <View/>
      </View>}
      />
      <Button title="New" onPress={() => this.setModalVisible(!this.state.modalVisible)} />
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
      <View>
      <View>
      <Text>Name</Text>
      <TextInput
      onChangeText={this.changeTextHandler}
      value={this.state.text}
      placeholder="Add Subscriptions"
      returnKeyType="done"
      returnKeyLabel="done"
      />
      <Button title="Due Date" onPress={() => {
        this._showDateTimePicker();
      }}/>
      <Text>{String(this.state.date).substr(0,10)}</Text>
      <Text>Category</Text>
      <RadioForm
          radio_props={radio_props}
          initial={1}
          animation="false"
          onPress={(value) => {this.setState({value:value})}}
        />
      <Button title="Remind me!" onPress={() => {
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

  AppRegistry.registerComponent("TodoList", () => TodoList);
