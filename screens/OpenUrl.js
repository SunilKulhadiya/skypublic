import React, { Component } from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet,
    SafeAreaView, Image, Share} from 'react-native';
import { WebView } from 'react-native-webview';
import { AntDesign } from '@expo/vector-icons';

import config from './app_config';

export default class OpenUrl extends Component {
    constructor() {
        super()
      this.state = {
            DataDetail : [], //define a state
            title: "",
            isLoading: true,
        }
    }

    async componentDidMount(){
    //   let Top5, fontsz = 33, ImgW = DEVICEWIDTH * 2.3, ImgH = DEVICEWIDTH * 1.5;
    //     console.log("ShowDetail.js, route.params.PageID : ", this.props.route.params.PageUrl);
    //         Top5 = await DR.Get_Detail(this.props.route.params.PageUrl);
    //         this.setState({DataDetail: Top5});
    
    //         setTimeout(()=> {
    //             this.setState({isLoading: false});
    //         }, 50);
    
    }

    //-------------------------------
    

  render() {
    // const ShareLink = ()=> {
    //     Share.share({
    //       message: this.state.ShareUrl.toString(),
    //     })
    //       //after successful share return result
    //       .then((result) => console.log(result))
    //       //If any thing goes wrong it comes here
    //       .catch((errorMsg) => console.log(errorMsg));
    //   }

    return (
      <SafeAreaView style={{ flex: 1 }}>
              <View style={{flexDirection: 'row', height: config.DEVICEHEIGHT * 0.07, width: config.DEVICEWIDTH,
                            backgroundColor: "#FF9F0B", alignItems: 'center', marginTop: 0}}>
                <View style={{justifyContent:'center', alignItems: 'center', flexDirection: "row",
                                marginStart: 20}}>
                    <AntDesign name="arrowleft" size={35} color="#FFFFFF" 
                            onPress={()=> this.props.navigation.goBack()} />
                    <Text style={{color: "#FFFFFF", marginStart: 10, fontSize: 15,
                        width: config.DEVICEWIDTH * 0.86, fontWeight: 'bold', padding: 5}}>
                        {this.props.route.params.Title}</Text>
                </View>
              </View>
              {
                    this.isLoading ? (
                        <ActivityIndicator/>
                    ):(
                        <View style={{width: config.DEVICEWIDTH, height: config.DEVICEHEIGHT}}>
                        <WebView
                        source={{ uri: this.props.route.params.PageUrl }}
                        />
              {/* <View style={styles.touchableOpacityStyle}>
                <AntDesign name="sharealt" size={40} color="#2574EB"  style={styles.floatingB}
                  onPress={()=> ShareLink()}/>
              </View> */}
                        <View style={{marginTop: 80}}/>
                        </View>
                    )
                }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      height: config.DEVICEHEIGHT,
      width: config.DEVICEWIDTH,
      flexDirection: 'column',
    },
    cardview2: {
        backgroundColor: 'grey',
        borderRadius: 10,
        elevation: 10,
    },
    touchableOpacityStyle: {
      position: 'absolute',
      elevation: 15,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      right: 10,
      bottom: 80,
    },
    floatingB: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 40,
      elevation: 15,
    },
  
});
