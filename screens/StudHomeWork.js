import React from "react";
import { View, StyleSheet, Text, Image, Dimensions, Modal, ActivityIndicator, 
        TouchableOpacity, FlatList, TextInput, ScrollView, RefreshControl, Alert } from "react-native";
import { FontAwesome, Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';   
import ImageViewer from 'react-native-image-pan-zoom';

import config from "./app_config";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;
const FileUrl = {title: null, uri: null, type: null};

const StudHomeWork = ({navigation, route}) => {

    const newdate = new Date();
    let HDAY= `${newdate.getDate()}/${newdate.getMonth() + 1}/${newdate.getFullYear()}`;
    let SDAY= `${newdate.getDate()+1}/${newdate.getMonth() + 1}/${newdate.getFullYear()}`;

    const [RefreshFlatList, set_RefreshFlatList] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [color, changeColor] = React.useState('red');

    const [SESSIONID, set_SESSIONID] = React.useState("19");

    const [Class, set_Class] = React.useState('Select');
    const [Section, set_Section] = React.useState('0');

    const [chevrondownSub, setchevrondownSub] = React.useState(true);
    const [SubLView, set_SubLView] = React.useState("none");
    const [SubID, set_SubID] = React.useState("0");

    const [SubForAtt, Set_SubForAtt] = React.useState([]);
    const [SelectedSubject, set_Subject] = React.useState('All Subjects');

    const [MakerN, set_MakerN] = React.useState('');
    const [HomeWorks, set_HomeWorks] = React.useState([]);
    const [isUploadBoxVisival, set_UploadBox] = React.useState(false);
    const [isSubmitLeaveForm, set_LeaveForm] = React.useState(false);
    const [SubForDisp, Set_SubForDisp] = React.useState([]);
    
    const [isShowFlatList, reset_isShowFlatList]=React.useState(false);
    const [isLoading, reset_isLoading]=React.useState(true);
    const [FileModalVisival, set_FileModalVisival] = React.useState(false);

    //---------------------------------
    const FetchFirst = async ()=>{
  
        AsyncStorage.getItem('CLASS').then((value) => set_Class(value));
        AsyncStorage.getItem('SECTION').then((value) => set_Section(value));

        AsyncStorage.getItem('CLASS_ID').then(async (clssID) => {
            AsyncStorage.getItem('SECTION_ID').then(async (sectnID) => {
                console.log("Home Work ---------- clssID : ", clssID);
                console.log("Home Work ---------- sectnID : ", sectnID);

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
                try{
                    let responsSub = await fetch(config.Url+'getsubjectlist', {
                        method: 'POST', headers: {'Accept': 'application/json',
                            'Content-Type': 'application/json',},
                        body: JSON.stringify({class_id: clssID, section_id: sectnID, session_id: SESSIONID})
                    })
                    var ss=[{"code": "0", "subject": "All Subject", "subject_id": "0", "type": ""}]
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
                }
    
            }catch(error){
                console.error("Error -4 : ",error);
            };
        });

        });
    }
    
    React.useEffect(() => {
        FetchFirst();
    }, []);
    //----------------------------------
    const onRefresh = () => {
        setRefreshing(true);
        FetchFirst();
        setTimeout(() => {
          changeColor('green');
          setRefreshing(false);
        }, 2000);
    };
    //---------------------------------------Section List for select
    const SubjectList = () =>{
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
            <TouchableOpacity onPress={() => SubjectSelect(ItmSub.subject_id, ItmSub.subject)} key={ItmSub.id}>
                <View style={{backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                            height: DEVICEHEIGHT * 0.05, width: "100%"}}>
                    <Text style={{width: "90%", color: "#000000", fontSize: 17, marginBottom: 6}}>
                            {ItmSub.subject}</Text>
                    <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 1}}></View>                        
                </View>
            </TouchableOpacity>
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
        console.log("HomeWork.js, FiletoggleModalVisibility, FileUrl : ", FileUrl);
        console.log("HomeWork.js, FiletoggleModalVisibility, FileUrl : ", FileUrl.type);
        set_FileModalVisival(!FileModalVisival);
    }

    //---------------------------------------
    const ShowHomeWorkList = (hw, Index, subid, sub) => {
        console.log("ShowHomeWorkList, sub id : ", subid);

        let desc = hw.description, fileEx = '';

        if(hw.subject_id == subid){
            desc=desc.replace(/<[^>]+>/g, '');
            fileEx = hw.document;
            if(fileEx.substring(fileEx.lastIndexOf(".")).length <= 5){
                if(fileEx.substring(fileEx.length-3, fileEx.length) == "png" ||
                    fileEx.substring(fileEx.length-3, fileEx.length) == "jpg" ||
                    fileEx.substring(fileEx.length-3, fileEx.length) == "peg"){
                    fileEx = 'png';
                }else{
                    fileEx = 'pdf';
                }
            }

        return(
            <View style={styles.Column2}>
                    <View style={styles.Row2}>
                        <Text style={{width: DEVICEWIDTH * 0.35, color: "#000000"}}>Homework Dt.</Text>
                        <Text style={{width: DEVICEWIDTH * 0.15, color: "#000000"}}>:</Text>
                        <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "700"}}>{hw.homework_date}</Text>
                    </View>
                    <View style={styles.Row2}>
                        <Text style={{width: DEVICEWIDTH * 0.35, color: "#000000"}}>Submission Dt.</Text>
                        <Text style={{width: DEVICEWIDTH * 0.15, color: "#000000"}}>:</Text>
                        <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "700"}}>{hw.submit_date}</Text>
                    </View>
                    {/* <View style={styles.Row2}>
                        <Text style={{width: DEVICEWIDTH * 0.35, color: "#000000"}}>Teacher</Text>
                        <Text style={{width: DEVICEWIDTH * 0.15, color: "#000000"}}>:</Text>
                        <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "700"}}>{hw.maker_name}</Text>
                    </View> */}
                    <View style={{flexDirection: "row", marginTop: 20, marginLeft: 0}}>
                        <Text style={{width: DEVICEWIDTH * 0.4, color: "blue", fontSize: 20, fontWeight: "bold"}}>
                            Home Work</Text>
                    </View>
                    <Text style={{fontWeight: "700"}}>{desc}</Text>
                    <View style={{marginTop: 20}}>
                        {
                            fileEx == "png" ? (
                                <View style={{flexDirection: "column"}}>
                                    <Entypo name="attachment"size={20} color="black"
                                            style={{marginBottom: 10}} />
                                        <TouchableOpacity
                                            onPress={()=>FiletoggleModalVisibility(sub, hw.document, "png")}>
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
                                            onPress={()=> navigation.navigate("PDFviewer", {fileuri: hw.document})}>
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
    const ShowList = (Itm, Index) => {
        console.log("ShowList, sub id : ", SubID);
        if(SelectedSubject == "All Subjects" || Itm.subject_id == SubID || SubID == "0")
            return(
                <View style={styles.SContainer}>
                    <View style={styles.CardView2}>
                        <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05, backgroundColor: "#BAFAFF",
                                        borderTopLeftRadius: 15, borderTopRightRadius: 15, justifyContent: "center"}}>
                            <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold",
                                        width: DEVICEWIDTH * 0.7}}>{Itm.subject}</Text>
                        </View>
                        <FlatList contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                            horizontal extraData={RefreshFlatList}
                            data={HomeWorks}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item, index}) => ShowHomeWorkList(item, index, Itm.subject_id, Itm.subject)}
                        />
                        <View style={{marginTop: 15}}></View>
                    </View>
                </View>
            );
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
                            <Text style={{fontSize: 20, fontWeight: "700"}}>is here!</Text>
                        <View style={[styles.Row2, {marginTop: 15}]}>
                            <Text style={{width: DEVICEWIDTH * 0.3, fontSize: 14, fontWeight: "bold"}}>
                                Class : {Class}</Text>

                            <Text style={{width: DEVICEWIDTH * 0.19, fontSize: 14, fontWeight: "bold", 
                                    marginLeft: DEVICEWIDTH * 0.07}}>Section : {Section}</Text>
                        </View>
                        </View>
                            <View style={{width: DEVICEWIDTH * 0.27, flexDirection: "column", alignItems: "center"}}>
                                <Image source={require('../assets/HomeWork2.jpg')} style={{width: 100, height: 100, 
                                    borderRadius: 20,}}/>
                            </View>
                    </View>

                    <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: '85%',height: DEVICEHEIGHT * 0.03,
                                borderRadius: 20, flexDirection: "row", marginTop: 15}} onPress={() => SubjectList()}>
                        <Text style={{width: "90%", fontSize: 14, fontWeight: "bold"}}>
                            {SelectedSubject}</Text>
                        <FontAwesome name={chevrondownSub ? "chevron-down" : "chevron-up"}
                                        size={19} color="black"/>
                    </TouchableOpacity>

                </View>
                <View style={{marginTop: 40}}></View>
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
            data={SubForAtt} style={[styles.dropdownSubject, {display: SubLView}]}
            keyExtractor={(item, indexx) => indexx.toString()}
            renderItem={({item, indexx}) => ShowSubjectFlatList(item, indexx)}
        />

    </View>
  );
};
export default StudHomeWork;


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
        top: "23%",
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
    floatingButtonStyle: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
        //backgroundColor:'black'
    },
    viewWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
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
    touchableOpacityStyle: {
        position: 'absolute',
        top: "0%",
        elevation: 15,
    },

});