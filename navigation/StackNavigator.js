import React, {useState, Component } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { AntDesign } from '@expo/vector-icons';
import { Badge } from "react-native-elements";
import { Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, View,
  Image, SafeAreaView} from "react-native";

import HomeWork from "../screens/HomeWork"

const Stack = createNativeStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#9AC4F8",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};

const HomeWorks = () => {
  return (
        <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen name="HomeWork" component={HomeWork} options={{title: 'Home Work'}}/>
        </Stack.Navigator>
    );
  }
  
  const Shop = () => {
    return (
      <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Shop" component={ShopCartV} options={{title: 'Shopping Cart'}} />
      </Stack.Navigator>
    );
  }

  const YourSelf = () => {
    return (
      <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="YourSelf" component={ShareYourSelf} options={{title: 'Share Your Self'}}/>
      </Stack.Navigator>
    );
  }

  const Aboutus = () => {
    return (
      <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Aboutus" component={AboutUs1} options={{title: 'About us'}}/>
      </Stack.Navigator>
    );
  }

  export { HomeWorks, Shop, YourSelf, Aboutus, };

  const styles = StyleSheet.create({
    badge: {
      borderRadius: 9,
      height: 18,
      minWidth: 0,
      width: 18
    },
    badgeContainer: {
      position: "absolute"
    },
    badgeText: {
      fontSize: 10,
      paddingHorizontal: 0
    }
  });