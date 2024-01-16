import React from "react";
import { View, StyleSheet, Text, Image, Dimensions, ActivityIndicator, 
        FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { FontAwesome, Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';   

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

const ClassTimeTable = ({navigation}) => {

    const newdate = new Date();

    const [RefreshFlatList, set_RefreshFlatList] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);

    const [WeekDay, Set_WeekDay] = React.useState([{"day": "Monday"},{"day": "Tuesday"},{"day": "Wednesday"},
                                    {"day": "Thursday"},{"day": "Friday"}, {"day": "Saturday"}]);
    const [ClassTT, set_ClassTT] = React.useState([]);
    const [chevrondownClass, setchevrondownClass] = React.useState(true);
    const [classLView, set_classLView] = React.useState("none");
    const [ClassID, set_ClassID] = React.useState("0");
    const [ClassAtt, set_ClassAtt] = React.useState('Select');
    const [ClassForAtt, Set_ClassForAtt] = React.useState([]);

    const [chevrondownSection, setchevrondownSection] = React.useState(true);
    const [SectionLView, set_SectionLView] = React.useState("none");
    const [SectionID, set_SectionID] = React.useState('0');
    const [SectionID2, set_SectionID2] = React.useState('0');
    const [SectionAtt, set_SectionAtt] = React.useState('All');
    const SectionForAtt = [{section: "All", id: '0'}, {section: "A", id: '1'}, {section: "B", id: '2'},
                            {section: "C", id: '3'}, {section: "D", id: '4'}, {section: "E", id: '5'}];

    const [isShowFlatList, reset_isShowFlatList]=React.useState(false);
    const [isLoading, reset_isLoading]=React.useState(true);

    //---------------------------------
    const FetchFirst=async ()=>{
  
        AsyncStorage.getItem('SERVERURL').then(async (value) => {

            try{
                let responsClass = await fetch(value+'api/Webservice/getclass', {
                method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
                })
        
                let responsJsonClass = await responsClass.json();
                Set_ClassForAtt(responsJsonClass);
                console.log("Class : ", responsJsonClass);
                reset_isLoading(false);
            }catch(error){
            console.error("Error -1 : ",error);
            };

        });
    }
    React.useEffect(() => {
      FetchFirst()
    }, []);
    const onRefresh = () => {
        setRefreshing(true);
        FetchFirst();
      };
    //----------------------------------
    const FetchClassTT = async (clssID, sectnID) =>{
        AsyncStorage.getItem('SERVERURL').then(async (value) => {
            try{
                let responsTT = await fetch(value+'api/Webservice/getClassTimetable', {
                method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                body: JSON.stringify({class_id: clssID, section_id: sectnID })
            })

                let responsJsonTT = await responsTT.json();
                set_ClassTT(responsJsonTT);

                reset_isLoading(false);
                reset_isShowFlatList(true)
                setRefreshing(false);
                console.log("Home W : "+isShowFlatList, responsJsonTT);

            }catch(error){
            console.error("PD -2 : ",error.message);
            };
        });
    }    
    //-----------------------------------------------------Select Class
    const ClassList = () =>{
        set_SectionLView("none");
        setchevrondownSection(true);
        setchevrondownClass(!chevrondownClass);
        if(chevrondownClass){
            set_classLView("flex");
        }else{
            set_classLView("none");
        }
    }

    const SelectClass = async (idd, Sclass) => {
        set_ClassID(idd);
        set_ClassAtt(Sclass);
        set_classLView("none");
        setchevrondownClass(true);
        if(Sclass !== 'Select' && SectionAtt !== "Select"){
            FetchClassTT(idd, SectionID);
        }
    }

    const ShowClassFlatList = (Itms) => {
        return(
            <TouchableOpacity onPress={() => SelectClass(Itms.id, Itms.class)} key={Itms.id}>
                <View style={{backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                            height: DEVICEHEIGHT * 0.05,}}>
                    <Text style={{width: DEVICEWIDTH * 0.2, color: "#000000", fontSize: 17}}>
                            {Itms.class}. </Text>
                    <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 1}}></View>                        
                </View>
            </TouchableOpacity>
        );
    }
    //---------------------------------------Section List for select
    const SectionList = () =>{
        set_classLView("none");
        setchevrondownClass(true);

        setchevrondownSection(!chevrondownSection);
        console.log("Section List : ", chevrondownSection);

        if(chevrondownSection){
            set_SectionLView("flex");
        }else{
            set_SectionLView("none");
        }
        console.log("Section List : ", chevrondownSection);
        console.log("Class List V : ", SectionLView);
    }

    const SelectSection = async (idd, SectionTitle) => {
        set_SectionID(idd);
        set_SectionAtt(SectionTitle);
        set_SectionLView("none");
        setchevrondownSection(true);

        if(ClassAtt !== 'Select' && SectionTitle !== "Select"){
            FetchClassTT(ClassID, idd);
        }
    }

    const ShowSectionFlatList = (Itmsection, Index) => {
        return(
            <TouchableOpacity onPress={() => SelectSection(Itmsection.id, Itmsection.section)} key={Itmsection.id}>
                <View style={{backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                            height: DEVICEHEIGHT * 0.05,}}>
                    <Text style={{width: DEVICEWIDTH * 0.2, color: "#000000", fontSize: 17, marginBottom: 6}}>
                            {Itmsection.section}. </Text>
                    <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 1}}></View>                        
                </View>
            </TouchableOpacity>
        );
    }
    //----------------------------------------------
    const ShowHomeWorkList = (hw, Index, wday) => {
        if(hw.day == wday)
        return(
            <View style={[styles.Column2, {marginBottom: 15}]}>
                    <View style={styles.Row2}>
                        <Text style={{fontSize:20, fontWeight: "bold", color: "#1407BF"}}>{hw.subject_name}</Text>
                    </View>
                    <View style={styles.Row2}>
                        <Text style={{width: DEVICEWIDTH * 0.20, color: "#000000"}}>Time</Text>
                        <Text style={{width: DEVICEWIDTH * 0.06, color: "#000000", fontWeight: "bold"}}>:</Text>
                        <Text style={{width: DEVICEWIDTH * 0.16, fontWeight: "700"}}>{hw.time_from}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.06, color: "#000000"}}>to</Text>
                        <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "700"}}>{hw.time_to}</Text>
                    </View>
                    <View style={styles.Row2}>
                        <Text style={{width: DEVICEWIDTH * 0.20, color: "#000000"}}>Teacher</Text>
                        <Text style={{width: DEVICEWIDTH * 0.06, color: "#000000", fontWeight: "bold"}}>:</Text>
                        <Text style={{width: DEVICEWIDTH * 0.4, fontWeight: "700"}}>{hw.staff_name} {hw.staff_surname}</Text>
                    </View>
            </View>
        );
    }
      const ShowList = (Itm, Index) => {
            return(
                <View style={styles.SContainer}>
                    <View style={styles.CardView2}>
                    <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05, backgroundColor: "#BAFAFF",
                                    borderTopLeftRadius: 15, borderTopRightRadius: 15, justifyContent: "center"}}>
                        <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold",
                                    width: DEVICEWIDTH * 0.7}}>{Itm.day}</Text>
                    </View>
                    <FlatList contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                        horizontal extraData={RefreshFlatList}
                        data={ClassTT.result_list}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => ShowHomeWorkList(item, index, Itm.day)}
                    />
                    <View style={{marginTop: 15}}></View>

                    </View>
                </View>
            );
    }
//----------------------------------------------
   return (
    <View>
    {
        isLoading ? (
            <ActivityIndicator/>
        ):(
            <View style={styles.Mcontainer}>
                <View style={{padding: 10, alignItems: "center", height: DEVICEHEIGHT * 0.15}}>
                    <View style={styles.Row1}>
                        <View style={styles.Column1}>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Your Class</Text>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Timetable is here!</Text>

                        </View>
                        <View style={{width: DEVICEWIDTH * 0.27, flexDirection: "column", alignItems: "center"}}>
                            <Image source={require('../assets/schedule.jpg')} style={{width: 120, height: 100, 
                                borderRadius: 20,}}/>
                        </View>
                    </View>
                </View>
                <View style={[styles.Row2, {left: "2%", top: "5%"}]}>
                    <Text style={{width: DEVICEWIDTH * 0.13, fontSize: 14, fontWeight: "bold"}}>
                        Class :</Text>
                    <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: '28%',height: DEVICEHEIGHT * 0.03,
                                borderRadius: 20, flexDirection: "row"}} onPress={() => ClassList()}>
                        <Text style={{width: DEVICEWIDTH * 0.175, fontSize: 14, fontWeight: "bold",
                                    marginLeft: 10}}>{ClassAtt}</Text>
                        <FontAwesome name={chevrondownClass ? "chevron-down" : "chevron-up"}
                                        size={19} color="black"/>
                    </TouchableOpacity>

                    <Text style={{width: DEVICEWIDTH * 0.19, fontSize: 14, fontWeight: "bold", 
                            marginLeft: DEVICEWIDTH * 0.07}}>Section :</Text>
                    <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: '26%',height: DEVICEHEIGHT * 0.03,
                                borderRadius: 20, flexDirection: "row"}} onPress={() => SectionList()}>
                        <Text style={{width: DEVICEWIDTH * 0.17, fontSize: 14, fontWeight: "bold",
                                    marginLeft: 10}}>{SectionAtt}</Text>
                        <FontAwesome name={chevrondownSection ? "chevron-down" : "chevron-up"}
                                        size={19} color="black"/>
                    </TouchableOpacity>
                </View>

                <View style={{marginTop: 40}}></View>
                {
                    isShowFlatList ? (
                        <FlatList contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                            data={WeekDay} extraData={refreshing}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item, index}) => ShowList(item, index)}
                            refreshControl={
                                <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                />
                            }
                        />
                        ):(
                            <View></View>
                        )
                }
                <View style={{marginTop: 70}}></View>
            {/* </ScrollView> */}
            </View>
        )
    }
            <FlatList contentContainerStyle={{ flexGrow: 1 }} 
            showsVerticalScrollIndicator={false}
            data={ClassForAtt.data} style={[styles.dropdownClass, {display: classLView}]}
            keyExtractor={(item, indexx) => indexx.toString()}
            renderItem={({item, indexx}) => ShowClassFlatList(item, indexx)}
        />
        <FlatList contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            data={SectionForAtt} style={[styles.dropdownSection, {display: SectionLView}]}
            keyExtractor={(item, indexx) => indexx.toString()}
            renderItem={({item, indexx}) => ShowSectionFlatList(item, indexx)}
        />

    </View>
  );
};
export default ClassTimeTable;


const styles = StyleSheet.create({
    Mcontainer: {
        width: DEVICEWIDTH,
        height: DEVICEHEIGHT,
    },
    SContainer: {
        left: "2.35%",        
    },
    dropdownClass: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '25%',
        height: DEVICEHEIGHT * 0.3,
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        elevation: 3,
        top: "18%",
        left: "17%",
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
        top: "18%",
        left: "70%",
    },
    dropdownSubject: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '80%',
        height: DEVICEHEIGHT * 0.3,
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        elevation: 3,
        top: "23%",
        left: "5%",
    },

    CardViewModel: {
        justifyContent: "center",
        position: "absolute",
        top: "40%",
        left: "45%",
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        width: DEVICEWIDTH * 0.9,
        backgroundColor: "#FFFFFF",
        borderRadius: 7,
    },
    CardView2: {
        left: "40%",
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        width: DEVICEWIDTH * 0.95,
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        marginTop: DEVICEHEIGHT * 0.12,
        marginBottom: -DEVICEHEIGHT * 0.1,
    },
    Row1: {
        flexDirection: "row",
    },
    Row2: {
        flexDirection: "row",
        marginTop: 10,
    },
    Column1: {
        flexDirection: "column",
        width: DEVICEWIDTH * 0.64,
    },
    Column2: {
        flexDirection: "column",
        width: DEVICEWIDTH * 0.89,
        marginLeft: 10,
    },
    ColumnM1: {
        flexDirection: "column",
        marginLeft: 10,
        top: 5,
    },
    dropdownBtnStyle: {
        textAlign: "center",
        width: '75%',
        height: DEVICEHEIGHT * 0.04,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginTop: DEVICEHEIGHT * 0.017,

    },
    dropdownBtnTextStyle: {
        color: '#000000',
        textAlign: "left",
        fontWeight: 'bold',
        width: 350,
    },
    DropDIcon: {
    right: 0,
    },
    viewWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    textInput: {
        fontSize: 18,
        backgroundColor: "#C9C9C9",
        
    },
    floatingButtonStyle: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
        //backgroundColor:'black'
    },

});