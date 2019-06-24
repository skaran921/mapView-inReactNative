import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  AsyncStorage
} from "react-native";

export default class Loding extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.checkSession();
  }

  checkSession = async () => {
    const emp_id = await AsyncStorage.getItem("emp_id");
    if (emp_id !== null) {
      // this.props.navigation.replace("Dashboard");
      this.props.navigation.navigate("Dashboard");
    } else {
      // this.props.navigation.replace("Login");
      this.props.navigation.navigate("Login");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
