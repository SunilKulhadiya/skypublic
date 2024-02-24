import React from "react";
import {View, Text, StyleSheet, Dimensions, Image, ImageBackground, TouchableOpacity,
  StatusBar, Modal, ScrollView, FlatList} from "react-native";
import {FontAwesome, MaterialIcons, MaterialCommunityIcons, AntDesign,
        Foundation, Ionicons, FontAwesome5} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { Marquee } from '@animatereactnative/marquee';
import MarqueeView from 'react-native-marquee-view';

import config from "./app_config";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

const Dashboard = ({ navigation, route }) => {

  const newdate = new Date();
  const [BirthWish, set_BirthWish] = React.useState(false);
  const [BirthGif, set_BirthGif] = React.useState("");
  const [ShowBirthGif, set_ShowBirthGif] = React.useState(false);

  const [MarqueeData, set_Marquee] = React.useState([]);
  const [BadgeHideShow, Set_BadgeHS] = React.useState('flex');
  const [MessageBadge, Update_MessB] = React.useState(2);
  const [NAME, set_NAME] = React.useState('');
  const [CLASS, set_CLASS] = React.useState('');
  const [SECTION, set_SECTION] = React.useState('');
  const [Role, set_Role] = React.useState('');
  const [IMAGE, set_IMAGE] = React.useState('null');
  const [isBoxVisival, set_UploadBox] = React.useState(false);
  const [SubBoxVisival, set_SubBox] = React.useState(false);
  const [SubDefin, set_SubDefin] = React.useState('');
  const [SubAction, set_SubAction] = React.useState('');
  const [isRolePermissions, set_RolePermissions] = React.useState([]);

  async function AsyncData() {
    set_BirthWish(false);
    try {
      AsyncStorage.getItem('ROLE').then((value) => set_Role(value));
      AsyncStorage.getItem('NAME').then((value) => set_NAME(value));
      AsyncStorage.getItem('CLASS').then((value) => set_CLASS(value));
      AsyncStorage.getItem('SECTION').then((value) => set_SECTION(value));
      AsyncStorage.getItem('IMAGE').then((value) => {
        set_IMAGE(value)
        console.log("Dashboard ImgPath : ", value);
      });
    } catch (e) {
      console.error("DashBoar Async : ", e);
    }
    let respons1="";
    let HDAY= new Date(`${newdate.getFullYear()}-${newdate.getMonth() + 1}-${newdate.getDate()}`);

    if(Role == "student" || Role == "Student"){
    AsyncStorage.getItem('StdID').then(async (value) => {
      //------
      try{
          respons1 = await fetch(config.Url+'getStudentProfile', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
            body: JSON.stringify({student_id: value})
          })

          respons1 = await respons1.json();
          console.log("Dashboard.js, Std data : ", respons1.student_result.dob, ", Date matched.......");
            if(new Date(respons1.student_result.dob).getTime() == HDAY.getTime()){
              set_BirthWish(true);
              console.log("Dashboard.js, Std data : ", respons1.student_result.dob, ", Date matched.......");
            }else{
              set_BirthWish(false);
              console.log("Dashboard.js, Std data : ", respons1.student_result.dob, ", Date not matched.......");
            }
      

        }catch(err){
          console.error("Error-1 : ",err);
        }
      });
      }else{
        AsyncStorage.getItem('DOB').then(async (dob) => {
        if(new Date(dob).getTime() == HDAY.getTime()){
          set_BirthWish(true);
          console.log("Dashboard.js, Std data : ", respons1.student_result.dob, ", Date matched.......");
        }else{
          set_BirthWish(false);
          console.log("Dashboard.js, Staff data :  Date not matched.......");
        }
      });
      }
    if(BirthGif){
      try{
        let respons = await fetch(config.SewaBhartiUrlApi+'Fetch_School_Base.php', {
        method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
        body: JSON.stringify({ACTION: "9", CLASS: ""})
        })
        let responsJson = await respons.json();
        let m=0;
        for(m = 0; m<responsJson.length; m++){
          if(responsJson[m].schedule <= newdate.getHours())
            set_BirthGif(responsJson[m].wish);
        }
        console.log("Birthday wish Url : ", responsJson[0].wish);
        setTimeout(()=>set_ShowBirthGif(true), 300);
      } catch (e) {
          console.error("Error-2, DashBoar Async : ", e);
      }
    }
  //------
  try{
    respons1 = await fetch(config.Url+'getnews', {
        method: 'GET', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
    })

    respons1 = await respons1.json(), Slides=[], Gallry = [], j=0;
    console.log("-----respons1 : ", respons1);
    Slides.push(respons1.data);
    if(Slides.length > 3){
      Slides = [];
      for(j = respons1.data.length - 4; j<respons1.data.length; j++){
              Slides.push(respons1.data[j]);
          if(j>=respons1.data.length - 1){
              set_Marquee(Slides);
          }
      }
    }else{
      set_Marquee(respons1.data);
    }

  }catch(err){ 
      console.error("Error-3 : ",err);
  }
  //------
  AsyncStorage.getItem('ROLE_ID').then(async (roleid) => {
    let Permission_respons="";
    try{
    Permission_respons = await fetch(config.Url+'getpermission', {
        method: 'POST', headers: {'Accept': 'application/json', 
                                'Content-Type': 'application/json',},
        body: JSON.stringify({role_id:  roleid})
    })

    Permission_respons = await Permission_respons.json();
    console.log("Permission-----Permission_respons : ", Permission_respons.data);
    if(Permission_respons.data.length > 0){
      set_RolePermissions(Permission_respons.data);
    }else{
      set_RolePermissions([]);
    }

    }catch(err){ 
        console.error("Error-4 : ",err);
    }
  });
  //----------
}

  React.useEffect(() => {
    AsyncData();
  }, []);

  function Definition(a) {
    set_UploadBox(!isBoxVisival);
  }
  function SSReasoning(a) {
    set_SubBox(!SubBoxVisival);
    set_SubAction(a.toString());

    if (a == 1) {
      set_SubDefin('Abductive reasoning is a form of logical inference ' +
        'that seeks the simplest and most likely conclusion from a set of ' +
        'observations. It was formulated and advanced by American philosopher ' +
        'Charles Sanders Peirce beginning in the last third of the 19th century.');
    }
    if (a == 2) {
      set_SubDefin('Abductive reasoning is a form of logical inference ' +
        'that seeks the simplest and most likely conclusion from a set of ' +
        'observations. It was formulated and advanced by American philosopher ' +
        'Charles Sanders Peirce beginning in the last third of the 19th century.');
    }
    if (a == 3) {
      set_SubDefin('Abductive reasoning is a form of logical inference ' +
        'that seeks the simplest and most likely conclusion from a set of ' +
        'observations. It was formulated and advanced by American philosopher ' +
        'Charles Sanders Peirce beginning in the last third of the 19th century.');
    }
    if (a == 4) {
      set_SubDefin('Abductive reasoning is a form of logical inference ' +
        'that seeks the simplest and most likely conclusion from a set of ' +
        'observations. It was formulated and advanced by American philosopher ' +
        'Charles Sanders Peirce beginning in the last third of the 19th century.');
    }
    if (a == 5) {
      set_SubDefin('Abductive reasoning is a form of logical inference ' +
        'that seeks the simplest and most likely conclusion from a set of ' +
        'observations. It was formulated and advanced by American philosopher ' +
        'Charles Sanders Peirce beginning in the last third of the 19th century.');
    }
    if (a == 6) {
      set_SubDefin('Abductive reasoning is a form of logical inference ' +
        'that seeks the simplest and most likely conclusion from a set of ' +
        'observations. It was formulated and advanced by American philosopher ' +
        'Charles Sanders Peirce beginning in the last third of the 19th century.');
    }
    if (a == 7) {
      set_SubDefin('Abductive reasoning is a form of logical inference ' +
        'that seeks the simplest and most likely conclusion from a set of ' +
        'observations. It was formulated and advanced by American philosopher ' +
        'Charles Sanders Peirce beginning in the last third of the 19th century.');
    }
    if (a == 8) {
      set_SubDefin('Abductive reasoning is a form of logical inference ' +
        'that seeks the simplest and most likely conclusion from a set of ' +
        'observations. It was formulated and advanced by American philosopher ' +
        'Charles Sanders Peirce beginning in the last third of the 19th century.');
    }
    if (a == 9) {
      set_SubDefin('Abductive reasoning is a form of logical inference ' +
        'that seeks the simplest and most likely conclusion from a set of ' +
        'observations. It was formulated and advanced by American philosopher ' +
        'Charles Sanders Peirce beginning in the last third of the 19th century.');
    }
    if (a == 10) {
      set_SubDefin('Abductive reasoning is a form of logical inference ' +
        'that seeks the simplest and most likely conclusion from a set of ' +
        'observations. It was formulated and advanced by American philosopher ' +
        'Charles Sanders Peirce beginning in the last third of the 19th century.');
    }
    if (a == 11) {
      set_SubDefin('Abductive reasoning is a form of logical inference ' +
        'that seeks the simplest and most likely conclusion from a set of ' +
        'observations. It was formulated and advanced by American philosopher ' +
        'Charles Sanders Peirce beginning in the last third of the 19th century.');
    }
    if (a == 12) {
      set_SubDefin('Abductive reasoning is a form of logical inference ' +
        'that seeks the simplest and most likely conclusion from a set of ' +
        'observations. It was formulated and advanced by American philosopher ' +
        'Charles Sanders Peirce beginning in the last third of the 19th century.');
    }
    if (a == 13) {
      set_SubDefin('Abductive reasoning is a form of logical inference ' +
        'that seeks the simplest and most likely conclusion from a set of ' +
        'observations. It was formulated and advanced by American philosopher ' +
        'Charles Sanders Peirce beginning in the last third of the 19th century.');
    }
    if (a == 14) {
      set_SubDefin('Abductive reasoning is a form of logical inference ' +
        'that seeks the simplest and most likely conclusion from a set of ' +
        'observations. It was formulated and advanced by American philosopher ' +
        'Charles Sanders Peirce beginning in the last third of the 19th century.');
    }
    if (a == 15) {
      set_SubDefin('Abductive reasoning is a form of logical inference ' +
        'that seeks the simplest and most likely conclusion from a set of ' +
        'observations. It was formulated and advanced by American philosopher ' +
        'Charles Sanders Peirce beginning in the last third of the 19th century.');
    }
  }

  function ReasoningQACancel() {
    set_SubBox(!SubBoxVisival);
  }
  function ReasoningQA() {
    set_SubBox(!SubBoxVisival);

    if (SubAction == 1) {
      navigation.navigate('Abductive');
    }
    if (SubAction == 2) {
      navigation.navigate('Analytic');
    }
    if (SubAction == 3) {
      navigation.navigate('Bayesian');
    }
    if (SubAction == 4) {
      navigation.navigate('CaseBased');
    }
    if (SubAction == 5) {
      navigation.navigate('Cause');
    }
    if (SubAction == 6) {
      navigation.navigate('Causality');
    }
    if (SubAction == 7) {
      navigation.navigate('CauseEffect');
    }
    if (SubAction == 8) {
      navigation.navigate('Commonsens');
    }
    if (SubAction == 9) {
      navigation.navigate('CriticalThinking');
    }
    if (SubAction == 10) {
      navigation.navigate('Deductive');
    }
    if (SubAction == 11) {
      navigation.navigate('Inductive');
    }
    if (SubAction == 12) {
      navigation.navigate('Logic');
    }
    if (SubAction == 13) {
      navigation.navigate('Logical');
    }
    if (SubAction == 14) {
      navigation.navigate('Syllogism');
    }
    if (SubAction == 15) {
      navigation.navigate('Verbal');
    }
  }

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);

  // if (!fontsLoaded) {
  //   return null;
  // }
  //---------------------------------
  const toggleModalVisibility = () => {
    set_BirthWish(false);
  }
  //---------------------------------
  const GalleryAuthority = () => {
    let j = 0, isPermision = 0;
    for(j = 0; j < isRolePermissions.length; j++){
      if(isRolePermissions[j].permisssion.name == "Gallery"){
        if(isRolePermissions[j].permisssion.can_add == 1){
          isPermision = 11;
        }
        if(isRolePermissions[j].permisssion.can_edit == 1){
            isPermision = 12;
        }
        if(isRolePermissions[j].permisssion.can_delete == 1){
            isPermision = 13;
        }
        if(isRolePermissions[j].permisssion.can_add == 1 &&
          isRolePermissions[j].permisssion.can_edit == 1 &&
          isRolePermissions[j].permisssion.can_delete == 1){
            isPermision = 30;
        }
      }

      if(j>=isRolePermissions.length-1){
            navigation.navigate('SkyGallery', {PERMISSION_RANGE: isPermision});
        console.log("GalleryAuthority Permission : ", isPermision);
      }
    }//for

  }
  //---------------------------------
  const StaffHomeWork = () => {
    let j = 0, isPermision = 0;
    for(j = 0; j < isRolePermissions.length; j++){
      //console.log("StaffHomeWork Permission : ", isRolePermissions[j].permisssion.name);
      if(isRolePermissions[j].permisssion.name == "Homework"){
        if(isRolePermissions[j].permisssion.can_add == 1){
          isPermision = 11;
        }
        if(isRolePermissions[j].permisssion.can_edit == 1){
            isPermision = 12;
        }
        if(isRolePermissions[j].permisssion.can_delete == 1){
            isPermision = 13;
        }
        if(isRolePermissions[j].permisssion.can_add == 1 &&
          isRolePermissions[j].permisssion.can_edit == 1 &&
          isRolePermissions[j].permisssion.can_delete == 1){
            isPermision = 30;
        }
      }
      if(isRolePermissions[j].permisssion.name == "Homework Evaluation"){
          if(isRolePermissions[j].permisssion.can_add == 1){
              isPermision = 21;
          }
          if(isRolePermissions[j].permisssion.can_edit == 1){
              isPermision = 22;
          }
          if(isRolePermissions[j].permisssion.can_delete == 1){
              isPermision = 23;
          }
          if(isRolePermissions[j].permisssion.can_add == 1 &&
            isRolePermissions[j].permisssion.can_edit == 1 &&
            isRolePermissions[j].permisssion.can_delete == 1){
              isPermision = 30;
          }
      }

      if(j>=isRolePermissions.length-1){
        console.log("HomeWork Authority, isPermision : ", isPermision);
        navigation.navigate('HomeWork', {PERMISSION_RANGE: isPermision});
      }
    }//for
  }
  //---------------------------------
  const IDCardAuthority = () => {
    AsyncStorage.getItem('ROLE_ID').then(async (roleid) => {
      navigation.navigate('IDCard', {PERMISSION_RANGE: roleid});
    });
  }
  //---------------------------------
  const FeesAuthority = () => {
    let j = 0, isPermision = 0;
    for(j = 0; j < isRolePermissions.length; j++){
      //console.log("StaffHomeWork Permission : ", isRolePermissions[j].permisssion.name);
      if(isRolePermissions[j].permisssion.name == "Fees Reminder" ||
          isRolePermissions[j].permisssion.name == "Search Due Fees" ||
          isRolePermissions[j].permisssion.name == "Search Fees Payment" ||
          isRolePermissions[j].permisssion.name == "Fees Discount Assign" ||
          isRolePermissions[j].permisssion.name == "Fees Discount" ||
          isRolePermissions[j].permisssion.name == "Fees Type" ||
          isRolePermissions[j].permisssion.name == "Collect Fees" ||
          isRolePermissions[j].permisssion.name == "Fees Awaiting Payment Widegts" ||
          isRolePermissions[j].permisssion.name == "Fees Overview Widegts" ||
          isRolePermissions[j].permisssion.name == "Fees Collection Widget" ||
          isRolePermissions[j].permisssion.name == "Fees Collection And Expense Yearly Chart" ||
          isRolePermissions[j].permisssion.name == "Fees Collection And Expense Monthly Chart" ||
          isRolePermissions[j].permisssion.name == "Online Fees Collection Report" ||
          isRolePermissions[j].permisssion.name == "Fees Collection Report" ||
          isRolePermissions[j].permisssion.name == "Balance Fees Report" ||
          isRolePermissions[j].permisssion.name == "Fees Statement" ||
          isRolePermissions[j].permisssion.name == "Fees Carry Forward"
        ){
        if(isRolePermissions[j].permisssion.can_add == 1){
          isPermision = 11;
        }
        if(isRolePermissions[j].permisssion.can_edit == 1){
            isPermision = 12;
        }
        if(isRolePermissions[j].permisssion.can_delete == 1){
            isPermision = 13;
        }
        if(isRolePermissions[j].permisssion.can_add == 1 &&
          isRolePermissions[j].permisssion.can_edit == 1 &&
          isRolePermissions[j].permisssion.can_delete == 1){
            isPermision = 30;
        }
      }
      if(j>=isRolePermissions.length-1){
        console.log("FeesAuthority, isPermision : ", isPermision);
        navigation.navigate('FeesReceive', {PERMISSION_RANGE: isPermision});
      }
    }//for
  }
  //---------------------------------
  const StaffAttendanceAuthority = () => {
    let j = 0, isPermision = 0;
    for(j = 0; j < isRolePermissions.length; j++){
      //console.log("StaffHomeWork Permission : ", isRolePermissions[j].permisssion.name);
      if(isRolePermissions[j].permisssion.name == "Staff Attendance"){
        if(isRolePermissions[j].permisssion.can_add == 1){
          isPermision = 11;
        }
        if(isRolePermissions[j].permisssion.can_edit == 1){
          isPermision = 12;
        }
        if(isRolePermissions[j].permisssion.can_delete == 1){
          isPermision = 13;
        }
        if(isRolePermissions[j].permisssion.can_add == 1 &&
          isRolePermissions[j].permisssion.can_edit == 1 &&
          isRolePermissions[j].permisssion.can_delete == 1){
            isPermision = 30;
        }
      }

      if(j>=isRolePermissions.length-1){
        console.log("StaffAttendence Authority, isPermision : ", isPermision);
        navigation.navigate('StaffAttendanceAdm', {PERMISSION_RANGE: isPermision});
      }
    }//for

  }
  //---------------------------------
  const MarqueeDisplay = (item, index) => {
    let str = item.description;
    str = str.toString();
    str = str.replace(/(<([^>]+)>)/ig, '');

    return(
      <View style={{marginLeft: 20}}>
        <View style={{justifyContent: "flex-start", flexDirection: "column",
              width: DEVICEWIDTH * 0.99, padding: 0}}>
          <View style={{flexDirection: "row", marginLeft: 15}}>
            <View style={{width: DEVICEWIDTH * 0.21, paddingRight: 12}}>
            {
              item.feature_image !== null && item.feature_image.length > 2 ? (
                  <Image source={{uri: item.feature_image}} style={{width: 90, height: 160, 
                      borderRadius: 12,}} resizeMode='contain'/>
              ):(
                <Image source={require('../assets/logoBn.png')} style={{
                  width: 90, height: 100, borderRadius: 12,
                  borderColor: "#FFFFFF", borderWidth: 0, marginRight: 0, marginTop: 0,
                  left: "0%"
                }} />
              )
            }
            </View>
            <View style={{flexDirection: "column", paddingLeft: 12, width: DEVICEWIDTH * 0.76}}>
              <Text style={{color: "#000000", fontWeight: "bold",
                  width: DEVICEWIDTH * 0.6, fontSize: 20}}>{item.title}</Text>
              <Text style={{color: "#000000", fontWeight: "bold",
                  width: DEVICEWIDTH * 0.76, fontSize: 15}}>{str}</Text>
              <Text style={{color: "#000000", fontWeight: "bold",
                  fontSize: 8}}>Create on : {item.created_at}</Text>
              <View style={{flexDirection: "row"}}>
                <Text style={{color: "#000000", fontWeight: "bold",
                    fontSize: 8}}>Start on : {item.event_start}</Text>
                <Text style={{color: "#000000", fontWeight: "bold",
                    fontSize: 8, marginLeft: 30}}>End on : {item.event_end}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
  //------------------------------------------------------------
  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} backgroundColor="#ecf0f1" />
      <ImageBackground source={require("../assets/skyImg1.jpg")} style={styles.Imgcontainer}>

        <View style={styles.MCol}>
          <View style={[styles.MRow, { justifyContent: "center", alignItems: "center" }]}>
            <Image source={require('../assets/logoBn.png')} style={{
              width: 38, height: 38, borderRadius: 50,
              borderColor: "#FFFFFF", borderWidth: 0, marginRight: 0, marginTop: 3,
              left: "-10%"}} />
            <View style={styles.MCol}>
              <Text style={styles.SchoolName}>Sky Public Hr. Sec. School</Text>
              <View style={{width: "100%", height: 2, backgroundColor: "#C90FEB",
                justifyContent: "center", alignItems: "center", top: "-14.7%"
              }}>
              </View>
            </View>
          </View>
          <View style={styles.TopBackground1}>
            {/*
              <View style={styles.MessageAlign}>
                <View style={{display: BadgeHideShow, marginTop: -2, marginRight: -30,}}>
                <Badge badgeStyle={styles.badge} textStyle={styles.badgeText} value={MessageBadge} 
                        status="error"/>
                </View>
                <Ionicons name="mail-open-outline" size={24} color="#FFFFFF"/>
              </View>
              */
            }
            <View style={styles.MStudRow}>
              {
                IMAGE == "null" ? (
                  <Image style={styles.StudentPhoto} source={require('../assets/Login.png')} />
                ) : (
                  <Image style={styles.StudentPhoto} source={{ uri: IMAGE }} />
                )
              }
              <View style={styles.StudColumn}>
                <Text style={styles.StudentName}>{NAME}</Text>
                {
                  Role == "student" ? (
                    <View style={styles.StudRow}>
                      <Text style={styles.StudentClass}>Class : {CLASS}</Text>
                      <Text style={styles.StudentClass}> | </Text>
                      <Text style={styles.StudentClass}>Section : {SECTION}</Text>
                    </View>
                  ) : (
                    <View style={styles.StudRow}>
                      <Text style={styles.StudentClass}>{CLASS}</Text>
                    </View>
                  )
                }
              </View>
            </View>
          </View>
        </View>
        {/* ----------------Card View--------------- */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ display: "flex", top: "0%"}}>

              <View style={{marginTop: "2%"}}>
                <MarqueeView>
                  <FlatList contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    data={MarqueeData} horizontal
                    keyExtractor={(item, indexx) => indexx.toString()}
                    renderItem={({item, indexx}) => MarqueeDisplay(item, indexx)}
                  />
                </MarqueeView>
              </View>

            <View style={styles.MMCol}>
              <View style={styles.CardView1}>
                <View style={styles.MColumn}>
                  <Text style={styles.CardTitle}>Organization</Text>

                  <View style={styles.SRow}>
                    <View style={styles.SColumn}>
                      <TouchableOpacity onPress={() => GalleryAuthority()}>
                        <View style={styles.IconsBackGround}>
                          <FontAwesome name="image" size={40} color="#4686E9" />
                        </View>
                        <View style={[styles.SSColumn, { marginTop: -5 }]}>
                          <Text style={styles.textStyle}>Gallery</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.SColumn}>
                      <TouchableOpacity onPress={() => navigation.navigate('Events')}>
                        <View style={styles.IconsBackGround}>
                          <FontAwesome5 name="people-carry" size={35} color="#800080" />
                        </View>
                        <View style={[styles.SSColumn, { marginTop: -5 }]}>
                          <Text style={styles.textStyle}>Events</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.SColumn}>
                      <TouchableOpacity onPress={() => navigation.navigate('SchoolNews')}>
                        <View style={styles.IconsBackGround}>
                          <FontAwesome name="newspaper-o" size={40} color="#FF00FF" />
                        </View>
                        <View style={[styles.SSColumn, { marginTop: -5 }]}>
                          <Text style={styles.textStyle}>School News</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ marginTop: 10 }}></View>
                </View>
              </View>

              <View style={styles.CardView1}>
                <View style={styles.MColumn}>
                  <Text style={styles.CardTitle}>E-Learning</Text>

                  <View style={styles.SRow}>
                    <View style={styles.SColumn}>
                      <TouchableOpacity onPress={() => navigation.navigate('OnlineExam')}>
                        <View style={styles.IconsBackGround}>
                          <MaterialIcons name="laptop-windows" size={40} color="#FF0000" />
                        </View>
                        <View style={styles.SSColumn}>
                          <Text style={styles.textStyle}>Online</Text>
                          <Text style={styles.textStyle}>Examination</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.SColumn}>
                      <TouchableOpacity onPress={() => navigation.navigate('DownloadCenter')}>
                        <View style={styles.IconsBackGround}>
                          <AntDesign name="clouddownload" size={40} color="#0000FF" />
                        </View>
                        <View style={styles.SSColumn}>
                          <Text style={styles.textStyle}>View/</Text>
                          <Text style={styles.textStyle}>Download</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.SColumn}>
                      <TouchableOpacity onPress={() => navigation.navigate('OnlineCourse')}>
                        <View style={styles.IconsBackGround}>
                          <AntDesign name="iconfontdesktop" size={40} color="#E66111" />
                        </View>
                        <Text style={styles.textStyle}>online Course</Text>
                      </TouchableOpacity>
                    </View>

                  </View>

                  <View style={styles.SRow}>
                    <View style={styles.SColumn}>
                      <TouchableOpacity onPress={() => navigation.navigate('ZoomLiveClass')}>
                        <View style={styles.IconsBackGround}>
                          <Ionicons name="videocam" size={40} color="#4686E9" />
                        </View>
                        <View style={styles.SSColumn}>
                          <Text style={styles.textStyle}>Zoom Live</Text>
                          <Text style={styles.textStyle}>Classes</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.SColumn}>
                      <TouchableOpacity onPress={() => navigation.navigate('GmeetLiveClass')}>
                        <View style={styles.IconsBackGround}>
                          <Ionicons name="videocam-outline" size={40} color="#FF00FF" />
                        </View>
                        <View style={styles.SSColumn}>
                          <Text style={styles.textStyle}>Gmeet Live</Text>
                          <Text style={styles.textStyle}>Classes</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ marginTop: 10 }}></View>
                </View>
              </View>

              <View style={styles.CardView2}>
                <View style={styles.MColumn}>
                  <Text style={styles.CardTitle}>Academics</Text>

                  <View style={styles.SRow}>
                    <View style={styles.SColumn}>
                      <TouchableOpacity onPress={() => {
                        if (Role == "Staff" || Role == "staff" || Role == "STAFF") {
                            StaffHomeWork();
                        } else {
                          navigation.navigate('StdHomeWork');
                        }
                      }
                      }>
                        <View style={styles.IconsBackGround}>
                          <MaterialCommunityIcons name="notebook-edit-outline"
                            size={40} color="#EF870F" />
                        </View>
                        <Text style={styles.textStyle}>Home Work</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.SColumn}>
                      <TouchableOpacity onPress={() => navigation.navigate('DailyAssignment')}>
                        <View style={styles.IconsBackGround}>
                          <MaterialCommunityIcons name="book-open-page-variant-outline"
                            size={40} color="#9CCA9D" />
                        </View>
                        <View style={styles.SSColumn}>
                          <Text style={styles.textStyle}>Daily</Text>
                          <Text style={styles.textStyle}>Assignment</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.SColumn}>
                      <TouchableOpacity onPress={() => navigation.navigate('LessonPlan')}>
                        <View style={styles.IconsBackGround}>
                          <MaterialCommunityIcons name="pencil-box-multiple" size={40} color="#7586A8" />
                        </View>
                        <Text style={styles.textStyle}>Lesson Plan</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.SRow}>
                    <TouchableOpacity onPress={() => {
                      if (Role == "Staff" || Role == "staff" || Role == "STAFF") {
                        navigation.navigate('ClassTimetable')
                      } else {
                        navigation.navigate('StdClassTimetable')
                      }
                    }}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGround}>
                          <MaterialCommunityIcons name="timetable" size={40} color="#5C8467" />
                        </View>
                        <View style={[styles.SSColumn, { marginTop: -5 }]}>
                          <Text style={styles.textStyle}>Class</Text>
                          <Text style={styles.textStyle}>Timetable</Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('SyllabusStatus')}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGround}>
                          <MaterialCommunityIcons name="book-open" size={40} color="#77D6DE" />
                        </View>
                        <View style={[styles.SSColumn, { marginTop: -5 }]}>
                          <Text style={styles.textStyle}>Syllabus Status</Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                      if (Role == "Staff") {
                        navigation.navigate('AttendanceReg')
                      } else {
                        navigation.navigate('Attendance')
                      }
                    }}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGround}>
                          <AntDesign name="checkcircleo" size={40} color="#8554A1" />
                        </View>
                        <View style={[styles.SSColumn, { marginTop: -5 }]}>
                          <Text style={styles.textStyle}>Attendance</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.SRow}>
                    <TouchableOpacity onPress={() => navigation.navigate('Examination')}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGround}>
                          <MaterialIcons name="pending-actions" size={40} color="#EF870F" />
                        </View>
                        <View style={[styles.SSColumn, { marginTop: -7 }]}>
                          <Text style={styles.textStyle}>Examination</Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    <View style={styles.SColumn}>
                      <TouchableOpacity onPress={() => navigation.navigate('Result')}>
                        <View style={styles.IconsBackGround}>
                          <Foundation name="results" size={40} color="#FF0000" />
                        </View>
                        <View style={[styles.SSColumn, { marginTop: -7 }]}>
                          <Text style={styles.textStyle}>Result</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('Leave')}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGround}>
                          <MaterialCommunityIcons name="exit-run" size={40} color="#4FA1C4" />
                        </View>
                        <View style={[styles.SSColumn, { marginTop: -6 }]}>
                          <Text style={styles.textStyle}>Leave</Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                  </View>

                  <View style={styles.SRow}>
                    <TouchableOpacity onPress={() => navigation.navigate('Library')}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGround}>
                          <Ionicons name="library" size={40} color="#4686E9" />
                        </View>
                        <View style={[styles.SSColumn, { marginTop: -5 }]}>
                          <Text style={styles.textStyle}>Library</Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                      if (Role == "Staff" || Role == "staff" || Role == "STAFF") {
                        IDCardAuthority();
                      } else {
                        navigation.navigate('StdID_Card');
                      }
                    }}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGround}>
                          <AntDesign name="idcard" size={40} color="#1C14DC" />
                        </View>
                        <View style={[styles.SSColumn, { marginTop: -7 }]}>
                          <Text style={styles.textStyle}>ID Card</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('AdmitCard')}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGround}>
                          <FontAwesome name="address-card" size={40} color="#14DCA1" />
                        </View>
                        <View style={[styles.SSColumn, { marginTop: -5 }]}>
                          <Text style={styles.textStyle}>Admit Card</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={[styles.SRow, { marginLeft: 2, }]}>
                  <TouchableOpacity onPress={() => {
                    if (Role == "Staff" || Role == "staff" || Role == "STAFF") {
                      FeesAuthority();
                    } else {
                      navigation.navigate('Fees')
                    }
                  }}>
                    <View style={styles.SColumn}>
                      <View style={styles.IconsBackGround}>
                        <AntDesign name="printer" size={40} color="#E66111" />
                      </View>
                      <View style={[styles.SSColumn, { marginTop: -5 }]}>
                        <Text style={styles.textStyle}>FEES</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.SColumn}>
                    <TouchableOpacity onPress={() => navigation.navigate('MyDocuments')}>
                      <View style={styles.IconsBackGround}>
                        <AntDesign name="folderopen" size={40} color="#FFA500" />
                      </View>
                      <View style={[styles.SSColumn, { marginTop: -5 }]}>
                        <Text style={styles.textStyle}>Social</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  {/* <TouchableOpacity onPress={() => navigation.navigate('SkyGallery')}>
                    <View style={styles.SColumn}>
                      <View style={styles.IconsBackGround}>
                        <FontAwesome name="image" size={40} color="#4686E9" />
                      </View>
                      <View style={[styles.SSColumn, { marginTop: -5 }]}>
                        <Text style={styles.textStyle}>Gallery</Text>
                      </View>
                    </View>
                  </TouchableOpacity> */}
                </View>
                <View style={{ marginTop: 10 }}></View>
              </View>
              <View style={{ marginTop: 15 }}></View>

              <View>
                {
                  Role == "Staff" ? (
                    <View style={styles.CardView2}>
                      <View style={styles.MColumn}>
                        <Text style={styles.CardTitle}>Admin/Staff</Text>

                        <View style={styles.SRow}>
                          <TouchableOpacity onPress={() => StaffAttendanceAuthority()}>
                            <View style={styles.SColumn}>
                              <View style={styles.IconsBackGround}>
                                <MaterialCommunityIcons name="timetable" size={40} color="#A380A6" />
                              </View>
                              <View style={[styles.SSColumn, { marginTop: -5 }]}>
                                <Text style={styles.textStyle}>Staff</Text>
                                <Text style={styles.textStyle}>Attendance</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{ marginTop: 10 }}></View>
                    </View>
                  ) : (
                    <></>
                  )
                }
              </View>
              <View style={{ marginTop: 15 }}></View>





              {/* <View style={styles.CardView2}>
                <View style={styles.MColumn}>
                  <Text style={styles.CardTitle}>Self Study</Text>
                    <TouchableOpacity onPress={()=>Definition(1)}  style={{width: '100%', 
                          justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                      <Text style={{fontSize: 16, fontWeight: "bold", color: 'blue'}}>Reasoning ?</Text>
                      <View style={{width: "22%", height: 2, backgroundColor: 'blue', marginTop: -3, marginRight: 19}}></View>
                    </TouchableOpacity>
                  <View style={styles.SRow}>
                    <TouchableOpacity onPress={() => SSReasoning(1)}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGroundSelfStudy}>

                        <Image source={require('../assets/abductive2.png')} 
                            style={{width: 40, height: 35,}} />
                        </View>
                        <View style={[styles.SSColumn, {marginTop: -5}]}>
                          <Text style={styles.textStyle}>Abductive</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => SSReasoning(2)}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGroundSelfStudy}>

                        <Image source={require('../assets/Analytic.png')} 
                            style={{width: 35, height: 35,}} />
                        </View>
                        <View style={[styles.SSColumn, {marginTop: -5}]}>
                          <Text style={styles.textStyle}>Analytic</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => SSReasoning(3)}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGroundSelfStudy}>

                        <Image source={require('../assets/Bayesian_inference.png')} 
                            style={{width: 35, height: 35,}} />
                        </View>
                        <View style={[styles.SSColumn, {marginTop: -5}]}>
                          <Text style={styles.textStyle}>Bayesian</Text>
                          <Text style={styles.textStyle}>inference</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.SRow}>
                  <TouchableOpacity onPress={() => SSReasoning(4)}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGroundSelfStudy}>

                        <Image source={require('../assets/CaseBased.png')} 
                            style={{width: 35, height: 35,}} />
                        </View>
                        <View style={[styles.SSColumn, {marginTop: -5}]}>
                          <Text style={styles.textStyle}>Case Based</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  <TouchableOpacity onPress={() => SSReasoning(5)}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGroundSelfStudy}>

                        <Image source={require('../assets/Cause.jpg')} 
                            style={{width: 35, height: 35,}} />
                        </View>
                        <View style={[styles.SSColumn, {marginTop: -5}]}>
                          <Text style={styles.textStyle}>Cause</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => SSReasoning(6)}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGroundSelfStudy}>

                        <Image source={require('../assets/Causality.png')} 
                            style={{width: 35, height: 35,}} />
                        </View>
                        <View style={[styles.SSColumn, {marginTop: -5}]}>
                          <Text style={styles.textStyle}>Causality</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.SRow}>
                  <TouchableOpacity onPress={() => SSReasoning(7)}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGroundSelfStudy}>

                        <Image source={require('../assets/Cause_Effect.png')} 
                            style={{width: 37, height: 35,}} />
                        </View>
                        <View style={[styles.SSColumn, {marginTop: -5}]}>
                          <Text style={styles.textStyle}>Cause Effect</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  <TouchableOpacity onPress={() => SSReasoning(8)}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGroundSelfStudy}>

                        <Image source={require('../assets/Commonsens.png')} 
                            style={{width: 35, height: 35,}} />
                        </View>
                        <View style={[styles.SSColumn, {marginTop: -5}]}>
                          <Text style={styles.textStyle}>Commonsens</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => SSReasoning(9)}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGroundSelfStudy}>

                        <Image source={require('../assets/CriticalThinking.png')} 
                            style={{width: 35, height: 35,}} />
                        </View>
                        <View style={[styles.SSColumn, {marginTop: -5}]}>
                          <Text style={styles.textStyle}>Critical Thinking</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.SRow}>
                  <TouchableOpacity onPress={() => SSReasoning(10)}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGroundSelfStudy}>

                        <Image source={require('../assets/Deductive.jpg')} 
                            style={{width: 35, height: 35,}} />
                        </View>
                        <View style={[styles.SSColumn, {marginTop: -5}]}>
                          <Text style={styles.textStyle}>Deductive</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  <TouchableOpacity onPress={() => SSReasoning(11)}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGroundSelfStudy}>

                        <Image source={require('../assets/inductive-reasoning.png')} 
                            style={{width: 35, height: 35,}} />
                        </View>
                        <View style={[styles.SSColumn, {marginTop: -5}]}>
                          <Text style={styles.textStyle}>Inductive</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => SSReasoning(12)}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGroundSelfStudy}>

                        <Image source={require('../assets/logic.png')} 
                            style={{width: 35, height: 35,}} />
                        </View>
                        <View style={[styles.SSColumn, {marginTop: -5}]}>
                          <Text style={styles.textStyle}>Logic</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.SRow}>
                  <TouchableOpacity onPress={() => SSReasoning(13)}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGroundSelfStudy}>
                        <Image source={require('../assets/logical.png')} 
                            style={{width: 35, height: 35,}} />
                        </View>
                        <View style={[styles.SSColumn, {marginTop: -5}]}>
                          <Text style={styles.textStyle}>Logical</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  <TouchableOpacity onPress={() => SSReasoning(14)}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGroundSelfStudy}>

                        <Image source={require('../assets/Syllogism.jpg')}
                            style={{width: 35, height: 35,}} />
                        </View>
                        <View style={[styles.SSColumn, {marginTop: -5}]}>
                          <Text style={styles.textStyle}>Syllogism</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => SSReasoning(15)}>
                      <View style={styles.SColumn}>
                        <View style={styles.IconsBackGroundSelfStudy}>

                        <Image source={require('../assets/Verbal.png')} 
                            style={{width: 35, height: 35,}} />
                        </View>
                        <View style={[styles.SSColumn, {marginTop: -5}]}>
                          <Text style={styles.textStyle}>Verbal</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>

              </View>
              <View style={{ marginTop: 10 }}></View>

                  <Modal animationType="fade" transparent={true} visible={isBoxVisival} 
                                presentationStyle="formSheet" onDismiss={toggleModalVisibility} 
                                style={{width: "100%", height: "50%", top: "80%"}}>
                    <TouchableOpacity onPress={()=>Definition(1)}>
                        <ImageBackground source={require("../assets/MessengerTD.png")} 
                            style={{width: "91.5%", height: "64.5%", top: "60%", left: "5%", position: "relative"}}>
                          <View style={{justifyContent: "center", alignItems: "center", marginTop: 7}}>
                          <Text style={{color: "white", width: "80%", height: "80%", fontSize: 12}}>
                            रीजनिंग किसी विशेष स्थिति या प्रश्न के बारे में तार्किक तरीके से सोचने की क्षमता है. 
                            रीजनिंग प्रश्नों को हल करके आप अपनी मानसिक क्षमता को बढ़ा सकते हैं और तार्किक दृष्टिकोण की 
                            दिशा में काम कर सकते हैं.
                          </Text>
                          </View>
                        </ImageBackground>
                    </TouchableOpacity>
                  </Modal>

                  <Modal animationType="fade" transparent={true} visible={SubBoxVisival} 
                                presentationStyle="formSheet" onDismiss={toggleModalVisibility}
                                style={{width: "100%", height: "80%", top: "80%"}}>
                      <View style={styles.viewWrapper}>
                        <View style={styles.CardViewModel}>
                        <TouchableOpacity onPress={()=>ReasoningQACancel()}>
                          <View style={{alignItems: "center", marginTop: 32,}}>
                          <Text style={{color: "black", width: "90%", height: "100%", fontSize: 20}}>
                            {SubDefin}
                          </Text>
                          </View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>ReasoningQA()}>
                            <View style={{left: '37%', alignItems: "center", marginBottom: 32}}>
                                <Text style={{color: "blue", fontSize: 20, fontWeight: "bold"}}>Next</Text>
                            </View>
                          </TouchableOpacity>
                    </View>
                    </View>
                  </Modal>

            </View> */}

{
  ShowBirthGif ? (
    <Modal animationType="fade" transparent={true} visible={BirthWish} 
        presentationStyle="overFullScreen" onDismiss={toggleModalVisibility}>
      <View style={styles.viewWrapper}>
        <View style={styles.BirthCardViewModel}>
          <View style={{flexDirection: "row", width: DEVICEWIDTH, height: DEVICEHEIGHT * 0.2}}>
              <Image style={{width: "35%", height: "100%", marginLeft: 5, marginTop: 5}}
                source={{ uri: IMAGE }} />
              <AntDesign name="close" size={25} color="red" onPress={() => toggleModalVisibility()}
                style={{marginLeft: "50%"}}/>
          </View>
          <View style={{alignItems: "center"}}>
            <Text style={styles.BirthNameStyle}>Dear</Text>
            <Text style={styles.BirthNameStyle}>{NAME}</Text>
            <Image style={styles.birthdayGif} source={{ uri: BirthGif}} resizeMode="contain" />
          </View>

        </View>
      </View>
    </Modal>    
  ):(
    <></>
  )
}

            </View>
          </View>
        </ScrollView>
      </ImageBackground>




    </View>

  );

}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    width: DEVICEWIDTH,
    height: DEVICEHEIGHT,
  },
  Imgcontainer: {
    width: "100%",
    height: "100%",
  },
  SchoolName: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#C90FEB",
  },
  TopBackground1: {
    width: DEVICEWIDTH,
    height: DEVICEHEIGHT * 0.24,
  },
  MessageAlign: {
    marginRight: 17, justifyContent: 'flex-end',
    marginTop: 20, flexDirection: 'row',
  },
  badge: {
    marginTop: -9,
    marginLeft: -8,
  },
  badgeText: {
    fontSize: 10,
    paddingHorizontal: 0
  },
  StudentPhoto: {
    borderColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 10,
    width: DEVICEWIDTH * 0.3,
    height: DEVICEWIDTH * 0.4,
    marginLeft: DEVICEWIDTH * 0.03,
  },
  scrolling1: {
    width: 400,
    padding: 10,
    marginBottom: 10,
  },
  BirthCardViewModel: {
    position: "absolute",
    top: "40%",
    left: "42%",
    elevation: 5,
    transform: [{ translateX: -(DEVICEWIDTH * 0.4) }, 
                { translateY: -90 }],
    width: DEVICEWIDTH * 0.96,
    height: DEVICEHEIGHT * 0.8,
    borderColor: "#09DB0A",
    borderWidth: 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
  },
  birthdayGif: {
    width: DEVICEWIDTH * 0.943,
    height: DEVICEHEIGHT * 0.5,
    borderRadius: 25,
    borderWidth: 3,
  },
  MStudRow: {
    flexDirection: 'row',
    alignItems: "center",
    textAlign: "center",
    marginTop: DEVICEHEIGHT * 0.03,
  },
  StudColumn: {
    flexDirection: 'column',
    textAlign: "center",
    marginLeft: 7,
    width: DEVICEWIDTH * 0.63,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF9F0B",
    borderRadius: 20,
  },
  StudentName: {
    fontSize: 15,
    fontWeight: "bold",
    color: '#000000',
    marginTop: 10,
  },
  StudRow: {
    flexDirection: 'row',
  },
  StudentClass: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 13,
  },
  MMCol: {
    flex: 1,
    flexDirection: "column",
    marginTop: DEVICEHEIGHT * 0.12,
  },
  SSColumn: {
    flexDirection: "column",
  },
  CardView1: {
    left: "42.5%",
    elevation: 5,
    transform: [{ translateX: -(DEVICEWIDTH * 0.4) },
    { translateY: -90 }],
    width: DEVICEWIDTH * 0.95,
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
    marginBottom: DEVICEHEIGHT * 0.02,
  },
  CardView2: {
    left: "42.5%",
    elevation: 5,
    transform: [{ translateX: -(DEVICEWIDTH * 0.4) },
    { translateY: -90 }],

    width: DEVICEWIDTH * 0.95,
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
    marginBottom: DEVICEHEIGHT * 0.0,
  },
  MColumn: {
    flexDirection: 'column',
    alignItems: "flex-start",
    marginLeft: 10,
  },
  MRow: {
    flexDirection: 'row',
  },
  MCol: {
    flexDirection: 'column',
  },
  SColumn: {
    flexDirection: 'column',
    padding: 9,

  },
  SRow: {
    flexDirection: 'row',
    marginLeft: -10,
  },
  IconsBackGround: {
    backgroundColor: '#FFFFFF',
    width: DEVICEWIDTH * 0.27,
    height: DEVICEHEIGHT * 0.06,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  IconsBackGroundSelfStudy: {
    backgroundColor: '#FFFFFF',
    width: DEVICEWIDTH * 0.27,
    height: DEVICEHEIGHT * 0.06,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  CardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: '#EB0AE4',
  },
  textStyle: {
    fontSize: 13,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
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

  CardViewMess: {
    left: "42.5%",
    elevation: 5,
    transform: [{ translateX: -(DEVICEWIDTH * 0.4) },
    { translateY: -90 }],
    width: DEVICEWIDTH * 0.95,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#000000",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: -40,
    borderBottomRightRadius: -40,

    marginBottom: DEVICEHEIGHT * 0.0,
  },
  viewWrapper: {
    marginTop: "50%",
  },
  ColumnM1: {
    flexDirection: "column",
    padding: 5,
    width: 100,
    height: 100,
  },

});



/*                          <View style={styles.SColumn}>
                            <View style={styles.IconsBackGround}>
                              <Foundation name="results-demographics" size={40} color="#4686E9" />
                            </View>
                              <Text style={styles.textStyle}>Library</Text>
                          </View>







rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}



                          */