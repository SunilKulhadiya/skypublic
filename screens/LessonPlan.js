import React from "react";
import { View, StyleSheet, Text, Image, Dimensions, useWindowDimensions, ActivityIndicator, FlatList, 
    TouchableOpacity, ScrollView, SafeAreaView, RefreshControl } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
//import { TabView, SceneMap } from 'react-native-tab-view';        //npm i react-native-tab-view
//npm install @react-native-community/masked-view react-native-select-dropdown
import AsyncStorage from '@react-native-async-storage/async-storage';   
//import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;


const LessonPlan = ({navigation}) => {

    const[BaseURL, set_BaseURL] = React.useState('');
    const [isLoading, reset_isLoading]=React.useState(true);
    const [isMonData, set_isMonData]=React.useState(true);
    const [isTueData, set_isTueData]=React.useState(true);
    const [isWedData, set_isWedData]=React.useState(true);
    const [isThuData, set_isThuData]=React.useState(true);
    const [isFriData, set_isFriData]=React.useState(true);
    const [isSatData, set_isSatData]=React.useState(true);
    const [MondayData, set_MondayData] = React.useState([]);
    const [TuesdayData, set_TuesdayData] = React.useState([]);
    const [WednesdayData, set_WednesdayData] = React.useState([]);
    const [ThursdayData, set_ThursdayData] = React.useState([]);
    const [FridayData, set_FridayData] = React.useState([]);
    const [SaturdayData, set_SaturdayData] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [color, changeColor] = React.useState('red');
    const [StdID, set_StdID] = React.useState(false);
    const [Class, set_Class] = React.useState(false);
    const [Section, set_Section] = React.useState(false);

    AsyncStorage.getItem('StdID').then((value) => set_StdID(value));
    AsyncStorage.getItem('CLASS').then((value) => set_Class(value));
    AsyncStorage.getItem('SECTION').then((value) => set_Section(value));


    React.useEffect(() => {
        setTimeout(()=> {
        FetchPersonal()}, 2000);
      },[]);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
          changeColor('green');
          FetchPersonal();
          setRefreshing(false);
        }, 2000);
    };

    const FetchPersonal=async ()=>{
  
        AsyncStorage.getItem('SERVERURL').then(async (value) => {
            set_BaseURL(value);
        try {
            let result = await fetch(value+'api/Webservice/getlessonplan', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
            body: JSON.stringify({student_id: StdID, date_from: "2023-05-22", date_to: "2023-05-28"})
            })

            let response = await result.json();
          console.log("Monday : ",response.timetable.Monday);

          set_MondayData(response.timetable.Monday);
          set_TuesdayData(response.timetable.Tuesday);
          set_WednesdayData(response.timetable.Wednesday);
          set_ThursdayData(response.timetable.Thursday);
          set_FridayData(response.timetable.Friday);
          set_SaturdayData(response.timetable.Saturday);

        }catch(error) {
            console.error("PD -1 : ",error);
          }
  
            if(MondayData.length > 0){
                set_isMonData(true);
            }else {
                set_isMonData(false);
            }
            if(TuesdayData.length > 0){
                set_isTueData(true);
            }else {
                set_isTueData(false);
            }
            if(WednesdayData.length > 0){
                set_isWedData(true);
            }else {
                set_isWedData(false);
            }
            if(ThursdayData.length > 0){
                set_isThuData(true);
            }else {
                set_isThuData(false);
            }
            if(FridayData.length > 0){
                set_isFriData(true);
            }else {
                set_isFriData(false);
            }
            if(SaturdayData.length > 0){
                set_isSatData(true);
            }else {
                set_isSatData(false);
            }

          reset_isLoading(false);
        });
      }

      
      const ShowList = (Itm, Index) => {
            return(
                <View style={styles.Column1}>
                    <View style={styles.Row2}>
                        <Text style={{width: DEVICEWIDTH * 0.37}}>{Itm.lesson_name}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.42}}>{Itm.time_from} - {Itm.time_to}</Text>
                        <MaterialIcons name="menu-book" size={24} color="black" />
                    </View>
                </View>
            );
    }

   return (
    <SafeAreaView>
        <View style={styles.Mcontainer}>
                <View style={{padding: 10, alignItems: "center", height: DEVICEHEIGHT * 0.15}}>
                    <View style={styles.Row1}>
                        <View style={styles.Column1}>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Your Lesson Plan</Text>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>is here!</Text>

                        </View>
                            <View style={{width: DEVICEWIDTH * 0.27, flexDirection: "column", alignItems: "center"}}>
                                <Image source={require('../assets/priorities.jpg')} style={{width: 120, height: 100, 
                                    borderRadius: 20,}}/>
                            </View>
                        </View>
                    </View>

                <View>
                {
                    isLoading ? (
                        <ActivityIndicator/>
                    ):(
                        <ScrollView showsVerticalScrollIndicator={false} refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                        
                        <View style={{flexGrow: 1}}>
                            <View style={styles.SContainer}>
                                <View style={styles.CardView2}>
                                    <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05,
                                                backgroundColor: "#BAFAFF", borderTopLeftRadius: 15,
                                                borderTopRightRadius: 15, justifyContent: "center"}}>
                                        <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold"}}>
                                            Monday</Text>
                                    </View>
                                {
                                isMonData ? (
                                <View>
                                    <View style={styles.Column1}>
                                        <View style={styles.Row2}>
                                        <Text style={{width: DEVICEWIDTH * 0.5, color: "#000080", 
                                                fontWeight: "bold"}}>Subject</Text>
                                        <Text style={{width: DEVICEWIDTH * 0.25, color: "#000080", 
                                                fontWeight: "bold"}}>Time</Text>
                                        <Text style={{width: DEVICEWIDTH * 0.2, color: "#000080", 
                                                fontWeight: "bold"}}>Syllabus</Text>
                                        </View>
                                        <View style={{backgroundColor: "#000000", width: DEVICEWIDTH * 0.95,
                                                     height: 1}}></View>
                                    </View>
                                        <FlatList contentContainerStyle={{ flexGrow: 1 }} 
                                        showsVerticalScrollIndicator={false}
                                        data={MondayData}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({item, index}) => ShowList(item, index)}
                                        />
                                </View>
                                ):(
                                    <Text style={{width: DEVICEWIDTH * 0.9, color: "#000080", marginTop: 15,
                                    marginBottom: 15, fontWeight: "400", textAlign: "center"}}>
                                        There is no class</Text>
                                )
                                }
                                        <View style={{marginTop: 20}}></View>
                                </View>
                            </View>

                            <View style={styles.SContainer}>
                                <View style={styles.CardView2}>
                                    <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05,
                                                backgroundColor: "#BAFAFF", borderTopLeftRadius: 15,
                                                borderTopRightRadius: 15, justifyContent: "center"}}>
                                        <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold"}}>
                                            Tuesday</Text>
                                    </View>
                                {
                                isTueData ? (
                                <View>
                                    <View style={styles.Column1}>
                                        <View style={styles.Row2}>
                                        <Text style={{width: DEVICEWIDTH * 0.5, color: "#000080", 
                                                fontWeight: "bold"}}>Subject</Text>
                                        <Text style={{width: DEVICEWIDTH * 0.25, color: "#000080", 
                                                fontWeight: "bold"}}>Time</Text>
                                        <Text style={{width: DEVICEWIDTH * 0.2, color: "#000080", 
                                                fontWeight: "bold"}}>Syllabus</Text>
                                        </View>
                                        <View style={{backgroundColor: "#000000", width: DEVICEWIDTH * 0.95,
                                                     height: 1}}></View>
                                    </View>
                                        <FlatList contentContainerStyle={{ flexGrow: 1 }} 
                                        showsVerticalScrollIndicator={false}
                                        data={TuesdayData}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({item, index}) => ShowList(item, index)}
                                        />
                                </View>
                                ):(
                                    <Text style={{width: DEVICEWIDTH * 0.9, color: "#000080", marginTop: 15,
                                    marginBottom: 15, fontWeight: "400", textAlign: "center"}}>
                                        There is no class</Text>
                                )
                                }
                                    <View style={{marginTop: 20}}></View>
                                </View>
                            </View>

                            <View style={styles.SContainer}>
                                <View style={styles.CardView2}>
                                    <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05,
                                                backgroundColor: "#BAFAFF", borderTopLeftRadius: 15,
                                                borderTopRightRadius: 15, justifyContent: "center"}}>
                                        <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold"}}>
                                            Wednesday</Text>
                                    </View>
                                {
                                isWedData ? (
                                <View>
                                    <View style={styles.Column1}>
                                        <View style={styles.Row2}>
                                        <Text style={{width: DEVICEWIDTH * 0.5, color: "#000080", 
                                                fontWeight: "bold"}}>Subject</Text>
                                        <Text style={{width: DEVICEWIDTH * 0.25, color: "#000080", 
                                                fontWeight: "bold"}}>Time</Text>
                                        <Text style={{width: DEVICEWIDTH * 0.2, color: "#000080", 
                                                fontWeight: "bold"}}>Syllabus</Text>
                                        </View>
                                        <View style={{backgroundColor: "#000000", width: DEVICEWIDTH * 0.95,
                                                     height: 1}}></View>
                                    </View>
                                        <FlatList contentContainerStyle={{ flexGrow: 1 }} 
                                        showsVerticalScrollIndicator={false}
                                        data={WednesdayData}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({item, index}) => ShowList(item, index)}
                                        />
                                </View>
                                ):(
                                    <Text style={{width: DEVICEWIDTH * 0.9, color: "#000080", marginTop: 15,
                                    marginBottom: 15, fontWeight: "400", textAlign: "center"}}>
                                        There is no class</Text>
                                  )
                                }
                                    <View style={{marginTop: 20}}></View>
                                </View>
                            </View>

                            <View style={styles.SContainer}>
                                <View style={styles.CardView2}>
                                    <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05,
                                                backgroundColor: "#BAFAFF", borderTopLeftRadius: 15,
                                                borderTopRightRadius: 15, justifyContent: "center"}}>
                                        <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold"}}>
                                            Thursday</Text>
                                    </View>
                                {
                                isThuData ? (
                                <View>
                                    <View style={styles.Column1}>
                                        <View style={styles.Row2}>
                                        <Text style={{width: DEVICEWIDTH * 0.5, color: "#000080", 
                                                fontWeight: "bold"}}>Subject</Text>
                                        <Text style={{width: DEVICEWIDTH * 0.25, color: "#000080", 
                                                fontWeight: "bold"}}>Time</Text>
                                        <Text style={{width: DEVICEWIDTH * 0.2, color: "#000080", 
                                                fontWeight: "bold"}}>Syllabus</Text>
                                        </View>
                                        <View style={{backgroundColor: "#000000", width: DEVICEWIDTH * 0.95,
                                                     height: 1}}></View>
                                    </View>
                                        <FlatList contentContainerStyle={{ flexGrow: 1 }} 
                                        showsVerticalScrollIndicator={false}
                                        data={ThursdayData}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({item, index}) => ShowList(item, index)}
                                        />
                                </View>
                                ):(
                                    <Text style={{width: DEVICEWIDTH * 0.9, color: "#000080", marginTop: 15,
                                    marginBottom: 15, fontWeight: "400", textAlign: "center"}}>
                                        There is no class</Text>
                                    )
                                }
                                    <View style={{marginTop: 20}}></View>
                                </View>
                            </View>

                            <View style={styles.SContainer}>
                                <View style={styles.CardView2}>
                                    <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05,
                                                backgroundColor: "#BAFAFF", borderTopLeftRadius: 15,
                                                borderTopRightRadius: 15, justifyContent: "center"}}>
                                        <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold"}}>
                                            Friday</Text>
                                    </View>
                                {
                                isFriData ? (
                                <View>
                                    <View style={styles.Column1}>
                                        <View style={styles.Row2}>
                                        <Text style={{width: DEVICEWIDTH * 0.5, color: "#000080", 
                                                fontWeight: "bold"}}>Subject</Text>
                                        <Text style={{width: DEVICEWIDTH * 0.25, color: "#000080", 
                                                fontWeight: "bold"}}>Time</Text>
                                        <Text style={{width: DEVICEWIDTH * 0.2, color: "#000080", 
                                                fontWeight: "bold"}}>Syllabus</Text>
                                        </View>
                                        <View style={{backgroundColor: "#000000", width: DEVICEWIDTH * 0.95,
                                                     height: 1}}></View>
                                    </View>
                                        <FlatList contentContainerStyle={{ flexGrow: 1 }} 
                                        showsVerticalScrollIndicator={false}
                                        data={FridayData}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({item, index}) => ShowList(item, index)}
                                        />
                                </View>
                                ):(
                                    <Text style={{width: DEVICEWIDTH * 0.9, color: "#000080", marginTop: 15,
                                    marginBottom: 15, fontWeight: "400", textAlign: "center"}}>
                                        There is no class</Text>
                                    )
                                }
                                    <View style={{marginTop: 20}}></View>
                                </View>
                            </View>

                            <View style={styles.SContainer}>
                                <View style={styles.CardView2}>
                                    <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05,
                                                backgroundColor: "#BAFAFF", borderTopLeftRadius: 15,
                                                borderTopRightRadius: 15, justifyContent: "center"}}>
                                        <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold"}}>
                                            Saturday</Text>
                                    </View>
                                {
                                isSatData ? (
                                <View>
                                    <View style={styles.Column1}>
                                        <View style={styles.Row2}>
                                        <Text style={{width: DEVICEWIDTH * 0.5, color: "#000080", 
                                                fontWeight: "bold"}}>Subject</Text>
                                        <Text style={{width: DEVICEWIDTH * 0.25, color: "#000080", 
                                                fontWeight: "bold"}}>Time</Text>
                                        <Text style={{width: DEVICEWIDTH * 0.2, color: "#000080", 
                                                fontWeight: "bold"}}>Syllabus</Text>
                                        </View>
                                        <View style={{backgroundColor: "#000000", width: DEVICEWIDTH * 0.95,
                                                     height: 1}}></View>
                                    </View>
                                        <FlatList contentContainerStyle={{ flexGrow: 1 }} 
                                        showsVerticalScrollIndicator={false}
                                        data={SaturdayData}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({item, index}) => ShowList(item, index)}
                                        />
                                </View>
                                ):(
                                    <Text style={{width: DEVICEWIDTH * 0.9, color: "#000080", marginTop: 15,
                                    marginBottom: 15, fontWeight: "400", textAlign: "center"}}>
                                        There is no class</Text>
                                    )
                                }
                                    <View style={{marginTop: 20}}></View>
                                </View>
                                <View style={{marginTop: 200}}></View>
                            </View>


                        </View>
                        </ScrollView>
                      )                    
                }
                </View>
        </View>
    </SafeAreaView>
  );
};
export default LessonPlan;

const styles = StyleSheet.create({
    Mcontainer: {
        width: DEVICEWIDTH,
        height: DEVICEHEIGHT,
    },
    SContainer: {
        marginTop: DEVICEHEIGHT * 0.01,
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
        marginTop: DEVICEHEIGHT * 0.12,
        marginBottom: -DEVICEHEIGHT * 0.1,
    },
    Row1: {
        flexDirection: "row",
    },
    Row2: {
        flexDirection: "row",
        marginLeft: 10,
    },
    Column1: {
        flexDirection: "column",
        width: DEVICEWIDTH * 0.6,
    },
    
});








//priorities.jpg