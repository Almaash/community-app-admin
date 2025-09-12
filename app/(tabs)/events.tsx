import React, { Component } from "react";
import EventScreen from "../pages/events/EventScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default class events extends Component {
  render() {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <EventScreen />
      </SafeAreaView>
    );
  }
}
