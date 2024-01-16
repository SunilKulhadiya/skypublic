import React from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity,
        Linking, Modal, Image} from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';   
import {MaterialCommunityIcons, AntDesign} from '@expo/vector-icons';
import ImageViewer from 'react-native-image-pan-zoom';

import config from './app_config';
import IMG_View_Zoom from './IMG_View';

const FileUrl = {title: null, uri: null, type: null};

export default function ViewDownload({navigation, route}) {

    const[Datas, set_Datas] = React.useState([]);
    const [isLoading, reset_isLoading]=React.useState(true);
    const [FileModalVisival, set_FileModalVisival] = React.useState(false);
    const [pickedFile, setPickedFile] = React.useState(null);
    //---------------------------
    FetchPersonal = async ()=>{
        try{
            let respons1 = await fetch(config.Url+'getdownloads', {
                method: 'GET', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
            })
    
            respons1 = await respons1.json();
            set_Datas(respons1.data);
            setTimeout(()=>{
                reset_isLoading(false);
            },300);
        }catch(err){
            console.error("Error-1 : ",err);
        }
    }

    React.useEffect(() => {
        FetchPersonal();
    },[]);
    //---------------------------------------------
    const FileDownload = async (fileUrl) => {
        console.log("FileDownload fileUrl : ", fileUrl);

        const supported = await Linking.canOpenURL(fileUrl);

        if (supported) {
        await Linking.openURL(fileUrl);
        } else {
        console.log(`Don't know how to open this URL: ${fileUrl}`);
        }
    }
    //---------------------------------------------------------
    const FiletoggleModalVisibility = (Title, url) => {
        if(Title !== null && url !== null){
            FileUrl.title = Title;
            FileUrl.uri = config.BaseUrl+url;
        }
        set_FileModalVisival(!FileModalVisival);
    }
    //---------------------------------------------
    const FileView = (Title, fileUrl) => {
        console.log("FileView fileUrl : ", Title);
        if(fileUrl.substring(fileUrl.lastIndexOf(".")+1).length <= 5){
            if(fileUrl.substring(fileUrl.length-3, fileUrl.length) == "png" ||
                fileUrl.substring(fileUrl.length-3, fileUrl.length) == "jpg" ||
                fileUrl.substring(fileUrl.length-3, fileUrl.length) == "jpe" ||
                fileUrl.substring(fileUrl.length-3, fileUrl.length) == "peg"){
                    console.log("FileView ex : ", fileUrl.substring(fileUrl.length-3, fileUrl.length));
                    // return(
                    //     <View style={{width: "100%", height: "100%"}}>
                    //     <IMG_View_Zoom FileUrl = {fileUrl}/>
                    //     </View>
                    // );
                    FiletoggleModalVisibility(Title, fileUrl);
                }else{
                    navigation.navigate("PDFviewer", {fileuri: config.BaseUrl+fileUrl, title: Title});
                }
            }
    }
    //---------------------------------------------
    const ShowList = (Itm, Indx) => {

        console.log("ShowList Itm : ", Itm);

        return(
        <View style={{marginTop: Indx ==0 ? "2.5%" : "01%", flexDirection: 'column',}}>
            <View style={{flexDirection: 'row', width: "100%", 
                        height: 50,}}>
                <TouchableOpacity onPress={()=> FileView(Itm.title, Itm.file)}
                    style={{flexDirection: 'row', width: "83%", marginLeft: 10,
                            height: 50,}}>
                    <Text style={{color: "#000000", fontSize: 17, width: "85%", height: "100%",
                            marginTop: 10}}>
                        {Itm.title}
                    </Text>
                </TouchableOpacity>
                <View style={{marginLeft: 15, height: "100%", justifyContent: 'center'}}>
                    <MaterialCommunityIcons name="file-download-outline" size={24} color="black"
                    onPress={()=>FileDownload(config.BaseUrl+Itm.file)}/>
                </View>
            </View>
            <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 1}}></View>
            <View style={{marginTop: Indx >= Datas.length -1 ? config.DEVICEHEIGHT * 0.02 : 0}}/>
        </View>
        );
    }
    //------------------------------
    return(
        <View style={styles.Mcontainer}>
            {
                isLoading ? (
                    <ActivityIndicator/>
                ):(
                    <View style={{marginTop: 0}}>
                        <View style={{height: config.DEVICEHEIGHT * 0.8, width: config.DEVICEWIDTH * 0.98}}>
                            <FlatList contentContainerStyle={{ flexGrow: 1 }}
                                showsVerticalScrollIndicator={false}
                                data={Datas}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item, index}) => ShowList(item, index)}
                            />
                        </View>
                    </View>
                )
            }

            <Modal animationType="fade" transparent={true} visible={FileModalVisival} 
                presentationStyle="overFullScreen" onDismiss={()=>FiletoggleModalVisibility(null, null)}>
                <View style={styles.viewWrapper}>
                    <View style={styles.AttachCardViewModel}>
                        <View style={{flexDirection: "column"}}>
                            <View style={{width: config.DEVICEWIDTH * 0.97, height: config.DEVICEHEIGHT * 0.97}}>
                                <View style={{width: config.DEVICEWIDTH * 0.97, height: config.DEVICEHEIGHT * 0.8}}>
                                    <ImageViewer cropWidth={config.DEVICEWIDTH * 0.98}
                                        cropHeight={config.DEVICEHEIGHT * 0.97}
                                        imageWidth={config.DEVICEWIDTH * 0.8}
                                        imageHeight={config.DEVICEHEIGHT * 0.6}
                                        style={{width: config.DEVICEWIDTH * 0.8,
                                        height: config.DEVICEHEIGHT * 0.6}}>
                                        <Image style={{width: config.DEVICEWIDTH * 0.8,
                                            height: config.DEVICEHEIGHT * 0.6}}
                                            resizeMode="contain"
                                            source={{uri: FileUrl.uri}}
                                        />
                                    </ImageViewer>
                                </View>
                            </View>
                            <View style={[styles.touchableOpacityStyle, {flexDirection: "row"}]}>
                                <Text style={{color: "#000000", fontSize: 20,
                                        width: config.DEVICEWIDTH * 0.9, fontWeight: "700"}}>
                                    {FileUrl.title}</Text>
                                <AntDesign name="close" size={35} color="red"
                                    onPress={() => FiletoggleModalVisibility(null, null)}
                                    style={styles.floatingB}/>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
  );
}

const styles = StyleSheet.create({
    Mcontainer: {
        width: config.DEVICEWIDTH,
        height: config.DEVICEHEIGHT,
    },
    AttachCardViewModel: {
        top: "14%",
        left: "40%",
        elevation: 5,
        transform: [{ translateX: -(config.DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        width: config.DEVICEWIDTH * 0.994,
        height: config.DEVICEHEIGHT * 0.93,
        backgroundColor: "#FFFFFF",
    },
    viewWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    touchableOpacityStyle: {
        position: 'absolute',
        top: "0%",
        elevation: 15,
    },
    floatingB: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 15,
    },
});