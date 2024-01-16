import React from "react";
import { View, Text, StyleSheet, Dimensions, TextInput, Image, ImageBackground,
            SafeAreaView, StatusBar, TouchableOpacity} from "react-native";
import Checkbox from "expo-checkbox";       //npx expo install expo-checkbox
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';    //npx expo install expo-notifications
import AsyncStorage from '@react-native-async-storage/async-storage';   
      //npx expo install @react-native-async-storage/async-storage

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

const LoginScreen = ({navigation}) => {

  const [SelectStudent, set_Student] = React.useState(true);
  const [SelectParents, set_Parents] = React.useState(false);
  const [SelectStaff, set_Staff] = React.useState(false);

  const [UserID, set_UserID] = React.useState("std29");
  const [UserPass, setUserPass] = React.useState("8x6v53");
  const [LoginHome, setHL] = React.useState(false);
  const [isPasswordSecure, setisPasswordSecure] = React.useState(true);
  const [isChecked, setChecked] = React.useState(true);
  
  const [TokenFor, setTokenFor] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  const [expoPushToken, setExpoPushToken] = React.useState('');


  const FetchLoginToken = async () =>{
    try{
      let respons1 = await fetch('https://amritaaz.com/school/api/auth/login', {
        method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
        body: JSON.stringify({username: UserID, password: UserPass})
      })

      let responsJson = await respons1.json();

      console.log("Login responsJson : ", (responsJson));

      await AsyncStorage.setItem('ID', responsJson.id)
      await AsyncStorage.setItem('TOKEN', responsJson.token)
      await AsyncStorage.setItem('ROLE', responsJson.role)
      await AsyncStorage.setItem('MID', responsJson.record.student_id)
      await AsyncStorage.setItem('NAME', responsJson.record.username)
      await AsyncStorage.setItem('CLASS', responsJson.record.class)
      await AsyncStorage.setItem('SECTION', responsJson.record.section)

      //console.log("Login Async : ", JSON.stringify(responsJson));

    }catch(err){
        console.error("Error-1 : ",err);
    }
  }

  const LoginToken = async () =>{

    FetchLoginToken();
    
    //reset_isLoading(false);

    navigation.navigate('Dashboard');
  }
  
  async function registerForPushNotificationsAsync() {
    let token, Dtoken;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      //const subscription = Notifications.addPushTokenListener(registerDevicePushTokenAsync);
      console.log("finalStatus : ",finalStatus);
      //console.log("subscription : ",subscription);
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      console.log("finalStatus-1 : ",finalStatus);
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      try{
        token = (await Notifications.getExpoPushTokenAsync({projectId: "a60854c4-aa22-4a57-9d08-be2e68c588b1"})).data;
        console.log("Expo Token : ",token);
        //Alert.alert("Expo Token : "+token);

        Dtoken = (await Notifications.getDevicePushTokenAsync()).data;

          console.log("Device Token : ", Dtoken);
    
      }catch(e){
        Alert.alert("Unable to get Expo Token, Error : "+JSON.stringify(e));
      }
      setExpoPushToken(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }

  function PushNotification(){
    fetch('https://exp.host/--/api/v2/push/send', {
         method: 'POST', 
         headers: {
               Accept: 'application/json',  
              'Content-Type': 'application/json', 
              'accept-encoding': 'gzip, deflate',   
              'host': 'exp.host'      
          }, 
        body: JSON.stringify({                 
              to: 'ExponentPushToken['+TokenFor+']',
              title: 'New Notification by SKAND',                  
              body: 'The notification worked!',             
              priority: "high",            
              sound:"default",              
              channelId:"default",   
                  }),        
      }).then((response) => response.json())   
               .then((responseJson) => {

                console.log("responseJson : ",responseJson);

                 })
                      .catch((error) => { console.log(error) });
  }

  React.useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log("notification : ",notification);
    });
    console.log("notificationListener.current : ",notificationListener.current);

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Response : ",response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
    <SafeAreaView>
    <StatusBar barStyle={"dark-content"} backgroundColor="#ecf0f1" />
      <View style={styles.container}>
        {
          LoginHome ? (
            //----------------------
              <NavigationContainer>
                <BottomTabNavigator/>
              </NavigationContainer>  
                  //------------------------
          ) : (
            <View>
              <View style={{width: DEVICEWIDTH/3, height: DEVICEWIDTH/3, backgroundColor: "#FFFFFF",
                    marginLeft: DEVICEWIDTH/3, marginTop: DEVICEHEIGHT / 12, alignItems: "center",
                    justifyContent: "center", borderRadius: 70, borderColor: "#0D047B", borderWidth: 2}}>
              <Image source={require('../assets/Login.png')} style={{width: DEVICEWIDTH/5, height: DEVICEWIDTH/5}} />
              </View>

            <View style={styles.DispCol}>
              <View style={{marginTop: 20, marginLeft: DEVICEWIDTH * 0.1}}>
                <View style={{flexDirection: "row", height: DEVICEHEIGHT * 0.05, marginBottom: 20,
                            backgroundColor: "#DDD9D9", width: DEVICEWIDTH * 0.8, borderRadius: 15}}>
                  <TouchableOpacity onPress={()=> ChooseStudent()}>
                    <View style={{backgroundColor: SelectStudent ? "#0D047B" : "#DDD9D9", 
                                borderRadius: 15, width: DEVICEWIDTH * 0.265,
                                height: DEVICEHEIGHT * 0.05, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: SelectStudent ? "#FFFFFF" : "#000000", 
                                      fontWeight: SelectStudent ? "bold" : "normal"}}>
                            Student</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=> ChooseParents()}>
                    <View style={{backgroundColor: SelectParents ? "#0D047B" : "#DDD9D9", borderRadius: 15, 
                                width: DEVICEWIDTH * 0.265, height: DEVICEHEIGHT * 0.05, 
                                justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: SelectParents ? "#FFFFFF" : "#000000", 
                                      fontWeight: SelectParents ? "bold" : "normal"}}>Parents</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=> ChooseStaff()}>
                    <View style={{backgroundColor: SelectStaff ? "#0D047B" : "#DDD9D9", borderRadius: 15, 
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
              <View style={{alignItems: "center"}}>
                  <View style={styles.DispRow}>
                    <View style={styles.IconSpace}>
                      <FontAwesome name="mobile-phone" size={30} color="#000000" />
                    </View>
                    <TextInput placeholder="User ID" onChangeText={(text) => set_UserID(text)}/>
                  </View>
                  <View style={styles.DispRow}>
                    <View style={styles.IconSpace}>
                      <MaterialIcons name="lock-outline" size={24} color="#000000" />
                    </View>
                    <View style={styles.PasswWidth}>
                      <TextInput placeholder="Password" onChangeText={(text) => setUserPass(text)}
                        secureTextEntry={isPasswordSecure} />
                    </View>
                    <View style={styles.AlignEye}>
                      <FontAwesome name={isPasswordSecure ? "eye-slash" : "eye"} size={24} color="#000000"
                          onPress={() => {isPasswordSecure ? setisPasswordSecure(false) : setisPasswordSecure(true)}}/>
                    </View>
                  </View>
                  <View style={styles.RowFCheck}>
                    <View style={styles.AlignCheckBox}>
                      <Checkbox value={isChecked} onValueChange={setChecked}
                                color={isChecked ? '#4630EB' : undefined} />
                      <Text style={styles.ForgetPassword}> Remember me</Text>
                    </View>
                    <View style={styles.AlignForget}>
                      <Text style={styles.ForgetPassword} 
                      onPress={() => navigation.navigate('ResetPW')}>Forget password ?</Text>
                    </View>
                  </View>
                  <View style={styles.DispRowButt}>
                      <View>
                        <Text style={styles.BottnL} onPress={() => LoginToken()}>Login</Text>
                      </View>
                      
                      <View style={styles.RowSignupText}>
                      <Text>Do not have account | </Text>
                      <Text style={styles.SignupText} onPress={() => componentWillMount()}>
                            sign up</Text>

                      </View>

                  </View>
                </View>
              </View>
              </View>
            )
        }
      </View>
  </SafeAreaView>

  );

}
//                      <Text style={styles.BottnR} onPress={() => navigation.navigate('RegisterUser')}>Sign up</Text>

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      backgroundColor: "#EF870F",
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
      flexDirection: 'column',
      justifyContent: "flex-end",
      alignItems: "center",
      textAlign: "center",
      borderTopRightRadius: 7,
      borderBottomLeftRadius: 7,
      padding: 5,
      marginTop: 40,
      width: DEVICEWIDTH*0.7,
      
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
        backgroundColor: '#0D047B',
        padding: 5,
        fontSize: 20,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderRadius: 8,
        width: DEVICEWIDTH * 0.8,
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