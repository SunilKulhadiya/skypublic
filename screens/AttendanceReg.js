import React from "react";
import {
    View, StyleSheet, Text, Image, Dimensions, ActivityIndicator, TouchableOpacity, FlatList,
    SafeAreaView, Modal
} from "react-native";
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import config from "./app_config";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

const AttendanceReg = ({ navigation }) => {

    const newdate = new Date();
    const [BaseURL, set_BaseURL] = React.useState('');
    const [message, set_message] = React.useState('Please select Class & Section.');

    const SectionForAtt = [{ section: "Select", id: '0' }, { section: "A", id: '1' }, { section: "B", id: '2' },
    { section: "C", id: '3' }, { section: "D", id: '4' }, { section: "E", id: '5' }];
    const [ProgressBar, reset_ProgressBar] = React.useState(0);
    const [isSaving, reset_isSaving] = React.useState(false);
    const [isLoadingFlatList, reset_isLoadingFlatList] = React.useState(false);
    const [isLoadingFlatList1, reset_isLoadingFlatList1] = React.useState(false);
    const [DataS, set_data] = React.useState([]);
    const [DataS1, set_data1] = React.useState([]);
    const [isChecked, setChecked] = React.useState(true);
    const [isAllChecked, setAllChecked] = React.useState(false);

    const [chevrondownClass, setchevrondownClass] = React.useState(true);
    const [classLView, set_classLView] = React.useState("none");
    const [ClassID, set_ClassID] = React.useState("0");
    const [ClassAtt, set_ClassAtt] = React.useState('Select');
    const [ClassForAtt, Set_ClassForAtt] = React.useState([]);

    const [chevrondownSection, setchevrondownSection] = React.useState(true);
    const [SectionLView, set_SectionLView] = React.useState("none");
    const [SectionID, set_SectionID] = React.useState('0.0');
    const [SectionAtt, set_SectionAtt] = React.useState('Select');
    const [SectionAtt1, set_SectionAtt1] = React.useState('Select');
    const [TextSave, set_TextSave] = React.useState('Save');
    let i = 0;

    let YDAY = `${newdate.getDate()}/${newdate.getMonth() + 1}/${newdate.getFullYear()}`

    //----------------------------------------------Fetch Class
    const FetchClass = async () => {
            try {
                let resultClass = await fetch(config.Url + 'getclass', {
                    method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', }
                })

                let responseClass = await resultClass.json();

                Set_ClassForAtt(responseClass);
                console.log("Class => ", responseClass);

            } catch (error) {
                console.error("FetchClass : ", error);
            }
    }

    React.useEffect(() => {
            FetchClass()
    }, []);
    //-----------------------------------------------------Submit to server
    const SubmitToServer = async () => {
        if (!isSaving) {
            reset_isSaving(true);
            let SDAY = `${newdate.getFullYear()}-${newdate.getMonth() + 1}-${newdate.getDate()}`
            let responseUpload;
            let Trow = DataS.data.length;

            for (i = 0; i < Trow; i++) {
                let sessionID = DataS.data[i].id;
                let PA = DataS.data[i].city;

                try {
                    let resultClass = await
                        fetch(config.Url + 'submitstudentattandance', {
                            method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
                            body: JSON.stringify({
                                "data": [
                                    {
                                        "student_session_id": sessionID,
                                        "biometric_attendence": "NA",
                                        "date": SDAY,
                                        "attendence_type_id": PA,
                                        "biometric_device_data": "NA",
                                        "is_active": "No",
                                        "remark": "0"
                                    }
                                ]
                            })
                        })

                    responseUpload = await resultClass.json();

                } catch (error) {
                    console.error("SubmitToServer : ", error);
                }

                reset_ProgressBar(Math.round(i * 100 / Trow));
            }

            if (i >= DataS.data.length) {
                reset_isSaving(false);
                set_TextSave("Successfully Saved")
                setTimeout(() => { set_TextSave("Save") }, 1000 * 2);
            }
        } else {
            console.log("SubmitToServer : Please wait");
        }
    }
    //------------------------------------****************************
    //------------------------------------*****-------------Main Display
    const UpdateAll = () => {

        setAllChecked(!isAllChecked);

        console.log("Update All-1 : ", isAllChecked)
        for (i = 0; i < DataS.data.length; i++) {
            if (isAllChecked) {       //false
                DataS.data[i].city = 4;      //Attendance CheckBox
            } else {
                DataS.data[i].city = 1;      //Attendance CheckBox
            }
        }
        console.log("Update All-2 : ", isAllChecked)
        console.log("Update All-Data : ", DataS.data[0].city)
        setChecked(!isChecked);   //for refresh FlatList
    }
    //------------------------------
    const UpdatePresent = (row) => {
        if (row !== null) {
            if (DataS.data[row - 1].city == 1) {
                DataS.data[row - 1].city = 4;
            } else {
                DataS.data[row - 1].city = 1;
            }
            setChecked(!isChecked);   //for refresh FlatList
            console.log("Update city : " + row, DataS.data[row - 1].city);
        }
    }
    //----------------------------
    const ShowList = (Itms) => {
        if(DataS.data.length > 0)
            return (
                <View>
                    <View style={{ backgroundColor: Itms.pincode }}>
                        <TouchableOpacity onPress={() => UpdatePresent(Itms.state)}>
                            <View style={styles.Row2}>
                                <Text style={{ width: DEVICEWIDTH * 0.1, color: "#000000", fontSize: 17, }}>
                                    {Itms.state}. </Text>
                                <Text style={{ width: DEVICEWIDTH * 0.6, color: "#000000", fontSize: 17 }}>
                                    {Itms.firstname} {Itms.lastname}</Text>
                                <Text style={{ width: DEVICEWIDTH * 0.06, color: "#000000", fontSize: 17 }}>:</Text>

                                <MaterialIcons name={Itms.city == 4 ? "check-box-outline-blank" : "check-box"}
                                    size={30} color={Itms.city == 4 ? "black" : "blue"}
                                    key={Itms.state} />

                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
    }
    //---------------------------------
                                                                            //1 = present, 4 = absent
    const FectchStudentAttendance = async (clssID, secID) => {
        let result, responseAtten, response, SDAY = `${newdate.getFullYear()}-${newdate.getMonth() + 1}-${newdate.getDate()}`;
        let i, j;
        console.log("Class id : "+clssID+", section id : "+secID);
        set_data([]);

        try {
            result = await fetch(config.Url + 'classwisestudent', {
                method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
                body: JSON.stringify({ class_id: clssID, section_id: secID, session_id: "19" })
            })
            response = await result.json();
            console.log("Attendance, FectchStudentAttendance : ", response);

            result = await fetch(config.Url + 'studentgetattandance', {
            method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
            body: JSON.stringify({ class_id: clssID, section_id: secID, date: SDAY })
            })
            responseAtten = await result.json();
            console.log("Attendance, FectchStudentAttendance, responseAtten : ", responseAtten);

    
        if(responseAtten.data.length > 0){
            let sid, Colors = "#FFFFFF";
            for (i = 0; i < response.data.length; i++) {
                sid = response.data[i].student_id;
                for (j = 0; j < responseAtten.data.length; j++) {
                    if(responseAtten.data[j].student_id == sid){
                        response.data[i].state = i + 1;
                        response.data[i].city = responseAtten.data[j].attendence_type_id;      //Attendance CheckBox
                        response.data[i].pincode = Colors;   //Color Code
                        if (Colors == "#FFFFFF") {
                            Colors = "#F8F7D8";
                        } else {
                            Colors = "#FFFFFF";
                        }
                    }
                }
            }
        }else{
            let Colors = "#FFFFFF";
            if(response !== null && response !== 'null')
                for (i = 0; i < response.data.length; i++) {
                    response.data[i].state = i + 1;
                    response.data[i].city = 4;      //Attendance CheckBox
                    response.data[i].pincode = Colors;   //Color Code
                    if (Colors == "#FFFFFF") {
                        Colors = "#F8F7D8";
                    } else {
                        Colors = "#FFFFFF";
                    }
                }
        }
            setTimeout(() => {
                if(response !== null && response !== 'null')
                    set_data(response);
                reset_isLoadingFlatList(true);
                reset_isLoadingFlatList1(false);
                setChecked(!isChecked);   //for refresh FlatList            
            }, 1000);
        } catch (error) {
            set_message('There are no data, please try again.')
            console.error("CAtt -2 : ", error);
                reset_isLoadingFlatList(true);
                reset_isLoadingFlatList1(false);
                setChecked(!isChecked);   //for refresh FlatList
        }

    }
    //-----------------------------------------------------Select Class
    const ClassList = () => {
        setchevrondownClass(!chevrondownClass);
        console.log("Class List : ", chevrondownClass);
        set_SectionLView("none");
        setchevrondownSection(true);
        if (chevrondownClass) {
            set_classLView("flex");
        } else {
            set_classLView("none");
        }
        console.log("Class List : ", chevrondownClass);
        console.log("Class List V : ", classLView);
    }

    const SelectClass = async (idd, Sclass) => {
        set_ClassID(idd);
        set_ClassAtt(Sclass);
        set_classLView("none");
        setchevrondownClass(true);

        if (Sclass !== 'Select' && SectionAtt !== 'Select') {
            reset_isLoadingFlatList1(true)
            reset_isLoadingFlatList(false);
            setchevrondownClass(true);
            FectchStudentAttendance(idd, SectionID);
        }

        set_ClassID(idd);
        set_ClassAtt(Sclass);
    }

    const ShowClassFlatList = (Itms) => {
        return (
            <TouchableOpacity onPress={() => SelectClass(Itms.id, Itms.class)} key={Itms.id}>
                <View style={{
                    backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                    height: DEVICEHEIGHT * 0.05,
                }}>
                    <Text style={{ width: DEVICEWIDTH * 0.2, color: "#000000", fontSize: 17 }}>
                        {Itms.class}. </Text>
                    <View style={{ backgroundColor: "#C0C0C0", width: "100%", height: 1 }}></View>
                </View>
            </TouchableOpacity>
        );
    }
    //---------------------------------------Section List for select
    const SectionList = () => {
        set_classLView("none");
        setchevrondownSection(!chevrondownSection);
        setchevrondownClass(true);
        console.log("Section List : ", chevrondownSection);

        if (chevrondownSection) {
            set_SectionLView("flex");
        } else {
            set_SectionLView("none");
        }
        console.log("Section List : ", chevrondownSection);
        console.log("Class List V : ", SectionLView);
    }

    const SelectSection = async (idd, SectionTitle) => {
        set_SectionID(idd);
        set_SectionAtt(SectionTitle);
        set_SectionLView("none");
        setchevrondownSection(true);

        if (ClassAtt !== 'Select' && SectionTitle !== 'Select') {
            set_SectionAtt1(SectionTitle);
            reset_isLoadingFlatList(false);
            setchevrondownSection(true);
            FectchStudentAttendance(ClassID, idd);
        }

    }

    const ShowSectionFlatList = (Itmsection, Index) => {
        return (
            <TouchableOpacity onPress={() => SelectSection(Itmsection.id, Itmsection.section)} key={Itmsection.id}>
                <View style={{
                    backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                    height: DEVICEHEIGHT * 0.05,
                }}>
                    <Text style={{ width: DEVICEWIDTH * 0.2, color: "#000000", fontSize: 17, marginBottom: 6 }}>
                        {Itmsection.section}. </Text>
                    <View style={{ backgroundColor: "#C0C0C0", width: "100%", height: 1 }}></View>
                </View>
            </TouchableOpacity>
        );
    }
    //---------------------------------------------------------

    return (
        <View style={styles.Mcontainer}>
            <View style={{ padding: 10, alignItems: "center", height: DEVICEHEIGHT * 0.15 }}>
                <View style={styles.Row1}>
                    <View style={styles.Column1}>
                        <Text style={{ fontSize: 20, fontWeight: "700" }}>Your Class Attendance</Text>
                        <Text style={{ fontSize: 20, fontWeight: "700" }}>Register is here!</Text>
                        <Text style={{}}>Dt. : {YDAY}</Text>
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
                <Text style={{ width: DEVICEWIDTH * 0.13, fontSize: 14, fontWeight: "bold" }}>
                    Class :</Text>
                <TouchableOpacity
                    style={{backgroundColor: "#FFFFFF", width: '28%', height: "100%",
                    borderRadius: 20, flexDirection: "row",
                    }} onPress={() => ClassList()}>
                    <Text
                        style={{width: DEVICEWIDTH * 0.175, fontSize: 14, fontWeight: "bold",
                        marginLeft: 10, top: "4%"}}>
                        {ClassAtt}</Text>
                    <FontAwesome name={chevrondownClass ? "chevron-down" : "chevron-up"}
                        size={19} color="black" style={{top: "4%"}} />
                </TouchableOpacity>

                <Text style={{
                    width: DEVICEWIDTH * 0.17, fontSize: 14, fontWeight: "bold",
                    marginLeft: DEVICEWIDTH * 0.07
                }}>Section :</Text>
                <TouchableOpacity
                    style={{backgroundColor: "#FFFFFF", width: '28%', height: "100%",
                    borderRadius: 20, flexDirection: "row"
                }} onPress={() => SectionList()}>
                    <Text style={{width: DEVICEWIDTH * 0.175, fontSize: 14, fontWeight: "bold",
                                marginLeft: 7, top: "4%"}}>
                        {SectionAtt}</Text>
                    <FontAwesome name={chevrondownSection ? "chevron-down" : "chevron-up"}
                        size={19} color="black" style={{top: "4%"}} />
                </TouchableOpacity>
            </View>

                    <View style={styles.CardView2}>
                        <View style={{
                            width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05,
                            backgroundColor: "#BAFAFF", borderTopLeftRadius: 15,
                            borderTopRightRadius: 15, flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <Text style={{
                                color: "#000000", marginLeft: 10, fontWeight: "bold",
                                width: DEVICEWIDTH * 0.79
                            }}>
                                All Present</Text>
                            {
                                isLoadingFlatList ? (
                                    <MaterialIcons name={isAllChecked ? "check-box" : "check-box-outline-blank"}
                                        size={30} color={isAllChecked ? "blue" : "black"}
                                        onPress={() => UpdateAll()} />
                                ) : (
                                    <View></View>
                                )
                            }
                        </View>
                        {
                            isLoadingFlatList ? (
                                <View>
                                    <FlatList contentContainerStyle={{ flexGrow: 1 }}
                                        showsVerticalScrollIndicator={false}
                                        data={DataS.data}
                                        keyExtractor={(item, indexx) => indexx.toString()}
                                        renderItem={({ item, indexx }) => ShowList(item, indexx)}
                                        extraData={isChecked} style={{ height: DEVICEHEIGHT * 0.6 }}
                                    />
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

            <FlatList contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                data={ClassForAtt.data} style={[styles.dropdown, {top: "21%",
                    display: classLView }]}
                keyExtractor={(item, indexx) => indexx.toString()}
                renderItem={({ item, indexx }) => ShowClassFlatList(item, indexx)}
            />
            <FlatList contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                data={SectionForAtt} style={[styles.dropdownSection, {top: "21%",
                    display: SectionLView }]}
                keyExtractor={(item, indexx) => indexx.toString()}
                renderItem={({ item, indexx }) => ShowSectionFlatList(item, indexx)}
            />

            {
                isLoadingFlatList ? (
                    <TouchableOpacity style={{
                        width: "95%", height: "5%",
                        backgroundColor: "#BAFAFF", borderRadius: 8, left: "2%",
                        position: "absolute", bottom: 5, justifyContent: "center"
                        }}
                        onPress={() => SubmitToServer()}>
                        {
                            isSaving ? (
                                <View>
                                    <View style={{
                                        backgroundColor: "#FF9F0B", width: ProgressBar + "%",
                                        justifyContent: "flex-start", height: "100%", borderRadius: 8
                                    }}>
                                    </View>
                                    <Text style={{ textAlign: "center", color: "#000000", marginTop: "-7%" }}>
                                        {ProgressBar} %</Text>
                                </View>
                            ) : (
                                <Text style={{
                                    color: "#000000", fontWeight: "bold", fontSize: 17,
                                    textAlign: "center"
                                }}>{TextSave}</Text>
                            )
                        }
                    </TouchableOpacity>
                ) : (
                    <View></View>
                )
            }

        </View>
    );
}
export default AttendanceReg;

const styles = StyleSheet.create({
    Mcontainer: {
        flex: 1,
        width: DEVICEWIDTH,
        height: DEVICEHEIGHT,
    },
    SContainer: {
        marginTop: DEVICEHEIGHT * 0.01,
        left: "2.35%",
    },
    CardView2: {
        left: "2.4%",
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        height: DEVICEHEIGHT * 0.65,
        width: DEVICEWIDTH * 0.95,
        marginTop: DEVICEHEIGHT * 0.02,
    },
    Row1: {
        flexDirection: "row",
    },
    Row2: {
        flexDirection: "row",
        height: 33,
        justifyContent: "center",
        alignItems: "center",
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
    dropdown: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '25%',
        height: DEVICEHEIGHT * 0.3,
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        elevation: 3,
        left: "17%",
    },
    dropdownSection: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '26%',
        height: DEVICEHEIGHT * 0.3,
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        elevation: 3,
        left: "70%",
    },

});