import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet,
    SafeAreaView, ActivityIndicator} from 'react-native';
import { WebView } from 'react-native-webview';
import { AntDesign, FontAwesome5, } from '@expo/vector-icons';

import config from './app_config';

export default function PdfViewer ({navigation, route}) {

  const[isLoading, set_isLoading] = React.useState(true);
  React.useEffect(()=>{
    set_isLoading(true);
    setTimeout(()=>{
      set_isLoading(false);
    }, 300);
  },[])

  //-------------------------------
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{flexDirection: "row", width: config.DEVICEWIDTH, height: config.DEVICEHEIGHT * 0.07,
          justifyContent: 'flex-start', backgroundColor: "#FF9F0B", paddingTop: 8}}>
            <AntDesign name="arrowleft" size={40} color="#FFFFFF"
                onPress={()=> navigation.goBack()}
                style={{width: "14%", height: "100%"}}/>
              <Text style={{color: "#000000", fontSize: 20, fontWeight: '800',
                width: "80%", height: "100%", marginTop: 5}}>{route.params.title}</Text>
        </View>

        <View style={{width: config.DEVICEWIDTH, height: config.DEVICEHEIGHT * 0.88,
          alignItems: 'center', justifyContent: 'center'}}>
          {
            this.isLoading ? (
                <ActivityIndicator/>
            ):(
              <View>
              <WebView style={{ height: config.DEVICEHEIGHT * 0.88, width: config.DEVICEWIDTH * 0.95 }}
                nestedScrollEnabled={true}
                source={{ uri: 'https://drive.google.com/viewerng/viewer?embedded=true&url='+
                                route.params.fileuri }}
              />
              </View>
            )
          }
        </View>
      </SafeAreaView>
    );
}