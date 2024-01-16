import React from "react";
import { View, StyleSheet, Text, Image, Dimensions, useWindowDimensions, ScrollView, 
        TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
//import { TabView, SceneMap } from 'react-native-tab-view';        //npm i react-native-tab-view
//npm install @react-native-community/masked-view react-native-select-dropdown
//import SelectDropdown from "react-native-select-dropdown";


const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;


const DailyAssignment = ({navigation}) => {

    const Subjects = ['All Subjects', 'Hindi', 'English', 'EVS', 'Mathe', 'Sanskrat', 'Science', 'Social Science'];
    const [SelectedSubject, set_Subject] = React.useState('All Subjects');
    const [DataS, set_data] = React.useState([]);
    const [isLoading, reset_isLoading]=React.useState(true);
  
    const FetchPersonal=()=>{
  
      fetch('http://skygroup.rootstechnology.in/school/api/Webservice/getHomework', {
        method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
        body: JSON.stringify({student_id: "29"})
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
        if(Itm.name == SelectedSubject || SelectedSubject == "All Subjects"){
            return(
            <View style={styles.SContainer}>
                <View style={styles.CardView2}>
                    <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05, backgroundColor: "#BAFAFF",
                                    borderTopLeftRadius: 15, borderTopRightRadius: 15, justifyContent: "center"}}>
                        <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold"}}>{Itm.name}</Text>
                    </View>
                    <View style={styles.Column2}>
                        <View style={styles.Row2}>
                            <Text style={{width: DEVICEWIDTH * 0.4, color: "#000000"}}>Homework Dt.</Text>
                            <Text style={{width: DEVICEWIDTH * 0.1, color: "#000000"}}>:</Text>
                            <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "700"}}>{Itm.homework_date}</Text>
                        </View>
                        <View style={styles.Row2}>
                            <Text style={{width: DEVICEWIDTH * 0.4, color: "#000000"}}>Submission Dt.</Text>
                            <Text style={{width: DEVICEWIDTH * 0.1, color: "#000000"}}>:</Text>
                            <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "700"}}>{Itm.submit_date}</Text>
                        </View>
                        <View style={styles.Row2}>
                            <Text style={{width: DEVICEWIDTH * 0.4, color: "#000000"}}>Created By</Text>
                            <Text style={{width: DEVICEWIDTH * 0.1, color: "#000000"}}>:</Text>
                            <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "700"}}>{Itm.created_by}</Text>
                        </View>
                        <View style={styles.Row2}>
                            <Text style={{width: DEVICEWIDTH * 0.4, color: "#000000"}}>Evaluated By</Text>
                            <Text style={{width: DEVICEWIDTH * 0.1, color: "#000000"}}>:</Text>
                            <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "700"}}>{Itm.evaluated_by}</Text>
                        </View>
                        <View style={styles.Row2}>
                            <Text style={{width: DEVICEWIDTH * 0.4, color: "#000000"}}>Evaluation Dt.</Text>
                            <Text style={{width: DEVICEWIDTH * 0.1, color: "#000000"}}>:</Text>
                            <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "700"}}>{Itm.evaluation_date}</Text>
                        </View>
                        <View style={styles.Row2}>
                            <Text style={{width: DEVICEWIDTH * 0.4, color: "#000000"}}>Marks</Text>
                            <Text style={{width: DEVICEWIDTH * 0.1, color: "#000000"}}>:</Text>
                            <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "700"}}>35</Text>
                        </View>
                        <View style={styles.Row2}>
                            <Text style={{width: DEVICEWIDTH * 0.4, color: "#000000"}}>Marks Obtained</Text>
                            <Text style={{width: DEVICEWIDTH * 0.1, color: "#000000"}}>:</Text>
                            <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "700"}}>34</Text>
                        </View>
                        <View style={styles.Row2}>
                            <Text style={{width: DEVICEWIDTH * 0.4, color: "#000000"}}>Note</Text>
                            <Text style={{width: DEVICEWIDTH * 0.1, color: "#000000"}}>:</Text>
                            <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "700"}}></Text>
                        </View>
                    </View>
                    <View style={{flexDirection: "row", marginTop: 20, marginLeft: 10}}>
                            <Text style={{width: DEVICEWIDTH * 0.4, color: "#000000",}}>
                                Description</Text>
                    </View>
                        <Text style={{width: DEVICEWIDTH * 0.7, fontWeight: "700", marginLeft: 10}}>
                            Please submit homework before last date.</Text>
                </View>
            </View>
            );
        }
    }

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
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Your Daily</Text>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Assignment !</Text>
                        </View>
                            <View style={{width: DEVICEWIDTH * 0.27, flexDirection: "column", alignItems: "center"}}>
                                <Image source={require('../assets/Assignment.jpg')} style={{width: 100, height: 100, 
                                    borderRadius: 20,}}/>
                            </View>
                    </View>
                </View>
                <FlatList contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                    data={DataS.homeworklist}
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
export default DailyAssignment;

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
        height: DEVICEHEIGHT * 0.5,
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