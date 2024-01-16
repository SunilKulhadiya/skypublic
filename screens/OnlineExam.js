import React from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { AntDesign } from '@expo/vector-icons';

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

const OnlineExam = ({navigation}) => {
  return (
    <View style={{alignItems: "center", justifyContent: "center"}}>
        <Text>Sorry, there is no data</Text>
    </View>
  );
};
export default OnlineExam;