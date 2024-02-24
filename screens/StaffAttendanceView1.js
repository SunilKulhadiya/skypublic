import React from "react";
import {View, StyleSheet, Text, Image, Dimensions, ActivityIndicator, TouchableOpacity, FlatList,
    SafeAreaView, Modal, TextInput} from "react-native";
import { FontAwesome, MaterialIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import config from "./app_config";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

const StaffAttendanceView = ({ navigation, route }) => {
    const newdate = new Date();

    const [message, set_message] = React.useState('');

    const [isLoadingFlatList, reset_isLoadingFlatList] = React.useState(false);
    const [isLoadingFlatList1, reset_isLoadingFlatList1] = React.useState(false);
    const [DataS, set_data] = React.useState([]);
    const [isChecked, setChecked] = React.useState(true);
    const [SelectedMonth, set_SelectedMonth] = React.useState(newdate.getMonth() + 1);
    const [SelectedYear, set_SelectedYear] = React.useState(newdate.getFullYear());

    const [chevrondownMonth, setchevrondownMonth] = React.useState(true);
    const [chevrondownYear, setchevrondownYear] = React.useState(true);
    const [classLView, set_classLView] = React.useState("none");
    const [SectionLView, set_SectionLView] = React.useState("none");

    const MonthList = [{id:1, month: 'January'}, {id:2, month: 'February'}, {id:3, month: 'March'},
                        {id:4, month: 'April'}, {id:5, month: 'May'}, {id:6, month: 'June'},
                        {id:7, month: 'July'}, {id:8, month: 'August'}, {id:9, month: 'September'},
                        {id:10, month: 'October'}, {id:11, month: 'November'}, {id:12, month: 'December'} ]
    const YearList = [{id:1, year: newdate.getFullYear()-1}, {id:2, year: newdate.getFullYear()}]

    let YDAY = `${newdate.getDate()}/${newdate.getMonth() + 1}/${newdate.getFullYear()}`

    //----------------------------------------------Fetch Staff
    const FetchStaff = async (SMonth, SYear) => {
        reset_isLoadingFlatList(true);
        console.log("--------------Attendance View : ", route.params.STAFF_ID, SMonth);
        let responseAtten="";
        try {
            responseAtten = await fetch(config.Url+'MonthAndStaffAttendence', {
            method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
            body: JSON.stringify({month : SMonth, staff_id: route.params.STAFF_ID})
            })
            responseAtten = await responseAtten.json();
            set_data(responseAtten.data.filter(item=> new Date(item.date).getFullYear() == SYear));
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>Attendance View : ", responseAtten.data.filter(item=> new Date(item.date).getFullYear() == SYear));

        } catch (error) {
            console.error("Error-2 : ", error);
            reset_isLoadingFlatList1(false);
        }
        setTimeout(()=> {
            if(responseAtten.data.length > 0)
                reset_isLoadingFlatList(true);
                setChecked(!isChecked);   //for refresh FlatList            
        }, 1000);
    }

    React.useEffect(() => {
        FetchStaff(SelectedMonth, SelectedYear);
    }, []);
    //----------------------------
    const ShowList = (Itms, indexx) => {
        let STime = Itms.Start_time, ETime = Itms.End_time;
        if(DataS.length > 0 && SelectedYear == (new Date(Itms.date).getFullYear()) &&
            STime.length > 0 && ETime.length > 0){
            date1 = new Date('2019-03-02 '+STime);        //responseAtten.data[j].Start_time);
            date2 = new Date('2019-03-02 '+ETime);     //responseAtten.data[j].End_time);
            TimeDifference =  (date2 - date1) / (1000 * 60 * 60);
            return (
                <View>
                    <View style={{ backgroundColor: Itms.other_document_name }}>
                        <View style={styles.Row2}>
                            <Text style={{ width: DEVICEWIDTH * 0.54, color: "#000000",
                                fontSize: 17 }}>{Itms.date}</Text>
                            <Text style={{ width: DEVICEWIDTH * 0.06, color: "#000000",
                                fontSize: 17 }}>:</Text>
                        {
                            //present = 1
                            //Late  = 2
                            //Absent = 3
                            //Half Day = 4
                            //Holiday = 5

                            TimeDifference >= 3 ? (
                                <MaterialCommunityIcons name="alpha-f-box-outline"
                                    size={30} color = "#08F543"
                                    key={Itms.id}/>
                            ):(
                                TimeDifference >= 1.5 ? (
                                    <MaterialCommunityIcons name="alpha-h-circle-outline"
                                        size={30} color = "#3003F7"
                                        key={Itms.id}/>
                                ):(
                                    TimeDifference >= 0 ? (
                                        <MaterialCommunityIcons name="alpha-p-box-outline"
                                            size={30} color="black" />
                                    ):(
                                        <MaterialCommunityIcons name="alpha-a-box-outline"
                                            size={30} color="#E90CF9" />
                                    )
                                )
                            )
                        }
                        </View>
                    </View>
                </View>
            );
        }
    }
    //-----------------------------------------------------Select Class
    const ClassList = () =>{
        set_SectionLView("none");
        setchevrondownYear(true);

        setchevrondownMonth(!chevrondownMonth);
        console.log("Class List : ", chevrondownMonth);

        if(chevrondownMonth){
            set_classLView("flex");
        }else{
            set_classLView("none");
        }
    }

    const SelectClass = async (idd, SMonth) => {
        set_classLView("none");
        setchevrondownMonth(true);
        set_SelectedMonth(idd);
        FetchStaff(idd, SelectedYear);
    }

    const ShowClassFlatList = (Itms) => {
        return(
            <TouchableOpacity onPress={() => SelectClass(Itms.id, Itms.month)} key={Itms.id}>
                <View style={{backgroundColor: "#E7E4E4", justifyContent: "center", alignItems: "center",
                            height: DEVICEHEIGHT * 0.05,}}>
                    <Text style={{width: DEVICEWIDTH * 0.26, color: "#000000", fontSize: 17}}>
                            {Itms.month}</Text>
                    <View style={{backgroundColor: "#575656", width: "100%", height: 1,
                        marginTop: 5}}></View>                        
                </View>
            </TouchableOpacity>
        );
    }
    //---------------------------------------Section List for select
    const SectionList = () =>{
        set_classLView("none");
        setchevrondownMonth(true);

        setchevrondownYear(!chevrondownYear);

        if(chevrondownYear){
            set_SectionLView("flex");
        }else{
            set_SectionLView("none");
        }
    }

    const SelectSection = async (idd, SYear) => {
        set_SectionLView("none");
        setchevrondownYear(true);

        console.log("Section, Class : ", SYear);

        FetchStaff(SelectedMonth, SYear);
    }

    const ShowSectionFlatList = (Itmsection, Index) => {
        return(
            <View style={{backgroundColor: "#E7E4E4", justifyContent: "center", alignItems: "center",
                            height: DEVICEHEIGHT * 0.05,}}>
                <TouchableOpacity onPress={() => SelectSection(Itmsection.id, Itmsection.year)}
                    key={Itmsection.id}>
                    <Text style={{width: DEVICEWIDTH * 0.2, color: "#000000", fontSize: 17, marginBottom: 6}}>
                            {Itmsection.year}</Text>
                </TouchableOpacity>
                <View style={{backgroundColor: "#575656", width: "100%", height: 1}}></View>                        
            </View>
        );
    }
    //---------------------------------------------------------
    return (
        <SafeAreaView>
            <View style={styles.Mcontainer}>
                <View style={{ padding: 10, alignItems: "center", height: DEVICEHEIGHT * 0.15 }}>
                    <View style={styles.Row1}>
                        <View style={styles.Column1}>
                            <Text style={{ fontSize: 20, fontWeight: "700" }}>
                                Dear {route.params.STAFF_NAME}</Text>
                            <Text style={{ fontSize: 20, fontWeight: "700" }}>your attendance status</Text>
                        </View>
                        <View style={{
                            width: DEVICEWIDTH * 0.27, flexDirection: "column",
                            alignItems: "center"
                        }}>
                            <Image source={require('../assets/Attendance2Bn.png')}
                                style={{ width: 120, height: 100, borderRadius: 20, }} />
                        </View>
                    </View>
                </View>

                <View style={styles.Row2}>
                    <Text style={{width: DEVICEWIDTH * 0.16, fontSize: 14, fontWeight: "bold"}}>
                        Month :</Text>
                    <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: '28%',height: DEVICEHEIGHT * 0.03,
                                borderRadius: 20, flexDirection: "row"}} onPress={() => ClassList()}>
                        <Text style={{width: DEVICEWIDTH * 0.175, fontSize: 14, fontWeight: "bold",
                                    marginLeft: 10}}>{MonthList[SelectedMonth-1].month}</Text>
                        <FontAwesome name={chevrondownMonth ? "chevron-down" : "chevron-up"}
                                        size={19} color="black"/>
                    </TouchableOpacity>

                    <Text style={{width: DEVICEWIDTH * 0.13, fontSize: 14, fontWeight: "bold", 
                            marginLeft: DEVICEWIDTH * 0.07}}>Year :</Text>
                    <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: '28%',height: DEVICEHEIGHT * 0.03,
                                borderRadius: 20, flexDirection: "row"}} onPress={() => SectionList()}>
                        <Text style={{width: DEVICEWIDTH * 0.175, fontSize: 14, fontWeight: "bold",
                                    marginLeft: 10}}>{SelectedYear}</Text>
                        <FontAwesome name={chevrondownYear ? "chevron-down" : "chevron-up"}
                                        size={19} color="black"/>
                    </TouchableOpacity>
                </View>

                <View style={styles.SContainer}>
                    <View style={styles.CardView2}>
                        <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05,
                            backgroundColor: "#BAFAFF", borderTopLeftRadius: 15,
                            borderTopRightRadius: 15, flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <Text style={{fontSize: 20, fontWeight: "600",
                                marginLeft: 10}}>Attendance Register</Text>
                        </View>
                        {
                            isLoadingFlatList ? (
                                <View>
                                    <FlatList contentContainerStyle={{ flexGrow: 1 }}
                                        showsVerticalScrollIndicator={false}
                                        data={DataS}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => ShowList(item, index)}
                                        extraData={isChecked} style={{ height: DEVICEHEIGHT * 0.55 }}
                                    />
                                <View style={{marginTop: 20}}/>
                                </View>

                            ) : (
                                isLoadingFlatList1 ? (
                                    <ActivityIndicator />
                                ) : (
                                    <View style={{ marginLeft: 10, marginTop: 10 }}>
                                        <Text>{message}</Text>
                                    </View>
                                )
                            )
                        }
                    </View>
                </View>



        <FlatList contentContainerStyle={{ flexGrow: 1 }} 
            showsVerticalScrollIndicator={false}
            data={MonthList} style={[styles.dropdownClass, {display: classLView,
                top: config.DEVICEHEIGHT <=734 ? "20%" : "18%",
            }]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => ShowClassFlatList(item, index)}
        />
        <FlatList contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            data={YearList} style={[styles.dropdownSection, {display: SectionLView,
            top: config.DEVICEHEIGHT <=734 ? "20%" : "18%",
            }]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => ShowSectionFlatList(item, index)}
        />



            </View>
        </SafeAreaView>
    );
}
export default StaffAttendanceView;

const styles = StyleSheet.create({
    Mcontainer: {
        width: DEVICEWIDTH,
        height: DEVICEHEIGHT,
    },
    SContainer: {
        top: "17%",
        left: "2.35%",
    },
    CardView2: {
        left: "40%",
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) },
        { translateY: -90 }],
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        width: DEVICEWIDTH * 0.95,
        marginBottom: -DEVICEHEIGHT * 0.1,
    },
    Row1: {
        flexDirection: "row",
        width: DEVICEWIDTH * 0.95,
    },
    Row2: {
        flexDirection: "row",
        marginLeft: 10,
        height: 33,
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
    CardViewModel: {
        justifyContent: "center",
        position: "absolute",
        top: "30%",
        left: "45%",
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        width: DEVICEWIDTH * 0.9,
        backgroundColor: "#FFFFFF",
        borderRadius: 7,
    },
    ColumnM1: {
        flexDirection: "column",
        marginLeft: 10,
        top: 5,
    },
    viewWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    textInput: {
        fontSize: 25,
        backgroundColor: "#C9C9C9",
        
    },
    dropdownClass: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '27%',
        height: DEVICEHEIGHT * 0.3,
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        elevation: 3,
        left: "19%",
      },
    dropdownSection: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '26%',
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        elevation: 3,
        left: "66%",
    },

});