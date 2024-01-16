import React from 'react';
import { StyleSheet, View, Text, Modal} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import ImageViewer from 'react-native-image-pan-zoom';

import config from './app_config';

export default function IMG_View_Zoom({FileUrl}) {

    const [FileModalVisival, set_FileModalVisival] = React.useState(true);
    console.log("FileView fileUrl : ", fileUrl);

    //---------------------------------------------------------
    const FiletoggleModalVisibility = () => {
        set_FileModalVisival(!FileModalVisival);
    }
    //-----------------------------------------
    return(
        <View style={styles.Mcontainer}>
            <Modal animationType="fade" transparent={true} visible={FileModalVisival} 
                presentationStyle="overFullScreen" onDismiss={FiletoggleModalVisibility}>
                <View style={styles.viewWrapper}>
                    <View style={styles.AttachCardViewModel}>
                        <View style={{flexDirection: "column"}}>
                            <View style={{
                                width: config.DEVICEWIDTH * 0.97, height: config.DEVICEHEIGHT * 0.97}}>
                                    <View style={{width: config.DEVICEWIDTH * 0.97,
                                        height: config.DEVICEHEIGHT * 0.8}}>
                                        <ImageViewer cropWidth={config.DEVICEWIDTH * 0.98}
                                            cropHeight={config.DEVICEHEIGHT * 0.97}
                                            imageWidth={config.DEVICEWIDTH * 0.8}
                                            imageHeight={config.DEVICEHEIGHT * 0.6}
                                            style={{width: config.DEVICEWIDTH * 0.8,
                                            height: config.DEVICEHEIGHT * 0.6}}>
                                            <Image style={{width: config.DEVICEWIDTH * 0.8,
                                                height: config.DEVICEHEIGHT * 0.6}}
                                                resizeMode="contain"
                                                source={{uri: FileUrl}}
                                            />
                                        </ImageViewer>
                                    </View>
                            </View>
                            <View style={[styles.touchableOpacityStyle, {flexDirection: "row"}]}>
                                <Text style={{color: "#000000", fontSize: 20,
                                        width: config.DEVICEWIDTH * 0.9, fontWeight: "700"}}>
                                    {FileUrl.title}</Text>
                                <AntDesign name="close" size={35} color="red"
                                    onPress={() => FiletoggleModalVisibility()}
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