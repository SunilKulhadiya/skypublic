import React from "react";
import { View, StyleSheet, Text, Image, Dimensions, useWindowDimensions, ScrollView, ActivityIndicator } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { TabView, SceneMap } from 'react-native-tab-view';        //npm i react-native-tab-view
import AsyncStorage from '@react-native-async-storage/async-storage';   

import ProfileOther from "../screens/ProfileOther";

import {Attendance} from "../screens/Attendance";
import {AttendanceReg} from "../screens/AttendanceReg";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;


export default function AttendanceDrawer() {
      try{
        AsyncStorage.getItem('ROLE').then((value) => {
            console.log("Drawer Attendance Role : ", value);
            if(value == "Staff"){
                return(
                    <View>
                <AttendanceReg/>
                </View>
                );
              }else{
                return(
                    <View>
                <Attendance/>
                </View>
                );
              }
        });
      } catch(e){
        console.error("Drawer Async : ", e);
      }
}