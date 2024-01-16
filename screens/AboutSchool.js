import React from "react";
import { View, StyleSheet, Text, Image, Dimensions, SafeAreaView, StatusBar } from "react-native";
import { AntDesign } from '@expo/vector-icons';

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

const AboutSchool = ({navigation}) => {

  const [DataS, set_data] = React.useState([]);
  const [isLoading, reset_isLoading]=React.useState(true);

  const FetchPersonal=async ()=>{
  
    try{
      let respons1 = await fetch('https://amritaaz.com/school/api/Webservice/getSchoolDetails', {
        method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
      })

      let responsJson = await respons1.json();
      console.log("responsJson : ",responsJson);
      set_data(responsJson);
      reset_isLoading(false);
      set_isFlatListLoading(false);
    }catch(err){
        console.error("Error-1 : ",err);
    }
  }
    React.useEffect(() => {
      FetchPersonal()
    }, []);

   return (
    <SafeAreaView>
    <StatusBar barStyle={"dark-content"} backgroundColor="#ecf0f1" />
      <View style={styles.Mcontainer}>
      {
        <View style={styles.Center}>
          <Image source={require('../assets/logoBn.png')} style={{width: DEVICEWIDTH * 0.9, height: DEVICEWIDTH * 0.9}}/>
          <View style={styles.Column}>
            <View>
              <Text style={{fontSize: 24, fontWeight: "bold", marginBottom: DEVICEHEIGHT * 0.01,
                            color: "#0000FF", textAlign: "center"}}>
                Sky Public Hr. Sec. School</Text>
            </View>
            <Text style={{fontSize: 10, left: "40%"}}>Dise Code: 2340405326, 23040405709</Text>
            <Text style={{width: DEVICEWIDTH * 0.3, fontSize: 20, fontWeight: "600"}}>Address</Text>
            <View style={styles.Row}>
              <Text style={{width: DEVICEWIDTH * 0.2}}>Branch-1</Text>
              <Text style={{width: DEVICEWIDTH * 0.04}}>:</Text>
              <Text style={{width: DEVICEWIDTH * 0.65}}>Bal Gopal Colony, Bada Goan Chauraha, Lal Tipara Road, Morar Gwalior-M.P.</Text>
            </View>
            <View style={styles.Row}>
              <Text style={{width: DEVICEWIDTH * 0.2}}>Branch-2</Text>
              <Text style={{width: DEVICEWIDTH * 0.04}}>:</Text>
              <Text style={{width: DEVICEWIDTH * 0.65}}>Mau Road Khureri Morar, Gwalior-M.P.</Text>
            </View>
            <View style={styles.Row}>
              <Text style={{width: DEVICEWIDTH * 0.2}}>Website</Text>
              <Text style={{width: DEVICEWIDTH * 0.04}}>:</Text>
              <Text style={{width: DEVICEWIDTH * 0.6}}>www.skygroupofeducation.com</Text>
            </View>
            <View style={styles.Row}>
              <Text style={{width: DEVICEWIDTH * 0.2}}>E-mail</Text>
              <Text style={{width: DEVICEWIDTH * 0.04}}>:</Text>
              <Text style={{width: DEVICEWIDTH * 0.65}}>skypublicschool2012@gmail.com</Text>
            </View>
            <View style={styles.Row}>
              <Text style={{width: DEVICEWIDTH * 0.2}}>Mob. No.</Text>
              <Text style={{width: DEVICEWIDTH * 0.04}}>:</Text>
              <Text style={{width: DEVICEWIDTH * 0.5}}>9755766915, 9522241890, 8963906228, 8120786228</Text>
            </View>
          </View>
        </View>
      }
      </View>
    </SafeAreaView>
);
}
export default AboutSchool;

const styles = StyleSheet.create({
  Mcontainer: {
    width: DEVICEWIDTH,
    height: DEVICEHEIGHT,
    backgroundColor: "#AAEAFE"
  },
  Center: {
    flex: 1,
    top: "0%",
    alignItems: "center",
  },
  Row: {
    flexDirection: "row",
    marginTop: 10,
  },
  Column: {
    flexDirection: "column",
  },


});




/*
        <View style={styles.Center}>
          <View style={styles.Column}>
            <View style={{alignItems: "center"}}>
              <Text style={{fontSize: 18, fontWeight: "bold", marginBottom: DEVICEHEIGHT * 0.01,
                            color: "#FEBD0A", }}>
                {DataS.name}</Text>
            </View>
            <View style={styles.Row}>
              <Text style={{width: DEVICEWIDTH * 0.2}}>Address</Text>
              <Text style={{width: DEVICEWIDTH * 0.04}}>:</Text>
              <Text style={{width: DEVICEWIDTH * 0.5}}>{DataS.address}</Text>
            </View>
            <View style={styles.Row}>
              <Text style={{width: DEVICEWIDTH * 0.2}}>E-mail</Text>
              <Text style={{width: DEVICEWIDTH * 0.04}}>:</Text>
              <Text style={{width: DEVICEWIDTH * 0.5}}>{DataS.email}</Text>
            </View>
            <View style={styles.Row}>
              <Text style={{width: DEVICEWIDTH * 0.2}}>Mob. No.</Text>
              <Text style={{width: DEVICEWIDTH * 0.04}}>:</Text>
              <Text style={{width: DEVICEWIDTH * 0.5}}>{DataS.phone}</Text>
            </View>
          </View>
        </View>
*/