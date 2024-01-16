import React from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity,
        Linking, Modal, Image} from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';   
import {MaterialCommunityIcons, AntDesign} from '@expo/vector-icons';
import ImageViewer from 'react-native-image-pan-zoom';

import config from './app_config';
import IMG_View_Zoom from './IMG_View';

const FileUrl = {title: null, uri: null, type: null};

export default function SocialMedia({navigation, route}) {

    const[Datas, set_Datas] = React.useState([]);
    const [isLoading, reset_isLoading]=React.useState(true);
    const [FileModalVisival, set_FileModalVisival] = React.useState(false);
    const [pickedFile, setPickedFile] = React.useState(null);
    //---------------------------
    FetchPersonal = async ()=>{
        try{
            let respons1 = await fetch(config.Url+'getpagesurl', {
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
    const ShowList = (Itm, Indx) => {

        console.log("ShowList Itm : ", Itm);

        return(
        <View style={{marginTop: Indx ==0 ? "2.5%" : "01%", flexDirection: 'column',}}>
            <View style={{flexDirection: 'row', width: "100%", 
                        height: 50,}}>
                <TouchableOpacity onPress={()=> navigation.navigate('OpenWebUrl', {PageUrl: Itm.ext_url_link,
                    Title: Itm.menu})} style={{flexDirection: 'row', width: "83%", marginLeft: 10,
                    height: 50,}}>
                    <Text style={{color: "#000000", fontSize: 17, width: "85%", height: "100%",
                            marginTop: 10}}>
                        {Itm.menu}
                    </Text>
                </TouchableOpacity>
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

        </View>
  );
}

const styles = StyleSheet.create({
    Mcontainer: {
        width: config.DEVICEWIDTH,
        height: config.DEVICEHEIGHT,
    },

});