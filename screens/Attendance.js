import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, ActivityIndicator, Image, 
        Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import SelectDropdown from "react-native-select-dropdown";          //npm i react-native-select-dropdown
import AsyncStorage from '@react-native-async-storage/async-storage';   

import config from './app_config';

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

export default function Attendance() {

    const newdate = new Date();

    const [SelectYear1, set_Year1] = React.useState(newdate.getFullYear());
    const [SelectMonth1, set_Month1] = React.useState(newdate.getMonth()+1);

    const [SelectYear, set_Year] = React.useState(newdate.getFullYear());
    const [SelectMonth, set_Month] = React.useState(newdate.getMonth()+1);
    const [FetchData, set_FetchData] = React.useState([]);
    const [isLoading, reset_isLoading]=React.useState(true);
    const [isLoadingFlatList, reset_isLoadingFlatList]=React.useState(true);
    const [isChecked, setChecked] = React.useState(false);
    const [ClassAtt, set_ClassAtt] = React.useState('Select Class');
    const [BGColor, set_BGColor] = React.useState('#F8F7D8');
    const ClassForAtt = ["Select Class", 'Nursari', 'LKG', 'UKG', 'Class - 1', 'Class - 2', 'Class - 3',
                        'Class - 4', 'Class - 5', 'Class - 6', 'Class - 7', 'Class - 8', 'Class - 9',
                        'Class - 10', 'Class - 11', 'Class - 12'];
  const AttMonth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const AttYears = [newdate.getFullYear()-1, newdate.getFullYear(), newdate.getFullYear()+1];
  const [StdID, set_StdID] = React.useState(false);


    FetchPersonal = async ()=>{
        AsyncStorage.getItem('SERVERURL').then(async (value) => {
            try{
            let respons1 = await fetch(config.Url+'getAttendenceRecords1', {
                method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                body: JSON.stringify({student_id: StdID, year: SelectYear, month: SelectMonth, student_session_id: "19"})
            })
      
            let responseJson = await respons1.json();
            
            console.log("responsJson : ",responseJson);
            
            console.log("Json :",(responseJson));
            set_FetchData(responseJson);
            console.log("DataS Length :", FetchData.length);
            console.log("DataS :",(FetchData));
            
            reset_isLoadingFlatList(true);
            reset_isLoading(false);
    
            }catch(err){
                console.error("Error-1 : ",err);
            }
        });
    }

    React.useEffect(() => {
        AsyncStorage.getItem('StdID').then((value) => set_StdID(value));
        FetchPersonal();
        setTimeout(()=> FetchPersonal(), 2000);
    },[]);

    const FetchMonthYearwise = ()=>{
        setTimeout(()=> {
        FetchPersonal()}, 2000);
    }
  
  const ShowList = (Itms, Index) => {
    return(
        <View style={{flexDirection: 'column'}}>
            <View style={{flexDirection: 'row', marginLeft: 10, marginTop: 5,}}>
                <Text style={{width: DEVICEWIDTH * 0.50, color: "#000000"}}>
                    {(Itms.date)}</Text>
                <Text style={{width: DEVICEWIDTH * 0.06, color: "#000000"}}>:</Text>
                <Text style={{width: DEVICEWIDTH * 0.66, color: "#000000"}}>
                    {(Itms.type)}</Text>
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
                    <Text style={{fontSize: 20, fontWeight: "700"}}>Your Class Attendance</Text>
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
                {/*
                    <SelectDropdown data={ClassForAtt} onSelect={(selectedClas, index)=>{
                        console.log(selectedClas, index)
                        set_ClassAtt(selectedClas)
                        }  } 
                        defaultButtonText={"Select Class"}
                        buttonTextAfterSelection={(selectedClas, index)=>{
                            //FetchMonthYearwise();
                            return selectedClas;  }
                        }
                        rowTextForSelection={(item, index)=>{ return item; }}
                        renderDropdownIcon={isOpened =>{
                            return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'}
                                                color={'#000000'} size={18} style={styles.DropDIcon}/>;
                        }}
                        buttonStyle={styles.dropdownBtnStyle}
                        buttonTextStyle={styles.dropdownBtnTextStyle}
                    />
                    */}
                    
                    <View style={styles.Row2}>
                        <Text style={{fontSize: 16, marginLeft: 17}}>Month : </Text>
                        <SelectDropdown data={AttMonth} onSelect={(selectedMnth, index)=>{
                            console.log(selectedMnth, index)
                            set_Month(selectedMnth)
                            }  } 
                            defaultButtonText={SelectMonth}
                            buttonTextAfterSelection={(selectedMnth, index)=>{
                                if(SelectMonth !== SelectMonth1){
                                    set_Month1(SelectMonth);
                                    reset_isLoadingFlatList(false);
                                    FetchPersonal();
                                }
                                return selectedMnth;  
                            }
                            }
                            rowTextForSelection={(item, index)=>{ return item; }}
                            renderDropdownIcon={isOpened =>{
                                return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'}
                                                    color={'#000000'} size={18} style={styles.DropDIcon}/>;
                            }}
                            buttonStyle={styles.dropdownBtnStyleMonth}
                            buttonTextStyle={styles.dropdownBtnTextStyle}
                        />

                        <Text style={{fontSize: 16, marginLeft: 30}}>Year : </Text>
                        <SelectDropdown data={AttYears} onSelect={(selectedYear, index)=>{
                            console.log(selectedYear, index)
                            set_Year(selectedYear)
                            }  }
                            defaultButtonText={SelectYear}
                            buttonTextAfterSelection={(selectedYear, index)=>{
                                if(SelectYear !== SelectYear1){
                                    set_Year1(SelectYear);
                                    reset_isLoadingFlatList(false);
                                    FetchPersonal();
                                }
                                return selectedYear;  
                            }
                            }
                            rowTextForSelection={(item, index)=>{ return item; }}
                            renderDropdownIcon={isOpened =>{
                                return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'}
                                                    color={'#000000'} size={18} style={styles.DropDIcon}/>;
                            }}
                            buttonStyle={styles.dropdownBtnStyleYear}
                            buttonTextStyle={styles.dropdownBtnTextStyle}
                        />
                    </View>
                    <View style={styles.SContainer}>
                        <View style={styles.CardView2}>
                            <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05, 
                                        backgroundColor: "#BAFAFF", borderTopLeftRadius: 15, 
                                        borderTopRightRadius: 15, justifyContent: "center"}}>
                                <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold"}}>Register</Text>
                            </View>
                            {
                                isLoadingFlatList ? (
                            <FlatList contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                                data={FetchData.data}
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
      height: DEVICEHEIGHT * 0.69,
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
  dropdownBtnStyleMonth: {
    textAlign: "center",
    width: '20%',
    height: DEVICEHEIGHT * 0.04,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    left: "1.6%",
},
dropdownBtnStyleYear: {
    textAlign: "center",
    width: '30%',
    height: DEVICEHEIGHT * 0.04,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    left: "1.6%",
},

});