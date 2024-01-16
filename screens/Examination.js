import React from "react";
import { View, StyleSheet, Text, Image, Dimensions, useWindowDimensions, ScrollView, 
        TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
//import { TabView, SceneMap } from 'react-native-tab-view';        //npm i react-native-tab-view
//npm install @react-native-community/masked-view react-native-select-dropdown
//import SelectDropdown from "react-native-select-dropdown";


const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;


const Examination = ({navigation}) => {


   return (
    <View style={styles.Mcontainer}>
                <View style={{padding: 10, alignItems: "center", height: DEVICEHEIGHT * 0.15}}>
                    <View style={styles.Row1}>
                        <View style={styles.Column1}>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Your</Text>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Examination</Text>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>is here!</Text>
                        </View>
                            <View style={{width: DEVICEWIDTH * 0.27, flexDirection: "column", alignItems: "center"}}>
                                <Image source={require('../assets/examination.jpg')} style={{width: 120, height: 100, 
                                    borderRadius: 20,}}/>
                            </View>
                    </View>
                </View>
                <View>
                </View>


        <ScrollView showsVerticalScrollIndicator={false} style={styles.SContainer}>
        <View style={styles.CardView2}>
            <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05, backgroundColor: "#000000",
                            borderTopLeftRadius: 15, borderTopRightRadius: 15, justifyContent: "center"}}>
                <Text style={{color: "#FFFFFF", marginLeft: 10, fontWeight: "bold"}}>HINDI</Text>
                
            </View>
        </View>
        <View style={styles.CardView2}>
            <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05, backgroundColor: "#000000",
                            borderTopLeftRadius: 15, borderTopRightRadius: 15, justifyContent: "center"}}>
                <Text style={{color: "#FFFFFF", marginLeft: 10, fontWeight: "bold"}}>ENGLISH</Text>
                
            </View>
        </View>
        </ScrollView>



    </View>
  );
};
export default Examination;

const styles = StyleSheet.create({
    Mcontainer: {
        width: DEVICEWIDTH,
        height: DEVICEHEIGHT,
    },
    SContainer: {
        marginTop: DEVICEHEIGHT * 0.04,
        left: "2.25%"
    },
    SContainer2: {
        marginTop: DEVICEHEIGHT * 0.001,
    },
    CardView2: {
        left: "40%",        
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        height: DEVICEHEIGHT * 0.45,
        width: DEVICEWIDTH * 0.95,
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        marginTop: DEVICEHEIGHT * 0.12,
        marginBottom: -DEVICEHEIGHT * 0.1,
    },
    Row1: {
        flexDirection: "row",
    },
    Column1: {
        flexDirection: "column",
        width: DEVICEWIDTH * 0.6,
    },
    viewPager: {
        flex: 1,
      },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownBtnStyle: {
        textAlign: "left",
        width: '95%',
        height: DEVICEHEIGHT * 0.04,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginTop: DEVICEHEIGHT * 0.017,

    },
    dropdownBtnTextStyle: {
        color: '#000000',
        textAlign: "left",
        fontWeight: 'bold',
        width: 350,
    },
    DropDIcon: {
    right: 0,
    },
    
});