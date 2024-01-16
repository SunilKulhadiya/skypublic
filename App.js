import {React, useRef } from 'react';
import { NavigationContainer, DrawerActions } from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem }
         from '@react-navigation/drawer';     //npm install @babel/core --save
import { MaterialIcons, MaterialCommunityIcons, AntDesign, FontAwesome5,
          Foundation, Ionicons, FontAwesome} from '@expo/vector-icons';
import { Image, Text, View, Dimensions } from "react-native";
import { useFonts } from "expo-font";
//import AppLoading from 'expo-app-loading';
//import * as SplashScreen from 'expo-splash-screen';

// import * as SplashScreen from 'expo-splash-screen';
// import * as Device from 'expo-device';              //npx expo install expo-device
// import AsyncStorage from '@react-native-async-storage/async-storage';   
        //npx expo install @react-native-async-storage/async-storage

import ResetPW from './screens/ForgetPW';
import LoginScreen from './screens/LoginScreen';
import Dashboard from './screens/Dashboard';
import SignUp from './screens/SignUp';
import AboutUs from './screens/AboutUs';
import ProfilehOME from './screens/Profile';
import AboutSchool from './screens/AboutSchool';
import HomeWork from "./screens/HomeWork";
import DailyAssignment from "./screens/DailyAssignment";
import LessonPlan from "./screens/LessonPlan";
import ClassTimeTable from "./screens/ClassTimeTable";
import Std_ClassTT from "./screens/Std_ClassTT";
import Attendance from "./screens/Attendance";
import AttendanceReg from "./screens/AttendanceReg";
//import AttendanceDrawer from "./screens/AttendanceDrawer";
import SyllabusStatus from "./screens/SyllabusStatus";
import Examination from "./screens/Examination";
import AppliedLeave from "./screens/AppliedLeave";
import Library from "./screens/Library";
import Events from "./screens/Events";
import Fees from "./screens/Fees";
import FeesReceive from "./screens/FeesReceive";
import GallerySky from "./screens/GallerySky";
import FeesReceiptDetails from "./screens/FeesReceiptDetails";
import OnlineExam from "./screens/OnlineExam";
import IDCard from "./screens/ID_Card";
import Std_IDCard from "./screens/Std_ID_Card";
import StudHomeWork from "./screens/StudHomeWork";
import AdmitCard from "./screens/Admit_Card";
import StaffAttendanceAdm from "./screens/StaffAttendanceAdm";
import PdfViewer from "./screens/PdfViewer";
import SchoolNews from "./screens/School_News";
import ViewDownload from "./screens/View_Download";
import SocialMedia from "./screens/SocialMedia";
import OpenUrl from "./screens/OpenUrl";
import Complain from "./screens/Complain";
//import GK from "./screens/GK";

//SplashScreen.preventAutoHideAsync();


const App = ({navigation}) => {

  // const [fontsLoaded, fontError] = useFonts({
  //   InterBlack : require('./assets/fonts/Inter-Black.ttf'),
  //   AlgerianBold : require('./assets/fonts/Algerian_R_A.ttf'),
  //   AlgerianRegular : require('./assets/fonts/Algerian-Regular.ttf'),
  //   SourceSansProItalic : require('./assets/fonts/SourceSansPro-Italic.ttf'),
  // });
  // console.log("fontsLoaded : ", fontsLoaded);
  // console.log("fontError : ", fontError);

  Dimensions.addEventListener('change', () => {
    console.log("Events.js, Orientation : ");    
  });

  const Stack = createNativeStackNavigator();
  //const Tab = createBottomTabNavigator();
  const Drawer = createDrawerNavigator();
  // const [expoPushToken, setExpoPushToken] = useState('');
  // const [TokenFor, setTokenFor] = useState('');
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  const responseListener = useRef();

  const screenOptionStyle = {
    headerStyle: {
      backgroundColor: "#9AC4F8",
    },
    headerTintColor: "white",
    headerBackTitle: "black",
  };

    
  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor: "#2E61C6"}}>
        <View style={{justifyContent: "flex-end"}}>
          <AntDesign name="arrowleft" size={35} color="#FFFFFF" 
            onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())} />
          <View style={{height: 120, marginLeft: 10,
                        justifyContent: "flex-start", alignItems: "center", flexDirection: "row"}}>
            <Image source={require('./assets/logoBn.png')} style={{width: 70, height: 70, borderRadius: 50,
                           borderColor: "#FFFFFF", borderWidth: 0}}/>
            <Text style={{marginLeft: 10, color: "#FFFFFF", fontWeight: "bold", fontSize: 14}}>Sky Public Hr. Sec. School</Text>
          </View>
        </View>
        <View style={{backgroundColor: "#FFFFFF"}}>
        <DrawerItemList {...props} />
        {
            /*
            <DrawerItem
              label="Toggle drawer"
              onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}
            />
            */
        }
        </View>
      </DrawerContentScrollView>
    );
  }
  
  const DrawerNavigator = ({navigation}) => {
    return (
      <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}>

        <Drawer.Screen name="Home" component={Dashboard} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <MaterialIcons name="dashboard" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Dashboard</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Dashboard</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        {/* <Drawer.Screen name="HomeWork" component={HomeWork} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <MaterialCommunityIcons name="notebook-edit-outline" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Home Work</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Home Work</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/> */}

        {/* <Drawer.Screen name="DailyAssignment" component={DailyAssignment} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <MaterialCommunityIcons name="book-open-page-variant-outline" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Daily Assignment</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Daily Assignment</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        <Drawer.Screen name="LessonPlan" component={LessonPlan} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <MaterialCommunityIcons name="pencil-box-multiple" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Lesson Plan</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Lesson Plan</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        <Drawer.Screen name="OnlineExamination" component={OnlineExam} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <MaterialIcons name="laptop-windows" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Online Examination</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Online Examination</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        <Drawer.Screen name="DownloadCenter" component={OnlineExam} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <AntDesign name="clouddownload" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Download Center</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Download Center</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        <Drawer.Screen name="OnlineCourse" component={OnlineExam} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <AntDesign name="iconfontdesktop" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Online Course</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Online Course</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        <Drawer.Screen name="ZoomLiveClasses" component={OnlineExam} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <Ionicons name="videocam" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Zoom Live Classes</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Zoom Live Classes</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        <Drawer.Screen name="GmeetLiveClasses" component={OnlineExam} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <Ionicons name="videocam-outline" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Gmeet Live Classes</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Gmeet Live Classes</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        <Drawer.Screen name="ClassTimetable" component={ClassTimeTable} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <MaterialCommunityIcons name="timetable" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Class Timetable</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Class Timetable</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        <Drawer.Screen name="SyllabusStatus" component={SyllabusStatus} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <MaterialCommunityIcons name="book-open" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Syllabus Status</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Syllabus Status</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        {/* <Drawer.Screen name="Attendance" component={AttendanceDrawer} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <AntDesign name="checkcircleo" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Attendance</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Make Attendance</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/> 
 */}
        {/* <Drawer.Screen name="Examination" component={Examination} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <MaterialIcons name="pending-actions" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Examination</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Examination</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        <Drawer.Screen name="RESULTS" component={OnlineExam} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <Foundation name="results" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Result</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Result</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        <Drawer.Screen name="Leave" component={AppliedLeave} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <MaterialCommunityIcons name="exit-run" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Leave</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Leave</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        <Drawer.Screen name="Library" component={Library} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <Ionicons name="library" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Library</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Library</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        <Drawer.Screen name="SchoolNews" component={OnlineExam} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <FontAwesome name="newspaper-o" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>School News</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>School News</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        <Drawer.Screen name="Events" component={Events} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <FontAwesome5 name="people-carry" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Events</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Events</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        <Drawer.Screen name="MyDocuments" component={OnlineExam} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <AntDesign name="folderopen" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>My Documents</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>My Documents</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/>

        <Drawer.Screen name="Gallery" component={GallerySky} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <FontAwesome name="image" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Gallery</Text>
            </View>),
          headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Gallery</Text>,
          headerStyle: {backgroundColor: "#FF9F0B"}
        }}/> */}



        <Drawer.Screen name="Profile" component={ProfilehOME} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <FontAwesome name="address-book" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Profile</Text>
            </View>),
           headerShown: true,
           headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>Profile</Text>,
           headerStyle: {backgroundColor: "#FF9F0B"}
           // headerLeft: () => (
          //   <View>
          //     <AntDesign name="arrowleft" size={35} color="#000000" />
          //   </View>
          // ),
        }}/>

        <Drawer.Screen name="About School" component={AboutSchool} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <FontAwesome name="building" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>About School</Text>
            </View>),
           headerShown: true,
           headerTitle: () => <Text style={{color: "#FFFFFF", fontSize: 17,}}>About School</Text>,
           headerStyle: {backgroundColor: "#FF9F0B"}
          // headerLeft: () => (
          //   <View>
          //     <AntDesign name="arrowleft" size={35} color="#000000" />
          //    </View>
          // ),
        }}/>

      </Drawer.Navigator>
    )
  }

  // if(!fontsLoaded){
  //   return(
  //   <AppLoading/>
  //   );
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName="LoginScreen">
        <Stack.Screen name='LoginScreen' component={LoginScreen} 
          options={{headerShown: false}}/>
        <Stack.Screen name='Dashboard' component={DrawerNavigator}
          options={{headerShown: false}}/>
        <Stack.Screen name='SignUp' component={SignUp}
          options={{title: 'Sign Up', headerShown: true}}/>

        <Stack.Screen name="ViewDownload" component={ViewDownload} 
          options={{title: 'View / Download', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>




        <Stack.Screen name='ResetPW' component={ResetPW}
          options={{title: 'Reset Password', headerShown: true}}/>



        <Stack.Screen name="HomeWork" component={HomeWork}
          options={{title: 'Home Work', headerShown: true, 
          headerStyle: {backgroundColor: "#EF870F"}}}/>
        <Stack.Screen name="StdHomeWork" component={StudHomeWork}
          options={{title: 'Home Work', headerShown: true, 
          headerStyle: {backgroundColor: "#EF870F"}}}/>
        <Stack.Screen name='AboutSchool' component={AboutSchool} 
          options={{title: 'About School', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="DailyAssignment" component={DailyAssignment} 
          options={{title: 'Daily Assignment', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="LessonPlan" component={LessonPlan} 
          options={{title: 'Lesson Plan', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="ClassTimetable" component={ClassTimeTable} 
          options={{title: 'Class Timetable', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="StdClassTimetable" component={Std_ClassTT} 
          options={{title: 'Class Timetable', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="Attendance" component={Attendance} 
          options={{title: 'Attendance', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="AttendanceReg" component={AttendanceReg} 
          options={{title: 'Make Attendance', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="SyllabusStatus" component={SyllabusStatus} 
          options={{title: 'Syllabus Status', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="Examination" component={Examination} 
          options={{title: 'Examination', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="Leave" component={AppliedLeave} 
          options={{title: 'Leave', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="Library" component={Library}
          options={{title: 'Library', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="Events" component={Events} 
          options={{title: 'Events', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="Fees" component={Fees} 
          options={{title: 'Fees', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="FeesReceive" component={FeesReceive} 
          options={{title: 'Fees Receive', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="SkyGallery" component={GallerySky} 
          options={{title: 'Gallery', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="FeesReceiptDetails" component={FeesReceiptDetails} 
          options={{title: 'Paid Fees', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="SocialMedia" component={SocialMedia} 
            options={{title: 'Social Media', headerShown: true,
            headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="OpenWebUrl" component={OpenUrl} 
            options={{title: 'Social Media', headerShown: false,
            headerStyle: {backgroundColor: "#FF9F0B"}}}/>

        <Stack.Screen name="OnlineExam" component={OnlineExam} 
          options={{title: 'Online Examination', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="DownloadCenter" component={ViewDownload} 
          options={{title: 'View & Download', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="OnlineCourse" component={OnlineExam} 
          options={{title: 'Online Course', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="ZoomLiveClass" component={OnlineExam} 
          options={{title: 'Zoom Live Class',
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="GmeetLiveClass" component={OnlineExam} 
          options={{title: 'Gmeet Live Class', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="Result" component={OnlineExam} 
          options={{title: 'Result', headerShown: true,
          headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="SchoolNews" component={SchoolNews} 
            options={{title: 'School News', headerShown: true,
            headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="MyDocuments" component={OnlineExam} 
            options={{title: 'My Documents', headerShown: true,
            headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="IDCard" component={IDCard} 
            options={{title: 'ID Card', headerShown: true,
            headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="StdID_Card" component={Std_IDCard} 
            options={{title: 'ID Card', headerShown: true,
            headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="AdmitCard" component={AdmitCard} 
            options={{title: 'Admit Card', headerShown: true,
            headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="StaffAttendanceAdm" component={StaffAttendanceAdm} 
            options={{title: 'Staff Attendance', headerShown: true,
            headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="PDFviewer" component={PdfViewer} 
            options={{title: 'Home Work', headerShown: false,
            headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="Complain" component={Complain} 
            options={{title: 'Complain', headerShown: true,
            headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        {/* <Stack.Screen name="Abductive" component={GK}
                      options={{title: 'Abductive Reasoning', headerShown: true, headerStyle: {backgroundColor: "#FF9F0B"}}}/> 
        <Stack.Screen name="Analytic" component={GK}
                      options={{title: 'Analytic Reasoning', headerShown: true, headerStyle: {backgroundColor: "#FF9F0B"}}}/> 
        <Stack.Screen name="Bayesian" component={GK}
                      options={{title: 'Bayesian Inference Reasoning', headerShown: true, headerStyle: {backgroundColor: "#FF9F0B"}}}/>
        <Stack.Screen name="CaseBased" component={GK}
                      options={{title: 'Case Based Reasoning', headerShown: true, headerStyle: {backgroundColor: "#FF9F0B"}}}/> 
        <Stack.Screen name="Cause" component={GK}
                      options={{title: 'Cause Reasoning', headerShown: true, headerStyle: {backgroundColor: "#FF9F0B"}}}/> 
        <Stack.Screen name="Cauuality" component={GK}
                      options={{title: 'Causality Reasoning', headerShown: true, headerStyle: {backgroundColor: "#FF9F0B"}}}/> 
        <Stack.Screen name="CauseEffect" component={GK}
                      options={{title: 'Cause Effect Reasoning', headerShown: true, headerStyle: {backgroundColor: "#FF9F0B"}}}/> 
        <Stack.Screen name="Commonsens" component={GK}
                      options={{title: 'Commonsens Reasoning', headerShown: true, headerStyle: {backgroundColor: "#FF9F0B"}}}/> 
        <Stack.Screen name="CriticalThinking" component={GK}
                      options={{title: 'Critical Thinking Reasoning', headerShown: true, headerStyle: {backgroundColor: "#FF9F0B"}}}/> 
        <Stack.Screen name="Deductive" component={GK}
                      options={{title: 'Deductive Reasoning', headerShown: true, headerStyle: {backgroundColor: "#FF9F0B"}}}/> 
        <Stack.Screen name="Inductive" component={GK}
                      options={{title: 'Inductive Reasoning', headerShown: true, headerStyle: {backgroundColor: "#FF9F0B"}}}/> 
        <Stack.Screen name="Logic" component={GK}
                      options={{title: 'Logic Reasoning', headerShown: true, headerStyle: {backgroundColor: "#FF9F0B"}}}/> 
        <Stack.Screen name="Logical" component={GK}
                      options={{title: 'Logical Reasoning', headerShown: true, headerStyle: {backgroundColor: "#FF9F0B"}}}/> 
        <Stack.Screen name="Syllogism" component={GK}
                      options={{title: 'Syllogism Reasoning', headerShown: true, headerStyle: {backgroundColor: "#FF9F0B"}}}/> 
        <Stack.Screen name="Verbal" component={GK}
                      options={{title: 'Verbal Reasoning', headerShown: true, headerStyle: {backgroundColor: "#FF9F0B"}}}/>  */}

      </Stack.Navigator>
    </NavigationContainer>  
  );
}
export default App;




/*
        <Drawer.Screen name="Settings" component={AboutUs} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <Ionicons name="settings" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Settings</Text>
            </View>),
           headerShown: false,
          headerLeft: () => (
            <View>
              <AntDesign name="arrowleft" size={35} color="#000000" />
             </View>
          ),
        }}/>


        <Drawer.Screen name="Logout" component={LoginScreen} options={{
          title: ()=>(
            <View style={{flexDirection: "row"}}>
              <MaterialCommunityIcons name="logout" size={24} color="#EF870F" style={{width: 34}}/>
              <Text>Logout</Text>
            </View>),
           headerShown: false,
          headerLeft: () => (
            <View>
              <AntDesign name="arrowleft" size={35} color="#000000" />
             </View>
          ),
        }}/>


          ()=>{
                        try{
                        AsyncStorage.getItem('ROLE').then((value) => {
                            if(Role == "Staff"){
                                navigation.navigate('AttendanceReg')
                              }else{
                                navigation.navigate('Attendance')
                              }  
                        });
                        } catch(e){
                          console.error("Drawer Async : ", e);
                        }
          } 
        */