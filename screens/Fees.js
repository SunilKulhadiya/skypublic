import React from "react";
import { View, StyleSheet, Text, Image, Dimensions, ActivityIndicator, FlatList, 
        SafeAreaView, ScrollView, RefreshControl } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';   

import config from "./app_config";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;


const Fees = ({navigation}) => {

    const[BaseURL, set_BaseURL] = React.useState('');
    const [isLoading, reset_isLoading]=React.useState(true);
    const [DataS, set_data] = React.useState([]);
    const [StudentName, set_StudName] = React.useState("");
    const [StdID, set_StdID] = React.useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [color, changeColor] = React.useState('red');


    const FetchPersonal=async ()=>{
        reset_isLoading(true);
        AsyncStorage.getItem('StdID').then((value) => set_StdID(value));
        try {
            let result = await fetch(config.Url+'fees?', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
            body: JSON.stringify({student_id: StdID})
            })

            let response = await result.json();
            set_data(response);
            console.log("Fees, response : ", response);
            console.log("Stud fees length : ", DataS.length);
            reset_isLoading(false);
            setRefreshing(false);

        }catch(error) {
          console.error("CAtt -1 : ",error);
          reset_isLoading(false);
        }
    }
      React.useEffect(() => {
        FetchPersonal();
      }, []);

      const onRefresh = () => {
        setRefreshing(true);
        changeColor('red');
        FetchPersonal();
        setTimeout(() => {
          changeColor('green');
          setRefreshing(false);
        }, 2000);
    };

      
   return (
    <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={{padding: 10, alignItems: "center", height: DEVICEHEIGHT * 0.15}}>
                    <View style={styles.Row1}>
                        <View style={styles.Column1}>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Your Fees</Text>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Status is here!</Text>

                        </View>
                            <View style={{width: DEVICEWIDTH * 0.27, flexDirection: "column", alignItems: "center"}}>
                                <Image source={require('../assets/SchoolFees.png')} style={{width: 120, height: 100, 
                                    borderRadius: 20}}/>
                            </View>
                        </View>
                    </View>
        </ScrollView>
        { DataS.length !== 0 ? (
                <View>
                {
                    isLoading ? (
                        <ActivityIndicator/>
                    ):(
                        <View style={styles.Mcontainer}>

                            <View style={styles.SContainer}>
                                <View style={styles.CardView1}>
                                    <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05, 
                                                backgroundColor: "#BAFAFF", borderTopLeftRadius: 15, 
                                                borderTopRightRadius: 15, justifyContent: "center"}}>
                                        <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold"}}>
                                            Student</Text>
                                    </View>
                                    <View style={{flexDirection: "column", marginLeft: 10, 
                                                marginTop: 10, marginBottom: 10}}>
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={{width: DEVICEWIDTH * 0.2}}>Name</Text>
                                            <Text style={{width: DEVICEWIDTH * 0.03}}>:</Text>

                                            <Text style={{width: DEVICEWIDTH * 0.7, fontWeight: "bold"}}>
                                                  {DataS.studentdetails.firstname} {DataS.studentdetails.middlename}
                                                    {DataS.studentdetails.lastname}
                                            </Text>

                                            </View>
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={{width: DEVICEWIDTH * 0.2}}>Class</Text>
                                            <Text style={{width: DEVICEWIDTH * 0.03}}>:</Text>
                                            <Text style={{width: DEVICEWIDTH * 0.7}}>
                                                {DataS.studentdetails.class} | Section - 
                                                        {DataS.studentdetails.section}</Text>
                                        </View>
                                        <View style={{flexDirection: "row"}}>
                                        <Text style={{width: DEVICEWIDTH * 0.2}}>S/o.</Text>
                                            <Text style={{width: DEVICEWIDTH * 0.03}}>:</Text>
                                            <Text style={{width: DEVICEWIDTH * 0.7}}>
                                                {DataS.studentdetails.father_name}</Text>
                                        </View>
                                                        
                                    </View>
                                </View>
                                <View style={styles.CardView2}>
                                    <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05, 
                                                backgroundColor: "#BAFAFF", borderTopLeftRadius: 15, 
                                                borderTopRightRadius: 15, justifyContent: "center"}}>
                                        <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold"}}>Status</Text>
                                    </View>

                                    <View style={{flexDirection: "column", marginLeft: 10,
                                                marginTop: 10, marginBottom: 10}}>
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 17, fontWeight: "bold"}}>
                                                Total Fees</Text>
                                            <Text style={{width: DEVICEWIDTH * 0.03, fontSize: 17}}>:</Text>
                                            <Text style={{fontWeight: "bold", fontSize: 17}}>
                                                {DataS.grand_fee.amount}
                                            </Text>
                                            <MaterialCommunityIcons name="currency-inr" size={22} color="#0CD021" />
                                        </View>
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 17}}>Paid Fees</Text>
                                            <Text style={{width: DEVICEWIDTH * 0.03, fontSize: 17}}>:</Text>
                                            <Text style={{fontSize: 17}}>
                                                {DataS.grand_fee.amount_paid}</Text>
                                            <MaterialCommunityIcons name="currency-inr" size={22} color="#000000" />
                                        </View>
                                        <View style={{height: 1, backgroundColor: "#000000", 
                                                        width: DEVICEWIDTH * 0.7}}></View>
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "bold", fontSize: 17}}>
                                                Balance Fees</Text>
                                            <Text style={{width: DEVICEWIDTH * 0.03, fontSize: 17}}>:</Text>
                                            <Text style={{fontWeight: "bold", fontSize: 17}}>
                                                {DataS.grand_fee.amount_remaining}</Text>
                                            <MaterialCommunityIcons name="currency-inr" size={22} color="#FFC00D" />
                                        </View>


                                    </View>

                                </View>
                            </View>
                            </View>
                              )                    
                }
                </View>
                ) : (
                    <View></View>
                )}
    </SafeAreaView>
  );
};
export default Fees;

const styles = StyleSheet.create({
    Mcontainer: {
        width: DEVICEWIDTH,
        height: DEVICEHEIGHT,
    },
    SContainer: {
        marginTop: DEVICEHEIGHT * 0.01,
        left: "2.35%",        
    },
    CardView1: {
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
        marginLeft: 10,
        marginTop: 10,
    },
    Column1: {
        flexDirection: "column",
        width: DEVICEWIDTH * 0.64,
    },
    Column2: {
        flexDirection: "column",
        width: DEVICEWIDTH,
        marginLeft: 10,
        marginTop: 35,
    },
    dropdownBtnStyle: {
        textAlign: "center",
        width: '55%',
        height: DEVICEHEIGHT * 0.04,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginTop: DEVICEHEIGHT * 0.017,
        left: "1.6%",
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



/*
                            <SelectDropdown data={ClassForAtt} onSelect={(selectedItem, index)=>{
                                console.log(selectedItem, index)
                                set_ClassAtt(selectedItem)
                                }  } 
                                defaultButtonText={"Select Class"}
                                buttonTextAfterSelection={(selectedItem, index)=>{
                                    //handleProduct(selectedItem);
                                    return selectedItem;  }
                                }
                                rowTextForSelection={(item, index)=>{ return item; }}
                                renderDropdownIcon={isOpened =>{
                                    return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'}
                                                        color={'#000000'} size={18} style={styles.DropDIcon}/>;
                                }}
                                buttonStyle={styles.dropdownBtnStyle}
                                buttonTextStyle={styles.dropdownBtnTextStyle}
                                
                            />
*/