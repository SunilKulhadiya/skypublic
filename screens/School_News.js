import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, ActivityIndicator, Image, 
        Dimensions, TouchableOpacity, Modal } from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';   
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {MaterialIcons, AntDesign,} from '@expo/vector-icons';
import ImageViewer from 'react-native-image-pan-zoom';

import config from './app_config';

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;
let ImgZoomSubIndex = 0;

export default function SchoolNews() {

    const[GalleyData, set_GalleyData] = React.useState([]);
    const[SlideData, set_SlideData] = React.useState([]);
    //const[SlideImgPath, set_SlideImgPath] = React.useState("");
    const [isLoading, reset_isLoading]=React.useState(true);
    const [isCarousel, set_isCarousel] = React.useState(false);
    const [ImgUrl, setImgUrl] = React.useState([]);

    const [ImgZoomModalVisival, set_ImgZoomModalVisival] = React.useState(false);
    const [ImgZoomIndex, set_ImgZoomIndex] = React.useState(0);
    //const [ImgZoomSubIndex, set_ImgZoomSubIndex] = React.useState("");
    const [ImgZoomTitle, set_ImgZoomTitle] = React.useState("");
    const [ImgZoomUri, set_ImgZoomUri] = React.useState("");
    const [ImgZoomImgs, set_ImgZoomImgs] = React.useState(0);
    //---------------------------
    FetchPersonal = async ()=>{
        ImgZoomSubIndex = 0;
        set_isCarousel(false);
        try{
            let respons1 = await fetch(config.Url+'getnews', {
                method: 'GET', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
            })
    
            respons1 = await respons1.json(), Slides=[], Gallry = [], j=0;
            for(j=0; j<respons1.data.length; j++){
                    if(respons1.data[j].title == "Slide" || respons1.data[j].title == "Slid" ||
                        respons1.data[j].title == "Slides" || respons1.data[j].title == "Slids" ||
                        respons1.data[j].title == "slide" || respons1.data[j].title == "slid" ||
                        respons1.data[j].title == "slides" || respons1.data[j].title == "Slids"){
                            Slides.push(respons1.data[j]);
                            set_isCarousel(true);
                    }else{
                        Gallry.push(respons1.data[j]);
                    }
                if(j>=respons1.data.length - 1){
                    set_SlideData(Slides);
                    set_GalleyData(Gallry);
                }
            }
            setTimeout(()=>{
                reset_isLoading(false);
            },800);
    
        }catch(err){
            console.error("Error-1 : ",err);
        }
    }

    React.useEffect(() => {
        FetchPersonal();
    },[]);
    //---------------------------------------------
    const ShowList = (Itm, Indx) => {
        console.log("ShowList Indx : ", Indx, ", >>>> ", Itm);
        let str = Itm.description;
        str = str.toString();
        str = str.replace(/(<([^>]+)>)/ig, '');
        return(
        <View style={[styles.SContainer, {marginTop: Indx ==0 ? "25%" : "3%"}]}>
            <View style={styles.CardView2}>
                <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05,
                    backgroundColor: "#BAFAFF", borderTopLeftRadius: 15,
                    borderTopRightRadius: 15, justifyContent: "center"}}>
                    <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold",
                        width: DEVICEWIDTH * 0.6, fontSize: 20}}>{Itm.title}</Text>
                </View>
                <View style={{marginTop: 10, alignItems: 'flex-start', flexDirection: 'column',
                        marginLeft: 10}}>
                    {
                        Itm.feature_image !== null && Itm.feature_image.length > 2 ? (
                            <Image source={{uri: Itm.feature_image}} style={{width: 110, height: 70, 
                                borderRadius: 10,}} resizeMode='contain'/>
                        ):(
                            <></>
                        )
                    }

                    <Text style={{color: "#000000", fontSize: 17, marginTop: 10}}>
                        {str}
                    </Text>

                    <Text style={{color: "#000000", fontSize: 17, marginTop: 10}}>
                        Create on : {Itm.created_at}
                    </Text>
                    <Text style={{color: "#000000", fontSize: 17, marginTop: 10}}>
                        Start on : {Itm.event_start}
                    </Text>
                    <Text style={{color: "#000000", fontSize: 17, marginTop: 10}}>
                        End on : {Itm.event_end}
                    </Text>
                </View>
                <View style={{marginTop: 10}}></View>
            </View>
            <View style={{marginTop: Indx >= GalleyData.length -1 ? DEVICEHEIGHT * 0.05 : 0}}/>
        </View>
        );
}
    //---------------------------------------------------------
    const ImgModalVisibility = (INDX, subINDX, TotalImgs) => {
        set_ImgZoomIndex(INDX);
        ImgZoomSubIndex = subINDX;
        set_ImgZoomTitle(GalleyData[INDX].title);
        set_ImgZoomUri(config.BaseUrl+GalleyData[INDX].images[subINDX].dir_path+
                        GalleyData[INDX].images[subINDX].img_name);
        set_ImgZoomImgs(TotalImgs);

        set_ImgZoomModalVisival(!ImgZoomModalVisival);
    }
    //---------------------------------------------------------
    const PrevImg = () => {
        if(ImgZoomSubIndex > 0)
            ImgZoomSubIndex = ImgZoomSubIndex - 1;

        set_ImgZoomUri(config.BaseUrl+GalleyData[ImgZoomIndex].images[ImgZoomSubIndex].dir_path+
                        GalleyData[ImgZoomIndex].images[ImgZoomSubIndex].img_name);
        console.log("PrevImg, Image index : ", ImgZoomSubIndex);
    }
    //---------------------------------------------------------
    const NextImg = () => {
        if(ImgZoomSubIndex < ImgZoomImgs -1)
            ImgZoomSubIndex = ImgZoomSubIndex + 1;

        set_ImgZoomUri(config.BaseUrl+GalleyData[ImgZoomIndex].images[ImgZoomSubIndex].dir_path+
                GalleyData[ImgZoomIndex].images[ImgZoomSubIndex].img_name);
        console.log("NextImg, Image index : ", ImgZoomSubIndex);
    }
    //---------------------------------------------------------
    const ImgModalVisibilityClose = () => {
        set_ImgZoomModalVisival(!ImgZoomModalVisival);
    }
  //--------------------------------------
  const mySlider = ({item}) => {
    return (
      <View style={styles.SliderContainer}>
        <TouchableOpacity key={item.id}>
          <View style={{ alignItems: 'center', }}>
            <Image source={{ uri: config.BaseUrl+item.dir_path+item.img_name }}
              style={styles.SliderCard} resizeMode="cover" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  //-------------------------------
  return (
        <View style={styles.Mcontainer}>
            {
                isLoading ? (
                    <ActivityIndicator/>
                ):(
                    <View>
                        {
                            isCarousel ? (
                                <View style={{padding: 10, alignItems: "center", height: DEVICEHEIGHT * 0.35}}>
                                <View style={{alignItems: "center"}}>
                                    <Carousel
                                        layout={"default"}
                                        data={SlideData[0].images}
                                        autoplay={true} loop={true} enableSnap={true} hasParallaxImages={false}
                                        activeSlideAlignment={'center'}
                                        renderItem={mySlider}
                                        sliderWidth={DEVICEWIDTH * 0.95}
                                        sliderHeight={DEVICEHEIGHT * 0.35}
                                        itemWidth={DEVICEWIDTH * 0.8}
                                    />
                                </View>
                                </View>
                                ):(
                                    <></>
                                )
                        }
                        <View style={{height: isCarousel ?  DEVICEHEIGHT * 0.6 : "100%", marginTop: "1%"}}>
                            <FlatList contentContainerStyle={{ flexGrow: 1 }}
                                showsVerticalScrollIndicator={false}
                                data={GalleyData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item, index}) => ShowList(item, index)}
                            />
                        </View>
                    </View>
                )
            }


        <Modal animationType="fade" transparent={true} visible={ImgZoomModalVisival}
                presentationStyle="overFullScreen" onDismiss={ImgModalVisibility}>
                <View style={styles.viewWrapper}>
                {
                    isLoading ? (
                        <></>
                    ):(
                        <View style={styles.ImgZoomCardViewModel}>
                        <View style={{flexDirection: "column"}}>
                            <View style={{width: DEVICEWIDTH * 0.97, height: DEVICEHEIGHT * 0.97}}>
                                <View style={{width: DEVICEWIDTH * 0.97,
                                    height: DEVICEHEIGHT * 0.8, alignContent: 'center',
                                    justifyContent: 'center'}}>
                                    <ImageViewer cropWidth={DEVICEWIDTH * 0.98}
                                        cropHeight={DEVICEHEIGHT * 0.97}
                                        imageWidth={DEVICEWIDTH * 0.8}
                                        imageHeight={DEVICEHEIGHT * 0.6}
                                        style={{width: DEVICEWIDTH * 0.8,
                                        height: DEVICEHEIGHT * 0.6, alignContent: 'center',
                                        justifyContent: 'center'}}>
                                        <Image style={{width: DEVICEWIDTH * 0.8,
                                            height: DEVICEHEIGHT * 0.3, alignItems: 'center',
                                            justifyContent: 'center'}}
                                            resizeMode='contain' resizeMethod='scale'
                                            source={{uri: ImgZoomUri}}
                                        />
                                    </ImageViewer>
                                </View>
                            </View>
                            <View style={[styles.touchableOpacityStyle, {flexDirection: "row"}]}>
                                <Text style={{color: "#000000", fontSize: 20,
                                        width: DEVICEWIDTH * 0.88, fontWeight: "700"}}>
                                    {ImgZoomTitle}</Text>
                                <AntDesign name="close" size={35} color="red"
                                    onPress={() => ImgModalVisibilityClose()}
                                    style={styles.floatingB}/>
                            </View>
                            <View style={{width: DEVICEWIDTH * 0.96, top: "40%", height: "10%",
                                    alignContent: 'center', justifyContent: 'center',
                                    flexDirection: 'row', position: 'absolute',
                                    elevation: 15,}}>
                                <AntDesign name="left" size={34} color="black"
                                    style={[styles.floatingB, {display: ImgZoomSubIndex > 0 ? "flex": "none"}]}
                                    onPress={()=>PrevImg()}/>
                                <View style={{width: DEVICEWIDTH * 0.8}}/>
                                <AntDesign name="right" size={34} color="black"
                                    style={[styles.floatingB,
                                        {display: ImgZoomSubIndex < ImgZoomImgs -1 > 0 ? "flex": "none"}]}
                                    onPress={()=>NextImg()}/>
                            </View>
                        </View>
                    </View>
                    )
                }
                </View>
            </Modal>

        </View>
  );
}

const styles = StyleSheet.create({
    Mcontainer: {
        width: DEVICEWIDTH,
        height: DEVICEHEIGHT,
    },
    SContainer: {
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
    },
    Column1: {
        flexDirection: "column",
        width: DEVICEWIDTH * 0.64,
    },
    SliderContainer: {
        alignContent: 'center',
        width: DEVICEWIDTH * 0.8,
        height: DEVICEWIDTH * 0.6,
        borderRadius: 8,
        backgroundColor: "#444444",
    },
    SliderCard: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        width: DEVICEWIDTH * 0.8,
        height: DEVICEWIDTH * 0.6,
    },
    ImgZoomCardViewModel: {
        top: "19%",
        left: "41.5%",
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        width: DEVICEWIDTH * 0.97,
        height: DEVICEHEIGHT * 0.93,
        backgroundColor: "#FFFFFF",
    },
    touchableOpacityStyle: {
        position: 'absolute',
        top: "0%",
        elevation: 15,
        width: DEVICEWIDTH * 0.96,
    },
    floatingB: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 15,
    },

});