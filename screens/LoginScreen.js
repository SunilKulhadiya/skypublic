import React from "react";
import { View, Text, StyleSheet, Dimensions, TextInput, Image, ImageBackground, BackHandler,
            SafeAreaView, StatusBar, TouchableOpacity, Alert, ActivityIndicator} from "react-native";
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';   

import config from "./app_config";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

const LoginScreen = ({navigation}) => {

  const newdate = new Date();

  const [SelectStudent, set_Student] = React.useState(true);
  const [SelectParents, set_Parents] = React.useState(false);
  const [SelectStaff, set_Staff] = React.useState(false);

  const [UserID, set_UserID] = React.useState("kajal@gmail.com");     //"std29"  "kajal@gmail.com"
  const [UserPass, setUserPass] = React.useState("12345678");   //"8x6v53"  12345678
  const [isLoginProgress, set_isLoginProgress] = React.useState(false);
  const [isPasswordSecure, setisPasswordSecure] = React.useState(true);
  const [isChecked, setChecked] = React.useState(true);
  
  const [LoginPermission, set_LoginPermission] = React.useState(true);

  const [TokenFor, setTokenFor] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  const [expoPushToken, setExpoPushToken] = React.useState('');
  //-----------------------------------------------
  const FetchLoginToken = async () =>{

    if(UserID == "" || UserPass == ""){
      Alert.alert("Please enter user id and password");
    }else{
      set_isLoginProgress(true);
      let respons1="";
    if(SelectStudent){
      
      try{
        respons1 = await fetch(config.BaseUrl+'api/auth/login', {
          method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
          body: JSON.stringify({username: UserID, password: UserPass})
        })

        respons1 = await respons1.json();

        console.log("Login responsJson, student : ", respons1);

        if(respons1.message == "Invalid Username orcheck_auth_client Password"){
          set_LoginPermission(false);
          set_isLoginProgress(false);
          Alert.alert("User ID or Password is invalid");
        }else{
          let secID="1";
          if(respons1.record.section == "B")
              secID="2";
          if(respons1.record.section == "C")
              secID="3";
          if(respons1.record.section == "D")
              secID="4";
          if(respons1.record.section == "E")
              secID="5";
          setTimeout(async () =>{
            await AsyncStorage.setItem('SERVERURL', config.BaseUrl);
            await AsyncStorage.setItem('ID', respons1.id);
            await AsyncStorage.setItem('StdID', respons1.record.student_id);
            await AsyncStorage.setItem('TOKEN', respons1.token);
            await AsyncStorage.setItem('ROLE', respons1.role);
            await AsyncStorage.setItem('NAME', respons1.record.username);
            await AsyncStorage.setItem('CLASS', respons1.record.class);
            await AsyncStorage.setItem('CLASS_ID', respons1.record.class_id);
            await AsyncStorage.setItem('SESSION_ID', respons1.record.session_id);
            await AsyncStorage.setItem('SECTION', respons1.record.section);
            await AsyncStorage.setItem('SECTION_ID', secID);

            if(respons1.record.image == null || respons1.record.image == "null" ||
              respons1.record.image == ""){
              await AsyncStorage.setItem('IMAGE', "null");
            }else{
              console.log("Login Img : ", respons1.record.image);
              await AsyncStorage.setItem('IMAGE', config.BaseUrl+""+respons1.record.image);
            }
              
            navigation.navigate("Dashboard", {DOB: ""});
            set_isLoginProgress(false);
          }, 100);
        }

      }catch(err){
        Alert.alert("Pleas check user id or password");
          console.error("Error-1 : ",err);
      }
    }
    if(SelectStaff){
      console.log("Login Staff : ", SelectStaff);
      try{
        respons1 = await fetch(config.BaseUrl+'api/auth/teacherlogin', {
          method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
          body: JSON.stringify({email: UserID, password: UserPass})
        });

        respons1 = await respons1.json();

        console.log("Login responsJson staff : ", (respons1));
        // var keys = Object.keys(respons1.roles);
        // console.log("Login Role : ", (keys[0]));

        console.log("Login responsJson id : ", respons1.id);
        console.log("Login responsJson employee_id : ", respons1.employee_id);


        if(respons1 == "false" || respons1 == false){
          set_LoginPermission(false);
          set_isLoginProgress(false);
          Alert.alert("User ID or Password is invalid");
        }else{
          setTimeout(async () =>{
          await AsyncStorage.setItem('SERVERURL', config.BaseUrl);
          await AsyncStorage.setItem('email', UserID);
          await AsyncStorage.setItem('password', UserPass);

          await AsyncStorage.setItem('StdID', "null");
          await AsyncStorage.setItem('TOKEN', "null");

          await AsyncStorage.setItem('ID', respons1.employee_id)
          await AsyncStorage.setItem('ROLE', "Staff")
          await AsyncStorage.setItem('ROLE_ID', respons1.roles.role_id);
          console.log("Role id : ", respons1.roles.role_id);
          await AsyncStorage.setItem('DOB', respons1.dob);
          await AsyncStorage.setItem('NAME', respons1.name+" "+respons1.surname)
          await AsyncStorage.setItem('SECTION', "none");
          if(respons1.designation == 1)
            await AsyncStorage.setItem('CLASS', "Admin");
          if(respons1.designation == 2)
            await AsyncStorage.setItem('CLASS', "Principal");
          if(respons1.designation == 3)
            await AsyncStorage.setItem('CLASS', "Management");
          if(respons1.designation == 4)
            await AsyncStorage.setItem('CLASS', "Examiner");
          if(respons1.designation == 6)
            await AsyncStorage.setItem('CLASS', "Director");
          if(respons1.designation == 7)
            await AsyncStorage.setItem('CLASS', "Librarien");
          if(respons1.designation == 8)
            await AsyncStorage.setItem('CLASS', "Cashier");
          if(respons1.designation == 9)
            await AsyncStorage.setItem('CLASS', "Receptionist");
          if(respons1.designation == 10)
            await AsyncStorage.setItem('CLASS', "Driver");
          if(respons1.designation == 11)
            await AsyncStorage.setItem('CLASS', "Gardner");
          if(respons1.designation == 12)
            await AsyncStorage.setItem('CLASS', "Teacher");

            if(respons1.image == null || respons1.image == "" || respons1.image == "null" ||
                    respons1.image == "none"){
              await AsyncStorage.setItem('IMAGE', "null");
            }else{
              await AsyncStorage.setItem('IMAGE', config.BaseUrl+"uploads/staff_images/"+respons1.image);
            }
            navigation.navigate("Dashboard", {DOB: respons1.dob});
            set_isLoginProgress(false);
          }, 100)
        }

      }catch(err){
          console.error("Error-2 : ",err);
      }
    }
  }
  }
  
  // async function registerForPushNotificationsAsync() {
  //   let token, Dtoken;
  
  //   if (Platform.OS === 'android') {
  //     await Notifications.setNotificationChannelAsync('default', {
  //       name: 'default',
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: '#FF231F7C',
  //     });
  //   }
  
  //   if (Device.isDevice) {
  //     const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;

  //     //const subscription = Notifications.addPushTokenListener(registerDevicePushTokenAsync);
  //     console.log("finalStatus : ",finalStatus);
  //     //console.log("subscription : ",subscription);
  //     if (existingStatus !== 'granted') {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     console.log("finalStatus-1 : ",finalStatus);
  //     if (finalStatus !== 'granted') {
  //       //alert('Failed to get push token for push notification!');
  //       return;
  //     }
  //     try{
  //       token = (await Notifications.getExpoPushTokenAsync({projectId: "a60854c4-aa22-4a57-9d08-be2e68c588b1"})).data;
  //       console.log("Expo Token : ",token);
  //       //Alert.alert("Expo Token : "+token);

  //       Dtoken = (await Notifications.getDevicePushTokenAsync()).data;

  //         console.log("Device Token : ", Dtoken);
    
  //     }catch(e){
  //       Alert.alert("Unable to get Expo Token, Error : "+JSON.stringify(e));
  //     }
  //     setExpoPushToken(token);
  //   } else {
  //     alert('Must use physical device for Push Notifications');
  //   }
  
  //   return token;
  // }

  // function PushNotification(){
  //   fetch('https://exp.host/--/api/v2/push/send', {
  //        method: 'POST', 
  //        headers: {
  //              Accept: 'application/json',  
  //             'Content-Type': 'application/json', 
  //             'accept-encoding': 'gzip, deflate',   
  //             'host': 'exp.host'      
  //         }, 
  //       body: JSON.stringify({                 
  //             to: 'ExponentPushToken['+TokenFor+']',
  //             title: 'New Notification by SKAND',                  
  //             body: 'The notification worked!',             
  //             priority: "high",            
  //             sound:"default",              
  //             channelId:"default",   
  //                 }),        
  //     }).then((response) => response.json())   
  //              .then((responseJson) => {

  //               console.log("responseJson : ",responseJson);

  //                })
  //                     .catch((error) => { console.log(error) });
  // }

  // React.useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //     console.log("notification : ",notification);
  //   });
  //   console.log("notificationListener.current : ",notificationListener.current);

  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log("Response : ",response);
  //   });

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  async function ChooseStudent(){
    set_Student(true);
    set_Parents(false);
    set_Staff(false);
    await AsyncStorage.setItem('ROLE', "Student");
  }
  async function ChooseParents(){
    set_Student(false);
    set_Parents(true);
    set_Staff(false);
    await AsyncStorage.setItem('ROLE', "Parents");
  }
  async function ChooseStaff(){
    set_Student(false);
    set_Parents(false);
    set_Staff(true);
    await AsyncStorage.setItem('ROLE', "Staff");
  }

return (
    <View style={styles.container}>
    <StatusBar barStyle={"dark-content"} backgroundColor="#FFFFFF" />
      <ImageBackground source={require("../assets/skyImg1.jpg")} style={styles.Imgcontainer}>
        <View style={{bottom: "25%", position: "absolute"}}>
          {/* <Text style={{fontSize: 20, textAlign: "center"}}>This is pirated version and vailid only for today.</Text> */}
              <View style={{width: DEVICEWIDTH/3, height: DEVICEWIDTH/3, backgroundColor: "#FFFFFF",
                    marginLeft: DEVICEWIDTH/3, marginTop: DEVICEHEIGHT / 12, alignItems: "center",
                    justifyContent: "center", borderRadius: 70, borderColor: "#0D047B", borderWidth: 2,
                    }}>
              <Image source={require('../assets/Login.png')} style={{width: DEVICEWIDTH/5, height: DEVICEWIDTH/5}} />
              </View>

              <View style={{marginTop: 20, marginLeft: DEVICEWIDTH * 0.1,}}>
                <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.05, marginBottom: 20,
                            backgroundColor: "#FFFFFF", width: DEVICEWIDTH * 0.795, borderRadius: 15}}>
                  <TouchableOpacity onPress={()=> ChooseStudent()}>
                    <View style={{backgroundColor: SelectStudent ? "#FF9F0B" : "#FFFFFF", 
                                borderRadius: 15, width: DEVICEWIDTH * 0.265,
                                height: DEVICEHEIGHT * 0.05, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: SelectStudent ? "#FFFFFF" : "#000000", 
                                      fontWeight: SelectStudent ? "bold" : "normal"}}>
                            Student</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=> ChooseParents()}>
                    <View style={{backgroundColor: SelectParents ? "#FF9F0B" : "#FFFFFF", borderRadius: 15, 
                                width: DEVICEWIDTH * 0.265, height: DEVICEHEIGHT * 0.05, 
                                justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: SelectParents ? "#FFFFFF" : "#000000", 
                                      fontWeight: SelectParents ? "bold" : "normal"}}>Parents</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=> ChooseStaff()}>
                    <View style={{backgroundColor: SelectStaff ? "#FF9F0B" : "#FFFFFF", borderRadius: 15, 
                                width: DEVICEWIDTH * 0.265, height: DEVICEHEIGHT * 0.05, 
                                justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: SelectStaff ? "#FFFFFF" : "#000000",
                                      fontWeight: SelectStaff ? "bold" : "normal"}}>Staff</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.DispColImg}>
                <Text style={styles.LoginStyle}>Login</Text>
              </View>
              <View style={{alignItems: "center", marginLeft: DEVICEWIDTH * 0.1}}>
                  <View style={styles.DispRow}>
                    <View style={styles.IconSpace}>
                      <FontAwesome name="mobile-phone" size={30} color="#000000" />
                    </View>
                    <TextInput placeholder="User ID" onChangeText={(text) => set_UserID(text)}
                        style={{width: "88%", backgroundColor: "#FFFFFF"}}/>
                  </View>
                  <View style={styles.DispRow}>
                    <View style={styles.IconSpace}>
                      <MaterialIcons name="lock-outline" size={24} color="#000000" />
                    </View>
                    <View style={styles.PasswWidth}>
                      <TextInput placeholder="Password" onChangeText={(text) => setUserPass(text)}
                        secureTextEntry={isPasswordSecure} style={{width: "88%", backgroundColor: "#FFFFFF"}} />
                    </View>
                    <View style={styles.AlignEye}>
                      <FontAwesome name={isPasswordSecure ? "eye-slash" : "eye"} size={24} color="#000000"
                          onPress={() => {isPasswordSecure ? setisPasswordSecure(false) : setisPasswordSecure(true)}}/>
                    </View>
                  </View>

                  <View style={styles.DispRowButt}>
                  {
                    isLoginProgress ? (
                      <ActivityIndicator/>
                    ):(
                      <TouchableOpacity onPress={() => FetchLoginToken()}>
                        <Text style={styles.BottnL}>Login</Text>
                      </TouchableOpacity>
                    )
                  }
                  </View>
                </View>
              </View>
      </ImageBackground>
      </View>

  );

}
//                      <Text style={styles.BottnR} onPress={() => navigation.navigate('RegisterUser')}>Sign up</Text>

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      flex: 1,
    },
    Imgcontainer: {
      width: "100%",
      height: "100%",
    },
    DispCol: {
      flexDirection: 'column',
      marginTop: DEVICEHEIGHT * 0.07,
      width: DEVICEWIDTH,
      height: DEVICEHEIGHT/1.47,
      backgroundColor: "#FEED53",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,      
    },
    DispColImg: {
      justifyContent: "center",
      alignItems: "flex-start",
      textAlign: "center",
      marginLeft: DEVICEWIDTH * 0.1,
      marginTop: DEVICEHEIGHT * 0.0,
    },
    labelText: {
      top: 0,
      marginLeft: 0,
    },
    DispRow: {
      flexDirection: 'row',
      borderColor: '#000000',
      backgroundColor: "#FFFFFF",
      borderWidth: 2,
      borderRadius: 8,
      padding: 5,
      marginBottom: 10,
      width: DEVICEWIDTH*0.8,
    },
    ImgStyle: {
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      width: DEVICEWIDTH * 0.45,
      height: DEVICEWIDTH * 0.45,
    },
    AlignEye: {
      justifyContent: "flex-end",
      alignItems: "flex-end",
      textAlign: "right",
      marginLeft: DEVICEWIDTH * 0.1,
    },
    LoginStyle: {
      fontSize: 20,
      marginBottom: 20,
      fontWeight: "600",
    },
    IconSpace: {
      justifyContent: "flex-start",
      marginRight: 25,
      width: DEVICEWIDTH * 0.052
    },
    DispRowButt: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: '#FF9F0B',
      marginTop: 40,
      borderRadius: 20,
      width: DEVICEWIDTH * 0.8,
      height: DEVICEHEIGHT * 0.05,
    },
    PasswWidth: {
      width: DEVICEWIDTH*0.45,
    },
    ForgetPassword: {
      color: '#3B0FC7',
    },
    BottnL: {
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      color: 'white',
      fontSize: 20,
      width: DEVICEWIDTH * 0.8,
      height: DEVICEHEIGHT * 0.05,
      marginTop: 7,
    },
    BottnR: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: 'white',
        backgroundColor: '#3B0FC7',
        padding: 5,
        fontSize: 20,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
    },
    LoadingIndicator:{
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      marginBottom: 50,
    },
    RowFCheck: {
      flexDirection: 'row',
    },
    RowSignupText: {
      flexDirection: 'row',
      textAlign: "right",
      marginTop: DEVICEHEIGHT * 0.01,
    },
    SignupText: {
      color: '#0000FF',
    },
    AlignForget: {
      justifyContent: "flex-end",
      alignItems: "flex-end",
      textAlign: "right",
      marginLeft: DEVICEWIDTH * 0.14,
    },
    AlignCheckBox: {
      justifyContent: "flex-start",
      alignItems: "flex-start",
      textAlign: "left",
      flexDirection: 'row',
    },
  
  });