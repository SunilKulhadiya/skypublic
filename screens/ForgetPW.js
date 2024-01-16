import React from "react";
import { View, Text, StyleSheet, Dimensions, TextInput, Image, ImageBackground,
            SafeAreaView, StatusBar, Button} from "react-native";

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const ResetPW = ({navigation}) => {



return (
    <SafeAreaView>
    <StatusBar barStyle={"dark-content"} backgroundColor="#ecf0f1" />
      <View style={styles.container}>
        <Text>Reset Password !</Text>
      </View>
  </SafeAreaView>

  );

}

export default ResetPW;

const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      width: DEVICE_WIDTH,
      height: DEVICE_HEIGHT,
    },
  
  });
  