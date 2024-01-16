import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, ActivityIndicator, Image, 
        Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';   

import config from './app_config';

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

export default function FeesReceiptDetails({navigation, route}) {

    const[FetchData, set_FetchData] = React.useState([]);
    const [isLoading, reset_isLoading]=React.useState(false);
    const [isLoadingFlatList, reset_isLoadingFlatList]=React.useState(true);

    FetchPersonal = async ()=>{

        try{
            let respons1 = await fetch(config.Url+'getmobliefeeslist', {
                method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
            })
      
            let responseSFM = await respons1.json();

            console.log("Stud fees ID : ", route.params.StudentID);
            
            setTimeout(()=> {
                for(i = 0; i<responseSFM.data.length; i++){
                    if(responseSFM.data[i].student_id == route.params.StudentID){

                        console.log("Stud fees installments-1 : ", responseSFM.data[i]);

                        TFeesInst = Object.entries(responseSFM.data[i].amount_detail).map(function(entry){
                            key = entry[0];
                            value = entry[1];
                
                            nested_object = value;
                            nested_object.key = key;
                
                            return nested_object;
                        })

                        set_FetchData(TFeesInst);
                        console.log("Stud fees installments : ", TFeesInst);
                        i = responseSFM.data.length+1;
                    }
                }
            }, 1000);
            
            reset_isLoadingFlatList(true);
            reset_isLoading(false);
    
        }catch(err){
              console.error("Error-1 : ",err);
        }
    }

    React.useEffect(() => {
        FetchPersonal();
    },[]);
  
  const ShowList = (Itms, Index) => {
    return(
        <View style={{flexDirection: 'column'}}>
            <View style={{flexDirection: 'row', marginLeft: 10, marginTop: 5,}}>
                <Text style={{width: DEVICEWIDTH * 0.22, color: "#000000", fontSize: 16}}>
                    {(Itms.date)}</Text>
                <Text style={{width: DEVICEWIDTH * 0.06, color: "#000000", fontSize: 16}}>:</Text>
                <Text style={{width: DEVICEWIDTH * 0.4, color: "#000000", fontSize: 16}}>
                    {Itms.amount} + {Itms.amount_discount} - {Itms.amount_fine}</Text>
                <Text style={{width: DEVICEWIDTH * 0.05, color: "#000000", fontSize: 16}}>=</Text>
                <Text style={{width: DEVICEWIDTH * 0.3, color: "#000000", fontSize: 16}}>
                   {parseFloat(Itms.amount) + parseFloat(Itms.amount_discount) - parseFloat(Itms.amount_fine)}</Text>
            </View>
                <View style={{width: DEVICEWIDTH * 0.948, height: 2, 
                    backgroundColor: "#F5EDF5", marginTop: 5}}></View>
        </View>
    );
}

  return (
    <SafeAreaView>
    <View style={styles.Mcontainer}>
                <View style={{padding: 10, alignItems: "center", height: DEVICEHEIGHT * 0.15}}>
                    <View style={styles.Row1}>
                        <View style={styles.Column1}>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Fees Detail</Text>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>is here!</Text>
                        </View>
                            <View style={{width: DEVICEWIDTH * 0.27, flexDirection: "column", alignItems: "center"}}>
                                <Image source={require('../assets/Teaching1Bn.png')} style={{width: 120, height: 100, 
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
                            <View style={{left: "4%", fontSize: 18}}>
                            <Text style={{width: DEVICEWIDTH * 0.8, fontSize: 14, fontWeight: "bold", marginTop: 4,
                                            fontSize: 18}}>
                                Student : {route.params.Student}</Text>
                            <Text style={{width: DEVICEWIDTH * 0.8, fontSize: 14, fontWeight: "bold", marginTop: 4,
                                            fontSize: 18}}>
                                S/o. : {route.params.Father}</Text>
                                <Text style={{width: DEVICEWIDTH * 0.8, fontSize: 14, fontWeight: "bold", marginTop: 4,
                                            fontSize: 18}}>
                                    Class : {route.params.Class} | Section : {route.params.Section}</Text>
                            </View>
                            <View style={styles.SContainer}>
                                <View style={styles.CardView2}>
                                    <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05, 
                                                backgroundColor: "#BAFAFF", borderTopLeftRadius: 15, 
                                                borderTopRightRadius: 15,
                                                flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{color: "#000000", marginLeft: 20, fontWeight: "bold"}}>date</Text>
                                        <Text style={{color: "#000000", marginLeft: DEVICEWIDTH * 0.18, 
                                            fontWeight: "bold"}}>Pay + Disc.- Penalty</Text>
                                        <Text style={{color: "#000000", marginLeft: DEVICEWIDTH * 0.04, 
                                            fontWeight: "bold"}}>=   Sub Total</Text>
                                    </View>
                                    {
                                        isLoadingFlatList ? (
                                    <FlatList contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                                        data={FetchData}
                                        keyExtractor={(item, indexx) => indexx.toString()}
                                        renderItem={({item, indexx}) => ShowList(item, indexx)}
                                    />
                                        ):(
                                            <ActivityIndicator/>
                                        )
                                    }
                                </View>
                            </View>
                            </View>
                              )                    
                }
                </View>
    </View>
    </SafeAreaView>
  );
}

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
      height: DEVICEHEIGHT * 0.6,
      width: DEVICEWIDTH * 0.95,
      marginTop: DEVICEHEIGHT * 0.12,
      bottom: "0%",
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


});