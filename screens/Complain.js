import React from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity,
        ScrollView, Modal, Image, TextInput} from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';   
import {MaterialCommunityIcons, AntDesign} from '@expo/vector-icons';
import ImageViewer from 'react-native-image-pan-zoom';

import config from './app_config';
import IMG_View_Zoom from './IMG_View';

const FileUrl = {title: null, uri: null, type: null};
const newdate = new Date();

export default function Complain({navigation, route}) {

    const [isSubmit, set_Submit] = React.useState(false);
    const [SubmitText, set_SubmitText] = React.useState("Submit");
    const [ComplainType, set_ComplainType] = React.useState("");        //subject
    const [Name, set_Name] = React.useState("");
    const [Mobile, set_Mobile] = React.useState("");
    const [Email, set_Email] = React.useState("");
    const [Description, set_Description] = React.useState("");
    //---------------------------
    const SubmitTo = async () => {
        set_Submit(true);

        let respons1 = await fetch(config.Url+'generatecomplaint', {
            method: 'POST', headers: {'Accept': 'application/json',
                            'Content-Type': 'application/json',},
            body: JSON.stringify({
                "complaint_type":"General",
                "source":"Online",
                "name": Name,
                "contact": Mobile,
                "email": Email,
                "date": `${newdate.getFullYear()}-${newdate.getMonth() + 1}-${newdate.getDate()}`,
                "description": Description
            })
        })

        respons1 = await respons1.json();
        console.log("Complain.js, respons1 : ", respons1);
        set_SubmitText(respons1.msg)


        setTimeout(()=> {
            set_Submit(false);
            set_ComplainType("");        //subject
            set_Name("");
            set_Mobile("");
            set_Email("");
            set_Description("");
        
            setTimeout(()=> {
                set_SubmitText("Submit");
            }, 4000);

        }, 300);
    }
    //---------------------------
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.Mcontainer}>
                <View style={{marginTop: "2%", width: "95%", height: "100%",
                        flexDirection: 'column', left: "2.3%"}}>
                <View style={{height: "9%", borderColor: "#D3D0D0", borderRadius: 10,
                        borderWidth: 3, marginTop: 20, width: "100%",}}>
                    <Text style={{color: "#777952", fontSize: 19, marginTop: -20,
                        backgroundColor: "#FFFFFF", width: "19.5%",
                        marginLeft: 10, borderRadius: 15}}> Subject</Text>
                    <TextInput onChangeText={(textF) => set_ComplainType(textF)}
                        style={[styles.textInput,{height: 45, width: "95%", padding: 10,
                        fontSize: 19, backgroundColor: "#F2F2F2", borderRadius: 10,
                        marginLeft: 9, marginTop: 0}]}
                        value={ComplainType}/>
                </View>
                <View style={{height: "9%", borderColor: "#D3D0D0", borderRadius: 10,
                        borderWidth: 3, marginTop: 20, width: "100%",}}>
                    <Text style={{color: "#777952", fontSize: 19, marginTop: -20,
                        backgroundColor: "#FFFFFF", width: "30%",
                        marginLeft: 10, borderRadius: 15}}> Your Name</Text>
                    <TextInput onChangeText={(textF) => set_Name(textF)}
                        style={[styles.textInput,{height: 45, width: "95%", padding: 10,
                        fontSize: 19, backgroundColor: "#F2F2F2", borderRadius: 10,
                        marginLeft: 9, marginTop: 0}]}
                        value={Name}/>
                </View>
                <View style={{height: "9%", borderColor: "#D3D0D0", borderRadius: 10,
                        borderWidth: 3, marginTop: 20, width: "100%",}}>
                    <Text style={{color: "#777952", fontSize: 19, marginTop: -20,
                        backgroundColor: "#FFFFFF", width: "43%",
                        marginLeft: 10, borderRadius: 15}}> Your Mobile No.</Text>
                    <TextInput onChangeText={(textF) => set_Mobile(textF)}
                        style={[styles.textInput,{height: 45, width: "95%", padding: 10,
                        fontSize: 19, backgroundColor: "#F2F2F2", borderRadius: 10,
                        marginLeft: 9, marginTop: 0}]}
                        value={Mobile}/>
                </View>
                <View style={{height: "9%", borderColor: "#D3D0D0", borderRadius: 10,
                        borderWidth: 3, marginTop: 20, width: "100%",}}>
                    <Text style={{color: "#777952", fontSize: 19, marginTop: -20,
                        backgroundColor: "#FFFFFF", width: "24%",
                        marginLeft: 10, borderRadius: 15}}> E-mail id</Text>
                    <TextInput onChangeText={(textF) => set_Email(textF)}
                        style={[styles.textInput,{height: 45, width: "95%", padding: 10,
                        fontSize: 19, backgroundColor: "#F2F2F2", borderRadius: 10,
                        marginLeft: 9, marginTop: 0}]}
                        value={Email}/>
                </View>
                <View style={{height: "37%", borderColor: "#D3D0D0", borderRadius: 10,
                        borderWidth: 3, marginTop: 20, width: "100%",}}>
                    <Text style={{color: "#777952", fontSize: 19, marginTop: -20,
                        backgroundColor: "#FFFFFF", width: "30%",
                        marginLeft: 10, borderRadius: 15}}> Description</Text>
                    <TextInput onChangeText={(textF) => set_Description(textF)}
                        style={{height: "95%", width: "95%", padding: 10,
                        fontSize: 19, backgroundColor: "#F2F2F2", borderRadius: 10,
                        marginLeft: 9, alignSelf: 'flex-start', justifyContent: 'flex-start',
                        textAlignVertical: 'top'}}
                        value={Description} multiline={true}/>
                </View>

                {
                    isSubmit ? (
                        <View style={{height: "7%", backgroundColor: "#260DF2", borderRadius: 20,
                        borderWidth: 1, marginTop: 20, width: "100%", alignItems: 'center',
                        justifyContent: 'center'}}>
                            <ActivityIndicator/>
                        </View>
                    ):(
                        <TouchableOpacity onPress={()=> SubmitTo()}
                            style={{height: "7%", width: "100%", alignItems: 'center',
                                justifyContent: 'center', backgroundColor: "#260DF2",
                                borderRadius: 20, borderWidth: 1, marginTop: 20}}>
                            <Text style={{color: "#FFFFFF", fontSize: SubmitText.length > 8 ? 14 : 19,
                                        fontWeight: '600'}}>
                                {SubmitText}</Text>
                        </TouchableOpacity>
                    )
                }
                <View style={{marginTop: 20}}/>


                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    Mcontainer: {
        width: config.DEVICEWIDTH,
        height: config.DEVICEHEIGHT,
        backgroundColor: "#FFFFFF",
    },
});