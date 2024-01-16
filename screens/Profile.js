import React from "react";
import { View, StyleSheet, Text, Image, Dimensions, useWindowDimensions, ScrollView, ActivityIndicator } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { TabView, SceneMap } from 'react-native-tab-view';        //npm i react-native-tab-view
import AsyncStorage from '@react-native-async-storage/async-storage';   

import ProfileOther from "../screens/ProfileOther";
import config from "./app_config";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;


const ProfileHome = ({navigation}) => {

  let Role;

  const[BaseURL, set_BaseURL] = React.useState('');
  const[user, set_user] = React.useState('');
    const[paswrd, set_paswrd] = React.useState('');
    const [DataS, set_data] = React.useState([]);
    const [isLoading, reset_isLoading]=React.useState(true);
    const[NAME, set_NAME] = React.useState('');
    const[Class, set_Class] = React.useState('');
    const[IMAGE, set_IMAGE] = React.useState('null');
    const[Rol, set_Role] = React.useState('');
    const[ID, set_ID] = React.useState('');
    let sid;


    async function AsyncData(){
      try{
        AsyncStorage.getItem('StdID').then((value) => {
          sid = value;
        });
        AsyncStorage.getItem('ROLE').then((value) => {
          Role = value;
          set_Role(value);
        });
        AsyncStorage.getItem('SERVERURL').then((value) => set_BaseURL(value));
        AsyncStorage.getItem('email').then((value) => set_user(value));
        AsyncStorage.getItem('password').then((value) =>set_paswrd(value));
        AsyncStorage.getItem('NAME').then((value) => set_NAME(value));
        AsyncStorage.getItem('ID').then((value) => set_ID(value));
        AsyncStorage.getItem('CLASS').then((value) => set_Class(value));
        AsyncStorage.getItem('IMAGE').then((value) => {
          set_IMAGE(value)
          console.log("Profile ImgPath : ", value);
        });
        } catch(e){
        console.error("DashBoar Async : ", e);
      }
    }
  
    const FetchPersonal= ()=>{

      AsyncStorage.getItem('StdID').then((value) => {
        sid = value;
      });
      AsyncStorage.getItem('ROLE').then((value) => {
        Role = value;
        set_Role(value);
      });
      AsyncStorage.getItem('email').then((value) => set_user(value));
      AsyncStorage.getItem('password').then((value) =>set_paswrd(value));
      AsyncStorage.getItem('NAME').then((value) => set_NAME(value));
      AsyncStorage.getItem('ID').then((value) => set_ID(value));
      AsyncStorage.getItem('CLASS').then((value) => set_Class(value));
      AsyncStorage.getItem('IMAGE').then((value) => {
        set_IMAGE(value)
        console.log("Profile ImgPath : ", value);
      });
    
      AsyncStorage.getItem('SERVERURL').then(async (value) => {set_BaseURL(value)

      if(Rol == "Student" || Rol == "student" || Rol == "STUDENT" || 
          Role == "Student" || Role == "student" || Role == "STUDENT"){

        try{
          let respons1 = await fetch(config.Url+'getStudentProfile', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
            body: JSON.stringify({student_id: sid})
          })
  
          let responsJson = await respons1.json();

          set_data(responsJson);

          console.log("Student, data : ", responsJson);
                  reset_isLoading(false);
        }catch(err){
          console.error("Error-1 : ",err);
        }
      }else{
        try{
          let respons1 = await fetch(config.BaseUrl+'api/auth/teacherlogin', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
            body: JSON.stringify({email: user, password: paswrd})
          })
  
          let responsJson = await respons1.json();

          set_data(responsJson);
          reset_isLoading(false);
          console.log("Staff data : ", responsJson);
          console.log("Staff data : ", responsJson.date_of_joining);
        }catch(err){
          console.error("Error-1 : ",err);
        }
  
      }
    });
    }
    React.useEffect(() => {
      AsyncData();
      setTimeout(()=>{
        FetchPersonal()
      },2000);
    }, []);

  const renderScene = SceneMap({
        first: PersonalInside,
        second: ParentInside,
        //third: ProfileOther,
      });

      const layout = useWindowDimensions();

      const [index, setIndex] = React.useState(0);
  
      const [routes] = React.useState([
        { key: 'first', title: 'PERSONAL' },
        { key: 'second', title: 'PARENTS' },
        //{ key: 'third', title: 'OTHER' },
      ]);

  
if(Rol == "Student" || Rol == "student" || Rol == "STUDENT"){
  return (
    <View style={styles.Mcontainer}>
    {
        isLoading ? (
            <ActivityIndicator/>
        ):(
        <View>
          {
        // <View style={{width: DEVICEWIDTH, height: DEVICEHEIGHT * 0.063, backgroundColor: "#FFFFFF",top: "0%", 
        //                 justifyContent: "flex-start", alignItems: "center",padding: 10, flexDirection: "row"}}>
        //     <AntDesign name="arrowleft" size={35} color="#000000" onPress={() => navigation.goBack()}/>
        //     <Text style={{marginLeft: 10, fontSize: 21, fontWeight: "bold",}}>Profile</Text>
        // </View>
        }
        <View style={styles.SContainer}>
            <View style={styles.MCardView}>
                <View style={{padding: 10, alignItems: "center"}}>
                    <View style={styles.Row1}>
                        <View style={styles.Column1}>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>
                                {DataS.student_result.firstname} {DataS.student_result.lastname}</Text>
                            <View style={styles.Row1}>
                                <Text style={{width: DEVICEWIDTH * 0.18}}>Class</Text>
                                <Text style={{width: DEVICEWIDTH * 0.035}}>:</Text>
                                <Text>{DataS.student_result.class} | Secton : {DataS.student_result.section}</Text>
                            </View>
                            <View style={styles.Row1}>
                                <Text style={{width: DEVICEWIDTH * 0.18}}>Adm. No.</Text>
                                <Text style={{width: DEVICEWIDTH * 0.035}}>:</Text>
                                <Text>{DataS.student_result.admission_no}</Text>
                            </View>
                            <View style={styles.Row1}>
                                <Text style={{width: DEVICEWIDTH * 0.18}}>Roll No.</Text>
                                <Text style={{width: DEVICEWIDTH * 0.035}}>:</Text>
                                <Text>{DataS.student_result.roll_no}</Text>
                            </View>
                        </View>
                            <View style={{width: DEVICEWIDTH * 0.27, flexDirection: "column", alignItems: "center"}}>
                              {
                                IMAGE == "null" ? (
                                  <Image style={{width: 120, height: 150, borderRadius: 20,}}
                                        source={require('../assets/Login.png')}/>
                                ) : (
                                  <Image source={{uri: IMAGE}} style={{width: 120, height: 150, borderRadius: 20,}}/>
                                )
                              }
                            </View>
                    </View>
                </View>
            </View>
        </View>

          <View style={styles.CardView2}>
              <TabView
                  navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex}
                  initialLayout={{ width: layout.width }} style={{borderTopLeftRadius: 20, borderTopRightRadius: 20}}
              />
          </View>
        </View>
        )
    }
    </View>
  );
  }else{      //Teacher
    return (
      <View style={styles.Mcontainer}>
        <View style={[styles.SContainer, {top: "0%"}]}>
            <View style={styles.MCardView}>
                <View style={{padding: 10, alignItems: "center"}}>
                    <View style={styles.Row1}>
                        <View style={styles.Column1}>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>
                                {NAME}</Text>
                            <View style={styles.Row1}>
                                <Text style={{width: DEVICEWIDTH * 0.25}}>Father</Text>
                                <Text style={{width: DEVICEWIDTH * 0.035}}>:</Text>
                                <Text>{DataS.father_name}</Text>
                            </View>
                            <View style={styles.Row1}>
                                <Text style={{width: DEVICEWIDTH * 0.25}}>Designation</Text>
                                <Text style={{width: DEVICEWIDTH * 0.035}}>:</Text>
                                <Text>{Class}</Text>
                            </View>
                            <View style={styles.Row1}>
                                <Text style={{width: DEVICEWIDTH * 0.25}}>Joining Date</Text>
                                <Text style={{width: DEVICEWIDTH * 0.035}}>:</Text>
                                <Text>{DataS.date_of_joining}</Text>
                            </View>
                            <View style={styles.Row1}>
                                <Text style={{width: DEVICEWIDTH * 0.25}}>Employee id</Text>
                                <Text style={{width: DEVICEWIDTH * 0.035}}>:</Text>
                                <Text>{ID}</Text>
                            </View>
                            <View style={styles.Row1}>
                                <Text style={{width: DEVICEWIDTH * 0.25}}>Gender</Text>
                                <Text style={{width: DEVICEWIDTH * 0.035}}>:</Text>
                                <Text>{DataS.gender}</Text>
                            </View>
                            <View style={styles.Row1}>
                                <Text style={{width: DEVICEWIDTH * 0.25}}>Contact No.</Text>
                                <Text style={{width: DEVICEWIDTH * 0.035}}>:</Text>
                                <Text>{DataS.contact_no}</Text>
                            </View>
                            <View style={styles.Row1}>
                                <Text style={{width: DEVICEWIDTH * 0.285}}></Text>
                                <Text>{DataS.emergency_contact_no}</Text>
                            </View>
                            <View style={styles.Row1}>
                                <Text style={{width: DEVICEWIDTH * 0.25}}>Experience</Text>
                                <Text style={{width: DEVICEWIDTH * 0.035}}>:</Text>
                                <Text>{DataS.work_exp}</Text>
                            </View>
                            <View style={styles.Row1}>
                                <Text style={{width: DEVICEWIDTH * 0.25}}>Address</Text>
                                <Text style={{width: DEVICEWIDTH * 0.035}}>:</Text>
                                <Text>{DataS.local_address}</Text>
                            </View>
                            <View style={styles.Row1}>
                                <Text style={{width: DEVICEWIDTH * 0.25}}>E-mail</Text>
                                <Text style={{width: DEVICEWIDTH * 0.035}}>:</Text>
                                <Text>{DataS.email}</Text>
                            </View>
                            
                        </View>
                            <View style={{width: DEVICEWIDTH * 0.27, alignItems: "center"}}>
                              {
                                IMAGE == "null" ? (
                                  <Image style={{width: 120, height: 150, borderRadius: 20,}}
                                        source={require('../assets/Login.png')}/>
                                ) : (
                                  <Image source={{uri: IMAGE}} style={{width: 120, height: 150, borderRadius: 20,}}/>
                                )
                              }
                            </View>
                    </View>
                </View>
            </View>
        </View>
      {
        isLoading ? (
            <ActivityIndicator/>
        ):(
          <View style={[styles.CardView3, {top: "0%",}]}>
              <View style={{width: "100%", height: DEVICEHEIGHT * 0.05, backgroundColor: "#BAFAFF", borderTopLeftRadius: 15, 
                              borderTopRightRadius: 15, flexDirection: "row", alignItems: "center"}}>
                  <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold",
                                width: DEVICEWIDTH * 0.76}}>Bank Detail</Text>
              </View>
              <View style={{flexDirection: "column", justifyContent: "center", marginLeft: 10}}>
                <View style={styles.Row1}>
                    <Text style={{width: DEVICEWIDTH * 0.32, fontSize: 17}}>Bank Name</Text>
                    <Text style={{width: DEVICEWIDTH * 0.035, fontSize: 17}}>:</Text>
                    <Text style={{fontSize: 17}}>{DataS.bank_name}</Text>
                </View>
                <View style={styles.Row1}>
                    <Text style={{width: DEVICEWIDTH * 0.32, fontSize: 17}}>Branch Name</Text>
                    <Text style={{width: DEVICEWIDTH * 0.035, fontSize: 17}}>:</Text>
                    <Text style={{fontSize: 17}}>{DataS.bank_branch}</Text>
                </View>
                <View style={styles.Row1}>
                    <Text style={{width: DEVICEWIDTH * 0.32, fontSize: 17}}>Account No.</Text>
                    <Text style={{width: DEVICEWIDTH * 0.035, fontSize: 17}}>:</Text>
                    <Text style={{fontSize: 17}}>{DataS.bank_account_no}</Text>
                </View>
                <View style={styles.Row1}>
                    <Text style={{width: DEVICEWIDTH * 0.32, fontSize: 17}}>Branch Name</Text>
                    <Text style={{width: DEVICEWIDTH * 0.035, fontSize: 17}}>:</Text>
                    <Text style={{fontSize: 17}}>{DataS.bank_branch}</Text>
                </View>
                <View style={[styles.Row1, {marginBottom: 15}]}>
                    <Text style={{width: DEVICEWIDTH * 0.32, fontSize: 17}}>IFSC Code</Text>
                    <Text style={{width: DEVICEWIDTH * 0.035, fontSize: 17}}>:</Text>
                    <Text style={{fontSize: 17}}>{DataS.ifsc_code}</Text>
                </View>

              </View>

          </View>
        )
        }
      </View>
    );
  }
//-----------------------------------------------------
function PersonalInside(){
  //if(DataS.length>0){
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.PColumn1}>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.04}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Admission Date</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>: {DataS.student_result.admission_date}</Text>
            </View>
            <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.04,
                           alignItems: "center", backgroundColor: "#F8F7D8"}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Date of Birth</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>: {DataS.student_result.dob}</Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.04}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Gender</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>: {DataS.student_result.gender}</Text>
            </View>
            <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.04,
                           alignItems: "center", backgroundColor: "#F8F7D8"}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Category</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>: {DataS.student_result.cast}</Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.06}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Mobile No.</Text>
              <Text style={{width: DEVICEWIDTH * 0.5, fontSize: 16}}>: {DataS.student_result.mobileno}</Text>
            </View>
            <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.04,
                           alignItems: "center", backgroundColor: "#F8F7D8"}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Caste</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>:</Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.04}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Religion</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>: {DataS.student_result.religion}</Text>
            </View>
            <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.07,
                           alignItems: "center", backgroundColor: "#F8F7D8"}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    E-mail ID</Text>
              <Text style={{width: DEVICEWIDTH * 0.55, fontSize: 16}}>: {DataS.student_result.student_email}</Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.085}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Current Address</Text>
              <Text style={{width: DEVICEWIDTH * 0.55, fontSize: 16}}>{DataS.student_result.current_address}</Text>
            </View>
            <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.085,
                           alignItems: "center", backgroundColor: "#F8F7D8"}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Permanent Address</Text>
              <Text style={{width: DEVICEWIDTH * 0.55, fontSize: 16}}>{DataS.student_result.permanent_address}</Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.04}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Blood Group</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>: {DataS.student_result.blood_group}</Text>
            </View>
            <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.04,
                           alignItems: "center", backgroundColor: "#F8F7D8"}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Height</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>: {DataS.student_result.height}</Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.04}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Weight</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>: {DataS.student_result.weight} kgs.</Text>
            </View>
            <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.04,
                           alignItems: "center", backgroundColor: "#F8F7D8"}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Medical History</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>: None</Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.04}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Remark/s</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>: None</Text>
            </View>
          </View>
          </ScrollView>
      );
    //}
}
//-----------------------------------------------------
function ParentInside(){
  //if(DataS.length>0){
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.PColumn1}>

          <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.04,
                            backgroundColor: "#F8F7D8"}}>
              <Text style={{width: DEVICEWIDTH, fontSize: 18, fontWeight: "bold",
                             marginLeft: DEVICEWIDTH * 0.04}}>
                    FATHER</Text>
            </View>
            <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.03,
                           alignItems: "center"}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Name</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>: {DataS.student_result.father_name}</Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.03}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Mobile No.</Text>
              <Text style={{width: DEVICEWIDTH * 0.5, fontSize: 16}}>: {DataS.student_result.father_phone}</Text>
            </View>
            <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.055,
                           alignItems: "center"}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    E-mail ID</Text>
              <Text style={{width: DEVICEWIDTH * 0.55, fontSize: 16}}>: {DataS.student_result.guardian_email}</Text>
            </View>
            <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.03,
                           alignItems: "center"}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Occupation</Text>
              <Text style={{width: DEVICEWIDTH * 0.5, fontSize: 16}}>: {DataS.student_result.father_occupation}</Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.085}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Current Address</Text>
              <Text style={{width: DEVICEWIDTH * 0.55, fontSize: 16}}>{DataS.student_result.current_address}</Text>
            </View>
            <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.085,
                           alignItems: "center"}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Permanent Address</Text>
              <Text style={{width: DEVICEWIDTH * 0.55, fontSize: 16}}>{DataS.student_result.permanent_address}</Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.03}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Blood Group</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>: O+</Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.04}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Remark/s</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>: None</Text>
            </View>
            </View>
            <View style={styles.PColumn1}>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.04,
                            backgroundColor: "#F8F7D8"}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 18, fontWeight: "bold",
                             marginLeft: DEVICEWIDTH * 0.04}}>
                    MOTHER</Text>
            </View>
            <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.03,
                           alignItems: "center"}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Name</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>: {DataS.student_result.mother_name}</Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.03}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Mobile No.</Text>
              <Text style={{width: DEVICEWIDTH * 0.5, fontSize: 16}}>: {DataS.student_result.mother_phone}</Text>
            </View>
            <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.055,
                           alignItems: "center"}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    E-mail ID</Text>
              <Text style={{width: DEVICEWIDTH * 0.55, fontSize: 16}}>: ssunilkulhadiya@gmail.com</Text>
            </View>
            <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.03,
                           alignItems: "center"}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Occupation</Text>
              <Text style={{width: DEVICEWIDTH * 0.5, fontSize: 16}}>: {DataS.student_result.mother_occupation}</Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.085}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Current Address</Text>
              <Text style={{width: DEVICEWIDTH * 0.55, fontSize: 16}}>{DataS.student_result.current_address}</Text>
            </View>
            <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.085,
                           alignItems: "center"}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Permanent Address</Text>
              <Text style={{width: DEVICEWIDTH * 0.55, fontSize: 16}}>{DataS.student_result.permanent_address}</Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.03}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Blood Group</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>: O+</Text>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", height: DEVICEHEIGHT * 0.04}}>
              <Text style={{width: DEVICEWIDTH * 0.4, fontSize: 16, marginLeft: DEVICEWIDTH * 0.04}}>
                    Remark/s</Text>
              <Text style={{width: DEVICEWIDTH * 0.6, fontSize: 16}}>: None</Text>
            </View>


          </View>
          </ScrollView>
      );
    //}
}

};

export default ProfileHome;

const styles = StyleSheet.create({
    Mcontainer: {
        width: DEVICEWIDTH,
        height: DEVICEHEIGHT,
    },
    SContainer: {
        marginTop: DEVICEHEIGHT * 0.13
    },
    SContainer2: {
        marginTop: DEVICEHEIGHT * 0.01,
    },
    MCardView: {
        left: "40%",        
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        width: DEVICEWIDTH,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginBottom: 20,
    },
    CardView2: {
      left: "40%",        
      elevation: 5,
      transform: [{ translateX: -(DEVICEWIDTH * 0.4) }, 
                  { translateY: -90 }],
      width: DEVICEWIDTH,
      height: "62%",
      backgroundColor: "#FFFFFF",
      marginBottom: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    CardView3: {
        left: "40%",        
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        width: DEVICEWIDTH,
        backgroundColor: "#FFFFFF",
        marginBottom: 20,
        borderRadius: 20,
    },
    Row1: {
        flexDirection: "row",
    },
    Column1: {
        flexDirection: "column",
        width: DEVICEWIDTH * 0.6,
    },
    PColumn1: {
      flexDirection: "column",
      width: DEVICEWIDTH,
      marginTop: 10,
      marginBottom: 10,
    },
    viewPager: {
        flex: 1,
      },
      page: {
        justifyContent: 'center',
        alignItems: 'center',
      },
});