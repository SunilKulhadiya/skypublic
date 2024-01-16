import React from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { AntDesign } from '@expo/vector-icons';

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

const ProfileOther= ({navigation}) => {
  return (
    <View style={{alignItems: "center"}}>
    <View style={styles.center}>
        <Text style={styles.summaryTitle}>Roots Technology Pvt. Ltd.</Text>
        <Text style={styles.summarySubTitle1}>Promise in</Text>
        <Text style={styles.summaryText1}>Android & ios Development, Web Development</Text>
        <Text style={styles.summaryText1}>Digital Marketing, E-mail Marketing</Text>
        <Text style={styles.summaryText1}>and Facebook Marketing</Text>
        <Text style={styles.summarySubTitle1}>Situated at</Text>
        <Text style={styles.summaryText1}>City : Gwalior</Text>
        <Text style={styles.summaryText1}>State : Madhya Pradesh</Text>
        <Text style={styles.summaryText1}>Country : INDIA</Text>
        <Text style={styles.summarySubTitle1}>Present at</Text>
        <View style={styles.summaryTextContainer}>
          <Text style={styles.summaryText1}>E-mail : </Text>
          <Text style={styles.summaryText2}>rootstech@gmail.com</Text>
        </View>
    </View>
    </View>
  );
};
export default ProfileOther;

const styles = StyleSheet.create({
  center: {
    alignContent: 'center',
    alignItems: 'center',
    textAlign: "center",
    marginTop: DEVICEHEIGHT / 8,
    padding: 7,
  },
  LogoSize:{
    width: 65,
    height: 65,
  },
  summaryTitle:{
    marginTop: 1,
    fontSize: 25,
    fontWeight: "bold",
    color: "#F3DC0E",
    marginTop: 10,
  },
  summarySubTitle1:{
    marginTop: 10,
    fontSize: 18,
    padding: 1,
    color: 'grey',
    fontWeight: "bold",
    fontStyle: "italic",
  },
  summaryText1:{
    alignContent: 'center',
    alignItems: 'center',
    textAlign: "center",
    fontSize: 14,
    padding: 2,
    color: 'black',
  },
  summaryTextContainer:{
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    textAlign: "center",
  },
  summaryText2:{
    fontSize: 14,
    padding: 3,
    color: 'blue',
  },

});