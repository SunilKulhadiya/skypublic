import React from "react";
import { View, Text, StyleSheet, Dimensions, TextInput, Button, ActivityIndicator, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, SafeAreaView, StatusBar, Alert} from "react-native";
//import SelectDropdown from "react-native-select-dropdown";
import { FontAwesome, Fontisto, MaterialIcons } from '@expo/vector-icons';

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

const SignUp = (navigation) => {

  const materialfor=['+91', '+11', '+12', '+13'];
  const [MobileNo, setMobileNo] = React.useState("");
  const [UserPass, setUserPass] = React.useState("");
  const [ConfirmPass, setConfirmPass] = React.useState("");
  const [UserName, setUserName] = React.useState("");
  const [EmailID, setEmailID] = React.useState("");
  const [waitProc, setwaitP] = React.useState(false);
  const [GoBackLogin, setGBLin] = React.useState(true);
  const [SelectProduct, updateSelectProduct] = React.useState('+91');
  const [isPasswordSecure, setisPasswordSecure] = React.useState(true);
  const [isPasswordSecureConf, setisPasswordSecureConf] = React.useState(true);

  const SaveContinue=(A)=>{
    console.log(MobileNo);
    if(UserPass === ConfirmPass){
      setwaitP(true);
      fetch('https://skand.tech/LoginMyTest.php', {
        method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
        body: JSON.stringify({Action: 'Insert', smobileno: MobileNo, emailid: EmailID, password: UserPass})
      }).then(response => response.json()).then(( responseJson ) => {
      console.log("Json :"+responseJson);
        setwaitP(false);
        setGBLin(false)
        if(responseJson.Mess === 'Successfully Saved'){
          setMobileNo('');
          setEmailID('');
          setUserPass('');
          setConfirmPass('');
        }
      }).catch((error) => {
        console.error(error);
        setMobileNo('');
        setEmailID('');
        setUserPass('');
        setConfirmPass('');
        setwaitP(false);
        setGBLin(false)
    });

    }else{
      Alert.alert("Password mismatch...")
    }
  }
  
  return (
    <SafeAreaView>
      <StatusBar barStyle={"dark-content"} backgroundColor="#ecf0f1" />
        <View style={styles.container}>
        <View style={styles.TitleSty}>
            </View>
          <View style={styles.DispCol}>
                    <View style={styles.DispRow}>
                      <View style={styles.IconSpace}>
                        <FontAwesome name="mobile-phone" size={30} color="green" />
                      </View>

                  <View style={styles.MobmarginL}>
                      <TextInput placeholder="Mobile NO." onChangeText={(text) => setMobileNo(text)}
                                  value={MobileNo}/>
                      </View>
                    </View>
                    <View style={styles.DispRow}>
                      <View style={styles.IconSpace}>
                        <Fontisto name="email" size={24} color="black" />
                      </View>
                      <TextInput placeholder="Email ID" onChangeText={(text) => setEmailID(text)}
                                value={EmailID}/>
                    </View>
                    <View style={styles.DispRow}>
                      <View style={styles.IconSpace}>
                        <MaterialIcons name="lock-outline" size={24} color="black" />
                      </View>
                      <View style={styles.PasswWidth}>
                        <TextInput placeholder="Password" onChangeText={(text) => setUserPass(text)}
                               secureTextEntry={isPasswordSecure} value={UserPass}/>
                      </View>
                      <FontAwesome name={isPasswordSecure ? "eye-slash" : "eye"} size={24} color="#000000"
                          onPress={() => {isPasswordSecure ? setisPasswordSecure(false) : setisPasswordSecure(true)}}/>
                    </View>
                    <View style={styles.DispRow}>
                      <View style={styles.IconSpace}>
                        <MaterialIcons name="lock-outline" size={24} color="#000000" />
                      </View>
                        <View style={styles.PasswWidth}>
                          <TextInput placeholder="Confirm" onChangeText={(text) => setConfirmPass(text)}
                               secureTextEntry={isPasswordSecureConf} value={ConfirmPass}/>
                        </View>
                        <FontAwesome name={isPasswordSecureConf ? "eye-slash" : "eye"} size={24} color="#000000"
                          onPress={() => {isPasswordSecureConf ? setisPasswordSecureConf(false) : 
                                                                  setisPasswordSecureConf(true)}}/>
                    </View>
                        <View style={styles.Bottn}>
                          {
                            waitProc ?(
                              <ActivityIndicator style={styles.LoadingIndicator}/>
                            ) : (
                              GoBackLogin ?(
                              <Button style={styles.BottnR} title="Continue" onPress={() => SaveContinue('a')}/>
                              ):(
                                <Text>Go back and login.</Text>
                              )
                            )
                          }
                        </View>
                </View>
                
        </View>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    width: DEVICEWIDTH,
  },
  TitleSty: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: DEVICEWIDTH * 0.17,
  },
  TitleStyText: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    color: 'black',
    fontSize: 25,
    marginTop: 20,
    marginBottom: 10,
  },
  DispCol: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    flexDirection: 'column',
    marginTop: DEVICEWIDTH*0.08,
  },
  DispRow: {
    flexDirection: 'row',
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
    width: DEVICEWIDTH*0.7,    
  },
  IconSpace: {
    justifyContent: "flex-start",
    marginRight: 25,
  },
  DispRowButt: {
    flexDirection: 'row',
    justifyContent: "flex-end",
    alignItems: "center",
    textAlign: "center",
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 7,
    padding: 5,
    marginTop: 40,
    width: DEVICEWIDTH*0.7,
  },
  PasswWidth: {
    width: DEVICEWIDTH*0.45,
  },
  MobmarginL: {
    marginLeft: 10,
  },
  Bottn: {
    justifyContent: "flex-end",
    alignItems: "center",
    textAlign: "center",
    padding: 0,
    marginTop: 15,
  },
  BottnL: {
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 7,
    marginRight: 20,
  },
  BottnR: {
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 7,
  },
  dropdownBtnStyle: {
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
    width: '32%',
    height: 30,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  dropdownBtnTextStyle: {
      color: '#000000',
      textAlign: 'center',
      fontWeight: 'bold',
  },

});
