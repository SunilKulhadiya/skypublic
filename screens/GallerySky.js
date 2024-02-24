import React from 'react';
import { StyleSheet, View, Text, Modal, FlatList, ActivityIndicator, Image, 
        TouchableOpacity, TextInput, Alert, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';   
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {MaterialIcons, AntDesign,} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import * as FileSystem from 'expo-file-system';

import config from './app_config';

let ImgZoomSubIndex = 0;

export default function GallerySky({navigation, route}) {

    const[GalleyData, set_GalleyData] = React.useState([]);
    const[SlideData, set_SlideData] = React.useState([]);
    const[SlideImgPath, set_SlideImgPath] = React.useState("");
    const [isLoading, reset_isLoading]=React.useState(true);
    const [isCarousel, set_isCarousel] = React.useState(false);
    const [Role, set_Role] = React.useState('');
    const [FileModalVisival, set_FileModalVisival] = React.useState(false);

    const[TextServerMess, set_TextServerMess] = React.useState("Save");
    const[NewTitle, set_NewTitle] = React.useState("");
    const [NewGalleryImg, set_NewGalleryImg] = React.useState([]);
    const [ServerProcess, set_ServerProcess] = React.useState(false);

    const isCarouselRef = React.useRef(null);
    const [page, setPage] = React.useState(0);
    const [ImgZoomModalVisival, set_ImgZoomModalVisival] = React.useState(false);
    const [ImgZoomIndex, set_ImgZoomIndex] = React.useState(0);
    const [ImgZoomTitle, set_ImgZoomTitle] = React.useState("");
    const [ImgZoomUrl, set_ImgZoomUrl] = React.useState([]);

    //-----------------------------------
    const FetchData = async () => {
        set_isCarousel(false);
        try{
                AsyncStorage.getItem('ROLE').then((value) => set_Role(value));

                let respons1 = await fetch(config.Url+'getgallery', {
                    method: 'GET', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
                })
        
                respons1 = await respons1.json(), Slides=[], Gallry = [], j=0;
                console.log("GallerySky.js, respons1 : ", respons1);
                for(j=0; j<respons1.data.length; j++){
                    //if(respons1.data[j].images.length > 0){
                        if(respons1.data[j].title == "Slide" || respons1.data[j].title == "Slid" ||
                            respons1.data[j].title == "Slides" || respons1.data[j].title == "Slids" ||
                            respons1.data[j].title == "slide" || respons1.data[j].title == "slid" ||
                            respons1.data[j].title == "slides" || respons1.data[j].title == "Slids"){
                                Slides.push(respons1.data[j]);
                                set_SlideImgPath(respons1.data[j].path);
                                console.log("------------------Path : ", respons1.data[j].path);
                        }else{
                            Gallry.push(respons1.data[j]);
                            set_SlideImgPath(respons1.data[j].path);
                        }
                    //}
                    if(j>=respons1.data.length - 1){
                        set_GalleyData(Gallry);
                        console.log("Data : ", Gallry);
                        if(Slides.length > 0){
                            set_SlideData(Slides);
                            setTimeout(()=>
                            set_isCarousel(true), 300);
                        }
                    }
                }                
                    reset_isLoading(false);
        
            }catch(err){
                console.error("Error-1 : ",err);
            }
    }

    React.useEffect(() => {
        FetchData();
    },[]);
    //----------------------------------------
    const DelGallery = async (Id) => {
        try{

            let respons1 = await fetch(config.Url+'deletegallery', {
                method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                body: JSON.stringify({"id": Id})
            })

            respons1 = await respons1.json();
            console.log("-----------------------------------------------------------GallerySky.js, Delete Gallery : ", respons1);
                reset_isLoading(false);
            if(respons1.code == 0 || respons1.code == "0"){
                Alert.alert(respons1.msg);
                FetchData();
            }else{
                Alert.alert("Some thing went wrong, try after some time.");
            }
        }catch(err){
            console.error("Error-1 : ",err);
        }

    }
    //----------------------------------------
    const ShowList = (Itm, Indx) => {
        //setImgUrl(Itm.images);
        //console.log("source : ", ImgUrl.length);
        return(
        <View style={styles.SContainer}>
            <View style={styles.CardView2}>
                <View style={{width: config.DEVICEWIDTH * 0.95, height: config.DEVICEHEIGHT * 0.05,
                    backgroundColor: "#BAFAFF", borderTopLeftRadius: 15,
                    borderTopRightRadius: 15, justifyContent: "center", flexDirection: 'row'}}>
                    <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold",
                        width: config.DEVICEWIDTH * 0.8, marginTop: 9}}>{Itm.title}</Text>
                    {
                        route.params.PERMISSION_RANGE == 12 ||
                        route.params.PERMISSION_RANGE == 30 ? (
                            <MaterialIcons name="delete" size={24} color="#F90E2D"
                                style={{width: config.DEVICEWIDTH * 0.12, marginTop: 9}}
                                onPress={()=> DelGallery(Itm.id)} />
                        ):(<></>)
                    }
                </View>
                <View style={{marginTop: 10}}></View>
                <FlatList contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                    data={Itm.images}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => ShowGridImg(item, Itm.path, index, Indx, Itm.images.length)}
                    numColumns={3}
                />
                <View style={{marginTop: 10}}></View>
            </View>
            <View style={{marginTop: Indx >= GalleyData.length -1 ? config.DEVICEHEIGHT * 0.8 : 0}}/>
        </View>
        );
    }
    
    const ShowGridImg = (item, path, index, Indx, TotalImgs) => {
        console.log("url : ", path, ", im : ", item, ", in : ", index);
        return(
            <TouchableOpacity style={{flex: 1, flexDirection: 'column', padding: 5, alignItems: 'center'}}
                    key={index+Indx}
                    onPress={()=> ImgModalVisibility(Indx, index, TotalImgs)}>
                <Image source={{uri: path+"/"+item}} style={{width: 110, height: 110, 
                    borderRadius: 10,}} resizeMode='contain'/>
            </TouchableOpacity>
        );
    }
    //---------------------------------------------------------
    const ImgModalVisibility = (INDX, subINDX, TotalImgs) => {
        if(!isLoading && GalleyData.length > 0){
            set_ImgZoomIndex(INDX);
            ImgZoomSubIndex = subINDX;
            set_ImgZoomTitle(GalleyData[INDX].title);
            let ss=[], n=0;
            for(n = 0; n < GalleyData[INDX].images.length; n++){
                ss.push({url: GalleyData[INDX].path+"/"+GalleyData[INDX].images[n]});
                if(n >= GalleyData[INDX].images.length-1){
                    set_ImgZoomUrl(ss);
                    set_ImgZoomModalVisival(!ImgZoomModalVisival);
                    console.log("GalleyData[INDX].images  ss : ", ImgZoomUrl);
                }
            }

        }
    }
    //---------------------------------------------------------
    const ImgModalVisibilityClose = () => {
        set_ImgZoomModalVisival(!ImgZoomModalVisival);
    }
    //--------------------------------------
    const mySlider = ({item}) => {
        console.log("mySlider : ", item, ", path : ", SlideImgPath+"/"+item);

        return (
        <View style={styles.SliderContainer}>
            <TouchableOpacity key={item.id}>
            <View style={{ alignItems: 'center', }}>
                <Image source={{ uri: SlideImgPath+"/"+item }}
                style={styles.SliderCard} resizeMode="contain" />
            </View>
            </TouchableOpacity>
        </View>
        );
    }
    //---------------------------------------------------------
    const FiletoggleModalVisibility = () => {
        set_FileModalVisival(!FileModalVisival);
    }
    //-------------------------------------
    const ShowSelectedImg = (item, path) => {
        return(
        <View style={{flex: 1, flexDirection: 'column', padding: 5, alignItems: 'center'}}>
            <Image source={{uri: item.item.uri}} style={{width: 110, height: 110, 
                borderRadius: 10,}} resizeMode='contain'/>
        </View>
        );
    }
    //-------------------------------------
    const PickImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            allowsMultipleSelection: true,
            selectionLimit: 12,
            aspect: [4, 3],
            quality: 1,
            //base64: true,
        });
        console.log("PickImages, result.assets length : ", result.assets);
        if(result.assets.length > 0){
            let PickedIMG = [], j = 0, st="";
            for(j = 0; j < result.assets.length; j++){
                st = result.assets[j].uri;
                st = st.substring(st.lastIndexOf("/")+1);
                console.log("PickImages, st : ", st);
                PickedIMG.push({
                    "name": st,
                    "type": result.assets[j].type,
                    "uri": result.assets[j].uri
                });
                if(j >= result.assets.length-1){
                    set_NewGalleryImg(PickedIMG);
                    console.log("PickImages, PickedIMG : ", PickedIMG);
                    set_NewGalleryImg(PickedIMG);
                }
            }
        }
    }
    //---------------------------------------
    const SaveNewGallery = async ()=>{
        console.log("SaveNewGallery, NewGalleryImg : ", NewGalleryImg);
        let responsServer, i = 0, imgs=[NewGalleryImg.length];
        if(NewGalleryImg.length>0){
            set_ServerProcess(true);
            for(i = 0; i < NewGalleryImg.length; i++){
                imgs[i] = "data:image/"+NewGalleryImg[i].type+";base64,"+
                    await FileSystem.readAsStringAsync(NewGalleryImg[i].uri, { encoding: 'base64' });
                if(i >= NewGalleryImg.length-1){
                    // console.log("NewGimgs - 0 : ", NewGimgs[0]);
                    // console.log("NewGimgs - 1 : ", NewGimgs[1]);
                    // console.log("NewGimgs - 2 : ", NewGimgs[2]);
                    console.log("NewGimgs length : ", imgs.length);
                    // var data = new FormData();
                    // data.append('title', NewTitle);
                    // //data.append('files', NewGalleryImg);
                    // data.append('images', imgs);
                    try{
                        responsServer = await fetch(config.Url+'createnewgallery', {
                            method: 'POST', headers: {'Accept': 'application/json',
                                                    'Content-Type': 'application/json',},
                            body: JSON.stringify({title: NewTitle, images: imgs})
                        })

                        responsServer = await responsServer.json();
                        setTimeout(()=>{
                            console.log("GallerySky.js, Save, respons : ", responsServer);

                            setTimeout(()=> {
                                set_ServerProcess(false);
                            }, 30)

                            if(responsServer.code == 0 || responsServer.code == "0" ||
                                responsServer.msg == "Gallery submited"){
                                set_TextServerMess("New Gallery successfully created");
                                FetchData();
                            }else{
                                set_TextServerMess("Sorry, something went wrong.");
                            }
                            setTimeout(()=> {
                                set_TextServerMess("Save");
                            }, 3000)
                        },300);
                    }catch(error){
                        set_ServerProcess(false);
                        Alert.alert("Please try again.....");
                        console.error("Action on Server -1 : ",error);
                    };
                }
            }
        }
    }
    //-------------------------------

  return (
        <View style={styles.Mcontainer}>
            {/* <Image source={require('../assets/logoBn.png')} style={{width: 80, height: 80, 
                borderRadius: 20,}}/>
            <Text style={{color: "#1807B4", fontWeight: 'bold', fontSize: 16}}>
                Sky Public Hr. Sec. School</Text> */}
            <View>
            {
                isLoading ? (
                    <ActivityIndicator/>
                ):(
                    <View>
                        {
                            isCarousel ? (
                        <View style={{padding: 10, alignItems: "center",
                            height: config.DEVICEHEIGHT * 0.35}}>
                            <View style={{alignItems: "center"}}>
                                <Carousel
                                    ref={isCarouselRef}
                                    layout={"default"}
                                    onSnapToItem={(page) => {
                                    setPage(page)
                                    }}
                                    data={SlideData[0].images}
                                    autoplay={true} loop={true} enableSnap={true} hasParallaxImages={false}
                                    activeSlideAlignment={'center'}
                                    renderItem={mySlider}
                                    sliderHeight={config.DEVICEHEIGHT * 0.5}
                                    sliderWidth={config.DEVICEWIDTH * 0.95}
                                    itemWidth={config.DEVICEWIDTH * 0.8}
                                />
                                <Pagination
                                    activeDotIndex={page}
                                    carouselRef={isCarouselRef}
                                    tappableDots={true}
                                    inactiveDotOpacity={0.4}
                                    inactiveDotScale={0.6}
                                    dotsLength={SlideData[0].images.length}      //DataCricketTeam.length
                                    dotStyle={{
                                    width: 20,
                                    height: 10,
                                    borderRadius: 18,
                                    backgroundColor: "#0074FF",
                                    }}
                                    containerStyle={{ paddingVertical: 10 }}
                                    inactiveDotStyle={{
                                    backgroundColor: "#A2A2A2",
                                    }}
                                />
                            </View>
                        </View>
                            ):(<></>)
                        }
                        <View style={{width: "100%", height: isCarousel ? "60%" : "80%"}}>
                        <FlatList contentContainerStyle={{ flexGrow: 1 }}
                            showsVerticalScrollIndicator={false}
                            data={GalleyData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item, index}) => ShowList(item, index)}
                        />
                        </View>
                        {
                            route.params.PERMISSION_RANGE == 11 ||
                            route.params.PERMISSION_RANGE == 12 ||
                            route.params.PERMISSION_RANGE == 30 ? (
                                <View style={[styles.touchableOpacityStyle,
                                    {bottom: 0,}]}>
                                    <MaterialIcons name="add-a-photo" size={35} color="blue"
                                        style={styles.floatingB}
                                        onPress={(()=> FiletoggleModalVisibility())}/>
                                </View>
                            ):(<></>)
                        }
                    </View>
                )
            }
            </View>


            <Modal animationType="fade" transparent={true} visible={FileModalVisival} 
                    presentationStyle="overFullScreen" onDismiss={FiletoggleModalVisibility}>
                    <View style={styles.viewWrapper}>
                        <View style={styles.AttachCardViewModel}>
                            <View style={{flexDirection: "column", padding: 10, height: "22%"}}>
                                <View style={{flexDirection: "row"}}>
                                    <Text style={{color: "blue", fontSize: 20,
                                            width: config.DEVICEWIDTH * 0.83}}>
                                        Create New Gallery</Text>
                                    <AntDesign name="close" size={28} color="red"
                                        onPress={() => FiletoggleModalVisibility()}
                                        style={styles.ModalClose}/>
                                </View>
                                <View style={{height: "54%", borderColor: "#BCAF98", borderRadius: 10,
                                        borderWidth: 3, marginTop: 20,}}>
                                    <Text style={{color: "#777952", fontSize: 19, marginTop: -23,
                                        backgroundColor: "#FFFFFF", width: "12%",
                                        marginLeft: 10}}>Title</Text>
                                    <TextInput onChangeText={(textF) => set_NewTitle(textF)}
                                        style={[styles.textInput,{height: 45, width: "98%", padding: 10,
                                        fontSize: 19, backgroundColor: "#EDEAD6", borderRadius: 10,
                                        marginLeft: 3, marginTop: 0}]}
                                        value={NewTitle}/>
                                </View>
                            </View>
                            <View style={{height: "68%", marginTop: 0, padding: 10}}>
                                <MaterialIcons name="add-photo-alternate" size={34} color="#BFC751"
                                    onPress={()=>PickImages()}/>
                                <FlatList contentContainerStyle={{ flexGrow: 1 }}
                                    showsVerticalScrollIndicator={false}
                                    data={NewGalleryImg}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={(item, index) => ShowSelectedImg(item, index)}
                                    numColumns={3}
                                />
                            </View>
                            <View style={{backgroundColor: "#0A12F4", height: "7%",
                                    width: "90%", borderRadius: 25, alignItems: 'center', marginTop: "2%",
                                    justifyContent: 'center', left: "5%"}}>
                            {
                                ServerProcess ? (
                                    <ActivityIndicator/>
                                ):(
                                    <TouchableOpacity onPress={()=>SaveNewGallery()}
                                        style={{width: "90%", alignItems: 'center'}}>
                                        <Text style={{color: "#FFFFFF", fontSize: 18,
                                            fontWeight: '700'}}>{TextServerMess}</Text>
                                    </TouchableOpacity>
                                )
                            }
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal animationType="fade" transparent={true} visible={ImgZoomModalVisival}
                        presentationStyle="overFullScreen" onDismiss={ImgModalVisibility}
                        supportedOrientations={['landscape', 'portrait']}>
                    <View style={styles.viewWrapper}>
                        <View style={styles.ImgZoomCardViewModel}>
                        <View style={{flexDirection: "column"}}>
                            {
                                GalleyData.length > 0 ?(
                                    <View style={{width: config.DEVICEWIDTH,
                                        height: config.DEVICEHEIGHT, alignContent: 'center',
                                        justifyContent: 'center'}}>

                                        <ImageViewer
                                            imageUrls={ImgZoomUrl}
                                            index={ImgZoomSubIndex}
                                            enableSwipeDown={true}
                                            saveToLocalByLongPress={false}
                                        />

                                    </View>
                                ):(<></>)
                            }
                            <View style={[styles.ZoomModelTitleStyle, {flexDirection: "row"}]}>
                                <Text style={{color: "#FFFFFF", fontSize: 20,
                                        width: config.DEVICEWIDTH * 0.88, fontWeight: "700"}}>
                                    {ImgZoomTitle}</Text>
                                <TouchableOpacity style={{width: 50, height: 50}}
                                    onPress={() => ImgModalVisibilityClose()}>
                                <AntDesign name="close" size={24} color="red"
                                    style={styles.floatingB}/>
                                </TouchableOpacity>
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
    SContainer: {
        left: "2.35%",
    },
    CardView2: {
        left: "40%",        
        elevation: 5,
        transform: [{ translateX: -(config.DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        width: config.DEVICEWIDTH * 0.95,
        marginTop: config.DEVICEHEIGHT * 0.12,
        marginBottom: -config.DEVICEHEIGHT * 0.1,
    },
    Column1: {
        flexDirection: "column",
        width: config.DEVICEWIDTH * 0.64,
    },
    SliderContainer: {
        alignContent: 'center',
        width: config.DEVICEWIDTH * 0.8,
        height: config.DEVICEWIDTH * 0.55,
        borderRadius: 8,
        backgroundColor: "#444444",
    },
    SliderCard: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        width: config.DEVICEWIDTH * 0.8,
        height: config.DEVICEWIDTH * 0.55,
    },
    touchableOpacityStyle: {
        position: 'absolute',
        elevation: 15,
        width: 50,
        height: 50,
        right: "3%"
    },
    ZoomModelTitleStyle: {
        position: 'absolute',
        elevation: 15,
        width: 50,
        height: 50,
        marginLeft: 10,
        left: "1.5%",
    },
    floatingB: {
        position: 'absolute',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 15,
    },
    ModalClose: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 15,
    },
    viewWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    AttachCardViewModel: {
        top: "15%",
        left: "40%",
        elevation: 15,
        transform: [{ translateX: -(config.DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        width: config.DEVICEWIDTH * 0.95,
        height: config.DEVICEHEIGHT * 0.7,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
    },
    ImgZoomCardViewModel: {
        top: "14%",
        left: "40%",
        elevation: 5,
        transform: [{ translateX: -(config.DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        width: config.DEVICEWIDTH * 0.994,
        height: config.DEVICEHEIGHT * 0.93,
        backgroundColor: "#FFFFFF",
    },

});