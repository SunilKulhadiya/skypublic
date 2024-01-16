import React from "react";
import { View, StyleSheet, Text, Image, Dimensions, useWindowDimensions, Modal, TextInput,
        TouchableOpacity, ActivityIndicator, FlatList, SafeAreaView, ScrollView, RefreshControl } from "react-native";
import { FontAwesome, Entypo, MaterialIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';       //npx expo install expo-image-picker
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';   

import config from "./app_config";

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

const AppliedLeave = ({navigation}) => {

    const newdate = new Date();

    const[BaseURL, set_BaseURL] = React.useState('');
    const [DataS, set_data] = React.useState([]);
    const [isLoading, reset_isLoading]=React.useState(true);
    const [isUploadBoxVisival, set_UploadBox] = React.useState(false);
    const [LeaveApply, set_LeaveApply] = React.useState("");
    const [LeaveFrom, set_From] = React.useState("");
    const [LeaveTo, set_To] = React.useState("");
    const [LeaveReason, set_Reason] = React.useState("");
    const [isSubmitLeaveForm, set_LeaveForm] = React.useState(false);
    const [StudentID, set_StudID] = React.useState("29");
    const [LeaveImg, set_LeaveImg] = React.useState(null);
    const [EditApplication, set_EditApplication] = React.useState(0);
    const [EditID, set_EditID] = React.useState("");
    const [isImgChoose, set_isImgChoose] = React.useState(false);
    const [isFlatListLoading, set_isFlatListLoading] = React.useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [color, changeColor] = React.useState('red');
  
    const clickHandler = () => {
        set_UploadBox(true);
    };

    const EditHandler = (itemm) => {
        set_EditID(itemm.id);
        set_From(itemm.from_date);
        set_To(itemm.to_date);
        set_LeaveApply(itemm.apply_date);
        set_Reason(itemm.reason);
        set_LeaveImg(itemm.docs);
        //set_LeaveImg(itemm.file);
        set_EditApplication(1);
        set_UploadBox(true);
        if(itemm.docs){
            set_isImgChoose(true);
        }else{
            set_isImgChoose(false);
        }
    };

    const toggleModalVisibility = () => {
        set_UploadBox(!isUploadBoxVisival);
        set_LeaveForm(false);
    }
    const toggleModalFlatList = () => {
        set_isFlatListLoading(!set_isFlatListLoading);
    }

    const SubmitApplication = async () => {
        set_LeaveForm(true);
        let SDAY= `${newdate.getFullYear()}-${newdate.getMonth() + 1}-${newdate.getDate()}`
        let respons2, responsJson;

        if(EditApplication == 0){
            try{
                respons2 = await fetch(config.Url+'addLeave', {
                method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                body: JSON.stringify({from_date: LeaveFrom, to_date: LeaveTo, apply_date: SDAY,
                                        student_id: StudentID, reason: LeaveReason, file: LeaveImg})
            })
            responsJson = await respons2.json();
            console.log("responsJson-1 : ",responsJson);
            set_From("");
            set_To("");
            set_LeaveApply("");
            set_Reason("");
            set_LeaveImg("");
            set_isImgChoose(false);
            }catch(err){
              console.error("Error-1 : ",err);
            }
        }
        if(EditApplication == 1){
            try{
                respons2 = await fetch(config.Url+'updateLeave', {
                method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                body: JSON.stringify({id: EditID, from_date: LeaveFrom, to_date: LeaveTo, apply_date: SDAY,
                                        student_id: StudentID, reason: LeaveReason, file: LeaveImg})
            })
            /*.then(response => response.json())
            .then(( responseJson ) => {
                console.log("Json :"+JSON.stringify(responseJson));
                //console.log("----Json---- :"+responseJson);
                set_From("");
                set_To("");
                set_LeaveApply("");
                set_Reason("");
                set_LeaveImg("");
                set_EditApplication(0);
                set_isImgChoose(false);
            }).catch((error) => {
                console.error("PD -1 : ",error);
            });*/
            responsJson = await respons2.json();
            set_From("");
            set_To("");
            set_LeaveApply("");
            set_Reason("");
            set_LeaveImg("");
            set_isImgChoose(false);
            set_EditApplication(0);
        }catch(err){
            console.error("Error-1 : ",err);
          }
      }


      set_UploadBox(false);
      set_isFlatListLoading(true);
        FetchPersonal();
        
        set_LeaveForm(false);
    }

    const onRefresh = () => {
        setRefreshing(true);
        changeColor('red');
        FetchPersonal();
        setTimeout(() => {
          changeColor('green');
          setRefreshing(false);
        }, 2000);
    };

    const FetchPersonal=async ()=>{
  
            try{
            let respons1 = await fetch(config.Url+'getApplyLeave', {
                method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                body: JSON.stringify({student_id: StudentID})
            })
            /*.then(response => response.json())
            .then(( responseJson ) => {
                console.log("Json :"+JSON.stringify(responseJson));
                set_data(responseJson);
                reset_isLoading(false);
            }).catch((error) => {
                console.error("PD -1 : ",error);
            });*/

            let responsJson = await respons1.json();
            
            console.log("responsJson : ",responsJson);
            
            set_data(responsJson);
            reset_isLoading(false);
            set_isFlatListLoading(false);
            }catch(err){
                console.error("Error-1 : ",err);
            }
    }

    React.useEffect(() => {
        AsyncStorage.getItem('StdID').then((value) => set_StudID(value));
      FetchPersonal()
      setTimeout(()=> FetchPersonal(), 3000);
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
          aspect:[3,4],
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          base64: true,
        });
    
        if (!result.canceled) {
            console.log("Pick Img Uri : ", result.base64);
            const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
                      console.log("Pick Img : ", base64);
          set_LeaveImg(result.base64);
          set_isImgChoose(true);
        }
    }

    const DeleteLeaveApplicationSurity = (ID) => {
        set_OpenDeleteSurityModel(true)
    }
    const DeleteLeaveApplication = async (ID) => {

       set_isFlatListLoading(true);
        try{
            let respons3 = await fetch(config.Url+'deleteLeave', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
            body: JSON.stringify({leave_id: ID})
          })

          let responsJson = await respons3.json();
        }catch(error){
            console.error("PD -1 : ",error);
          };
    
          FetchPersonal();
    }

    const ShowList = (Itm, Index) => {
            return(
            <View style={styles.SContainer}>
                <View style={styles.CardView2}>
                    <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05, backgroundColor: "#BAFAFF",
                                    borderTopLeftRadius: 15, borderTopRightRadius: 15, justifyContent: "center"}}>
                        <View style={styles.Row1}>
                        <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold", width: DEVICEWIDTH * 0.6}}>
                            Apply Date : {Itm.apply_date}</Text>
                        <FontAwesome name="download" size={24} color="#008000" style={{width: DEVICEWIDTH * 0.12}} />

                        <TouchableOpacity onPress={() => EditHandler(Itm)}>
                            <Entypo name="edit" size={24} color="#000080" style={{width: DEVICEWIDTH * 0.12}} />
                        </TouchableOpacity>

                        <TouchableOpacity key={Itm.id} onPress={() => DeleteLeaveApplication(Itm.id)}>
                            <MaterialIcons name="delete" size={24} color="#F90E2D"
                                            style={{width: DEVICEWIDTH * 0.12}} />
                        </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.Row1}>
                    <View style={styles.Column2}>
                        <View style={styles.Row2}>
                            <Text style={{width: DEVICEWIDTH * 0.2, color: "#000000"}}>From Date</Text>
                            <Text style={{width: DEVICEWIDTH * 0.06, color: "#000000"}}>:</Text>
                            <Text style={{width: DEVICEWIDTH * 0.25, fontWeight: "700"}}>{Itm.from_date}</Text>
                        </View>
                        <View style={styles.Row2}>
                            <Text style={{width: DEVICEWIDTH * 0.2, color: "#000000"}}>To Date</Text>
                            <Text style={{width: DEVICEWIDTH * 0.06, color: "#000000"}}>:</Text>
                            <Text style={{width: DEVICEWIDTH * 0.25, fontWeight: "700"}}>{Itm.to_date}</Text>
                        </View>
                        <View style={styles.Row2}>
                            <Text style={{width: DEVICEWIDTH * 0.2, color: "#000000"}}>Reason</Text>
                            <Text style={{width: DEVICEWIDTH * 0.06, color: "#000000"}}>:</Text>
                            <Text style={{width: DEVICEWIDTH * 0.25, fontWeight: "700"}}>{Itm.reason}</Text>
                        </View>
                    </View>
                        <Image source={{uri: `data:image/png;base64,${Itm.docs}`}} 
                            style={{width: 70, height: 70, borderRadius: 10, marginTop: 10}}/>
                    </View>

                    <View style={{flexDirection: "row", marginTop: 20, marginLeft: 10}}>
                            <Text style={{width: DEVICEWIDTH * 0.4, color: "#000000",}}>
                                Description</Text>
                    </View>
                        <Text style={{width: DEVICEWIDTH * 0.7, fontWeight: "700", marginLeft: 10}}></Text>
                </View>
            </View>
            );
    }

  return (
    <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={{padding: 10, alignItems: "center", height: DEVICEHEIGHT * 0.15}}>
            <View style={styles.Row1}>
                <View style={styles.Column1}>
                    <Text style={{fontSize: 20, fontWeight: "700"}}>Your Applied</Text>
                    <Text style={{fontSize: 20, fontWeight: "700"}}>Leaves is here!</Text>

                </View>
                    <View style={{width: DEVICEWIDTH * 0.27, flexDirection: "column", alignItems: "center"}}>
                        <Image source={require('../assets/LeaveAppBN.png')} style={{width: 120, height: 120, 
                            borderRadius: 20, marginTop: -15}}/>
                    </View>
            </View>
        </View>
        </ScrollView>
        
    {
        isLoading ? (
            <ActivityIndicator/>
        ):(
            <View style={styles.Mcontainer}>
                <FlatList contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                    data={DataS.result_array}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => ShowList(item, index)}
                />
                     <View style={{marginTop: 180}}></View>

                <TouchableOpacity activeOpacity={0.7} onPress={clickHandler} style={styles.touchableOpacityStyle}>
                    <MaterialIcons name="note-add" size={50} color="#05AE7D" style={styles.floatingButtonStyle} />
                </TouchableOpacity>

                <Modal animationType="fade" transparent={true} visible={isUploadBoxVisival} 
                    presentationStyle="overFullScreen" onDismiss={toggleModalVisibility}>
                    <View style={styles.viewWrapper}>
                        <View style={styles.CardViewModel}>
                            <View style={styles.ColumnM1}>
                                <View style={{flexDirection: "row"}}>
                                    <Text style={{fontSize: 15, fontWeight: "bold", width: DEVICEWIDTH * 0.8}}>
                                        Leave Form
                                    </Text>
                                    <AntDesign name="close" size={25} color="red" onPress={() => toggleModalVisibility()}/>
                                </View>

                                <TextInput placeholder="From" onChangeText={(textF) => set_From(textF)}
                                                style={styles.textInput} value={LeaveFrom}/>
                                <View style={styles.textUnderLine}></View>
                                <TextInput placeholder="To" onChangeText={(textT) => set_To(textT)}
                                                style={styles.textInput} value={LeaveTo}/>
                                <View style={styles.textUnderLine}></View>
                                <TextInput placeholder="Reason" onChangeText={(textR) => set_Reason(textR)}
                                                style={styles.textInput} value={LeaveReason}/>
                                <View style={styles.textUnderLine}></View>

                                <TouchableOpacity onPress={() => pickImage()}>
                                    <View style={{flexDirection: "column", marginTop: 20, alignItems: "center"}}>
                                    {
                                        isImgChoose ? (
                                            <View style={{alignItems: "center"}}>
                                                <Image source={{uri: `data:image/png;base64,${LeaveImg}`}}
                                                style={{width: 70, height: 70, borderRadius: 10,}}/>
                                                <Text>Choose</Text>
                                            </View>
                                    ):(
                                            <View style={{alignItems: "center"}}>
                                                <Image source={require('../assets/LeaveAppBN.png')} 
                                                style={{width: 70, height: 70, borderRadius: 10,}}/>
                                                <Text>Choose</Text>
                                            </View>
                                        )
                                    }
                                    </View>
                                </TouchableOpacity>

                                <View>
                                {
                                    isSubmitLeaveForm ? (
                                        <View style={{marginTop: DEVICEHEIGHT * 0.07, marginBottom: DEVICEHEIGHT * 0.0338}}>
                                            <ActivityIndicator/>
                                        </View>
                                    ):(
                                        <TouchableOpacity onPress={() => SubmitApplication()}>
                                        <View style={{flexDirection: "row", marginTop: 47, backgroundColor: '#FCB11C',
                                            width: DEVICEWIDTH * 0.901, marginLeft: -10, height: DEVICEHEIGHT * 0.07,
                                            alignItems: "center", justifyContent: "center", textAlign: "center",
                                            borderBottomLeftRadius: 7, borderBottomRightRadius: 7}}>
                                            <Text style={{fontSize: 15, fontWeight: "bold", color: "#FFFFFF",}}>
                                                SUBMIT
                                            </Text>
                                        </View>
                                        </TouchableOpacity>
                                    )
                                }
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal animationType="fade" transparent={true} visible={isFlatListLoading}
                    presentationStyle="overFullScreen" onDismiss={toggleModalFlatList}>
                    <View style={styles.viewWrapper}>
                        <View style={styles.CardViewModelFlatList}>
                                <ActivityIndicator/>
                        </View>
                    </View>
                </Modal>


            </View>
        )
    }
    </SafeAreaView>
  );
};
export default AppliedLeave;

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
        height: DEVICEHEIGHT * 0.25,
        width: DEVICEWIDTH * 0.95,
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        marginTop: DEVICEHEIGHT * 0.1,
        marginBottom: -DEVICEHEIGHT * 0.1,
    },
    Row1: {
        flexDirection: "row",
    },
    Row2: {
        flexDirection: "row",
    },
    Column1: {
        flexDirection: "column",
        width: DEVICEWIDTH * 0.64,
    },
    Column2: {
        flexDirection: "column",
        width: DEVICEWIDTH * 0.65,
        marginLeft: 10,
        marginTop: 5,
    },
    touchableOpacityStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: "1.5%",
        bottom: "25%",
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
    CardViewModel: {
        justifyContent: "center",
        position: "absolute",
        top: "40%",
        left: "45%",
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        height: DEVICEHEIGHT * 0.47,
        width: DEVICEWIDTH * 0.9,
        backgroundColor: "#FFFFFF",
        borderRadius: 7,
    },
    CardViewModelFlatList: {
        justifyContent: "center",
        position: "absolute",
        top: "50%",
        right: "5%",
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        height: DEVICEWIDTH * 0.1,
        width: DEVICEWIDTH * 0.1,
        backgroundColor: "#FFFFFF",
        borderRadius: 7,
    },
    ColumnM1: {
        flexDirection: "column",
        marginLeft: 10,
    },
    textUnderLine: {
        backgroundColor: '#C0C0C0',
        width: DEVICEWIDTH * 0.6,
        height: 1,
        marginTop: 0,
        marginLeft: DEVICEWIDTH * 0.1,
    },
    textInput: {
        marginLeft: DEVICEWIDTH * 0.1,
        marginTop: 15,
        fontSize: 18,
    },
                   
    
});