import React from "react";
import { View, StyleSheet, Text, Image, Dimensions, useWindowDimensions, ScrollView, 
        ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';   

import config from "./app_config";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;


const SyllabusStatus = ({navigation}) => {

    const [DataS, set_data] = React.useState([]);
    const [isLoading, reset_isLoading]=React.useState(true);
    const [StdID, set_StdID] = React.useState(false);
    const [Class_ID, set_Class_ID] = React.useState(false);
    const [SessionID, set_SessionID] = React.useState(false);

    AsyncStorage.getItem('StdID').then((value) => set_StdID(value));
    AsyncStorage.getItem('CLASS_ID').then((value) => set_Class_ID(value));
    AsyncStorage.getItem('SESSION_ID').then((value) => set_SessionID(value));
  
    const FetchPersonal=()=>{
  
      fetch(config.Url+'getsyllabussubjects', {
        method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
        body: JSON.stringify({student_id: StdID, class_id: Class_ID, section_id: SessionID})
      })
      .then(response => response.json())
      .then(( responseJson ) => {
        console.log("Json :"+JSON.stringify(responseJson));
        set_data(responseJson);
        reset_isLoading(false);
      }).catch((error) => {
        console.error("PD -1 : ",error);
      });
    }
    React.useEffect(() => {
      FetchPersonal()
    }, []);

    const ShowList = (Itm, Index) => {
            return(
            <View style={styles.SContainer}>
                <View style={styles.CardView2}>
                    <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05, backgroundColor: "#BAFAFF",
                                    borderTopLeftRadius: 15, borderTopRightRadius: 15,
                                    flexDirection: "row",alignItems: "center"}}>
                        <Image source={require('../assets/open-book-blue.png')} 
                                style={{width: 40, height: 40, marginLeft: 10 }}/>
                        <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold", fontSize: 14,
                                        width: DEVICEWIDTH * 0.49}}>
                                {Itm.subject_name}</Text>
                        <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold", fontSize: 12}}>
                                {Itm.total_complete} % Completed</Text>
                    </View>
                    <View >
                    <View style={{flexDirection: "row", justifyContent: "flex-end", width: DEVICEWIDTH*1.4,
                                    marginTop: 10}}>
                        <Ionicons name="newspaper-outline" size={24} color="black" />
                        <Text style={{width: DEVICEWIDTH * 0.7, fontWeight: "700", marginLeft: 10, color: "blue"}}>
                            Lesson Topic</Text>
                            </View>
                    </View>
                </View>
            </View>
            );
    }
//--------------------------------
   return (
    <View>
    {
        isLoading ? (
            <ActivityIndicator/>
        ):(
            <View style={styles.Mcontainer}>
                <View style={{padding: 10, alignItems: "center", height: DEVICEHEIGHT * 0.15}}>
                    <View style={styles.Row1}>
                        <View style={styles.Column1}>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Your Syllabus</Text>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Status is here!</Text>

                        </View>
                            <View style={{width: DEVICEWIDTH * 0.27, flexDirection: "column", alignItems: "center"}}>
                                <Image source={require('../assets/syllabusStatus.jpg')} style={{width: 100, height: 100, 
                                    borderRadius: 20,}}/>
                            </View>
                    </View>
                </View>
                <FlatList contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                    data={DataS.subjects}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => ShowList(item, index)}
                />
                     <View style={{marginTop: 70}}></View>
            </View>
        )
    }
    </View>
  );
};

export default SyllabusStatus;

const styles = StyleSheet.create({
    Mcontainer: {
        width: DEVICEWIDTH,
        height: DEVICEHEIGHT,
    },
    SContainer: {
        marginTop: DEVICEHEIGHT * 0.01,
        left: "2.35%",
    },
    CardView2: {
        left: "40%",        
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        height: DEVICEHEIGHT * 0.13,
        width: DEVICEWIDTH * 0.95,
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        marginTop: DEVICEHEIGHT * 0.12,
        marginBottom: -DEVICEHEIGHT * 0.1,
    },
    Row1: {
        flexDirection: "row",
    },
    Row2: {
        flexDirection: "row",
        marginTop: 10,
    },
    Column1: {
        flexDirection: "column",
        width: DEVICEWIDTH * 0.64,
    },
    Column2: {
        flexDirection: "column",
        width: DEVICEWIDTH * 0.93,
        alignItems: "center",
    },
    
});