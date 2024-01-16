import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, ActivityIndicator, Image, 
        Dimensions, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import SelectDropdown from "react-native-select-dropdown";          //npm i react-native-select-dropdown
//import DropDownPicker from 'react-native-dropdown-picker';
//import Checkbox from "expo-checkbox";       //npx expo install expo-checkbox
        
const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

export default function FeesReceive({navigation}) {

    const newdate = new Date();
//    const [currentYear, set_Year] = React.useState(newdate.getFullYear());
  //  const [currentMonth, set_Month] = React.useState(newdate.getMonth()+1);

    const SectionForAtt = [{section: "Select", id: '0'}, {section: "A", id: '1'}, {section: "B", id: '2'},
                            {section: "C", id: '3'}, {section: "D", id: '4'}, {section: "E", id: '5'}];
    const [isSaving, reset_isSaving]=React.useState(false);
    const [TextSave, set_TextSave] = React.useState('Save');
    const [DataS, set_data] = React.useState([]);
    const [isLoading, reset_isLoading]=React.useState(true);
    const [isLoadingFlatList, reset_isLoadingFlatList]=React.useState(true);
    const [isLoadingFlatList1, reset_isLoadingFlatList1]=React.useState(false);
    const [isChecked, setChecked] = React.useState(true);

    const [SessionID, set_SessionID] = React.useState("NA");
    const [FeeGroupID, set_FeeGroupID] = React.useState("NA");

    const [chevrondownClass, setchevrondownClass] = React.useState(true);
    const [ClassForAtt, Set_ClassForAtt] = React.useState([]);
    const [classLView, set_classLView] = React.useState("none");
    const [ClassID, set_ClassID] = React.useState("0");
    const [ClassAtt, set_ClassAtt] = React.useState('Select');
    const [ClassAtt1, set_ClassAtt1] = React.useState('Select');

    const [chevrondownSection, setchevrondownSection] = React.useState(true);
    const [SectionLView, set_SectionLView] = React.useState("none");
    const [SectionID, set_SectionID] = React.useState('0.0');
    const [SectionAtt, set_SectionAtt] = React.useState('Select');
    const [SectionAtt1, set_SectionAtt1] = React.useState('Select');

    const [chevrondownStud, setchevrondownStud] = React.useState(true);
    const [StudentLView, set_StudentLView] = React.useState("none");
    const [Student_ID, set_Student_ID] = React.useState('0.0');
    const [StudentNme, set_StudentNme] = React.useState('Select');
    const [StudentFather, set_StudentFather] = React.useState('');

    const [FGData, Set_FGData] = React.useState([]);
    const [FeesGroupN, Set_FeesGroupN] = React.useState('Select');
    const [chevrondownFG, setchevrondownFG] = React.useState(true);
    const [FGroupLView, set_FGroupLView] = React.useState("none");

    const [FTData, Set_FTData] = React.useState([]);
    const [chevrondownFT, setchevrondownFT] = React.useState(true);
    const [FTypeLView, set_FTypeLView] = React.useState("none");
    const [FeesTypeN, Set_FeesTypeN] = React.useState('Select');
    const [FeeType_ID, set_FeeType_ID] = React.useState('0.0');

    let i =0;

    let YDAY= `${newdate.getDate()}/${newdate.getMonth() + 1}/${newdate.getFullYear()}`
                        
    //---------------------------------------------------------
    const FetchClass = async ()=>{  
        try {
            let resultClass = await fetch('https://amritaaz.com/school/api/Webservice/getclass', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
            })

            let responseClass = await resultClass.json();

            Set_ClassForAtt(responseClass);

        }catch(error) {
            console.error("FetchClass : ",error);
        }
        try {
            let resultFT = await fetch('https://amritaaz.com/school/api/Webservice/studentgettype', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
            })

            let responseFT = await resultFT.json();

            Set_FTData(responseFT);

            console.log("Fetch Fee Type : ", responseFT.data[0].id);

        }catch(error) {
            console.error("Fetch Fee Type : ",error);
        }
        try {
            let resultFG = await fetch('https://amritaaz.com/school/api/Webservice/studentgetgroup', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
            })

            let responseFG = await resultFG.json();

            Set_FGData(responseFG);

        }catch(error) {
            console.error("Fetch Fee Group : ",error);
        }

    }

    React.useEffect(() => {
        setTimeout(()=> {
        FetchClass()},2000);
    },[]);
    //---------------------------------------------------------Submit to server
    const SubmitToServer=async ()=>{  
        reset_isSaving(true);
        let SDAY= `${newdate.getFullYear()}-${newdate.getMonth() + 1}-${newdate.getDate()}`
        let responseUpload;

            let sessionID =  DataS.result_list[i].id;
            let PA = DataS.result_list[i].city;

                try {
                    let resultClass = await fetch('https://amritaaz.com/school/api/Webservice/submitstudentattandance', {
                    method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                    body: JSON.stringify({"data":[
                        {       
                            "student_session_id" : sessionID,
                            "biometric_attendence" : "NA",
                            "date" : SDAY,
                            "attendence_type_id" : PA,
                            "biometric_device_data" : "NA",
                            "is_active" : "No",
                            "remark" : "0"
                        }
                    ]})
                    })
        
                    responseUpload = await resultClass.json();

                }catch(error) {
                  console.error("FetchClass : ",error);
                }
                    

            console.log("FetchClass : ", i);


        // if(i >= DataS1.length){
        //     reset_isSaving(false);
        //     set_TextSave("Successfully Saved")
        //     setTimeout(()=> set_TextSave("Save"), 1000 * 3);
        // }
    }
    //------------------------------------****************************
    //---------------------------------------Class List for select
    const ClassList = () =>{
        set_SectionLView("none");
        set_StudentLView("none");
        setchevrondownClass(!chevrondownClass);
        setchevrondownStud(true)
        setchevrondownSection(true)
        console.log("Class List : ", chevrondownClass);

        if(chevrondownClass){
            set_classLView("flex");
        }else{
            set_classLView("none");
        }
        console.log("Class List : ", chevrondownClass);
        console.log("Class List V : ", classLView);
    }

    const SelectClass = async (idd, Sclass) => {
        set_ClassID(idd);
        set_ClassAtt(Sclass);
        set_classLView("none");
        setchevrondownClass(true);

        if(ClassAtt !== 'Select' && SectionAtt !== 'Select'){
                set_ClassAtt1(Sclass);
                reset_isLoadingFlatList(false);
                setchevrondownClass(true);
                console.log("SelectClass, class id : ", idd);
                try {
                    let result = await fetch('https://amritaaz.com/school/api/Webservice/classwisestudent', {
                    method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                    body: JSON.stringify({class_id: idd, section_id : SectionID})
                    })
        
                    let response = await result.json();
        
                    set_data(response);
                    
                    console.log("Students : ",DataS);

                    reset_isLoadingFlatList(true);
                    setChecked(!isChecked);   //for refresh FlatList

                }catch(error) {
                    console.error("CAtt -2 : ",error);
                }
        }

        set_ClassID(idd);
        set_ClassAtt(Sclass);
    }

    const ShowClassFlatList = (Itms, Index) => {
        return(
            <TouchableOpacity onPress={() => SelectClass(Itms.id, Itms.class)} key={Itms.id}>
                <View style={{backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                            height: DEVICEHEIGHT * 0.05,}}>
                    <Text style={{width: DEVICEWIDTH * 0.2, color: "#000000", fontSize: 17, marginBottom: 6}}>
                            {Itms.class}. </Text>
                    <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 1}}></View>                        
                </View>
            </TouchableOpacity>
        );
    }
    //---------------------------------------Section List for select
    const SectionList = () =>{
        set_StudentLView("none");
        set_classLView("none");
        setchevrondownSection(!chevrondownSection);
        setchevrondownClass(true);
        setchevrondownStud(true)
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

        if(ClassAtt !== 'Select' && SectionTitle !== 'Select'){
                set_SectionAtt1(SectionTitle);
                reset_isLoadingFlatList(false);
                setchevrondownSection(true);
                console.log("SelectClass, class id : ", idd);
                try {
                    let result = await fetch('https://amritaaz.com/school/api/Webservice/classwisestudent', {
                    method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                    body: JSON.stringify({class_id: ClassID, section_id : idd})
                    })
        
                    let response = await result.json();
        
                    set_data(response);
                    
                    console.log("Students : ",DataS);

                    reset_isLoadingFlatList(true);
                    setChecked(!isChecked);   //for refresh FlatList

                }catch(error) {
                    console.error("CAtt -2 : ",error);
                }
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
    //---------------------------------------Students List for select
    const StudentList = () =>{
        set_classLView("none");
        set_SectionLView("none");
        setchevrondownStud(!chevrondownStud);
        setchevrondownClass(true);
        setchevrondownSection(true)
        console.log("Class List : ", chevrondownStud);

        if(chevrondownStud){
            set_StudentLView("flex");
        }else{
            set_StudentLView("none");
        }
        console.log("Class List : ", chevrondownStud);
        console.log("Class List V : ", classLView);
    }

    const SelectStudent = async (idd, SFN, SLN, SonOf, sessionidd) => {
        set_Student_ID(idd);
        set_SessionID(sessionidd);
        set_StudentNme(SFN+" "+SLN);
        set_StudentFather(SonOf);
        set_StudentLView("none");
        setchevrondownStud(true);
    }

    const ShowStudentFlatList = (stud, Index) => {
        return(
            <TouchableOpacity onPress={() => SelectStudent(stud.id, stud.firstname, stud.lastname,
                                    stud.father_name, stud.session_id)}
                             key={stud.id}>
                <View style={{backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                            height: DEVICEHEIGHT * 0.064, width: "100%"}}>
                    <Text style={{width: "97%", color: "#000000", fontSize: 17, marginBottom: 7}}>
                            {stud.firstname} {stud.lastname}, S/o.- {stud.father_name} </Text>
                    <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 1}}></View>                        
                </View>
            </TouchableOpacity>
        );
    }
    //---------------------------------------------------------

  return (
    <SafeAreaView>
        <View style={styles.Mcontainer}>
            <View style={{padding: 10, alignItems: "center", height: DEVICEHEIGHT * 0.15}}>
                <View style={styles.Row1}>
                    <View style={styles.Column1}>
                        <Text style={{fontSize: 20, fontWeight: "700"}}>Fees Receipt</Text>
                        <Text style={{fontSize: 20, fontWeight: "700"}}>is here!</Text>
                        <Text style={{}}>Dt. : {YDAY}</Text>
                    </View>
                    <View style={{width: DEVICEWIDTH * 0.27, flexDirection: "column",
                                alignItems: "center"}}>
                        <Image source={require('../assets/printer_text.png')} 
                                style={{width: 120, height: 100, borderRadius: 20,}}/>
                    </View>
                </View>
            </View>
            <View style={styles.Column2}>
                <View style={styles.Row2}>
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
                                marginLeft: DEVICEWIDTH * 0.07}}>
                        Section :</Text>
                    <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: '28%',height: DEVICEHEIGHT * 0.03,
                                borderRadius: 20, flexDirection: "row"}} onPress={() => SectionList()}>
                        <Text style={{width: DEVICEWIDTH * 0.175, fontSize: 14, fontWeight: "bold",
                                    marginLeft: 10}}>{SectionAtt}</Text>
                        <FontAwesome name={chevrondownSection ? "chevron-down" : "chevron-up"}
                                        size={19} color="black"/>
                    </TouchableOpacity>

                </View>

                <View style={styles.Row2}>
                    <Text style={{width: DEVICEWIDTH * 0.17, fontSize: 14, fontWeight: "bold", marginTop: 4}}>
                        Student :</Text>
                    <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: '77%',height: DEVICEHEIGHT * 0.03,
                                borderRadius: 20, flexDirection: "row"}} onPress={() => StudentList()}>
                        <Text style={{width: "85%", fontSize: 15, fontWeight: "bold",
                                    marginLeft: 10}}>{StudentNme}</Text>
                        <FontAwesome name={chevrondownStud ? "chevron-down" : "chevron-up"}
                                        size={19} color="black" style={{marginLeft: 8}}/>
                    </TouchableOpacity>
                </View>
                {
                    Student_ID == "0.0" ? (
                        <View></View>
                    ) : (
                        <View>
                            <Text>Father    : {StudentFather}</Text>
                        </View>
                    )
                }
            </View>
            <View>
                <View style={styles.SContainer}>
                    <View style={styles.CardView2}>
                        <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05, 
                                    backgroundColor: "#BAFAFF", borderTopLeftRadius: 15, 
                                    borderTopRightRadius: 15, flexDirection: "row",
                                    alignItems: "center"}}>
                            <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold",
                                            width: DEVICEWIDTH * 0.76}}>
                                </Text>
                        </View>
                        {
                            isLoadingFlatList ? (
                                <View>




                                </View>

                            ):(
                                isLoadingFlatList1 ? (
                                    <ActivityIndicator/>
                                ):(
                                    <View style={{marginLeft: 10, marginTop: 10}}>
                                        <Text>Please select Class & Section.</Text>
                                    </View>
                                )
                            )
                        }
                    </View>

                </View>
            </View>
        {
            isLoadingFlatList ? (
                <TouchableOpacity style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05,
                    backgroundColor: "#BAFAFF", borderRadius: 8, left: "2%",
                    justifyContent: "center", alignItems: "center",position: "absolute", bottom: 57}}
                    onPress = {() => SubmitToServer()}>
                    {
                        isSaving ? (
                            <ActivityIndicator/>    
                        ) : (
                            <Text style={{color: "#000000", fontWeight: "bold", fontSize: 17,}}>
                            {TextSave}</Text>
                        )
                    }
                </TouchableOpacity>
            ):(
                <View></View>
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
        <FlatList contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            data={DataS.result_list} style={[styles.dropdownStud, {display: StudentLView}]}
            keyExtractor={(item, indexx) => indexx.toString()}
            renderItem={({item, indexx}) => ShowStudentFlatList(item, indexx)}
        />

    </View>
    </SafeAreaView>
);
}

const styles = StyleSheet.create({
    Mcontainer: {
        width: DEVICEWIDTH,
        height: DEVICEHEIGHT,
    },
    SContainer: {
        marginTop: DEVICEHEIGHT * 0.01,
        left: "2.35%",        
    },
    CardView2: {
        left: "40%",        
        elevation: 5,
        transform: [{ translateX: -(DEVICEWIDTH * 0.4) }, 
                    { translateY: -90 }],
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        height: DEVICEHEIGHT * 0.40,
        width: DEVICEWIDTH * 0.95,
        marginTop: DEVICEHEIGHT * 0.12,
        marginBottom: -DEVICEHEIGHT * 0.1,
    },
    Row1: {
        flexDirection: "row",
    },
    Row2: {
        flexDirection: "row",
        height: 33,
    },
    Column1: {
        flexDirection: "column",
        width: DEVICEWIDTH * 0.64,
    },
    Column2: {
        flexDirection: "column",
        width: DEVICEWIDTH,
        marginLeft: 10,
    },
dropdownClass: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '30%',
    height: DEVICEHEIGHT * 0.3,
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    elevation: 3,
    top: "18%",
    left: "13%",
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
dropdownStud: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '95%',
    height: DEVICEHEIGHT * 0.3,
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    elevation: 3,
    top: "22.2%",
    left: "2%",
},
dropdownFeesGroup: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '95%',
    height: DEVICEHEIGHT * 0.3,
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    elevation: 3,
    top: "31%",
    left: "2%",
},
dropdownFeesType: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '95%',
    height: DEVICEHEIGHT * 0.3,
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    elevation: 3,
    top: "35%",
    left: "2%",
},

  
  });





  /*
  https://amritaaz.com/school/api/Webservice/getfeessessiongroups

  */