import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  ActivityIndicator
} from "react-native";
import { Font } from "expo";
import {
  Container,
  Button,
  Header,
  Left,
  Title,
  Icon,
  Body
} from "native-base";

import { MapView } from "expo";
export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emp_id: null,
      ready: false,
      where: {
        lat: null,
        lng: null
      },
      error: null,
      buttonShowHide: true,
      address: "",
      lastInsterCheckInId: "",
      isLoading: true
    };
  }
  async componentDidMount() {
    this.checkSession();
    // this.getLocation();

    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });

    this.setState({
      isLoading: false
    });
    this.forceUpdate();
  }

  componentWillUnmount(){
    getLocation()
  }
  //   TODO: getLocation
  getLocation = async () => {
    let geoOptions = {
      enableHighAccuracy: true,
      timeOut: 20000,
      maximuxAge: 30000
    };

    await navigator.geolocation.getCurrentPosition(
      this.geoSuccess,
      this.geoFailure,
      geoOptions
    );
  };

  //TODO:addCheckInData
  addCheckInData = async (emp_id, lat, lng) => {
    this.getLocation();
    await fetch(
      `http://192.168.0.60:7000/checkin?emp_id=${emp_id}&lat=${emp_id}&lng=${lng}`
    )
      .then(response => response.json())
      .then(JSONResponse => {
        console.log(JSONResponse);
        this.setState({
          buttonShowHide: false,
          lastInsterCheckInId: JSONResponse.toString()
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  //TODO:addCheckOutData
  addCheckOutData = async (lastInsterCheckInId, emp_id, lat, lng) => {
    this.getLocation();
    await fetch(
      `http://192.168.0.60:7000/checkOut?checkInId=${lastInsterCheckInId}&emp_id=${emp_id}&lat=${lat}&lng=${lng}`
    )
      .then(response => response.json())
      .then(JSONResponse => {
        console.log(JSONResponse);
        this.setState({ buttonShowHide: true });
      })
      .catch(error => {
        console.log(error);
      });
  };

  getAddress = async (lat, lng) => {
    await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=your-api-key `
    )
      .then(response => response.json())
      .then(JSONResponse => {
        console.log(JSONResponse);
      })
      .catch(err => {
        console.log(err);
      });
  };

  checkSession = async () => {
    const emp_id = await AsyncStorage.getItem("emp_id");
    this.setState({
      emp_id: emp_id
    });

    if (this.state.emp_id === null) {
      this.props.navigation.navigate("Auth");
    }
  };

  geoSuccess = async position => {
    await this.setState({
      where: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    });
  };

  geoFailure = err => {
    Alert.alert(err);
  };

  removeSession = async () => {
    const emp_id = await AsyncStorage.removeItem("emp_id");
    this.setState({
      emp_id: emp_id
    });

    if (this.state.emp_id === null) {
      this.props.navigation.navigate("Auth");
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <Container>
        <Header style={{ marginTop: 20, backgroundColor: "#FFC312" }}>
          <Left>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.toggleDrawer();
              }}
            >
              <Icon name="menu" style={{ color: "#fff" }} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title>Dashboard</Title>
          </Body>
        </Header>

        <MapView
          style={{ flex: 1, height: 600 }}
          showsUserLocation
          initialRegion={{
            latitude: 30.7333,
            longitude: 76.7794,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0821
          }}
        >
          <MapView.Marker
            coordinate={{ latitude: 30.7333, longitude: 76.7794 }}
            title="My Marker"
            description="Some description"
          />
        </MapView>
        <View style={styles.container}>
          {this.state.buttonShowHide ? (
            <Button
              success
              full
              onPress={() => {
                this.addCheckInData(
                  this.state.emp_id,
                  this.state.where.lat,
                  this.state.where.lng
                );
              }}
              style={{
                margin: 6,
                padding: 10
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                  padding: 10,
                  color: "#fff"
                }}
              >
                Clock-in {this.state.lastInsterCheckInId}
              </Text>
            </Button>
          ) : (
            <Button
              full
              block
              style={{ margin: 6, padding: 10, backgroundColor: "#FF3031" }}
              onPress={() => {
                this.addCheckOutData(
                  this.state.lastInsterCheckInId,
                  this.state.emp_id,
                  this.state.where.lat,
                  this.state.where.lng
                );
              }}
            >
              <Text style={{ fontSize: 26, padding: 10, color: "#fff" }}>
                Clock-out
              </Text>
            </Button>
          )}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  textBox: {
    backgroundColor: "#fafafa"
  }
});
