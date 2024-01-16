import React from "react";
import { View, StyleSheet, Text, Image, Dimensions, Modal, ActivityIndicator, 
        TouchableOpacity, FlatList, TextInput, ScrollView, RefreshControl, Alert } from "react-native";
import { FontAwesome, Entypo, MaterialIcons, AntDesign, Ionicons } from '@expo/vector-icons';
//import { TabView, SceneMap } from 'react-native-tab-view';        //npm i react-native-tab-view
//npm install @react-native-community/masked-view react-native-select-dropdown
//import SelectDropdown from "react-native-select-dropdown";
//import * as ImagePicker from 'expo-image-picker';       //npx expo install expo-image-picker
import * as DocumentPicker from "expo-document-picker";
//import * as FileSystem from 'expo-file-system';
import ImageViewer from 'react-native-image-pan-zoom';
import AsyncStorage from '@react-native-async-storage/async-storage';   
//import * as filesystem from 'expo-file-system';
//import * as intentlauncher from 'expo-intent-launcher';

import config from "./app_config";
import PdfViewer from "./PdfViewer";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;
const FileUrl = {title: null, uri: null, type: null};


const HomeWork = ({navigation, route}) => {

    const newdate = new Date();
    let HDAY= `${newdate.getFullYear()}/${newdate.getMonth() + 1}/${newdate.getDate()}`;
    let SDAY= `${newdate.getFullYear()}/${newdate.getMonth() + 1}/${newdate.getDate()+1}`;

    const [ServerProcess, set_ServerProcess] = React.useState(false);
    const [RefreshFlatList, set_RefreshFlatList] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [color, changeColor] = React.useState('red');

    const [SESSIONID, set_SESSIONID] = React.useState("19");

    const [chevrondownClass, setchevrondownClass] = React.useState(true);
    const [classLView, set_classLView] = React.useState("none");
    const [ClassID, set_ClassID] = React.useState("0");
    const [ClassAtt, set_ClassAtt] = React.useState('Select');
    const [ClassForAtt, Set_ClassForAtt] = React.useState([]);

    const [chevrondownSection, setchevrondownSection] = React.useState(true);
    const [SectionLView, set_SectionLView] = React.useState("none");
    const [SectionID, set_SectionID] = React.useState('0');
    const [SectionID2, set_SectionID2] = React.useState('0');
    const [SectionAtt, set_SectionAtt] = React.useState('All');
    const SectionForAtt = [{section: "All", id: '0'}, {section: "A", id: '1'}, {section: "B", id: '2'},
                            {section: "C", id: '3'}, {section: "D", id: '4'}, {section: "E", id: '5'}];

    const [chevrondownSub, setchevrondownSub] = React.useState(true);
    const [SubLView, set_SubLView] = React.useState("none");
    const [SubID, set_SubID] = React.useState("0");

    const [SubGID, set_SubGID] = React.useState('');

    const [SubForAtt, Set_SubForAtt] = React.useState([]);
    const [SubForDisp, Set_SubForDisp] = React.useState([]);
    const [SelectedSubject, set_Subject] = React.useState('All Subjects');

    const [InitialSubRow, set_InitialSubRow] = React.useState(0);
    const [HomeWorkSubT, set_HomeWorkSubT] = React.useState("");
    const [EditID, set_EditID] = React.useState('-1');
    const [Activit, set_Activit] = React.useState('0');
    const [MakerID, set_MakerID] = React.useState('');
    const [MakerN, set_MakerN] = React.useState('');
    const [HomeWorkDt, set_HomeWorkDt] = React.useState('');
    const [Submission_DT, set_Submission_DT] = React.useState('');
    const [HomeWorkEdit, set_HomeWorkEdit] = React.useState('');
    const [HomeWorkSubID, set_HomeWorkSubID] = React.useState(0);
    const [HomeWorks, set_HomeWorks] = React.useState([]);
    const [isUploadBoxVisival, set_UploadBox] = React.useState(false);
    const [isSubmitLeaveForm, set_LeaveForm] = React.useState(false);

    const [FileModalVisival, set_FileModalVisival] = React.useState(false);

    const [isShowFlatList, reset_isShowFlatList]=React.useState(false);
    const [isLoading, reset_isLoading]=React.useState(true);
    const [pickedFile, setPickedFile] = React.useState(null);
    //---------------------------------
    const FetchPersonal=async ()=>{
  
        FileUrl.title = null;
        FileUrl.uri = null;
        FileUrl.type = null;
        AsyncStorage.getItem('NAME').then((value) => set_MakerN(value));
        try{
            let responsClass = await fetch(config.Url+'getclass', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
            })
    
            let responsJsonClass = await responsClass.json();
            Set_ClassForAtt(responsJsonClass);
            console.log("Class : ", responsJsonClass);
            reset_isLoading(false);
        }catch(error){
            reset_isLoading(false);
            Alert.alert("Server issue, please try again");
            console.error("Error -1 : ",error);
        };

    }
    
    React.useEffect(() => {
        AsyncStorage.getItem('ID').then(async (staffID) => set_MakerID(staffID));
        FetchPersonal();
    }, []);
    //----------------------------------
    const FetchHomeWork = async (clssID, sectnID) =>{
        console.log("FetchHomeWork, Class : ", clssID);
        console.log("FetchHomeWork, section : ", sectnID);
        set_HomeWorks([]);
        try{
            let responsHW = await fetch(config.Url+'gethomeworkbyclass', {
                method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                body: JSON.stringify({class_id: clssID})
        })
            let responsJsonHW = await responsHW.json();
            console.log("Home responsJsonHW-1 : ", responsJsonHW);
            console.log("Home responsJsonHW : ", responsJsonHW.data.length);

            let ss=[], l=0;
            for(l=0; l<responsJsonHW.data.length; l++){
                if(responsJsonHW.data[l].class_id == clssID && (responsJsonHW.data[l].section_id == sectnID ||
                    sectnID == 0 || sectnID == "0")  && responsJsonHW.data[l].session_id == SESSIONID){
                    ss.push(responsJsonHW.data[l]);
                }
                if(l>=responsJsonHW.data.length-1){
                    console.log("Home responsJsonHW, Add : ", ss);
                    set_HomeWorks(ss);
                    reset_isLoading(false);
                    reset_isShowFlatList(true)
                    console.log("Home W : "+isShowFlatList, ss);
                }
            }

        }catch(error){
        console.error("Error -3 : ",error);
        };

    }
    const onRefresh = () => {
        setRefreshing(true);
        FetchHomeWork(ClassID, SectionID);
        setTimeout(() => {
          changeColor('green');
          setRefreshing(false);
        }, 2000);
    };
    //-----------------------------------------------------Select Class
    const FetchSubjects = async (Cid, Sid) =>{
        let l;
        try{
            let responsSub = await fetch(config.Url+'getsubjectlist', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
            body: JSON.stringify({class_id: Cid, section_id: Sid, session_id: SESSIONID})
            })
            var ss=[{
                "id": "0",
                "subject_group_id": "0",
                "class_section_id": "0",
                "session_id": SESSIONID,
                "description": null,
                "is_active": "0",
                "created_at": "",
                "updated_at": null,
                "name": "",
                "subject_id": "0",
                "subject": "All Subject",
                "code": "0",
                "type": "0"
            }]
            let responsJsonSub = await responsSub.json();
            
            console.log("Subject : ", responsJsonSub);
            console.log("Subject : ", responsJsonSub.data.length);
            if(responsJsonSub.data.length > 0){
                Set_SubForDisp(responsJsonSub.data);
                for(l=0; l<responsJsonSub.data.length; l++){
                    console.log("Under for loop, Subject : ", responsJsonSub.data[l]);
                    ss.push(responsJsonSub.data[l]);
                    if(l>=responsJsonSub.data.length-1)
                        Set_SubForAtt(ss);
                        console.log("Subject ss : ", ss);
                        reset_isShowFlatList(true)
                    }
            }else{
                var ss=[{
                    "id": "0",
                    "subject_group_id": "0",
                    "class_section_id": "0",
                    "session_id": SESSIONID,
                    "description": null,
                    "is_active": "0",
                    "created_at": "",
                    "updated_at": null,
                    "name": "",
                    "subject_id": "0",
                    "subject": "All Subject",
                    "code": "0",
                    "type": "0"
                    }]
                Alert.alert("There is no subject list for selected class, please update.");
                Set_SubForDisp(ss);
                Set_SubForAtt(ss);
                reset_isShowFlatList(true)
            }

        }catch(error){
            console.error("Error -4 : ",error);
        };

    }
    //-----------------------------------------------------Pick file
    const PickFile = async () => {
        console.log("HomeWork.js, PickedFile : ------------------");
        try {
            const filePickResponse = await DocumentPicker.getDocumentAsync({
              type: "*/*",
            });
            console.log("HomeWork.js, filePickResponse : ", filePickResponse);
            setTimeout(()=>{
                if (!filePickResponse.canceled) {
                setPickedFile({
                    name: filePickResponse.assets[0].name,
                    type: filePickResponse.assets[0].mimeType,
                    uri: filePickResponse.assets[0].uri,
                });
                console.log("HomeWork.js, PickedFile : ", pickedFile);
                }
            }, 1000);
          } catch (error) {
            console.error("PickFile : ", error);
          }
    }
    //-----------------------------------------------------Select Class
    const ClassList = () =>{
        console.log("Home W -3 : ", HomeWorks);
        set_SectionLView("none");
        setchevrondownSection(true);
        set_SubLView("none");
        setchevrondownSub(true);

        setchevrondownClass(!chevrondownClass);
        console.log("Class List : ", chevrondownClass);

        if(chevrondownClass){
            set_classLView("flex");
        }else{
            set_classLView("none");
        }
    }

    const SelectClass = async (idd, Sclass) => {
        console.log("Home W -4 : ", HomeWorks);
        set_ClassID(idd);
        set_ClassAtt(Sclass);
        set_classLView("none");
        setchevrondownClass(true);
        if(Sclass !== 'Select' && SectionAtt !== "All"){
            FetchSubjects(idd, SectionID);
            FetchHomeWork(idd, SectionID);
        }
    }

    const ShowClassFlatList = (Itms) => {
        return(
            <TouchableOpacity onPress={() => SelectClass(Itms.id, Itms.class)} key={Itms.id}>
                <View style={{backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                            height: DEVICEHEIGHT * 0.05,}}>
                    <Text style={{width: DEVICEWIDTH * 0.2, color: "#000000", fontSize: 17}}>
                            {Itms.class}. </Text>
                    <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 1,
                        marginTop: 5}}></View>                        
                </View>
            </TouchableOpacity>
        );
    }
    //---------------------------------------Section List for select
    const SectionList = () =>{
        set_classLView("none");
        setchevrondownClass(true);
        set_SubLView("none");
        setchevrondownSub(true);

        setchevrondownSection(!chevrondownSection);
        console.log("Section List : ", chevrondownSection);

        if(chevrondownSection){
            set_SectionLView("flex");
        }else{
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

        console.log("Section, Class : ", ClassAtt);
        console.log("Section, section : ", SectionTitle);

        if(ClassAtt !== 'Select' && SectionTitle !== "All"){
            FetchSubjects(ClassID, idd);
            FetchHomeWork(ClassID, idd);
        }

    }

    const ShowSectionFlatList = (Itmsection, Index) => {
        return(
            <View style={{backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                            height: DEVICEHEIGHT * 0.05,}}>
                <TouchableOpacity onPress={() => SelectSection(Itmsection.id, Itmsection.section)} key={Itmsection.id}>
                    <Text style={{width: DEVICEWIDTH * 0.2, color: "#000000", fontSize: 17, marginBottom: 6}}>
                            {Itmsection.section}. </Text>
                    <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 1}}></View>                        
                </TouchableOpacity>
            </View>
        );
    }
    //---------------------------------------Section List for select
    const SubjectList = () =>{
        set_classLView("none");
        setchevrondownClass(true);
        set_SectionLView("none");
        setchevrondownSection(true);

        setchevrondownSub(!chevrondownSub);

        if(chevrondownSub){
            set_SubLView("flex");
        }else{
            set_SubLView("none");
        }
        console.log("Sub List : ", chevrondownSub);
    }

    const SubjectSelect = async (idd, SubjectTitle) => {
        set_SubID(idd);
        set_Subject(SubjectTitle);
        set_SubLView("none");
        setchevrondownSub(true);
    }

    const ShowSubjectFlatList = (ItmSub, Index) => {
        console.log("ShowSubjectFlatList, ItmSub : ", ItmSub);
        return(
                <View style={{backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                            height: DEVICEHEIGHT * 0.05, width: "100%"}}>
                    <TouchableOpacity onPress={() => SubjectSelect(ItmSub.subject_id, ItmSub.subject)}
                        key={ItmSub.subject_id}>
                        <Text style={{width: "90%", color: "#000000", fontSize: 17, marginBottom: 6}}>
                            {ItmSub.subject}</Text>
                    </TouchableOpacity>
                    <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 1}}></View>                        
                </View>
        );
    }
    //---------------------------------------------------------
    const toggleModalVisibility = () => {
        set_UploadBox(!isUploadBoxVisival);
        set_LeaveForm(false);
    }
    //---------------------------------------------------------
    const FiletoggleModalVisibility = (sub, furi, type) => {
        FileUrl.title = sub;
        FileUrl.uri = furi;
        FileUrl.type = type;

        console.log("HomeWork.js, FiletoggleModalVisibility, FileUrl : ", FileUrl.title);
        console.log("HomeWork.js, FiletoggleModalVisibility, FileUrl : ", FileUrl.type);
        set_FileModalVisival(!FileModalVisival);
    }
    //-----------------------------
    const EditHandler = (itemm, subj, subID, SecID, SGid) => {
        set_SectionID2(SecID);
        set_SubGID(SGid);
        set_ServerProcess(false);
        set_HomeWorkSubID(itemm.subject_id);
        
        let desc = itemm.description;
        desc=desc.replace(/<[^>]+>/g, '');

        set_HomeWorkSubT(subj);
        set_EditID(itemm.id);
        set_HomeWorkDt(itemm.homework_date);
        set_Submission_DT(itemm.submit_date);
        set_HomeWorkEdit(desc);
        set_Activit("1");
        set_UploadBox(true);
    };
    const ClickHandler = (itmm, SecID, SGid) => {
        set_SectionID2(SecID);
        set_SubGID(SGid);
        set_ServerProcess(false);
        set_HomeWorkSubID(itmm.subject_id);

        set_HomeWorkSubT(itmm.subject);
        set_HomeWorkDt(HDAY);
        set_Submission_DT(SDAY);
        set_HomeWorkEdit("");
        set_Activit("0");
        //set_EditApplication(1);
        set_UploadBox(true);
    };
    //--------------------------------------------------
    const SaveNew = async () => {
        set_ServerProcess(true);
        var data = new FormData();
        data.append('class_id', ClassID);
        data.append('section_id', SectionID2);
        data.append('session_id', SESSIONID);
        data.append('subject_group_id', SubGID);
        data.append('subject_id', HomeWorkSubID);
        data.append('homework_date', HomeWorkDt);
        data.append('submit_date', Submission_DT);
        data.append('staff_id', MakerID);
        data.append('description', HomeWorkEdit);
        console.log("----------------------", pickedFile);
        data.append('homework_file', pickedFile);
        try{
            let responsServer = await fetch(config.Url+'addclasshomework', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",},
            body: data
            })

            console.log("HomeWork.js, responsServer : ", responsServer);
            let responsJsonServer = await responsServer.json();
          console.log("HomeWork.js, Save, respons : ", responsJsonServer);
            if(responsJsonServer.code == 0 || responsJsonServer.code == "0"){
                Alert.alert("Home work submited successfully");
                FetchHomeWork(ClassID, SectionID);
                setTimeout(()=>{
                    set_ServerProcess(false);
                    set_UploadBox(false);
                    setPickedFile(null);
                }, 30);
            }else{
                set_ServerProcess(false);
                Alert.alert("Please try again...");
            }
        }catch(error){
            set_ServerProcess(false);
            Alert.alert("Please try again.....")
            console.error("Action on Server -1 : ",error);
        };
    };
    const UpdateEdit = async () => {
        set_ServerProcess(true);
        try{
            let responsServer = await fetch(config.Url+'updateclasshomework', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
            body: JSON.stringify({id: EditID,
                                    class_id: ClassID,
                                    section_id: SectionID2,
                                    session_id: SESSIONID,
                                    homework_date: HomeWorkDt,
                                    submit_date: Submission_DT,
                                    staff_id: MakerID,
                                    subject_group_id: SubGID,
                                    description: HomeWorkEdit
                                })
            })

          let responsJsonServer = await responsServer.json();
          console.log("Server Response : ", responsJsonServer);
            if(responsJsonServer.code == 0 || responsJsonServer.code == "0"){
                Alert.alert("Home work updated successfully");
                FetchHomeWork(ClassID, SectionID);
                setTimeout(()=>{
                    set_ServerProcess(false);
                    set_UploadBox(false);
                }, 30);
            }else{
                Alert.alert("Please try again...");
            }
        }catch(error){
            Alert.alert("Please try again.....")
            console.error("Action on Server -1 : ",error);
        };
    };
    const DelRecord = async (recordNo) => {
        try{
            let responsServer = await fetch(config.Url+'deletehomework', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
            body: JSON.stringify({id: recordNo})
            })

          let responsJsonServer = await responsServer.json();
          console.log("Server Response : ", responsJsonServer);
            if(responsJsonServer.code == 0 || responsJsonServer.code == "0"){
                Alert.alert("Home work Deleted Successfully");
                    FetchHomeWork(ClassID, SectionID);
                    setTimeout(()=>{
                        set_ServerProcess(false);
                        set_UploadBox(false);
                    }, 300);
            }else{
                Alert.alert("Please try again...");
            }
        }catch(error){
            Alert.alert("Please try again.....")
            console.error("Action on Server -1 : ",error);
        };
    };
    //---------------------------------------
    const ShowHomeWorkList = (hw, Index, subid, sub, subGid) => {
        let desc = hw.description, fileEx = '';
        if(hw.subject_id == subid){
            desc=desc.replace(/<[^>]+>/g, '');
            console.log("ShowHomeWorkList, url : ", hw.document);
            fileEx = hw.document;
            if(fileEx.substring(fileEx.lastIndexOf(".")).length <= 5){
                if(fileEx.substring(fileEx.length-3, fileEx.length) == "png" ||
                    fileEx.substring(fileEx.length-3, fileEx.length) == "jpg" ||
                    fileEx.substring(fileEx.length-3, fileEx.length) == "jpe" ||
                    fileEx.substring(fileEx.length-3, fileEx.length) == "peg"){
                    fileEx = 'png';
                }else{
                    fileEx = 'pdf';
                }
            }

            return(
                <View style={styles.Column2}>
                        <View style={[styles.Row1, {alignItems: "flex-end", justifyContent: "flex-end"}]}>
                            {
                                route.params.PERMISSION_RANGE == 12 ||
                                route.params.PERMISSION_RANGE == 22 ||
                                route.params.PERMISSION_RANGE == 30 ? (
                                    <TouchableOpacity key={hw.id} onPress={() => EditHandler(hw, sub, subid,
                                        hw.section_id, subGid)}>
                                        <Entypo name="edit" size={24} color="#000080"
                                            style={{width: DEVICEWIDTH * 0.12}} />
                                    </TouchableOpacity>
                                ):(
                                    <></>
                                )
                            }

                            {
                                route.params.PERMISSION_RANGE == 13 ||
                                route.params.PERMISSION_RANGE == 23 ||
                                route.params.PERMISSION_RANGE == 30 ? (
                                    <TouchableOpacity key={`A${hw.id}`} onPress={() => DelRecord(hw.id)}>
                                        <MaterialIcons name="delete" size={24} color="#F90E2D"
                                                        style={{width: DEVICEWIDTH * 0.12}} />
                                    </TouchableOpacity>
                                ):(
                                    <></>
                                )
                            }
                        </View>
                        <View style={styles.Row2}>
                            <Text style={{width: DEVICEWIDTH * 0.35, color: "#000000"}}>
                                Homework Dt.</Text>
                            <Text style={{width: DEVICEWIDTH * 0.15, color: "#000000"}}>:</Text>
                            <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "700"}}>
                                {hw.homework_date}</Text>
                        </View>
                        <View style={styles.Row2}>
                            <Text style={{width: DEVICEWIDTH * 0.35, color: "#000000"}}>
                                Submission Dt.</Text>
                            <Text style={{width: DEVICEWIDTH * 0.15, color: "#000000"}}>:</Text>
                            <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "700"}}>
                                {hw.submit_date}</Text>
                        </View>
                        {/* <View style={styles.Row2}>
                            <Text style={{width: DEVICEWIDTH * 0.35, color: "#000000"}}>Teacher</Text>
                            <Text style={{width: DEVICEWIDTH * 0.15, color: "#000000"}}>:</Text>
                            <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "700"}}>{hw.maker_name}</Text>
                        </View> */}
                        <View style={{flexDirection: "row", marginTop: 20, marginLeft: 0}}>
                            <Text style={{width: DEVICEWIDTH * 0.4, color: "blue",
                                fontSize: 20, fontWeight: "bold"}}>Home Work</Text>
                        </View>
                        <Text style={{fontWeight: "700"}}>{desc}</Text>
                        <View style={{marginTop: 20}}>
                        {
                            fileEx == "png" ? (
                                <View style={{flexDirection: "column"}}>
                                    <Entypo name="attachment"size={20} color="black"
                                            style={{marginBottom: 10}} />
                                        <TouchableOpacity
                                            onPress={()=>{
                                                console.log("ShowHomeWorkList, sub : ", sub);
                                                FiletoggleModalVisibility(sub, hw.document, "png")
                                                }}>
                                            <Image 
                                            source={{uri: hw.document}}
                                            style={{width: 40, height: 40, 
                                                borderRadius: 3,}}/>
                                        </TouchableOpacity>
                                </View>
                            ):(
                                fileEx == 'pdf' ? (
                                    <View style={{flexDirection: "column"}}>
                                        <Entypo name="attachment"size={20} color="black"
                                            style={{marginBottom: 10}} />
                                        <TouchableOpacity
                                            onPress={()=> navigation.navigate("PDFviewer",
                                                            {fileuri: hw.document})}>
                                            <AntDesign name="pdffile1" size={35} color="blue" />
                                        </TouchableOpacity>
                                    </View>
                                ):(
                                    <></>
                                )
                            )
                        }
                        </View>
                    <View style={{paddingTop: 20}}/>
                </View>
            );
        }
    }
    //----------------
    const ShowList = (Itm, Index) => {
        if(Itm.subject_id != "-1" && HomeWorks.length > 0){
        // let n = 0, InitialIndex = 0;
        // for(n = 0; n<HomeWorks.length; n++){
        //     if(Itm.subject_id == HomeWorks[n].subject_id)
        //         InitialIndex = InitialIndex + 1;
        // }
        console.log("InitialIndex : ", InitialIndex);
        if(SelectedSubject == "All Subject" || Itm.subject_id == SubID || SubID == "0")
            return(
                <View style={styles.SContainer}>
                    <View style={styles.CardView2}>
                        <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05,
                                        backgroundColor: "#BAFAFF", borderTopLeftRadius: 15,
                                        borderTopRightRadius: 15, justifyContent: "center"}}>
                            <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold",
                                        width: DEVICEWIDTH * 0.7}}>{Itm.subject}</Text>
                        </View>
                        <FlatList contentContainerStyle={{ flexGrow: 1 }}
                            showsVerticalScrollIndicator={false}
                            horizontal extraData={RefreshFlatList}
                            data={HomeWorks}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item, index}) => ShowHomeWorkList(item, index, Itm.subject_id,
                                Itm.name+", "+Itm.subject,
                                Itm.subject_group_id)}
                        />
                        <View style={{marginTop: 0}}></View>
                        {
                            route.params.PERMISSION_RANGE == 11 ||
                            route.params.PERMISSION_RANGE == 21 ||
                            route.params.PERMISSION_RANGE == 30 ? (
                                <TouchableOpacity onPress={() => ClickHandler(Itm, HomeWorks[0].section_id,
                                        Itm.subject_group_id)}>
                                    <MaterialIcons name="note-add" size={40} color="#05AE7D"
                                        style={{left: "82%"}}/>
                                </TouchableOpacity>
                            ):(
                                <></>
                            )
                        }
                        <View style={{marginTop: 15}}></View>
                    </View>
                </View>
            );
        }
    }
//----------------------------------------------
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
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Your Home work</Text>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Diary is here!</Text>
                        </View>
                            <View style={{width: DEVICEWIDTH * 0.27, flexDirection: "column", alignItems: "center"}}>
                                <Image source={require('../assets/HomeWork2.jpg')} style={{width: 100, height: 100, 
                                    borderRadius: 20,}}/>
                            </View>
                    </View>


                        <View style={styles.Row2}>
                            <Text style={{width: DEVICEWIDTH * 0.13, fontSize: 14, fontWeight: "bold"}}>
                                Class :</Text>
                            <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: '28%',height: DEVICEHEIGHT * 0.03,
                                        borderRadius: 20, flexDirection: "row"}} onPress={() => ClassList()}>
                                <Text style={{width: DEVICEWIDTH * 0.175, fontSize: 14, fontWeight: "bold",
                                            marginLeft: 10}}>{ClassAtt}</Text>
                                <FontAwesome name={chevrondownClass ? "chevron-down" : "chevron-up"}
                                             size={19} color="black"/>
                            </TouchableOpacity>

                            <Text style={{width: DEVICEWIDTH * 0.19, fontSize: 14, fontWeight: "bold", 
                                    marginLeft: DEVICEWIDTH * 0.07}}>Section :</Text>
                            <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: '28%',height: DEVICEHEIGHT * 0.03,
                                        borderRadius: 20, flexDirection: "row"}} onPress={() => SectionList()}>
                                <Text style={{width: DEVICEWIDTH * 0.175, fontSize: 14, fontWeight: "bold",
                                            marginLeft: 10}}>{SectionAtt}</Text>
                                <FontAwesome name={chevrondownSection ? "chevron-down" : "chevron-up"}
                                                size={19} color="black"/>
                            </TouchableOpacity>
                        </View>

                            <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: '85%',height: DEVICEHEIGHT * 0.03,
                                        borderRadius: 20, flexDirection: "row", marginTop: 15}} onPress={() => SubjectList()}>
                                <Text style={{width: "90%", fontSize: 14, fontWeight: "bold",
                                            marginLeft: 10}}>{SelectedSubject}</Text>
                                <FontAwesome name={chevrondownSub ? "chevron-down" : "chevron-up"}
                                             size={19} color="black"/>
                            </TouchableOpacity>

                </View>
                <View style={{marginTop: 90}}></View>
                <ScrollView showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {
                    isShowFlatList ? (
                        SubForDisp.map((subj, index)=>{
                           return ShowList(subj, index);
                        })
                    ):(
                        <View></View>
                    )
                }
                </ScrollView>
                <View style={{marginTop: 70}}></View>
            </View>
            )
        }
                <Modal animationType="fade" transparent={true} visible={isUploadBoxVisival} 
                    presentationStyle="overFullScreen" onDismiss={toggleModalVisibility}>
                    <View style={styles.viewWrapper}>
                        <View style={styles.CardViewModel}>
                            <View style={styles.ColumnM1}>
                                <View style={{flexDirection: "row"}}>
                                    <Text style={{fontSize: 21, fontWeight: "bold", width: DEVICEWIDTH * 0.8,
                                                    color: "blue"}}>
                                        {HomeWorkSubT}
                                    </Text>
                                    <AntDesign name="close" size={25} color="red" onPress={() => toggleModalVisibility()}/>
                                </View>

                                <View style={[styles.Row1, {marginTop: 15,}]}>
                                    <Text style={{width: DEVICEWIDTH * 0.35, fontSize: 18}}>Home Work Dt.</Text>
                                    <Text style={{width: DEVICEWIDTH * 0.03, fontSize: 18, fontWeight: "bold"}}>:</Text>
                                    <TextInput placeholder="Home Work Date" onChangeText={(textF) => set_HomeWorkDt(textF)}
                                                    style={[styles.textInput,{height: 40, marginTop: -7}]} value={HomeWorkDt}/>
                                </View>
                                <View style={[styles.Row1, {marginTop: 15}]}>
                                    <Text style={{width: DEVICEWIDTH * 0.35, fontSize: 18}}>Submission Dt.</Text>
                                    <Text style={{width: DEVICEWIDTH * 0.03, fontSize: 18, fontWeight: "bold"}}>:</Text>
                                    <TextInput placeholder="Submission Date" onChangeText={(textT) => set_Submission_DT(textT)}
                                                    style={[styles.textInput,{height: 40, marginTop: -7}]} value={Submission_DT}/>
                                </View>
                                <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 18, marginTop: 20,
                                                color: "grey"}}>Home Work -</Text>
                                <TextInput placeholder="Home Work" onChangeText={(textR) => set_HomeWorkEdit(textR)}
                                                style={[styles.textInput, {width: DEVICEWIDTH * 0.85, 
                                                    height: DEVICEHEIGHT * 0.2, alignItems: "flex-start", 
                                                    justifyContent: "flex-start", textAlignVertical: 'top'}]} 
                                                value={HomeWorkEdit} multiline={true}/>
                                <TouchableOpacity style={{flexDirection: "row", alignItems: "center",
                                    marginTop: DEVICEHEIGHT * 0.03, justifyContent: "space-evenly",
                                    }} onPress={()=> PickFile()}>
                                {
                                    pickedFile !== null ? (
                                        pickedFile.type == "pdf" ||
                                        pickedFile.type == "application/pdf" ? (
                                            <AntDesign name="pdffile1" size={35} color="blue" />
                                        ):(
                                            <Image 
                                            source={{uri: pickedFile.uri}}
                                            style={{width: 40, height: 40, 
                                                borderRadius: 3,}}/>
                                        )
                                    ):(
                                        <Ionicons name="document-attach-outline" size={30} color="black"/>
                                    )
                                }
                                </TouchableOpacity>

                                <View>
                                {
                                    isSubmitLeaveForm ? (
                                        <View style={{marginTop: DEVICEHEIGHT * 0.01,
                                            marginBottom: DEVICEHEIGHT * 0.0338}}>
                                            <ActivityIndicator/>
                                        </View>
                                    ):(
                                        <View>
                                            {
                                                Activit == 1 ? (
                                                    <View>
                                                    {
                                                        ServerProcess?(
                                                            <View style={{marginTop:10, justifyContent: "center"}}>
                                                                <ActivityIndicator/>
                                                            </View>
                                                        ):(
                                                            <View>
                                                            <TouchableOpacity onPress={() => UpdateEdit()}>
                                                            <View style={{flexDirection: "row", marginTop: 0, 
                                                                    backgroundColor: '#FCB11C', width: DEVICEWIDTH * 0.901,
                                                                    marginLeft: -10, height: DEVICEHEIGHT * 0.07,
                                                                    alignItems: "center", justifyContent: "center",
                                                                    textAlign: "center", borderBottomLeftRadius: 7,
                                                                    borderBottomRightRadius: 7}}>
                                                                <Text style={{fontSize: 15, fontWeight: "bold", color: "#FFFFFF",}}>
                                                                    Update
                                                                </Text>
                                                            </View>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => SaveNew()}>
                                                            <View style={{flexDirection: "row", marginTop: 10, 
                                                                    backgroundColor: '#FCB11C', width: DEVICEWIDTH * 0.901,
                                                                    marginLeft: -10, height: DEVICEHEIGHT * 0.07,
                                                                    alignItems: "center", justifyContent: "center",
                                                                    textAlign: "center", borderBottomLeftRadius: 7,
                                                                    borderBottomRightRadius: 7}}>
                                                                <Text style={{fontSize: 15, fontWeight: "bold", color: "#FFFFFF",}}>
                                                                    Save for today
                                                                </Text>
                                                            </View>
                                                            </TouchableOpacity>
                                                            </View>
                                                            )
                                                    }
                                                    </View>
                                                ):(
                                                    ServerProcess?(
                                                        <View style={{marginTop:10, justifyContent: "center",
                                                            height: DEVICEHEIGHT * 0.07}}>
                                                            <ActivityIndicator/>
                                                        </View>
                                                    ):(
                                                    <TouchableOpacity onPress={() => SaveNew()}>
                                                        <View style={{flexDirection: "row", marginTop: 10, 
                                                            backgroundColor: '#FCB11C', width: DEVICEWIDTH * 0.901,
                                                            marginLeft: -10, height: DEVICEHEIGHT * 0.07,
                                                            alignItems: "center", justifyContent: "center",
                                                            textAlign: "center", borderBottomLeftRadius: 7,
                                                            borderBottomRightRadius: 7}}>
                                                        <Text style={{fontSize: 15, fontWeight: "bold", color: "#FFFFFF",}}>
                                                            SUBMIT
                                                        </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    )
                                                )
                                            }
                                            <View style={{marginTop: 15}}></View>
                                        </View>
                                    )
                                }
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal animationType="fade" transparent={true} visible={FileModalVisival} 
                    presentationStyle="overFullScreen" onDismiss={FiletoggleModalVisibility}>
                    <View style={styles.viewWrapper}>
                        <View style={styles.AttachCardViewModel}>
                            <View style={{flexDirection: "column"}}>
                                <View style={{
                                    width: DEVICEWIDTH * 0.97, height: DEVICEHEIGHT * 0.97}}>
                                {
                                    FileUrl.type == "png" ? (
                                        <View style={{width: DEVICEWIDTH * 0.97,
                                            height: DEVICEHEIGHT * 0.8}}>
                                            <ImageViewer cropWidth={DEVICEWIDTH * 0.98}
                                                cropHeight={DEVICEHEIGHT * 0.97}
                                                imageWidth={DEVICEWIDTH * 0.8}
                                                imageHeight={DEVICEHEIGHT * 0.6}
                                                style={{width: DEVICEWIDTH * 0.8,
                                                height: DEVICEHEIGHT * 0.6}}>
                                                <Image style={{width: DEVICEWIDTH * 0.8,
                                                    height: DEVICEHEIGHT * 0.6}}
                                                    resizeMode="contain"
                                                    source={{uri: FileUrl.uri}}
                                                />
                                            </ImageViewer>
                                        </View>
                                    ):(
                                        <></>
                                    )
                                }
                                </View>
                                <View style={[styles.touchableOpacityStyle, {flexDirection: "row"}]}>
                                    <Text style={{color: "#000000", fontSize: 20,
                                            width: DEVICEWIDTH * 0.9, fontWeight: "700"}}>
                                        {FileUrl.title}</Text>
                                    <AntDesign name="close" size={35} color="red"
                                        onPress={() => FiletoggleModalVisibility()}
                                        style={styles.floatingB}/>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

        <FlatList contentContainerStyle={{ flexGrow: 1 }} 
            showsVerticalScrollIndicator={false}
            data={ClassForAtt.data} style={[styles.dropdownClass, {display: classLView,
                top: config.DEVICEHEIGHT <=734 ? "20%" : "18%",
            }]}
            keyExtractor={(item, indexx) => indexx.toString()}
            renderItem={({item, indexx}) => ShowClassFlatList(item, indexx)}
        />
        <FlatList contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            data={SectionForAtt} style={[styles.dropdownSection, {display: SectionLView,
            top: config.DEVICEHEIGHT <=734 ? "20%" : "18%",
            }]}
            keyExtractor={(item, indexx) => indexx.toString()}
            renderItem={({item, indexx}) => ShowSectionFlatList(item, indexx)}
        />
        <FlatList contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            data={SubForAtt} style={[styles.dropdownSubject, {display: SubLView,
            top: config.DEVICEHEIGHT <=734 ? "26%" : "23%",
            }]}
            keyExtractor={(item, indexx) => indexx.toString()}
            renderItem={({item, indexx}) => ShowSubjectFlatList(item, indexx)}
        />

    </View>
  );
};
export default HomeWork;

const styles = StyleSheet.create({
    Mcontainer: {
        width: DEVICEWIDTH,
        height: DEVICEHEIGHT,
    },
    SContainer: {
        left: "2.35%",        
    },
    dropdownClass: {
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
    dropdownSubject: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '80%',
        height: DEVICEHEIGHT * 0.3,
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        elevation: 3,
        left: "10%",
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
    AttachCardViewModel: {
        top: "14%",
        left: "40%",
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        width: DEVICEWIDTH * 0.994,
        height: DEVICEHEIGHT * 0.93,
        backgroundColor: "#FFFFFF",
    },
    viewWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    CardView2: {
        left: "40%",
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
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
        width: DEVICEWIDTH * 0.89,
        marginLeft: 10,
    },
    ColumnM1: {
        flexDirection: "column",
        marginLeft: 10,
        top: 5,
    },
    dropdownBtnStyle: {
        textAlign: "center",
        width: '75%',
        height: DEVICEHEIGHT * 0.04,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginTop: DEVICEHEIGHT * 0.017,

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
    textInput: {
        fontSize: 18,
        backgroundColor: "#C9C9C9",
        
    },
    floatingButtonStyle: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
        //backgroundColor:'black'
    },
    touchableOpacityStyle: {
        position: 'absolute',
        top: "0%",
        elevation: 15,
    },
    floatingB: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 15,
    },
});