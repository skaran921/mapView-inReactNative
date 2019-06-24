import Loading from "./screens/Loading";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
  DrawerItems
} from "react-navigation";
import {
  SafeAreaView,
  ScrollView,
  Dimensions,
  Text,
  View,
  Button,
  Alert,
  AsyncStorage
} from "react-native";
import React from "react";

// TODO: checkSession

const customDrawerComponent = props => (
  <SafeAreaView style={{ flex: 1, zIndex: 1 }}>
    <ScrollView>
      <View
        style={{
          height: 350,
          backgroundColor: "#fff",
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text>Welcome</Text>
      </View>

      <View
        style={{
          height: 150,
          backgroundColor: "#fff",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          bottom: 0
        }}
      >
        <Button
          title="Close"
          color="#f00"
          style={{ marginBottom: 10, flex: 1, width: "100%" }}
          onPress={() => {
            props.navigation.closeDrawer();
          }}
        />
        <Button
          title="Logout"
          style={{ marginTop: 10, width: "100%" }}
          color="#111"
          onPress={() => {
            Alert.alert(
              "Logout?",
              "Are You Sure?",
              [
                {
                  text: "Cancel",
                  onPress: () => {}
                },
                {
                  text: "Sure",
                  onPress: () => {
                    AsyncStorage.clear();
                    props.navigation.navigate("Auth");
                  }
                }
              ],
              {
                cancelable: false
              }
            );
          }}
        />
      </View>
    </ScrollView>
  </SafeAreaView>
);

//TODO:AuthStack
const AuthStack = createStackNavigator(
  {
    Loading: { screen: Loading },
    Login: { screen: Login }
  },
  {
    defaultNavigationOptions: {
      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: "#FFC312"
      },
      headerTitleStyle: {
        color: "#fff"
      }
    }
  }
);
const myNavigator = createDrawerNavigator(
  {
    Dashboard: { screen: Dashboard }
  },
  {
    drawerBackgroundColor: "#fafafa",
    contentComponent: customDrawerComponent
  }
);

const App = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: Loading,
      App: myNavigator,
      Auth: AuthStack
    },
    {
      initialRouteName: "Auth"
    }
  )
);
export default App;
