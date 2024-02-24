import {Keyboard, StyleSheet, Text, TextInput, View, TouchableOpacity,
    ScrollView, FlatList, Animated, Easing} from 'react-native';
import React, {useEffect, useState} from 'react';

export default RotateObject = ({Object, Degree}) => {

    const fadeInValue = new Animated.Value(0)
    const spinValue = new Animated.Value(0)

    Animated.sequence([
        Animated.delay(1000),
        Animated.timing(fadeInValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start()
  
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 360,
          duration: 300000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start()

    //------loop
    return(

        <Animated.View
            style={{
            opacity: fadeInValue,
            transform: [{ rotate: spinValue }],
            }}>

            <AntDesign name="caretdown" size={20} color="black"/>

        </Animated.View>

      );
    //---------------------------------
    const [rotateValue, setRotateValue] = useState(new Animated.Value(0));

    const handleAnimationClockW = () => {
    Animated.timing(rotateValue, {
        toValue: 180,
        duration: 500,
        useNativeDriver: true,
    }).start();
    };
    const handleAnimationAntiClockW = () => {
        Animated.timing(rotateValue, {
        toValue: -0,
        duration: 500,
        useNativeDriver: true,
        }).start(() => {
            rotateValue.setValue(0);
        });
    };

    //--------
    return(

        <TouchableOpacity onPress={()=> {
            if(ModeLView == "none"){
                set_ModeLView("flex");
                handleAnimationClockW();
            }else{
                set_ModeLView("none");
                handleAnimationAntiClockW();
            }
        }}>
    <Text style={{color: "#000000", fontSize: 17, marginTop: 0,
            marginLeft: 10, width: SIZES.width * 0.45}}>{EventMode}</Text>
     <Animated.View
        style={{
        transform: [{ rotate: rotateValue.interpolate({
            inputRange: [0, 180],
            outputRange: ["0deg", "180deg"],
        }) }],
        }}
    >
    <AntDesign name="caretdown" size={20} color="black"/>
        </Animated.View>
</TouchableOpacity>

    );


}