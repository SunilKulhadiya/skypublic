import React from 'react';
import {StyleSheet, View, Text, SafeAreaView, FlatList, ActivityIndicator, Image,
    Dimensions, TouchableOpacity, Alert, Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, FontAwesome5, AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';        //npx expo install expo-print
import { shareAsync } from 'expo-sharing';      //npx expo install expo-sharing

import config from './app_config';

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

export default function IDCard({ navigation, route }) {

    const newdate = new Date();
    const [Session, set_Session] = React.useState(`${newdate.getFullYear()}-${newdate.getFullYear() + 1}`);
    const [FetchData, set_FetchData] = React.useState([]);
    const [PrintData, set_PrintData] = React.useState([]);
    const [SelectAllforPrint, set_SelectAllforPrint] = React.useState(0);

    const SectionForAtt = [{section: "Select", id: '0'}, {section: "A", id: '1'}, {section: "B", id: '2'},
                            {section: "C", id: '3'}, {section: "D", id: '4'}, {section: "E", id: '5'}];
    const [isLoading, reset_isLoading] = React.useState(true);
    const [isShowFlatList, reset_isShowFlatList] = React.useState(false);
    const [refreshing, setRefreshing] = React.useState(false);

    const [ServerUrl, set_ServerUrl] = React.useState("");

    const [Mess_P_Share, set_Mess_P_Share] = React.useState("Download next page....");
    const [Print_Share, set_Print_Share] = React.useState("1");
    const [IndicatorT, set_IndicatorT] = React.useState(8000);
    const [isDownloadModel, set_DownloadModel] = React.useState(false);
    const [PrintDownload, set_PrintDownload] = React.useState(false);
    const [StdImg, set_StdImg] = React.useState('');
    const [StdID, set_StdID] = React.useState('');
    const [CLAS, set_CLASS] = React.useState('');
    const [SECTIN, set_SECTION] = React.useState('');
    const [RowNo, set_RowNo] = React.useState(0);

    const [chevrondownClass, setchevrondownClass] = React.useState(true);
    const [classLView, set_classLView] = React.useState("none");
    const [ClassID, set_ClassID] = React.useState("0");
    const [ClassAtt, set_ClassAtt] = React.useState('Select');
    const [ClassForAtt, Set_ClassForAtt] = React.useState([]);

    const [chevrondownSection, setchevrondownSection] = React.useState(true);
    const [SectionLView, set_SectionLView] = React.useState("none");
    const [SectionID, set_SectionID] = React.useState('0.0');
    const [SectionAtt, set_SectionAtt] = React.useState('Select');
    //const [SectionForAtt, set_SectionForAtt] = React.useState([]);
    let html2 = ``, html;

    const FetchPersonal = async () => {
            try {
            let resultClass = await fetch(config.Url+'getclass', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
            })

            let responseClass = await resultClass.json();

            Set_ClassForAtt(responseClass);
            console.log("Class => ", responseClass);
            reset_isLoading(false);
            }catch(error) {
            console.error("FetchClass : ",error);
            }

    }

    React.useEffect(() => {
        AsyncStorage.getItem('SERVERURL').then((value) => set_ServerUrl(value));
        AsyncStorage.getItem('StdID').then((value) => set_StdID(value));
        AsyncStorage.getItem('CLASS').then((value) => set_CLASS(value));
        AsyncStorage.getItem('SECTION').then((value) => set_SECTION(value));
        FetchPersonal();
    }, []);
    //----------------------------------------------
    const toggleModalVisibility = () => {
        set_DownloadModel(!isDownloadModel);
    }
    //----------------------------------------------
    const CardCompose = async () => {
        console.log("Data for Print CardCompose Data : ", PrintData[0]);
        console.log("Data for Print CardCompose Data : ", PrintData[0].length);

        const html1 = `
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, 
              maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            .page {
                width: 21cm;
                min-height: 29.7cm;
            }
            @page {
                size: A4;
                margin: 0;
            }
            .table1 {
                  border: 0px solid black;
                  border-collapse: collapse;
                  margin-top: 20px
            }
            .tr1 {
            border: 0px solid black;
            border-collapse: collapse;
            width: 50%;
            height: 100%;
            padding: 0px;
            
            }
            .td1 {
                border: 0px solid black;
                border-collapse: collapse;
                padding-left: 0px;
                font-size: 13px;
            }

            .TriAngleL1 {
                position: absolute;
                width: 0; 
                height: 0; 
                border-left: 100px solid transparent;
                border-right: 100px solid transparent;                  
                border-top: 120px solid blue;
                margin-top: 01px;
                margin-left: 30px;
            }
            .TriAngleL2 {
                position: absolute;
                width: 0; 
                height: 0; 
                border-left: 100px solid transparent;
                border-right: 100px solid transparent;                  
                border-top: 120px solid blue;
                margin-top: 01px;
                margin-left: 30px;
            }
            .RotateLeft1 {
                position: absolute;
                width: 120px;
                height: 10px;
                transform: rotate(50deg);
                background-color: white;
                margin-top: 40px;
                margin-left: 24px;
            }
            .RotateLeft2 {
                position: absolute;
                width: 120px;
                height: 10px;
                transform: rotate(50deg);
                background-color: white;
                margin-top: 40px;
                margin-left: 25px;
            }
            .RotateRight1 {
                position: absolute;
                width: 120px;
                height: 10px;
                transform: rotate(-50deg);
                background-color: white;
                margin-left: 117px;
                margin-top: 21px;
            }
            .RotateRight2 {
                position: absolute;
                width: 120px;
                height: 10px;
                transform: rotate(-50deg);
                background-color: white;
                margin-left: 115px;
                margin-top: 22px;
            }
            .SessionRight1 {
                transform: rotate(-49deg);
                margin-left: 141px;
                margin-top: 8px;
                color: white;
            }
            .SessionRight2 {
                transform: rotate(-49deg);
                margin-left: 138px;
                margin-top: 8px;
                color: white;
            }
        </style>
    </head>
    <body style="text-align: flex-start">`;
    
    // const html2= `<div style= "flex-direction: column; direction: flex; margin-left: 0px; height: 1754px">
    //                 <table class="table1">`;

        const html5 = `</body>
                    </html>`;

        let html3 = ``,  stdIMG = '', stdName = '';
        let ij = 0, logo ='https://sewabhartidabra.in/School_Images/skyschool.png', 
                PSignature = 'https://sewabhartidabra.in/School_Images/sky_signature1.png';
        // let TM = '10px;';
    for (ij = 0; ij < PrintData[0].length; ij++) {

            if(ij>1)
                // TM = '200px';
            if(PrintData[0][ij].image  !== 'null'  && PrintData[0][ij].image !== '' &&
            PrintData[0][ij].image  !== null){
                stdIMG = PrintData[0][ij].image;
            }else{
                stdIMG = logo;
            }
                if(PrintData[0][ij].middlename !== null && PrintData[0][ij].middlename !== '' && 
                PrintData[0][ij].middlename !== 'null'){
                    stdName = PrintData[0][ij].firstname+" "+PrintData[0][ij].middlename;
                }else{
                    stdName = PrintData[0][ij].firstname;
                }
                if(PrintData[0][ij].lastname.length > 1){
                    stdName = stdName+" "+PrintData[0][ij].lastname;
                }
            if(ij == 0 || ij == 6 || ij == 12 || ij == 18 || ij == 24 || ij == 30 || ij == 36 ||
                ij == 40 || ij == 46 || ij == 52 || ij == 58 || ij == 64){
                html3 = html3 + `<div class="page">
                                    <table class="table1">`;
                }
                
            html3 = html3 +
            `<tr style= "border: 0px solid black; border-collapse: collapse; width: 100%;
                        height: 34%;">
                <td style= "width: 50%;">
                    <div class= 'TriAngleL1'></div>
                        <H1 style= "font-size: 12px; font-weight: bold; color: white; margin-top: 5px;
                                    margin-left: 66px; position: absolute;">SKY PUBLIC SCHOOL</H1>
                        <img src=`+ logo + `
                        style="width: 40px; height: 40px; margin-left: 111px; margin-top: 18px; position: absolute;" />
                        
                        <div class='RotateLeft1'></div>
                        
                        <div class='SessionRight1'>
                            <Text style= "font-size: 8px; font-weight: bold;">`+ PrintData[0][ij].session + `</Text>
                        </div>
                        <div class='RotateRight1'></div>
                        <Image src=`+ServerUrl+PrintData[0][ij].image + ` style="width: 70px; height: 70px; borderRadius: 10px;
                                        margin-top: 40px; margin-left: 95px; position: absolute;" />
                    <div style="margin-top: 115px; margin-left: 70px;">
                            <p style="font-size: 11px; font-weight: bold; height: 3px;">Name : `+
                                stdName.substring(0, 15)+ `</p>
                            <p style="font-size: 11px; font-weight: bold; height: 3px;">Class : `+
                                PrintData[0][ij].class +
                        ` | Sec. : ` + PrintData[0][ij].section + `</p>
                            <p style="font-size: 11px; font-weight: bold; height: 3px;">DOB : `+
                                PrintData[0][ij].dob + ` | ` + PrintData[0][ij].blood_group + `</p>
                            <p style="font-size: 11px; font-weight: bold; height: 3px">F.Name : `+
                                PrintData[0][ij].father_name.substring(0, 15) + `</p>
                            <p style="font-size: 11px; font-weight: bold; height: 3px">M.Name : `+
                                PrintData[0][ij].mother_name.substring(0, 15) + `</p>
                            <p style="font-size: 11px; font-weight: bold; height: 3px">Mob.No. : `+
                            PrintData[0][ij].mobileno + `, ` + `</p>
                            <p style="font-size: 11px; font-weight: bold; height: 3px; margin-left: 56px;">`+
                            PrintData[0][ij].guardian_phone + `</p>
                        </div>
                        <img src=`+ PSignature + `
                            style="width: 40px; height: 35px; margin-left: 160px; position: absolute;" />
                        <p style="font-size: 11px; height: 5px; margin-top: 46px;
                                margin-left: 150px;">Principal Sign.</p>
                        <div style="margin-left: 30px; background-color: blue; width: 200px;">
                            <p style="font-size: 5px; height: 5px; color: white">
                                    Add. Bal Gopal Colony Badagaon, Morar, Gwalior-(M.P.)</p>
                            <p style="font-size: 5px; height: 5px;  color: white; margin-left: 28px;">
                            Mob. 9755766915, 9522241890, 8963906228</p>
                            <p style="font-size: 5px; height: 5px;  color: white; margin-left: 25px;">
                            E-mail : skypublicschool2012@gmail.com</p>
                            <p style="font-size: 5px; height: 5px;  color: white"></p>
                        </div>
                    </div>
                </td>`;
            
            if (PrintData[0].length-1 >= ij+1) {
                    ij++;
                if(PrintData[0][ij].image  !== 'null'  && PrintData[0][ij].image !== '' &&
                PrintData[0][ij].image  !== null){
                    stdIMG = PrintData[0][ij].image;
                }else{
                    stdIMG = logo;
                }

                    if(PrintData[0][ij].middlename !== null && PrintData[0][ij].middlename !== '' && 
                    PrintData[0][ij].middlename !== 'null'){
                        stdName = PrintData[0][ij].firstname+" "+PrintData[0][ij].middlename;
                    }else{
                        stdName = PrintData[0][ij].firstname;
                    }
                    if(PrintData[0][ij].lastname.length > 1){
                        stdName = stdName+" "+PrintData[0][ij].lastname;
                    }
                    html3 = html3 +
                    `<td>
                        <div class= 'TriAngleL2'></div>
                            <H1 style= "font-size: 12px; font-weight: bold; color: white; margin-top: 5px;
                                        margin-left: 66px; position: absolute;">SKY PUBLIC SCHOOL</H1>
                            <img src=`+ logo + `
                            style="width: 40px; height: 40px; margin-left: 110px; margin-top: 18px; position: absolute;" />
                            
                            <div class='RotateLeft2'></div>
                            
                            <div class='SessionRight2'>
                                <Text style= "font-size: 8px; font-weight: bold;">`+ PrintData[0][ij].session + `</Text>
                            </div>
                            <div class='RotateRight2'></div>
                            <Image src=`+ ServerUrl+stdIMG + ` style="width: 70px; height: 70px; borderRadius: 10px;
                                            margin-top: 40px; margin-left: 95px; position: absolute;" />
                            <div style="margin-top: 115px; margin-left: 70px;">
                                <p style="font-size: 11px; font-weight: bold; height: 3px;">Name : `+
                                    stdName.substring(0, 15) + `</p>
                                <p style="font-size: 11px; font-weight: bold; height: 3px;">Class : `+
                                    PrintData[0][ij].class +` | Sec. : ` + PrintData[0][ij].section + `</p>
                                <p style="font-size: 11px; font-weight: bold; height: 3px;">DOB : `+
                                    PrintData[0][ij].dob + ` | ` + PrintData[0][ij].blood_group + `</p>
                                <p style="font-size: 11px; font-weight: bold; height: 3px">F.Name : `+ 
                                    PrintData[0][ij].father_name.substring(0, 15) + `</p>
                                <p style="font-size: 11px; font-weight: bold; height: 3px">M.Name : `+ 
                                    PrintData[0][ij].mother_name.substring(0, 15) + `</p>
                                <p style="font-size: 11px; font-weight: bold; height: 3px">Mob.No. : `+
                                    PrintData[0][ij].mobileno + `, ` + `</p>
                                <p style="font-size: 11px; font-weight: bold; height: 3px; margin-left: 56px;">`+
                                    PrintData[0][ij].guardian_phone + `</p>
                            </div>
                            <img src=`+ PSignature + `
                                style="width: 40px; height: 35px; margin-left: 160px; position: absolute;" />
                            <p style="font-size: 11px; height: 5px; margin-top: 46px;
                                    margin-left: 150px;">Principal Sign.</p>
                            <div style="margin-top: 0px; margin-left: 30px; background-color: blue; width: 200px;">
                                <p style="font-size: 5px; height: 5px; color: white">
                                        Add. Bal Gopal Colony Badagaon, Morar, Gwalior-(M.P.)</p>
                                <p style="font-size: 5px; height: 5px;  color: white; margin-left: 28px;">
                                    Mob. 9755766915, 9522241890, 8963906228</p>
                                <p style="font-size: 5px; height: 5px;  color: white; margin-left: 25px;">
                                    E-mail : skypublicschool2012@gmail.com</p>
                                <p style="font-size: 5px; height: 5px;  color: white"></p>
                            </div>
                        </div>
                    </td>`;
            }else{
                html3 = html3 +
                `<td>
                 </td>`;
            }
            html3 = html3 + `</tr>`;
            if(ij == 5 || ij == 11 || ij == 17 || ij == 23 || ij == 29 || ij == 35 || ij == 41 ||
                ij == 47 || ij == 53 || ij == 59 || ij == 65 || ij == 71){
                    html3 = html3 + `</table>
                                </div>`;
            }

        }

        html = html1 + "" + html3 + "" + html5;
        //html = html+""+html+""+html+""+html+""+html+""+html;
    }
    //-------------------------
    const SelectUnSelect = () => {
        let l;
        if(SelectAllforPrint == 0){
            set_SelectAllforPrint(1);
            for(l=0; l<FetchData.data.length; l++){
                FetchData.data[l].weight = "1";
            }
            }else{
            set_SelectAllforPrint(0);
            for(l=0; l<FetchData.data.length; l++){
                FetchData.data[l].weight = "0";
            }
        }
    }
    //-------------------------print && pdf
    const DataToPrint = () => {
        set_PrintData([]);
        let ss=[], l=0;
        if(SelectAllforPrint == 0){
        for(l=0; l<FetchData.data.length; l++){
            if(FetchData.data[l].weight == "1"){
                ss.push(FetchData.data[l]);
                console.log("Data for Print l : ", l);
            }
            if(l>=FetchData.data.length-1){
                PrintData.push(ss);
                console.log("Data for Print SS Length : ", ss.length);
                console.log("Data for Print SS Length : ", PrintData[0].length);
            }
        }
        }else{
            for(l=0; l<FetchData.data.length; l++){
                    ss.push(FetchData.data[l]);
                if(l>=FetchData.data.length-1){
                    PrintData.push(ss);
                    console.log("Data for Print SS Length : ", ss.length);
                    console.log("Data for Print SS Length : ", PrintData[0].length);
                }
            }
        }
    }
    //-------------------------print && pdf
    const DownloadPDF = async () => {
        if (FetchData.data.length > 0) {
            set_PrintDownload(true)
            set_DownloadModel(true);
                DataToPrint();
            setTimeout(()=>{
                CardCompose();
                setTimeout(async ()=>{
                    await Print.printAsync({ html, });
                        set_DownloadModel(false);
                    setTimeout(()=>{
                        set_PrintDownload(false);
                        console.log("print, DownloadBox : ", PrintDownload);
                    }, 300);
                },300);
            },100);
        } else {
            Alert.alert("Please select class");
        }
    };
    //-------------------------
    const FileShare = async () => {
        if (FetchData.data.length > 0) {
            set_PrintDownload(true)
            set_DownloadModel(true);
            DataToPrint();
            setTimeout(()=>{
                CardCompose();
                // On iOS/android prints the given html. On web prints the HTML from the current page.
                setTimeout(async ()=>{
                    const { uri } = await Print.printToFileAsync({ html });
                    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
                        set_DownloadModel(false);
                    setTimeout(()=>{
                        set_PrintDownload(false);
                        console.log("print, DownloadBox : ", PrintDownload);
                    }, 300);
                },300);
            },50);
        } else {
            Alert.alert("Please select class");
        }
    };
    //-----------------------------------------------
    const FetchProfile = async (classid, classN, sectionid, sectionN) => {
        console.log("FetchProfile, Class ID  : "+classid+", Section ID : "+sectionid);
        reset_isShowFlatList(false);
        let resultProfile;
        try {
            if (classN !== 'Select' && classN !== 'select' && sectionN !== 'Select' && sectionN !== 'select') {
                //reset_isLoading(true);
                resultProfile = await fetch(ServerUrl + 'api/Webservice/classwisestudent', {
                    method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
                    body: JSON.stringify({class_id: classid, section_id : sectionid, session_id: "19"})
                })
            }
            let responseProfile = await resultProfile.json();

            console.log("FetchProfile,  : ", responseProfile);
            console.log("FetchProfile,  : ", responseProfile.data.length);
            set_RowNo(responseProfile.length);
            set_FetchData(responseProfile);
            reset_isShowFlatList(true);
            setRefreshing(false);
        } catch (err) {
            console.error("Error-1 : ", err);
        }
    }
    //-----------------------------------------------------Select Class
    const ClassList = () => {
        //console.log("Home W -3 : ", HomeWorks);
        set_SectionLView("none");
        setchevrondownSection(true);

        setchevrondownClass(!chevrondownClass);
        console.log("Class List : ", chevrondownClass);

        if (chevrondownClass) {
            set_classLView("flex");
        } else {
            set_classLView("none");
        }
    }

    const SelectClass = async (idd, Sclass) => {
        set_ClassID(idd);
        set_ClassAtt(Sclass);
        set_classLView("none");
        setchevrondownClass(true);

        console.log("Section, Class : ", Sclass);
        console.log("Section, section : ", SectionAtt);

        if (Sclass !== 'Select' && Sclass !== 'select') {
            FetchProfile(idd, Sclass, SectionID, SectionAtt);
        }
    }

    const ShowClassFlatList = (Itms) => {
        return (
            <View>
                <TouchableOpacity onPress={() => SelectClass(Itms.id, Itms.class)} key={Itms.id}>
                    <View style={{
                        backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                        height: DEVICEHEIGHT * 0.05,
                    }}>
                        <Text style={{
                            width: DEVICEWIDTH * 0.3, color: "#000000", fontSize: 17,
                            marginBottom: 5
                        }}>
                            {Itms.class}. </Text>
                    </View>
                </TouchableOpacity>
                <View style={{ backgroundColor: "#C0C0C0", width: "100%", height: 1 }}></View>
            </View>
        );
    }
    //---------------------------------------Section List for select
    const SectionList = () => {
        set_classLView("none");
        setchevrondownClass(true);

        setchevrondownSection(!chevrondownSection);
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

        console.log("Section, Class : ", ClassAtt);
        console.log("Section, section : ", SectionTitle);

        if (ClassAtt !== 'Select' && ClassAtt !== 'select' && SectionTitle !== 'Select' && SectionTitle !== 'select') {
            FetchProfile(ClassID, ClassAtt, idd, SectionTitle);
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
    //-----------------------------------------
    const CardSelected = (index) => {
        console.log("Card Selected, index : ", FetchData.data[index].firstname);
        set_SelectAllforPrint(0);
        if (FetchData.data[index].weight == "1"){
            FetchData.data[index].weight = "0";
        }else{
            FetchData.data[index].weight = "1";
        }
        let l, n=0;
        for(l=0; l<FetchData.data.length; l++){
            if(FetchData.data[l].weight == "1")
                n++;
            if(l >= FetchData.data.length-1){
                if(n==FetchData.data.length)
                    set_SelectAllforPrint(1);
            }
        }

        setRefreshing(!refreshing);

        console.log("Card Selected, weight : ", FetchData.data[index].weight);
        console.log("Card Selected, refreshing : ", refreshing);

    }
    //-----------------------------------------
    const ShowList = (Itm, Index) => {
        if (Index == 0)
            set_StdImg(Itm.image);
        return (
            <View>
                {
                    Index == 0 ? (
                        <View style={{ marginTop: 100 }}></View>
                    ) : (
                        <View></View>
                    )
                }
                <View style={styles.CardView}>
                    <View style={{marginTop: 8, alignItems: 'flex-end', marginRight: 5}}>
                        <MaterialIcons name={Itm.weight =="1" ? "check-box" : "check-box-outline-blank"}
                            size={30} color={Itm.weight =="1" ? "blue" : "black"}
                            onPress={() => CardSelected(Index)} key={Itm.student_id}/>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                        <View style={styles.TriangleShap}>
                        </View>
                        <Text style={{ top: '-37%', fontSize: 24, color: 'white', fontWeight: 'bold', }}>SKY PUBLIC SCHOOL</Text>
                        <Text style={styles.TextAngle}>{Session}</Text>
                        <View style={styles.lineRight}></View>
                        <View style={styles.lineLeft}></View>
                        <Image source={require('../assets/logoBn.png')} style={{
                            width: 50, height: 50, borderRadius: 50,
                            borderColor: "#FFFFFF", borderWidth: 0, marginRight: 0, top: "-42%",
                            left: "0%"
                        }} />
                        <Image source={{ uri: ServerUrl+Itm.image }} style={{
                            width: 120, height: 120, borderRadius: 10,
                            borderColor: "#FFFFFF", borderWidth: 0, marginRight: 0, top: "-40%"
                        }} />
                        <View style={[styles.Column, { marginTop: '-53%', marginLeft: "5%" }]}>
                            <View style={styles.Row1}>
                                <Text style={{ width: "18%", fontSize: 15, fontWeight: 'bold' }}>Name</Text>
                                <Text style={{ width: "2%", fontSize: 15, fontWeight: 'bold' }}>:</Text>
                                <Text style={{ width: "42%", fontSize: 15, fontWeight: 'bold' }}>
                                    {Itm.firstname} {Itm.lastname}</Text>
                            </View>
                            <View style={styles.Row1}>
                                <Text style={{ width: "18%", fontSize: 15, fontWeight: 'bold' }}>Class</Text>
                                <Text style={{ width: "2%", fontSize: 15, fontWeight: 'bold' }}>:</Text>
                                <Text style={{ width: "42%", fontSize: 15, fontWeight: 'bold' }}>
                                    {Itm.class} | Sec : {Itm.section}</Text>
                            </View>
                            <View style={styles.Row1}>
                                <Text style={{ width: "18%", fontSize: 15, fontWeight: 'bold' }}>DOB</Text>
                                <Text style={{ width: "2%", fontSize: 15, fontWeight: 'bold' }}>:</Text>
                                <Text style={{ width: "24%", fontSize: 15, fontWeight: 'bold' }}>{Itm.dob}</Text>
                                <Text style={{ width: "13%", fontSize: 15, fontWeight: 'bold' }}>| B.G.:</Text>
                                <Text style={{ width: "6%", fontSize: 15, fontWeight: 'bold' }}>{Itm.blood_group}</Text>
                            </View>
                            <View style={styles.Row1}>
                                <Text style={{ width: "18%", fontSize: 15, fontWeight: 'bold' }}>F.Name</Text>
                                <Text style={{ width: "2%", fontSize: 15, fontWeight: 'bold' }}>:</Text>
                                <Text style={{ width: "42%", fontSize: 15, fontWeight: 'bold' }}>{Itm.father_name}</Text>
                            </View>
                            <View style={styles.Row1}>
                                <Text style={{ width: "18%", fontSize: 15, fontWeight: 'bold' }}>M.Name</Text>
                                <Text style={{ width: "2%", fontSize: 15, fontWeight: 'bold' }}>:</Text>
                                <Text style={{ width: "42%", fontSize: 15, fontWeight: 'bold' }}>{Itm.mother_name}</Text>
                            </View>
                            <View style={styles.Row1}>
                                <Text style={{ width: "18%", fontSize: 15, fontWeight: 'bold' }}>Mob.</Text>
                                <Text style={{ width: "2%", fontSize: 15, fontWeight: 'bold' }}>:</Text>
                                <Text style={{ width: "42%", fontSize: 15, fontWeight: 'bold' }}>{Itm.mobileno},</Text>
                            </View>
                            <Text style={{ width: "42%", fontSize: 15, fontWeight: 'bold', left: "10%" }}>
                                {Itm.guardian_phone}</Text>

                        </View>
                        <Image source={require('../assets/sky_signature.png')} style={{width: 50, height: 50, marginTop: 5, left: "26%"}} />

                        <Text style={{left: "28%", fontWeight: '800' }}>Principal Sign.</Text>
                        <View style={{ backgroundColor: 'blue', width: "92%", justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', marginTop: 4, fontSize: 13 }}>
                                Add. Bal Gopal Colony Badagaon, Morar, Gwalior-(M.P.)</Text>
                            <Text style={{ color: 'white',}}>Mob. 9755766915, 9522241890, 8963906228</Text>
                            <Text style={{ color: 'white', marginBottom: 4 }}>
                                E-mail : skypublicschool2012@gmail.com</Text>
                        </View>
                    </View>
                    <View style={{ marginBottom: 10 }}></View>
                </View>
                {
                    Index == RowNo - 1 ? (
                        <View style={{ marginBottom: 80 }}></View>
                    ) : (
                        <View style={{ marginBottom: 30 }}></View>
                    )
                }
            </View>
        );


    }
    //------------------------------------
    return (
        <SafeAreaView>
            <View style={styles.Mcontainer}>
                <View style={{ marginTop: 10, alignItems: "center", height: DEVICEHEIGHT * 0.15 }}>
                    <View style={styles.Row1}>
                        <View style={styles.Column1}>
                            <Text style={{ fontSize: 20, fontWeight: "700" }}>Your School ID Card</Text>
                            <Text style={{ fontSize: 20, fontWeight: "700" }}>is here!</Text>
                            {
                                route.params.PERMISSION_RANGE == 1 ||
                                route.params.PERMISSION_RANGE == 7 ||
                                route.params.PERMISSION_RANGE == 8 ? (
                                    <View style={[styles.Row1, { marginTop: 10, left: "35%" }]}>
                                        <TouchableOpacity onPress = {() => {
                                            set_Mess_P_Share("Download next pages.....")
                                            set_Print_Share("1");
                                            //PagesDownload("1")
                                            DownloadPDF();
                                        }
                                        } style={{width:80}}>
                                            <FontAwesome5 name="file-download" size={35}
                                                color="#6D6666" style={{ width: "30%" }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress = {() => {
                                                set_Mess_P_Share("Share next pages.....")
                                                set_Print_Share("2");
                                                //PagesDownload("2")
                                                FileShare();
                                            }
                                            } >
                                            <FontAwesome name="share-alt" size={30} color="#928686" />
                                        </TouchableOpacity>
                                </View>
                                ):(
                                    <></>
                                )
                            }
                            </View>
                        <View style={{ width: DEVICEWIDTH * 0.27, flexDirection: "column",
                                alignItems: "center" }}>
                            <Image source={require('../assets/IDCard_Sub1.png')} style={{
                                width: 100, height: 100,
                                borderRadius: 20,
                            }} />
                        </View>
                    </View>
                    <View style={styles.Row2}>
                        <Text style={{ width: DEVICEWIDTH * 0.13, fontSize: 14, fontWeight: "bold" }}>
                            Class :</Text>
                        <TouchableOpacity style={{
                            backgroundColor: "#FFFFFF", width: '33%', height: DEVICEHEIGHT * 0.03,
                            borderRadius: 20, flexDirection: "row"
                        }} onPress={() => ClassList()}>
                            <Text style={{
                                width: DEVICEWIDTH * 0.25, fontSize: 14, fontWeight: "bold",
                                marginLeft: 10
                            }}>{ClassAtt}</Text>
                            <FontAwesome name={chevrondownClass ? "chevron-down" : "chevron-up"}
                                size={19} color="black" />
                        </TouchableOpacity>

                        <Text style={{
                            width: DEVICEWIDTH * 0.18, fontSize: 14, fontWeight: "bold",
                            marginLeft: DEVICEWIDTH * 0.07
                        }}>Section :</Text>
                        <TouchableOpacity style={{
                            backgroundColor: "#FFFFFF", width: '22%',
                            height: DEVICEHEIGHT * 0.03, borderRadius: 20, flexDirection: "row"
                        }} onPress={() => SectionList()}>
                            <Text style={{
                                width: DEVICEWIDTH * 0.128, fontSize: 14, fontWeight: "bold",
                                marginLeft: 10
                            }}>{SectionAtt}</Text>
                            <FontAwesome name={chevrondownSection ? "chevron-down" : "chevron-up"}
                                size={19} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', left: "100%"}}>
                        <Text style={{fontSize: 16}}>Select All</Text>
                        <MaterialIcons name={SelectAllforPrint =="1" ? "check-box" : "check-box-outline-blank"}
                            size={30} color={SelectAllforPrint =="1" ? "blue" : "black"}
                            onPress={() => SelectUnSelect()} style={{marginTop: -3}}/>
                    </View>
                </View>
                {
                    isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <View style={{ marginTop: "19%" }}>

                            <View style={{ marginTop: 0 }}></View>
                            {
                                isShowFlatList ? (
                                    <FlatList contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                                        data={FetchData.data} extraData={refreshing}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => ShowList(item, index)}
                                    />
                                ) : (
                                    <View></View>
                                )
                            }
                            <View style={{ marginTop: 70 }}></View>
                        </View>
                    )
                }

                <FlatList contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    data={ClassForAtt.data} style={[styles.dropdownClass, { display: classLView }]}
                    keyExtractor={(item, indexx) => indexx.toString()}
                    renderItem={({ item, indexx }) => ShowClassFlatList(item, indexx)}
                />
                <FlatList contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    data={SectionForAtt} style={[styles.dropdownSection, { display: SectionLView }]}
                    keyExtractor={(item, indexx) => indexx.toString()}
                    renderItem={({ item, indexx }) => ShowSectionFlatList(item, indexx)}
                />

                <Modal animationType="fade" transparent={true} visible={isDownloadModel} 
                    presentationStyle="overFullScreen" onDismiss={toggleModalVisibility}>
                    <View style={styles.viewWrapper}>
                        <View style={styles.CardViewModel}>
                            <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                <AntDesign name="close" size={25} color="red" onPress={() => toggleModalVisibility()}/>
                            </View>
                            <View>
                                <View style={styles.ColumnM1}>
                                    <Text style={{color: 'blue', fontSize: 15}}>Please wait</Text>
                                    <ActivityIndicator/>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>


            </View>
        </SafeAreaView>
    );
}
//--------------------------------------------------
const styles = StyleSheet.create({
    Mcontainer: {
        width: DEVICEWIDTH,
        height: DEVICEHEIGHT,
        alignItems: 'center',
    },
    SContainer: {
        marginTop: DEVICEHEIGHT * 0.01,
        left: "5%",
    },
    CardView: {
        left: "42%",
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) },
        { translateY: -90 }],
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        width: DEVICEWIDTH * 0.95,
        bottom: "0%",
    },
    Row1: {
        flexDirection: "row",
    },
    Row2: {
        flexDirection: "row",
        marginTop: 20,
        height: 40,
    },
    Column: {
        flexDirection: "column",
        width: "100%",
        alignItems: 'center',
    },

    Column1: {
        flexDirection: "column",
        width: DEVICEWIDTH * 0.64,
    },
    dropdownClass: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '35%',
        height: DEVICEHEIGHT * 0.3,
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        elevation: 3,
        top: "22%",
        left: "12%",
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
        top: "22%",
        left: "70%",
    },
    TriangleShap: {
        width: 0,
        height: 0,
        borderLeftWidth: 180,
        borderRightWidth: 180,
        borderTopWidth: 200,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'blue',
        marginTop: 10,
        top: "-0%",
    },
    TextAngle: {
        transform: [{ rotate: '-48deg' }],
        color: 'white',
        top: "-34%",
        left: "26%",
        fontWeight: 'bold',
    },
    lineRight: {
        transform: [{ rotate: '-48deg' }],
        backgroundColor: 'white',
        top: "-32%",
        left: "24%",
        width: 238,
        height: 5,
    },
    lineLeft: {
        transform: [{ rotate: '48deg' }],
        backgroundColor: 'white',
        top: "-32.3%",
        left: "-23%",
        width: 235,
        height: 5,
    },
    viewWrapper: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
    CardViewModel: {
        justifyContent: "center",
        position: "absolute",
        top: "27%",
        left: "45%",
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        width: "40%",
        backgroundColor: "#FFFFFF",
        borderRadius: 7,
    },
    ColumnM1: {
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },

});