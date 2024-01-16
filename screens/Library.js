import React from "react";
import { View, StyleSheet, Text, Image, Dimensions, useWindowDimensions, ActivityIndicator, FlatList, 
        TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
//import { TabView, SceneMap } from 'react-native-tab-view';        //npm i react-native-tab-view
//npm install @react-native-community/masked-view react-native-select-dropdown
import SelectDropdown from "react-native-select-dropdown";
import AsyncStorage from '@react-native-async-storage/async-storage';   


const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;


const Library = ({navigation}) => {

    const [isLoading, reset_isLoading]=React.useState(true);
    const [DataS, set_data] = React.useState([]);
    const [StdID, set_StdID] = React.useState(false);
    const [Class, set_Class] = React.useState(false);
    const [Section, set_Section] = React.useState(false);
    const[Role, set_Role] = React.useState('');

    AsyncStorage.getItem('StdID').then((value) => set_StdID(value));
    AsyncStorage.getItem('CLASS').then((value) => set_Class(value));
    AsyncStorage.getItem('SECTION').then((value) => set_Section(value));
    AsyncStorage.getItem('ROLE').then((value) => set_Role(value));

    const FetchPersonal=async ()=>{
        AsyncStorage.getItem('SERVERURL').then(async (value) => {

            try {
                let result = await fetch(value+'api/Webservice/getLibraryBookIssued', {
                method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                body: JSON.stringify({studentId: StdID, member_type: Role})
                })

                let response = await result.json();
            
                set_data(response);

            reset_isLoading(false);
            }catch(error) {
            console.error("PD -1 : ",error);
            }
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
                                borderTopLeftRadius: 15, borderTopRightRadius: 15, justifyContent: "center"}}>
                    <View style={styles.Row1}>
                        <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold", width: DEVICEWIDTH * 0.6}}>
                            {Itm.book_title}</Text>
                        {Itm.is_returned == "1" ? 
                            <Text style={{backgroundColor: "#E96211", borderRadius: 8, width: DEVICEWIDTH * 0.28,
                                         textAlign: "center", color: "#FFFFFF"}}>Not Returned</Text>
                         : <Text></Text>}
                    </View>
                </View>

                <View style={styles.Column2}>
                    <View style={styles.Row2}>
                        <Text style={{width: DEVICEWIDTH * 0.28, color: "#000000"}}>Author</Text>
                        <Text style={{width: DEVICEWIDTH * 0.06, color: "#000000"}}>:</Text>
                        <Text style={{width: DEVICEWIDTH * 0.25, fontWeight: "700"}}>{Itm.author}</Text>
                    </View>
                    <View style={styles.Row2}>
                        <Text style={{width: DEVICEWIDTH * 0.28, color: "#000000"}}>Book No.</Text>
                        <Text style={{width: DEVICEWIDTH * 0.06, color: "#000000"}}>:</Text>
                        <Text style={{width: DEVICEWIDTH * 0.25, fontWeight: "700"}}>{Itm.book_no}</Text>
                    </View>
                    <View style={styles.Row2}>
                        <Text style={{width: DEVICEWIDTH * 0.28, color: "#000000"}}>Issued Dt.</Text>
                        <Text style={{width: DEVICEWIDTH * 0.06, color: "#000000"}}>:</Text>
                        <Text style={{width: DEVICEWIDTH * 0.25, fontWeight: "700"}}>{Itm.issue_date}</Text>
                    </View>
                    <View style={styles.Row2}>
                        <Text style={{width: DEVICEWIDTH * 0.28, color: "#000000"}}>Returned Dt.</Text>
                        <Text style={{width: DEVICEWIDTH * 0.06, color: "#000000"}}>:</Text>
                        <Text style={{width: DEVICEWIDTH * 0.25, fontWeight: "700"}}>{Itm.return_date}</Text>
                    </View>
                    <View style={styles.Row2}>
                        <Text style={{width: DEVICEWIDTH * 0.28, color: "#000000"}}>Due Return Dt.</Text>
                        <Text style={{width: DEVICEWIDTH * 0.06, color: "#000000"}}>:</Text>
                        <Text style={{width: DEVICEWIDTH * 0.25, fontWeight: "700"}}>{Itm.due_return_date}</Text>
                    </View>
                    <View style={{marginTop: 20}}></View>
                </View>
        </View>
        </View>
        );
    }


   return (
    <SafeAreaView>
    <View style={styles.Mcontainer}>
                <View style={{padding: 10, alignItems: "center", height: DEVICEHEIGHT * 0.15}}>
                    <View style={styles.Row1}>
                        <View style={styles.Column1}>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Your Issued</Text>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Books is here!</Text>

                        </View>
                            <View style={{width: DEVICEWIDTH * 0.27, flexDirection: "column", alignItems: "center"}}>
                                <Image source={require('../assets/books.png')} style={{width: 120, height: 100, 
                                    borderRadius: 20,}}/>
                            </View>
                        </View>
                    </View>

                <View>
                {
                    isLoading ? (
                        <ActivityIndicator/>
                    ):(
                        <View style={styles.Mcontainer}>
        
                        <FlatList contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                            data={DataS}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item, index}) => ShowList(item, index)}
                        />
                             <View style={{marginTop: 70}}></View>
                        </View>
        
                              )                    
                }
                </View>
    </View>
    </SafeAreaView>
  );
};
export default Library;

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
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        width: DEVICEWIDTH * 0.95,
        marginTop: DEVICEHEIGHT * 0.12,
        marginBottom: -DEVICEHEIGHT * 0.1,
    },
    Row1: {
        flexDirection: "row",
    },
    Row2: {
        flexDirection: "row",
    },
    Column1: {
        flexDirection: "column",
        width: DEVICEWIDTH * 0.64,
    },
    Column2: {
        flexDirection: "column",
        width: DEVICEWIDTH * 0.65,
        marginLeft: 10,
        marginTop: 5,
    },
    
});