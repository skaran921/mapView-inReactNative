import React from "react";
import {
  StyleSheet,
  Text,
  Keyboard,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Alert,
  AsyncStorage
} from "react-native";
import { Card, Button, Form, Item, Label, Input } from "native-base";
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emp_id: null,
      emp_login_id: "",
      emp_password: ""
    };
  }

  componentDidMount() {
    this.checkSession();
  }
  static navigationOptions = {
    title: "Login",
    headerLeft: null,
    gesturesEnabled: false,
    index: 0,
    initialRouteName: "Login"
  };

  checkSession = async () => {
    const emp_id = await AsyncStorage.getItem("emp_id");
    if (emp_id !== null) {
      this.props.navigation.navigate("Dashboard");
    }
  };

  //TODO:createSession
  createSession = async () => {
    try {
      await AsyncStorage.setItem("emp_id", this.state.emp_id.toString());
      this.props.navigation.navigate("Dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  //TODO:Login
  login = (emp_login_id, emp_password) => {
    console.log("Hello");
    if (this.state.emp_login_id !== "" && this.state.emp_password !== "") {
      fetch(
        `http://192.168.0.60:7000/login?emp_login_id=${emp_login_id}&emp_password=${emp_password}`
      )
        .then(response => response.json())
        .then(JSONResponse => {
          console.log(JSONResponse);
          console.log(JSONResponse[0]["emp_id"]);
          if (JSONResponse[0]["emp_id"] === "Not found") {
            Alert.alert("User ID OR Password Not Correct!!!");
          } else {
            this.setState({
              emp_id: JSONResponse[0]["emp_id"]
            });
            this.createSession();
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      Alert.alert("All fields are Required!!!");
    }
  };
  render() {
    return (
      <SafeAreaView>
        <Card style={{ padding: 10 }}>
          <Image
            source={require("../assets/icon.png")}
            style={{
              marginTop: 50,
              alignSelf: "center",
              width: 50,
              height: 50,
              marginBottom: 2,
              borderRadius: 10
            }}
          />
          <Text
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "600"
            }}
          >
            integratio
          </Text>
          <Form style={{ margin: 10 }}>
            <Item>
              <Input
                style={styles.inputBox}
                placeholder="User ID"
                keyboardType="number-pad"
                onChangeText={emp_login_id => {
                  this.setState({ emp_login_id });
                }}
              />
            </Item>

            <Item>
              <Input
                style={styles.inputBox}
                secureTextEntry={true}
                placeholder="Password"
                onChangeText={emp_password => {
                  this.setState({ emp_password });
                }}
              />
            </Item>
            <TouchableOpacity>
              <Button
                full
                rounded
                style={{ marginTop: 20, backgroundColor: "#FFC312" }}
                onPress={() => {
                  this.login(this.state.emp_login_id, this.state.emp_password);
                }}
              >
                <Text style={{ color: "#fff", fontSize: 20 }}>Login</Text>
              </Button>
            </TouchableOpacity>
          </Form>
        </Card>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  inputBox: {
    backgroundColor: "#fafafa",
    marginBottom: 10,
    borderRadius: 20,
    paddingLeft: 40
  }
});
