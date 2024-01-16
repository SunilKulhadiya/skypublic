import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, ActivityIndicator, Image, 
        Dimensions, TouchableOpacity, Modal } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {FontAwesome, AntDesign,} from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';

import config from './app_config';

let ImgZoomSubIndex = 0;

export default function Events() {

    const[GalleyData, set_GalleyData] = React.useState([]);
    const[SlideData, set_SlideData] = React.useState([]);
    const [isLoading, reset_isLoading]=React.useState(true);
    const [isCarousel, set_isCarousel] = React.useState(false);
    const isCarouselRef = React.useRef(null);
    const [page, setPage] = React.useState(0);
  
    const [ImgZoomModalVisival, set_ImgZoomModalVisival] = React.useState(false);
    const [ImgZoomIndex, set_ImgZoomIndex] = React.useState(0);
    const [ImgZoomTitle, set_ImgZoomTitle] = React.useState("");
    const [ImgZoomUri, set_ImgZoomUri] = React.useState("");
    const [ImgZoomImgs, set_ImgZoomImgs] = React.useState(0);
    const [RotatModelImg, set_RotatModelImg] = React.useState('0deg');
    const [ImgZoomUrl, set_ImgZoomUrl] = React.useState([]);

    //---------------------------
    FetchPersonal = async ()=>{
        ImgZoomSubIndex = 0;
        set_isCarousel(false);
        try{

            Dimensions.addEventListener('change', () => {
                console.log("Events.js, Orientation : ");
            });
    
            let respons1 = await fetch(config.Url+'getevents', {
                method: 'GET', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
            })
    
            respons1 = await respons1.json(), Slides=[], Gallry = [], j=0;

            console.log("Events.js, respons1 : ", respons1);

            for(j=0; j<respons1.data.length; j++){
                if(respons1.data[j].images.length > 0){
                    if(respons1.data[j].title == "Slide" || respons1.data[j].title == "Slid" ||
                        respons1.data[j].title == "Slides" || respons1.data[j].title == "Slids" ||
                        respons1.data[j].title == "slide" || respons1.data[j].title == "slid" ||
                        respons1.data[j].title == "slides" || respons1.data[j].title == "Slids"){
                            Slides.push(respons1.data[j]);
                            set_isCarousel(true);
                            console.log("------------------Path : ", respons1.data[j].path);
                    }else{
                        Gallry.push(respons1.data[j]);
                        //set_SlideImgPath(respons1.data[j].path);
                    }
                }
                if(j>=respons1.data.length - 1){
                    set_SlideData(Slides);
                    set_GalleyData(Gallry);
                    console.log("Data : ", Gallry);
                }
            }
            setTimeout(()=>{
                reset_isLoading(false);
            },2000);
    
        }catch(err){
            console.error("Error-1 : ",err);
        }
    }

    React.useEffect(() => {
        FetchPersonal();
        },[]);
    //---------------------------------------------
    const ShowList = (Itm, Indx) => {
        //setImgUrl(Itm.images);
        if(!isLoading)
        return(
        <View style={styles.SContainer}>
            <View style={styles.CardView2}>
                <View style={{width: config.DEVICEWIDTH * 0.95, height: config.DEVICEHEIGHT * 0.05,
                    backgroundColor: "#BAFAFF", borderTopLeftRadius: 15,
                    borderTopRightRadius: 15, justifyContent: "center"}}>
                    <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold",
                        width: config.DEVICEWIDTH * 0.6}}>{Itm.title}</Text>
                </View>
                <View style={{marginTop: 10}}></View>
                <FlatList contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                    data={Itm.images}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => ShowGridImg(item, Itm.path, index, Indx, Itm.images.length)}
                    numColumns={3}
                />
                <View style={{marginTop: config.DEVICEHEIGHT * 0.01}}/>
            </View>
            <View style={{marginTop: Indx >= GalleyData.length -1 ? config.DEVICEHEIGHT * 0.07 : 0}}/>
        </View>
        );
    }
    
    const ShowGridImg = (item, path, index, Indx, TotalImgs) => {
        return(
            <TouchableOpacity style={{flex: 1, flexDirection: 'column', padding: 5, alignItems: 'center'}}
                key={index+Indx}
                onPress={()=> ImgModalVisibility(Indx, index, TotalImgs)}>
                <Image source={{uri: config.BaseUrl+item.dir_path+item.img_name}}
                    style={{width: 110, height: 110, 
                    borderRadius: 10,}} resizeMode='cover'/>
            </TouchableOpacity>
        );
    }
    //---------------------------------------------------------
    const ImgModalVisibility = (INDX, subINDX, TotalImgs) => {
        if(!isLoading && GalleyData.length > 0){
        set_ImgZoomIndex(INDX);
        ImgZoomSubIndex = subINDX;
        set_ImgZoomTitle(GalleyData[INDX].title);
        set_ImgZoomUri(config.BaseUrl+GalleyData[INDX].images[subINDX].dir_path+
                        GalleyData[INDX].images[subINDX].img_name);
        set_ImgZoomImgs(TotalImgs);
        let ss=[], n=0;
        for(n = 0; n < GalleyData[INDX].images.length; n++){
            ss.push({url: config.BaseUrl+GalleyData[INDX].images[subINDX].dir_path+
                GalleyData[INDX].images[n].img_name});
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
                        <View style={{padding: 10, alignItems: "center", height: config.DEVICEHEIGHT * 0.35}}>
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
                                    sliderWidth={config.DEVICEWIDTH * 0.95}
                                    sliderHeight={config.DEVICEHEIGHT * 0.35}
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
                        <View style={{height: config.DEVICEHEIGHT * 0.6, marginTop: 10}}>
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
            presentationStyle="overFullScreen" onDismiss={ImgModalVisibility}
            supportedOrientations={['landscape', 'portrait']}>
                <View style={styles.viewWrapper}>
                        <View style={styles.ImgZoomCardViewModel}>
                        <View style={{flexDirection: "column"}}>
                            {
                                GalleyData.length > 0 ?(
                                    <View style={{width: config.DEVICEWIDTH ,
                                        height: config.DEVICEHEIGHT, left: "44.2%"}}>

                                        <ImageViewer
                                            imageUrls={ImgZoomUrl}
                                            index={ImgZoomSubIndex}
                                            enableSwipeDown={true}
                                            saveToLocalByLongPress={false}
                                            enableDoubleClickRotate={true}
                                            enableRotationGesture={true}
                                            doubleClickInterval={500}
                                        />

                                    </View>
                                ):(<></>)
                            }
                            <View style={[styles.touchableOpacityStyle, {flexDirection: "row"}]}>
                                <Text style={{color: "#FFFFFF", fontSize: 20,
                                        width: config.DEVICEWIDTH * 0.88, fontWeight: "700"}}>
                                    {ImgZoomTitle}</Text>
                                <AntDesign name="close" size={27} color="red"
                                    onPress={() => ImgModalVisibilityClose()}
                                    style={styles.floatingB}/>
                            </View>
                            {/* <View style={{width: config.DEVICEWIDTH * 0.96, alignItems: 'center',
                                bottom: config.DEVICEHEIGHT <=734 ? "5%" : "3%", height: "10%",
                                position: 'absolute',
                                elevation: 35,}}>
                                <FontAwesome name="rotate-right" size={35} color="#000000"
                                    onPress={()=> {
                                        if(RotatModelImg == '0deg'){
                                            set_RotatModelImg('90deg');
                                        }else{
                                            set_RotatModelImg('0deg');
                                        }
                                    }}/>
                            </View> */}
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
    SliderContainer: {
        alignContent: 'center',
        width: config.DEVICEWIDTH * 0.8,
        height: config.DEVICEWIDTH * 0.6,
        borderRadius: 8,
        backgroundColor: "#444444",
    },
    SliderCard: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        width: config.DEVICEWIDTH * 0.8,
        height: config.DEVICEWIDTH * 0.6,
    },
    SliderGrpCard: {
        width: config.DEVICEWIDTH,
        height: config.DEVICEWIDTH,
        transform: [{rotate: '0deg'}],
        justifyContent: 'center',
        alignItems: 'center',
    },
    SliderGrpContainer: {
        width: config.DEVICEWIDTH,
        height: config.DEVICEWIDTH,
        alignContent: 'center',
        justifyContent: 'center',
        top: config.DEVICEHEIGHT <=734 ? "30%" : "20%",
    },
    ImgZoomCardViewModel: {
        top: "18%",
        elevation: 5,
        transform: [{ translateX: -(config.DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        width: config.DEVICEWIDTH * 0.9,
        height: config.DEVICEHEIGHT,
        backgroundColor: "#FFFFFF",
    },
    touchableOpacityStyle: {
        position: 'absolute',
        top: "0%",
        left: "47%",
        elevation: 15,
        width: config.DEVICEWIDTH * 0.97,
    },
    floatingB: {
        shadowColor: '#000000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 35,
    },
    viewWrapper: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.2)",

    },

});