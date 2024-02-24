import React from "react";
import {View, StyleSheet, Text, Image, Dimensions, ActivityIndicator, TouchableOpacity, FlatList,
    SafeAreaView, Modal, TextInput} from "react-native";
import { FontAwesome, MaterialIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
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
    const [isHoliday, set_Holiday] = React.useState(false);
    const [isLoadingFlatList, reset_isLoadingFlatList] = React.useState(false);
    const [isLoadingFlatList1, reset_isLoadingFlatList1] = React.useState(false);
    const [DataS, set_data] = React.useState([]);
    const [isRefFlatList, setRefFlatList] = React.useState(true);
    const [isAllChecked, setAllChecked] = React.useState(true);     //true = false

    const [OpenDropdown, set_OpenDropdown] = React.useState("none");

    const [Api, set_Api] = React.useState('submitstaffattandance');
    const [EditInOutModel, set_EditInOutModel] = React.useState(false);
    const [EditTimeFor, set_EditTimeFor] = React.useState(0);
    const [DataIndex, set_DataIndex] = React.useState(0);
    const [InTime, set_InTime] = React.useState(true);
    const [StaffNm, set_StaffNm] = React.useState("");
    const [EditINOUTTime, set_EditINOUTTime] = React.useState("");
    const [INOUTTitle, set_INOUTTitle] = React.useState("");
    const [OutTime, set_OutTime] = React.useState(false);
    //const [FullHalfDay, set_FullHalfDay] = React.useState("0");
    const ActionType = [{action: "Late", id: 2}, {action: "Half Day", id: 4}];

    
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
                    resultStaffList.data[i].contract_type = "0";
                    resultStaffList.data[i].gender = "0";
                    if (Colors == "#FFFFFF") {
                        Colors = "#F8F7D8";
                    } else {
                        Colors = "#FFFFFF";
                    }
                //console.log("Row color : ", resultStaffList.data[i].other_document_name);
                    for (j = 0; j < responseAtten.data.length; j++) {
                        //console.log("responseAtten.data[j].staff_id : ", responseAtten.data[j].staff_id);
                        if(responseAtten.data[j].staff_id == sid){
                            resultStaffList.data[i].epf_no = responseAtten.data[j].staff_attendance_type_id;
                            resultStaffList.data[i].bank_branch = "none";
                            if(responseAtten.data[j].staff_attendance_type_id == 1)
                                cno = cno+1;

                            //Attendance CheckBox
                            //console.log("responseAtten.data[j].Start_time : ", responseAtten.data[j].Start_time);
                            if(responseAtten.data[j].Start_time == null){
                                resultStaffList.data[i].contract_type = "0";
                            }else{
                                resultStaffList.data[i].contract_type = responseAtten.data[j].Start_time;
                                //console.log("In time : ", resultStaffList.data[i].contract_type);
                            }
                            //console.log("responseAtten.data[j].End_time : ", responseAtten.data[j].End_time);
                            if(responseAtten.data[j].End_time == null){
                                resultStaffList.data[i].gender = "0";
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
                        //console.log("c no : ", cno);
                    }
                }
            }else{
                let Colors = "#FFFFFF";
                if(resultStaffList.data.length > 0)
                    for (i = 0; i < resultStaffList.data.length; i++) {
                        resultStaffList.data[i].lang_id = i + 1;
                        //Attendance CheckBox
                        resultStaffList.data[i].contract_type = "0";
                        resultStaffList.data[i].gender = "0";
                        resultStaffList.data[i].epf_no = "0";
                        resultStaffList.data[i].bank_branch = "none";
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
                    setRefFlatList(!isRefFlatList);   //for refresh FlatList            
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
            let Trow = DataS.data.length, date1, date2, TimeDifference, FullHalfDay = "4";
            let SID;
            var ST, ET;

            for (i = 0; i < Trow; i++) {
                SID = DataS.data[i].id;
                ST = DataS.data[i].contract_type;
                ET = DataS.data[i].gender;
                if(ET == "NaN:NaN")
                    ET = "0:0";

                date1 = new Date('2019-03-02 '+ST);        //responseAtten.data[j].Start_time);
                date2 = new Date('2019-03-02 '+ET);     //responseAtten.data[j].End_time);
                TimeDifference =  (date2 - date1) / (1000 * 60 * 60);
                
                // ST= `${date1.getHours()}:${date1.getMinutes()}`;
                // ET= `${date2.getHours()}:${date2.getMinutes()}`;
                //present = 1
                //Late  = 2
                //Absent = 3
                //Half Day = 4
                //Holiday = 5

                FullHalfDay="4";
                if(TimeDifference >= 1.5){
                    FullHalfDay="4";
                }
                if(TimeDifference >= 3){
                    FullHalfDay="1";
                }
                if(ST == "0" || ST == 0 || ET == "0" || ET == 0 || TimeDifference == 0){
                    FullHalfDay = "3";
                }

                console.log("Parameters : ", DataS.data[i].name+" "+DataS.data[i].surname, ", epf :", DataS.data[i].epf_no);
                let resultClass0, resultClass;
                try {
                    resultClass = await
                        fetch(config.Url+Api, {
                            method: 'POST', headers: { 'Accept': 'application/json',
                                                'Content-Type': 'application/json', },
                            body: JSON.stringify({
                                "data": [
                                    {
                                        "date": SDAY,
                                        "staff_id": SID,
                                        "staff_attendance_type_id": DataS.data[i].epf_no,
                                        "remark":"Excellent",
                                        "Start_time": ST,
                                        "End_time": ET,
                                        "is_active": "0"
                                    }
                                ]
                            })
                        })
                        resultClass0 = resultClass;
                        resultClass = await resultClass.json();
                    console.log("responseUpload : ", resultClass);
                    reset_ProgressBar(Math.round(i * 100 / Trow));

                    if (i >= DataS.data.length-1) {
                        reset_isSaving(false);
                        set_TextSave("Successfully Saved")
                        setTimeout(() => { set_TextSave("Save") }, 1000 * 2);
                    }
    
                } catch (error) {
                    //resultClass0 = await resultClass0.update();
                    console.log("SubmitToServer resultClass0 : ", resultClass0.status);
                    console.error("SubmitToServer : ", error.message);
                    if(resultClass0.status == 200)
                        reset_ProgressBar(Math.round(i * 100 / Trow));
                    if (i >= DataS.data.length-1) {
                        reset_isSaving(false);
                        if(error.message == "[SyntaxError: JSON Parse error: Unexpected end of input]" ||
                            resultClass0.status == 200){
                                set_TextSave("Successfully Saved")

                        }else{
                            set_TextSave("Server issue, try after some time.");
                        }
                        setTimeout(() => { set_TextSave("Save") }, 1000 * 2);
                    }
                }

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
        let i=0;
        for (i = 0; i < DataS.data.length; i++) {
            DataS.data[i].gender = CurrentTime;      //Attendance CheckBox
            console.log("*************** DataS.data[i].gender : ", DataS.data[i].gender);
            if(i >= DataS.data.length -1){
                setTimeout(()=>{
                    setRefFlatList(!isRefFlatList);   //for refresh FlatList
                },300);
            }
        }
        set_InTime(false);
        set_OutTime(true);
        CheckPresent(2);
    }
    //------------------------------------*****-------------Main Display
    const UpdateAll = () => {
        setAllChecked(!isAllChecked);
        set_Holiday(false);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Update All-1 : ", isAllChecked, ", ------InTime : ", InTime);
        for (i = 0; i < DataS.data.length; i++) {
            if(DataS.data[i].epf_no == 3 || DataS.data[i].epf_no == "3" || DataS.data[i].epf_no == "5"||
                DataS.data[i].epf_no == 5 || DataS.data[i].epf_no == 0){
                DataS.data[i].epf_no = "1";
                if(InTime){
                    DataS.data[i].contract_type = CurrentTime;      //Attendance CheckBox
                }
                if(OutTime){
                    DataS.data[i].gender = CurrentTime;      //Attendance CheckBox
                }
            }else{
                DataS.data[i].epf_no = "3";
                if(InTime){
                    DataS.data[i].contract_type = "0";      //Attendance CheckBox
                }
                if(OutTime){
                    DataS.data[i].gender = "0";      //Attendance CheckBox
                }
            }
            // if(InTime){
            //     if (isAllChecked) {       //false
            //         DataS.data[i].contract_type = CurrentTime;      //Attendance CheckBox
            //         console.log("---------------------DataS.data[i].contract_type : ", DataS.data[i].contract_type);
            //     }else{
            //         DataS.data[i].contract_type = "0";      //Attendance CheckBox
            //     }
            // }
            // if(OutTime){
            //     if (isAllChecked) {       //false
            //         if(DataS.data[i].contract_type !== "0" || DataS.data[i].contract_type.length > 3)
            //             DataS.data[i].gender = CurrentTime;      //Attendance CheckBox
            //     }else{
            //         DataS.data[i].gender = "0";      //Attendance CheckBox
            //     }
            // }
            console.log("DataS.data[i].contract_type : ", DataS.data[i].contract_type);
            console.log("DataS.data[i].gender : ", DataS.data[i].gender);
            if(i >= DataS.data.length -1){
                setTimeout(()=>{
                    setRefFlatList(!isRefFlatList);   //for refresh FlatList
                },300);
            }
        }
    }
    //------------------------------------*****-------------Main Display
    const UpdateAllHoliday = () => {
        setAllChecked(true);
        //console.log("Update All-1 : ", isAllChecked)
        for (i = 0; i < DataS.data.length; i++) {
                DataS.data[i].epf_no = "5";
            if(i >= DataS.data.length - 1){
                setTimeout(()=>{
                    setRefFlatList(!isRefFlatList);   //for refresh FlatList
                    set_Holiday(true);
                },300);
            }
        }
    }
    //------------------------------
    const UpdatePresent = (id) => {
        let present, n;
        //console.log("UpdatePresent, ID : ", id);
        if (id !== null) {
            for(n = 0; n < DataS.data.length; n++){
                if(DataS.data[n].id == id){
                    console.log("ID matched");
                    if(InTime){
                        present = DataS.data[n].contract_type;
                        if (present.length > 1) {       //false
                            DataS.data[n].contract_type = "0";      //Attendance CheckBox
                        }else{
                            DataS.data[n].contract_type = CurrentTime;      //Attendance CheckBox
                        }
                    }
                    if(OutTime){
                        present = DataS.data[n].gender;
                        console.log("UpdatePresent, ID : ", id);
                        if (present.length > 1) {       //false
                            DataS.data[n].gender = "0";      //Attendance CheckBox
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
                    if ((DataS.data[i].contract_type).length > 1) {       //false
                        cno = cno+1;
                    }
                }
                if(OutTime){
                    if ((DataS.data[i].gender).length > 1) {       //false
                        cno = cno+1;
                    }
                }
                if(cno == DataS.data.length){
                    setAllChecked(false);
                }else{
                    setAllChecked(true);
                }
            }
            setRefFlatList(!isRefFlatList);   //for refresh FlatList
        }
    }
    //------------------------------
    const UpdateStatusByID = (actionID, id) => {
        let n;
        if (id !== null) {
            for(n = 0; n < DataS.data.length; n++){
                if(DataS.data[n].id == id){
                    if(actionID > 0){
                        DataS.data[n].epf_no = actionID;
                        DataS.data[n].bank_branch = "none";
                    }else{
                        if(DataS.data[n].epf_no == 3 || DataS.data[n].epf_no == "3"){
                            DataS.data[n].epf_no = "1";
                        }else{
                            DataS.data[n].epf_no = "3";
                        }
                        if(InTime){
                            if (isAllChecked) {       //false
                                DataS.data[n].contract_type = CurrentTime;      //Attendance CheckBox
                            }else{
                                DataS.data[n].contract_type = "0";      //Attendance CheckBox
                            }
                        }
                        if(OutTime){
                            if (isAllChecked) {       //false
                                if(DataS.data[n].contract_type !== "0" || DataS.data[n].contract_type.length > 3)
                                    DataS.data[n].gender = CurrentTime;      //Attendance CheckBox
                            }else{
                                DataS.data[n].gender = "0";      //Attendance CheckBox
                            }
                        }
                    }
                }
                if(n >= DataS.data.length - 1)
                setRefFlatList(!isRefFlatList);   //for refresh FlatList
            }
            let cno=0;
            for (i = 0; i < DataS.data.length; i++) {
                    if (DataS.data[i].epf_no == 1 || DataS.data[i].epf_no == "1") {       //false
                        cno = cno+1;
                    }
                    if(i >= DataS.data.length -1)
                        if(cno == DataS.data.length){
                            setAllChecked(false);
                        }else{
                            setAllChecked(true);
                        }
            }

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
        console.log("EditTimeFor : ", EditINOUTTime.substring(EditINOUTTime.lastIndexOf(":")+1));
        for (i = 0; i < DataS.data.length; i++) {
            if (DataS.data[i].id == DataIndex) {       //false
                if(EditTimeFor == 1)
                    DataS.data[i].contract_type = `${EditINOUTTime.substring(0, EditINOUTTime.lastIndexOf(":"))}:${EditINOUTTime.substring(EditINOUTTime.lastIndexOf(":")+1)}`;      //Attendance CheckBox
                if(EditTimeFor == 2)
                    DataS.data[i].gender = `${EditINOUTTime.substring(0, EditINOUTTime.lastIndexOf(":"))}:${EditINOUTTime.substring(EditINOUTTime.lastIndexOf(":")+1)}`;;      //Attendance CheckBox
                    console.log("EditTimeFor : ", EditTimeFor, "DataS.data[i].gender : ", DataS.data[i].gender);
            }
        }
        set_EditInOutModel(false);
    }
    //------------------------------
    const ForOpenDropD = (id) => {
        let n;
        console.log("UpdateStatusByID ------------------- id : ", id);
        //console.log("UpdateStatusByID ------------------- DataS.data[n].epf_no : ", DataS.data[id].epf_no);
        if (id !== null) {
            for(n = 0; n < DataS.data.length; n++){
                if(DataS.data[n].id == id){
                    if(DataS.data[n].bank_branch == "none"){
                        DataS.data[n].bank_branch = "flex";
                    }else{
                        DataS.data[n].bank_branch = "none";
                    }
                    n = DataS.data.length + 1;
                }else{
                    DataS.data[n].bank_branch = "none";
                }
                if(n >= DataS.data.length - 1)
                setRefFlatList(!isRefFlatList);   //for refresh FlatList
            }
        }
    }
    //----------------------------
    const ShowDropdown = (Itm, indexx, id) => {
        console.log("--------------------", Itm);
        return(
            <View style={{flexDirection: "column"}}>
            <TouchableOpacity style={{width: config.DEVICEWIDTH * 0.5, margin: 7}}
                onPress={()=> UpdateStatusByID(Itm.id, id)}>
                <Text style={{fontSize: 17, color: "#000000",}}>{Itm.action}</Text>
            </TouchableOpacity>
            <View style={{backgroundColor: "A09C9C", height: 2, width: "100%"}}/>
            </View>
            
        );
    }
    //----------------------------
    const ShowList = (Itms, indexx) => {
        let II = (Itms.contract_type).length, OO = (Itms.gender).length, date1, date2, TimeDifference = 0;
        //console.log("ShowList, name : ", Itms.name, ", epf : ", Itms.bank_branch);
        if(DataS.data.length > 0){
        return (
            <View style={{flexDirection: "column"}}>
                <View style={{ backgroundColor: Itms.other_document_name }}>
                    <View style={styles.Row2}>
                        <TouchableOpacity style={{width: "68%", height: "100%", flexDirection: "row"}}
                            onPress={()=> {
                                navigation.navigate('StaffAttendanceView', {PERMISSION_RANGE: "0",
                                STAFF_NAME: Itms.name+" "+Itms.surname, STAFF_ID: Itms.id});
                            }}>
                            <Text style={{ width: "12%", height: "100%", color: "#000000", fontSize: 17, }}>
                                {Itms.lang_id}. </Text>
                            <Text style={{ width: "80%", height: "100%", color: "#000000", fontSize: 17 }}>
                                {Itms.name} {Itms.surname}</Text>
                            <Text style={{ width: "2%", color: "#000000",
                                fontSize: 17 }}>:</Text>
                        </TouchableOpacity>

                        <View style={{flexDirection: "row", width: "100%", marginLeft: -5}}>
                                <TouchableOpacity onPress={() => {
                                    if(InTime){
                                        UpdateStatusByID(0, Itms.id);
                                    }else{
                                        if(II>1)
                                            UpdateStatusByID(0, Itms.id);
                                    }

                                }} style={{width: "10%"}}>
                                {
                                    Itms.epf_no == 1 ? (
                                        <MaterialCommunityIcons name="alpha-p-box-outline"
                                            size={30} color = "#08F543"
                                            key={Itms.id}/>
                                    ):(
                                    Itms.epf_no == 2 ? (
                                        <MaterialCommunityIcons name="alpha-l-circle-outline"
                                            size={30} color = "#FBC612"
                                            key={Itms.id}/>
                                    ):(
                                        Itms.epf_no == 3 ? (
                                            <MaterialCommunityIcons name="alpha-a-box-outline"
                                            size={30} color="red" />
                                        ):(
                                            Itms.epf_no == 4 ? (
                                                <MaterialCommunityIcons name="alpha-h-circle-outline"
                                                size={30} color = "#3003F7"
                                                key={Itms.id}/>
                                        ):(
                                            Itms.epf_no == 5 ? (
                                                <MaterialCommunityIcons name="alpha-h-box-outline"
                                                size={30} color = "#0D885C"
                                                key={Itms.id}/>
                                            ):(
                                                <MaterialIcons name={II > 1 ? "check-box" : "check-box-outline-blank"}
                                                    size={30} color={II > 1 ? "blue" : "black"}
                                                    key={Itms.state}/>
                                            )
                                        )
                                    )
                                    )
                                    )
                                }
                                </TouchableOpacity>
                        {
                            Itms.epf_no == 5 ? (
                                <></>
                            ):(
                                <TouchableOpacity style={{width: 50, height: 50, marginLeft: 10, marginTop: 2}}
                                    onPress={()=> ForOpenDropD(Itms.id)}>
                                    <AntDesign name={Itms.bank_branch == "none"? "down" : "up"} size={25} color="black" />
                                </TouchableOpacity>
                            )
                        }
                        {
                            InTime ? (
                                II > 1 && Itms.epf_no != 3 && Itms.epf_no != 5 ? (
                                    <TouchableOpacity onPress={() => EditTime(1, Itms.contract_type,
                                        Itms.name+" "+Itms.surname, Itms.id)}
                                        style={{marginLeft: 0, marginTop: 3}}>
                                        <MaterialIcons name="access-time" size={24} color="green" />
                                    </TouchableOpacity>
                                ):(
                                    <></>
                                )
                            ):(
                                OO > 1 && Itms.epf_no != 3 && Itms.epf_no != 5 ? (
                                    <TouchableOpacity onPress={() => EditTime(2, Itms.gender,
                                        Itms.name+" "+Itms.surname, Itms.id)}
                                        style={{marginTop: 3}}>
                                        <MaterialIcons name="access-time" size={24} color="green" />
                                    </TouchableOpacity>
                                ):(
                                    <></>
                                )
                            )
                        } 
                    </View>
                </View>
            </View>
                <View style={[styles.dropdownAction, {top: config.DEVICEHEIGHT <=734 ? "20%" : "2%",
                    display: Itms.bank_branch,
                    marginBottom: 10}]}>
                    <FlatList contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                        data={ActionType}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => ShowDropdown(item, index, Itms.id)}
                    />
                </View>
            </View>
        );
        }
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
                    {
                        route.params.PERMISSION_RANGE == 12 ||
                        route.params.PERMISSION_RANGE == 13 ||
                        route.params.PERMISSION_RANGE == 30 ? (
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
                        ):(
                            <></>
                        )
                    }
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
                                            <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold",
                                                width: DEVICEWIDTH * 0.15, marginTop: 3
                                            }}>Holiday</Text>
                                            <MaterialIcons name={isHoliday ? "check-box" : "check-box-outline-blank"}
                                                size={30} color={isHoliday ? "blue":"black"}
                                                onPress={() => UpdateAllHoliday()} style={{width: DEVICEWIDTH * 0.1}} />
                                            <View style={{width: config.DEVICEWIDTH * 0.135}}/>
                                            <Text style={{
                                                color: "#000000", marginLeft: 10, fontWeight: "bold",
                                                width: DEVICEWIDTH * 0.21, marginTop: 3
                                            }}>All Present</Text>

                                            <MaterialIcons name={isAllChecked ? "check-box-outline-blank" : "check-box"}
                                                size={30} color={isAllChecked ? "black" : "blue"}
                                                onPress={() => UpdateAll()} style={{width: DEVICEWIDTH * 0.1}} />
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
                                            extraData={isRefFlatList} style={{ height: DEVICEHEIGHT * 0.55 }}
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
        elevation: 1,
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
        fontSize: 25,
        backgroundColor: "#C9C9C9",
        
    },
    dropdownAction: {
        backgroundColor: '#DCDCDC',
        width: '40%',
        height: DEVICEHEIGHT * 0.12,
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        elevation: 20,
        left: "50%",
      },

});