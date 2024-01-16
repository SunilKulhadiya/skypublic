import React from 'react';
import {
    StyleSheet, View, Text, SafeAreaView, FlatList, ActivityIndicator, Image,
    Dimensions, TouchableOpacity, Alert, Modal, ScrollView, RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import config from './app_config';

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

export default function Std_IDCard({ navigation, route }) {

    const newdate = new Date();
    const [Session, set_Session] = React.useState(`${newdate.getFullYear()}-${newdate.getFullYear() + 1}`);
    const [FetchData, set_FetchData] = React.useState([]);

    const SectionForAtt = [{ section: "Select", id: '0' }, { section: "A", id: '1' }, { section: "B", id: '2' },
    { section: "C", id: '3' }, { section: "D", id: '4' }, { section: "E", id: '5' }];
    const [isLoading, reset_isLoading] = React.useState(true);
    const [isShowFlatList, reset_isShowFlatList] = React.useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [color, changeColor] = React.useState('red');

    const [ServerUrl, set_ServerUrl] = React.useState("");

    const [Mess_P_Share, set_Mess_P_Share] = React.useState("Download next page....");
    const [Print_Share, set_Print_Share] = React.useState("1");
    const [IndicatorT, set_IndicatorT] = React.useState(8000);
    const [isDownloadModel, set_DownloadModel] = React.useState(false);
    const [PrintDownload, set_PrintDownload] = React.useState(false);
    const [PrintFrom, set_PrintFrom] = React.useState(0);
    const [PrintTo, set_PrintTo] = React.useState(0);
    const [StdImg, set_StdImg] = React.useState('');
    const [StdID, set_StdID] = React.useState('');
    const [CLAS, set_CLASS] = React.useState('');
    const [SECTIN, set_SECTION] = React.useState('');
    const [RowNo, set_RowNo] = React.useState(0);

    const [chevrondownClass, setchevrondownClass] = React.useState(true);
    const [classLView, set_classLView] = React.useState("none");
    const [ClassID, set_ClassID] = React.useState("0");
    const [ClassAtt, set_ClassAtt] = React.useState('Select');
    const [ClassForAtt, Set_ClassForAtt] = React.useState([]);

    const [chevrondownSection, setchevrondownSection] = React.useState(true);
    const [SectionLView, set_SectionLView] = React.useState("none");
    const [SectionID, set_SectionID] = React.useState('0.0');
    const [SectionAtt, set_SectionAtt] = React.useState('Select');
    //const [SectionForAtt, set_SectionForAtt] = React.useState([]);
    let html2 = ``, html;

    React.useEffect(() => {
        AsyncStorage.getItem('SERVERURL').then((value) => set_ServerUrl(value));
        AsyncStorage.getItem('StdID').then((value) => set_StdID(value));
        AsyncStorage.getItem('CLASS').then((value) => set_ClassAtt(value));
        AsyncStorage.getItem('SECTION').then((value) => set_SectionAtt(value));
        AsyncStorage.getItem('CLASS_ID').then((classid) => {
            set_ClassID(classid);
            AsyncStorage.getItem('SECTION_ID').then((sectionid) => {
                set_SectionID(sectionid);
                FetchProfile(classid, sectionid);
            });
        });

        //FetchPersonal();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        FetchProfile(ClassID, SectionID);
        setTimeout(() => {
            changeColor('green');
            setRefreshing(false);
        }, 2000);
    };

    //-----------------------------------------------
    const FetchProfile = async (classid, sectionid) => {
        console.log("FetchProfile, Class ID  : " + classid + ", Section ID : " + sectionid);
        let resultProfile;
        try {
            resultProfile = await fetch(config.Url+'classwisestudent', {
                method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
                body: JSON.stringify({ class_id: classid, section_id: sectionid, session_id: "19" })
            })
            let responseProfile = await resultProfile.json();

            console.log("FetchProfile,  : ", responseProfile);
            set_RowNo(responseProfile.length);
            set_FetchData(responseProfile);
            reset_isShowFlatList(true);
            setRefreshing(false);
            reset_isLoading(false);
        } catch (err) {
            Alert.alert("Please refresh, somthing went wrong.");
            console.error("Error-1 : ", err);
            reset_isLoading(false);
            setRefreshing(false);
        }
    }
    //-----------------------------------------
    const ShowList = (Itm, Index) => {
        if (Itm.student_id == StdID)
            return (
                <View style={{ marginTop: 100 }}>
                    <View style={styles.CardView}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.TriangleShap}>
                            </View>
                            <Text style={{ top: '-37%', fontSize: 24, color: 'white', fontWeight: 'bold', }}>SKY PUBLIC SCHOOL</Text>
                            <Text style={styles.TextAngle}>{Session}</Text>
                            <View style={styles.lineRight}></View>
                            <View style={styles.lineLeft}></View>
                            <Image source={require('../assets/logoBn.png')} style={{
                                width: 50, height: 50, borderRadius: 50,
                                borderColor: "#FFFFFF", borderWidth: 0, marginRight: 0, top: "-42%",
                                left: "0%"
                            }} />
                            <Image source={{ uri: ServerUrl + Itm.image }} style={{
                                width: 120, height: 120, borderRadius: 10,
                                borderColor: "#FFFFFF", borderWidth: 0, marginRight: 0, top: "-40%"
                            }} />
                            <View style={[styles.Column, { marginTop: '-53%', marginLeft: "5%" }]}>
                                <View style={styles.Row1}>
                                    <Text style={{ width: "18%", fontSize: 15, fontWeight: 'bold' }}>Name</Text>
                                    <Text style={{ width: "2%", fontSize: 15, fontWeight: 'bold' }}>:</Text>
                                    <Text style={{ width: "42%", fontSize: 15, fontWeight: 'bold' }}>
                                        {Itm.firstname} {Itm.lastname}</Text>
                                </View>
                                <View style={styles.Row1}>
                                    <Text style={{ width: "18%", fontSize: 15, fontWeight: 'bold' }}>Class</Text>
                                    <Text style={{ width: "2%", fontSize: 15, fontWeight: 'bold' }}>:</Text>
                                    <Text style={{ width: "42%", fontSize: 15, fontWeight: 'bold' }}>
                                        {Itm.class} | Sec : {Itm.section}</Text>
                                </View>
                                <View style={styles.Row1}>
                                    <Text style={{ width: "18%", fontSize: 15, fontWeight: 'bold' }}>DOB</Text>
                                    <Text style={{ width: "2%", fontSize: 15, fontWeight: 'bold' }}>:</Text>
                                    <Text style={{ width: "24%", fontSize: 15, fontWeight: 'bold' }}>{Itm.dob}</Text>
                                    <Text style={{ width: "13%", fontSize: 15, fontWeight: 'bold' }}>| B.G.:</Text>
                                    <Text style={{ width: "6%", fontSize: 15, fontWeight: 'bold' }}>{Itm.blood_group}</Text>
                                </View>
                                <View style={styles.Row1}>
                                    <Text style={{ width: "18%", fontSize: 15, fontWeight: 'bold' }}>F.Name</Text>
                                    <Text style={{ width: "2%", fontSize: 15, fontWeight: 'bold' }}>:</Text>
                                    <Text style={{ width: "42%", fontSize: 15, fontWeight: 'bold' }}>{Itm.father_name}</Text>
                                </View>
                                <View style={styles.Row1}>
                                    <Text style={{ width: "18%", fontSize: 15, fontWeight: 'bold' }}>M.Name</Text>
                                    <Text style={{ width: "2%", fontSize: 15, fontWeight: 'bold' }}>:</Text>
                                    <Text style={{ width: "42%", fontSize: 15, fontWeight: 'bold' }}>{Itm.mother_name}</Text>
                                </View>
                                <View style={styles.Row1}>
                                    <Text style={{ width: "18%", fontSize: 15, fontWeight: 'bold' }}>Mob.</Text>
                                    <Text style={{ width: "2%", fontSize: 15, fontWeight: 'bold' }}>:</Text>
                                    <Text style={{ width: "42%", fontSize: 15, fontWeight: 'bold' }}>{Itm.mobileno},</Text>
                                </View>
                                <Text style={{ width: "42%", fontSize: 15, fontWeight: 'bold', left: "10%" }}>
                                    {Itm.guardian_phone}</Text>

                            </View>
                            <Image source={require('../assets/sky_signature.png')} style={{ width: 50, height: 50, marginTop: 5, left: "26%" }} />

                            <Text style={{ left: "28%", fontWeight: '800' }}>Principal Sign.</Text>
                            <View style={{ backgroundColor: 'blue', width: "92%", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white', marginTop: 4, fontSize: 13 }}>
                                    Add. Bal Gopal Colony Badagaon, Morar, Gwalior-(M.P.)</Text>
                                <Text style={{ color: 'white', }}>Mob. 9755766915, 9522241890, 8963906228</Text>
                                <Text style={{ color: 'white', marginBottom: 4 }}>
                                    E-mail : skypublicschool2012@gmail.com</Text>
                            </View>
                        </View>
                        <View style={{ marginBottom: 10 }}></View>
                    </View>
                    {
                        Index == RowNo - 1 ? (
                            <View style={{ marginBottom: 80 }}></View>
                        ) : (
                            <View style={{ marginBottom: 30 }}></View>
                        )
                    }
                </View>
            );
    }
    //------------------------------------
    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={styles.Mcontainer}>
                    <View style={{ marginTop: 10, alignItems: "center", height: DEVICEHEIGHT * 0.08 }}>
                        <View style={styles.Row1}>
                            <View style={styles.Column1}>
                                <Text style={{ fontSize: 20, fontWeight: "700" }}>Your School ID Card</Text>
                                <Text style={{ fontSize: 20, fontWeight: "700" }}>is here!</Text>
                            </View>
                            <View style={{ width: DEVICEWIDTH * 0.27, flexDirection: "column", alignItems: "center" }}>
                                <Image source={require('../assets/IDCard.jpg')} style={{
                                    width: 100, height: 100,
                                    borderRadius: 20,
                                }} />
                            </View>
                        </View>
                    </View>
                    <View style={[styles.Row2, {left: "5%"}]}>
                            <Text style={{ width: DEVICEWIDTH * 0.2, fontSize: 14, fontWeight: "bold" }}>
                                Class : {ClassAtt}</Text>
                            <Text style={{
                                width: DEVICEWIDTH * 0.18, fontSize: 14, fontWeight: "bold",
                                marginLeft: DEVICEWIDTH * 0.07
                            }}>Section : {SectionAtt}</Text>
                    </View>

                    {
                        isLoading ? (
                            <ActivityIndicator />
                        ) : (
                            <View style={{alignItems : 'center' }}>
                                {
                                    isShowFlatList ? (
                                        <FlatList contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                                            data={FetchData.data} extraData={refreshing}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => ShowList(item, index)}
                                        />
                                    ) : (
                                        <View></View>
                                    )
                                }
                                <View style={{ marginTop: 70 }}></View>
                            </View>
                        )
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
//--------------------------------------------------
const styles = StyleSheet.create({
    Mcontainer: {
        width: DEVICEWIDTH,
        height: DEVICEHEIGHT,
    },
    SContainer: {
        marginTop: DEVICEHEIGHT * 0.01,
        left: "5%",
    },
    CardView: {
        left: "42%",
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) },
        { translateY: -90 }],
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        width: DEVICEWIDTH * 0.95,
        bottom: "0%",
    },
    Row1: {
        flexDirection: "row",
    },
    Row2: {
        flexDirection: "row",
        marginTop: 20,
        height: 50,
    },
    Column: {
        flexDirection: "column",
        width: "100%",
        alignItems: 'center',
    },

    Column1: {
        flexDirection: "column",
        width: DEVICEWIDTH * 0.64,
    },
    dropdownClass: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '35%',
        height: DEVICEHEIGHT * 0.3,
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        elevation: 3,
        top: "22%",
        left: "12%",
    },
    dropdownSection: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '26%',
        height: DEVICEHEIGHT * 0.3,
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        elevation: 3,
        top: "22%",
        left: "70%",
    },
    TriangleShap: {
        width: 0,
        height: 0,
        borderLeftWidth: 180,
        borderRightWidth: 180,
        borderTopWidth: 200,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'blue',
        marginTop: 10,
        top: "-0%",
    },
    TextAngle: {
        transform: [{ rotate: '-48deg' }],
        color: 'white',
        top: "-34%",
        left: "26%",
        fontWeight: 'bold',
    },
    lineRight: {
        transform: [{ rotate: '-48deg' }],
        backgroundColor: 'white',
        top: "-32%",
        left: "24%",
        width: 238,
        height: 5,
    },
    lineLeft: {
        transform: [{ rotate: '48deg' }],
        backgroundColor: 'white',
        top: "-32.3%",
        left: "-23%",
        width: 235,
        height: 5,
    },
    viewWrapper: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    CardViewModel: {
        justifyContent: "center",
        position: "absolute",
        top: "27%",
        left: "45%",
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) },
        { translateY: -90 }],
        width: "40%",
        backgroundColor: "#FFFFFF",
        borderRadius: 7,
    },
    ColumnM1: {
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },

});