import React from "react";
import {View, StyleSheet, Text, Image, Dimensions, ActivityIndicator, TouchableOpacity, FlatList,
    SafeAreaView, Modal, TextInput} from "react-native";
import { FontAwesome, MaterialIcons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import config from "./app_config";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;


const StaffAttendanceAdm = ({ navigation, route }) => {

    
    const newdate = new Date();
    var CurrentTime= `${newdate.getHours()}:${newdate.getMinutes()}`;

    const [message, set_message] = React.useState('');

    const [ProgressBar, reset_ProgressBar] = React.useState(0);
    const [isSaving, reset_isSaving] = React.useState(false);
    const [isLoadingFlatList, reset_isLoadingFlatList] = React.useState(false);
    const [isLoadingFlatList1, reset_isLoadingFlatList1] = React.useState(false);
    const [DataS, set_data] = React.useState([]);
    const [isChecked, setChecked] = React.useState(true);
    const [isAllChecked, setAllChecked] = React.useState(true);     //true = false

    const [Api, set_Api] = React.useState('submitstaffattandance');
    const [EditInOutModel, set_EditInOutModel] = React.useState(false);
    const [EditTimeFor, set_EditTimeFor] = React.useState(0);
    const [DataIndex, set_DataIndex] = React.useState(0);
    const [InTime, set_InTime] = React.useState(true);
    const [StaffNm, set_StaffNm] = React.useState("");
    const [EditINOUTTime, set_EditINOUTTime] = React.useState("");
    const [INOUTTitle, set_INOUTTitle] = React.useState("");
    const [OutTime, set_OutTime] = React.useState(false);
    const [TextSave, set_TextSave] = React.useState('Save');
    let i = 0;

    let YDAY = `${newdate.getDate()}/${newdate.getMonth() + 1}/${newdate.getFullYear()}`

    //----------------------------------------------Fetch Staff
    const FetchStaff = async () => {
        setAllChecked(true);
        let resultStaffList, responseAtten,
            SDAY = `${newdate.getFullYear()}-${newdate.getMonth() + 1}-${newdate.getDate()}`;
        let i, j, cno=0;

        try {
            resultStaffList = await fetch(config.Url+'getstafflist', {
                method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
            })
            resultStaffList = await resultStaffList.json();
            console.log("Staff list : ", resultStaffList);
        } catch (error) {
            set_message('There are no data, please try again.')
            console.error("Error-1 : ", error);
                reset_isLoadingFlatList(false);
                reset_isLoadingFlatList1(false);
        }

        try {
            responseAtten = await fetch(config.Url+'getstaffattendence', {
            method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
            body: JSON.stringify({ date: SDAY })
            })
            responseAtten = await responseAtten.json();
            console.log("Staff Attendance : ", responseAtten);
        } catch (error) {
            set_message('There are no data, please try again.')
            console.error("Error-2 : ", error);
            reset_isLoadingFlatList(false);
            reset_isLoadingFlatList1(false);
        }
        //set_data(resultStaffList);

        setTimeout(()=> {
            console.log("responseAtten, count : ", responseAtten.data.length);
            if(responseAtten.data.length > 0){
                let sid, Colors = "#FFFFFF";
                for (i = 0; i < resultStaffList.data.length; i++) {
                    sid = resultStaffList.data[i].id;
                    resultStaffList.data[i].lang_id = i + 1;
                    resultStaffList.data[i].other_document_name = Colors;   //Color Code
                    if (Colors == "#FFFFFF") {
                        Colors = "#F8F7D8";
                    } else {
                        Colors = "#FFFFFF";
                    }
                console.log("Row color : ", resultStaffList.data[i].other_document_name);
                    for (j = 0; j < responseAtten.data.length; j++) {
                        console.log("responseAtten.data[j].staff_id : ", responseAtten.data[j].staff_id);
                        if(responseAtten.data[j].staff_id == sid){
                            //Attendance CheckBox
                            console.log("responseAtten.data[j].Start_time : ", responseAtten.data[j].Start_time);
                            if(responseAtten.data[j].Start_time == null){
                                resultStaffList.data[i].contract_type = "";
                            }else{
                                resultStaffList.data[i].contract_type = responseAtten.data[j].Start_time;
                                console.log("In time : ", resultStaffList.data[i].contract_type);
                                cno = cno+1;
                            }
                            console.log("responseAtten.data[j].End_time : ", responseAtten.data[j].End_time);
                            if(responseAtten.data[j].End_time == null){
                                resultStaffList.data[i].gender = "";
                            }else{
                                resultStaffList.data[i].gender = responseAtten.data[j].End_time;
                                console.log("Out time : ", resultStaffList.data[i].gender);
                            }
                        }
                    }
                    if(i >= resultStaffList.data.length - 1){
                        if(cno >= resultStaffList.data.length && cno > 0){
                            setAllChecked(false);
                            set_Api("updatestaffattandance");
                        }else{
                            setAllChecked(true);
                            set_Api('submitstaffattandance');
                        }
                        console.log("c no : ", cno);
                    }
                }
            }else{
                let Colors = "#FFFFFF";
                if(resultStaffList.data.length > 0)
                    for (i = 0; i < resultStaffList.data.length; i++) {
                        resultStaffList.data[i].lang_id = i + 1;
                        //Attendance CheckBox
                        resultStaffList.data[i].contract_type = "";
                        resultStaffList.data[i].gender = "";
                        resultStaffList.data[i].other_document_name = Colors;   //Color Code
                        if (Colors == "#FFFFFF") {
                            Colors = "#F8F7D8";
                        } else {
                            Colors = "#FFFFFF";
                        }
                    }
            }

            setTimeout(()=> {
                if(resultStaffList.data.length > 0)
                    set_data(resultStaffList);
                    reset_isLoadingFlatList(true);
                    setChecked(!isChecked);   //for refresh FlatList            
            }, 1000);

        }, 300);
    }

    React.useEffect(() => {
        FetchStaff();
    }, []);
    //-----------------------------------------------------Submit to server
    const SubmitToServer = async () => {
        if (!isSaving) {
            reset_isSaving(true);
            let SDAY = `${newdate.getFullYear()}-${newdate.getMonth() + 1}-${newdate.getDate()}`
            let Trow = DataS.data.length;

            for (i = 0; i < Trow; i++) {
                let SID = DataS.data[i].id, ST = DataS.data[i].contract_type, ET = DataS.data[i].gender;
                console.log("SubmitToServer, ID : ", SID);
                console.log("SubmitToServer, start time : ", ST, "End Time : ", ET);
                try {
                    let resultClass = await
                        fetch(config.Url+Api, {
                            method: 'POST', headers: { 'Accept': 'application/json',
                                                'Content-Type': 'application/json', },
                            body: JSON.stringify({
                                "data": [
                                    {
                                        "date": SDAY,
                                        "staff_id": SID,
                                        "staff_attendance_type_id": "1",
                                        "remark":"Excellent",
                                        "Start_time": ST,
                                        "End_time": ET,
                                        "is_active": "0"
                                    }
                                ]
                            })
                        })

                    responseUpload = await resultClass.json();
                    console.log("responseUpload : ", responseUpload);

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
    const CheckPresent = (ch) => {
        let cno=0;
        for (i = 0; i < DataS.data.length; i++) {
            if(ch == 1){
                if ((DataS.data[i].contract_type).length > 0) {       //false
                    cno = cno+1;
                }
            }
            if(ch == 2){
                if ((DataS.data[i].gender).length > 0) {       //false
                    cno = cno+1;
                }
            }
            if(cno == DataS.data.length){
                setAllChecked(false);
            }else{
                setAllChecked(true);
            }
        }
    }
    const InPresent = () => {
        set_InTime(true);
        set_OutTime(false);
        CheckPresent(1);
    }
    const OutPresent = () => {
        set_InTime(false);
        set_OutTime(true);
        CheckPresent(2);
    }
    //------------------------------------*****-------------Main Display
    const UpdateAll = () => {
        setAllChecked(!isAllChecked);
        console.log("Update All-1 : ", isAllChecked)
        for (i = 0; i < DataS.data.length; i++) {
            if(InTime){
                if (isAllChecked) {       //false
                    DataS.data[i].contract_type = CurrentTime;      //Attendance CheckBox
                }else{
                    DataS.data[i].contract_type = "";      //Attendance CheckBox
                }
            }
            if(OutTime){
                if (isAllChecked) {       //false
                    DataS.data[i].gender = CurrentTime;      //Attendance CheckBox
                }else{
                    DataS.data[i].gender = "";      //Attendance CheckBox
                }
            }
            console.log("DataS.data[i].contract_type : ", DataS.data[i].contract_type);
            console.log("DataS.data[i].gender : ", DataS.data[i].gender);
        }
        console.log("Update All-2 : ", isAllChecked)
        console.log("Update All-Data : ", DataS.data[0].contract_type)
        setChecked(!isChecked);   //for refresh FlatList
    }
    //------------------------------
    const UpdatePresent = (id) => {
        let present, n;
        console.log("UpdatePresent, ID : ", id);
        if (id !== null) {
            for(n = 0; n < DataS.data.length; n++){
                if(DataS.data[n].id == id){
                    console.log("ID matched");
                    if(InTime){
                        present = DataS.data[n].contract_type;
                        if (present.length > 0) {       //false
                            DataS.data[n].contract_type = "";      //Attendance CheckBox
                        }else{
                            DataS.data[n].contract_type = CurrentTime;      //Attendance CheckBox
                        }
                    }
                        if(OutTime){
                            present = DataS.data[n].gender;
                            console.log("UpdatePresent, ID : ", id);
                            if (present.length > 0) {       //false
                                DataS.data[n].gender = "";      //Attendance CheckBox
                            }else{
                                DataS.data[n].gender = CurrentTime;      //Attendance CheckBox
                                console.log("UpdatePresent, ID : ", id);
                            }
                        }
                    
        
                }
            }
            let cno=0;
            for (i = 0; i < DataS.data.length; i++) {
                if(InTime){
                    if ((DataS.data[i].contract_type).length > 0) {       //false
                        cno = cno+1;
                    }
                }
                if(OutTime){
                    if ((DataS.data[i].gender).length > 0) {       //false
                        cno = cno+1;
                    }
                }
                if(cno == DataS.data.length){
                    setAllChecked(false);
                }else{
                    setAllChecked(true);
                }
            }
    
            setChecked(!isChecked);   //for refresh FlatList
        }
    }
    //----------------------------
    const EditTime = (forTime, ETime, staffname, id) => {
        set_DataIndex(id);
        set_EditTimeFor(forTime);
        set_EditINOUTTime(ETime);
        set_StaffNm(staffname);
        if(forTime == 1){
            set_INOUTTitle("In-Time :");
            set_EditInOutModel(true);
        }
        if(forTime == 2){
            set_INOUTTitle("Out-Time :");
            set_EditInOutModel(true);            
        }
    }
    //---------------------------------------------------------
    const toggleModalVisibility = () => {
        set_EditInOutModel(false);
    }
    //---------------------------------------------------------
    const SaveEditTime = () => {
        console.log("EditTimeFor : ", EditTimeFor);
        for (i = 0; i < DataS.data.length; i++) {
            if (DataS.data[i].id == DataIndex) {       //false
                if(EditTimeFor == 1)
                    DataS.data[i].contract_type = EditINOUTTime;      //Attendance CheckBox
                if(EditTimeFor == 2)
                    DataS.data[i].gender = EditINOUTTime;      //Attendance CheckBox
                    console.log("EditTimeFor : ", EditTimeFor, "DataS.data[i].gender : ", DataS.data[i].gender);
            }
        }
        set_EditInOutModel(false);
    }
    //----------------------------
    const ShowList = (Itms, indexx) => {
        let II = (Itms.contract_type).length, OO = (Itms.gender).length;
        console.log("ShowList, II : ", II, ", OO : ",OO);
        if(DataS.data.length > 0)
            return (
                <View>
                    <View style={{ backgroundColor: Itms.other_document_name }}>
                            <View style={styles.Row2}>
                                <Text style={{ width: DEVICEWIDTH * 0.1, color: "#000000", fontSize: 17, }}>
                                    {Itms.lang_id}. </Text>
                                <Text style={{ width: DEVICEWIDTH * 0.54, color: "#000000", fontSize: 17 }}>
                                    {Itms.name} {Itms.surname}</Text>
                                <Text style={{ width: DEVICEWIDTH * 0.06, color: "#000000", fontSize: 17 }}>:</Text>
                            {
                                InTime ? (
                                    <View style={{flexDirection: "row"}}>
                                        <TouchableOpacity onPress={() => UpdatePresent(Itms.id)}>
                                            <MaterialIcons name={II > 0 ? "check-box" : "check-box-outline-blank"}
                                                size={30} color={II > 0 ? "blue" : "black"}
                                                key={Itms.state}/>
                                        </TouchableOpacity>
                                        {
                                            II > 0 ? (
                                                <TouchableOpacity onPress={() => EditTime(1, Itms.contract_type,
                                                    Itms.name+" "+Itms.surname, Itms.id)}
                                                    style={{marginLeft: 25}}>
                                                    <MaterialIcons name="access-time" size={24} color="green" />
                                                </TouchableOpacity>
                                            ):(
                                                <></>
                                            )
                                        }
                                    </View>
                                ):(
                                    <View style={{flexDirection: "row"}}>
                                        <TouchableOpacity onPress={() => UpdatePresent(Itms.id)}>
                                            <MaterialIcons name={OO > 0 ? "check-box" : "check-box-outline-blank"}
                                                size={30} color={OO > 0 ? "blue" : "black"}
                                                key={Itms.state}/>
                                        </TouchableOpacity>
                                        {
                                            OO > 0 ? (
                                                <TouchableOpacity onPress={() => EditTime(2, Itms.gender,
                                                    Itms.name+" "+Itms.surname, Itms.id)}
                                                    style={{marginLeft: 25, marginTop: 3}}>
                                                    <MaterialIcons name="access-time" size={24} color="green" />
                                                </TouchableOpacity>
                                            ):(
                                                <></>
                                            )
                                        }
                                    </View>
                                )
                            }
                            </View>
                    </View>
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
                            <Text style={{ fontSize: 20, fontWeight: "700" }}>Staff Attendance</Text>
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
                    <View style={styles.Row1}>
                        <View style={{width: DEVICEWIDTH * 0.40, flexDirection: "row"}}>
                            <MaterialIcons name={InTime ? "check-box" : "check-box-outline-blank"}
                                    size={30} color={InTime ? "blue" : "black"}
                                    onPress={() => InPresent()} />
                            <Text style={{color: "#000000", fontSize: 18}}>
                                In-Time
                            </Text>
                        </View>
                        <View style={{width: DEVICEWIDTH * 0.40, flexDirection: "row"}}>
                            <MaterialIcons name={OutTime ? "check-box" : "check-box-outline-blank"}
                                    size={30} color={OutTime ? "blue" : "black"}
                                    onPress={() => OutPresent()} />
                            <Text style={{color: "#000000", fontSize: 18}}>
                                Out-Time
                            </Text>
                        </View>
                    </View>
                </View>

                    <View style={styles.SContainer}>
                        <View style={styles.CardView2}>
                            <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05,
                                backgroundColor: "#BAFAFF", borderTopLeftRadius: 15,
                                borderTopRightRadius: 15, flexDirection: "row",
                                alignItems: "center"
                            }}>
                                {
                                    isLoadingFlatList ? (
                                        <View style={{width: DEVICEWIDTH * 0.93, flexDirection: "row"}}>
                                            <Text style={{
                                                color: "#000000", marginLeft: 10, fontWeight: "bold",
                                                width: DEVICEWIDTH * 0.7
                                            }}>All Present</Text>

                                            <MaterialIcons name={isAllChecked ? "check-box-outline-blank" : "check-box"}
                                                size={30} color={isAllChecked ? "black" : "blue"}
                                                onPress={() => UpdateAll()} />
                                        </View>
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
                {
                    isLoadingFlatList ? (
                            route.params.PERMISSION_RANGE == 11 ||
                            route.params.PERMISSION_RANGE == 12 ||
                            route.params.PERMISSION_RANGE == 13 ||
                            route.params.PERMISSION_RANGE == 30 ? (
                        <TouchableOpacity style={{
                            width: "95%", height: "5%",
                            backgroundColor: "#BAFAFF", borderRadius: 8, left: "2%",
                            position: "absolute", bottom: 60, justifyContent: "center"
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
                            ):(<></>)
                    ) : (
                        <View></View>
                    )
                }

            </View>

            <Modal animationType="fade" transparent={true} visible={EditInOutModel} 
                    presentationStyle="overFullScreen" onDismiss={toggleModalVisibility}>
                    <View style={styles.viewWrapper}>
                        <View style={styles.CardViewModel}>
                            <View style={styles.ColumnM1}>
                                <View style={{flexDirection: "row"}}>
                                    <Text style={{fontSize: 21, fontWeight: "bold", width: DEVICEWIDTH * 0.8,
                                                    color: "blue"}}>
                                        {StaffNm}
                                    </Text>
                                    <AntDesign name="close" size={25} color="red" 
                                        onPress={() => toggleModalVisibility()}/>
                                </View>

                                <View style={{flexDirection: "row", marginTop: 20, justifyContent: "center"}}>
                                    <Text style={{width: DEVICEWIDTH * 0.25, fontSize: 18}}>{INOUTTitle}</Text>
                                    <TextInput placeholder="Time" onChangeText={(textF) => set_EditINOUTTime(textF)}
                                        style={[styles.textInput,{height: 40, marginTop: -7}]} 
                                        value={EditINOUTTime}/>
                                </View>
                                    <TouchableOpacity onPress={() => SaveEditTime()}>
                                        <View style={{flexDirection: "row", marginTop: 47, 
                                            backgroundColor: '#FCB11C', width: DEVICEWIDTH * 0.901,
                                            marginLeft: -10, height: DEVICEHEIGHT * 0.07,
                                            alignItems: "center", justifyContent: "center",
                                            textAlign: "center", borderBottomLeftRadius: 7,
                                            borderBottomRightRadius: 7}}>
                                        <Text style={{fontSize: 15, fontWeight: "bold", color: "#FFFFFF",}}>
                                            Save
                                        </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{marginTop: 15}}></View>
                                </View>
                        </View>
                    </View>
                </Modal>

        </SafeAreaView>
    );
}
export default StaffAttendanceAdm;

const styles = StyleSheet.create({
    Mcontainer: {
        width: DEVICEWIDTH,
        height: DEVICEHEIGHT,
    },
    SContainer: {
        top: "19%",
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
        top: "18%",
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
        top: "18%",
        left: "70%",
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
        fontSize: 18,
        backgroundColor: "#C9C9C9",
        
    },

});