import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, ActivityIndicator, Image, 
        Dimensions, TouchableOpacity, ScrollView} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';   

import config from './app_config';

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

export default function AttendanceStatus() {

    const newdate = new Date();


//    const [currentYear, set_CYear] = React.useState(newdate.getFullYear());
  //  const [currentMonth, set_CMonth] = React.useState(newdate.getMonth()+1);

    const SectionForAtt = [{section: "Select", id: '0'}, {section: "A", id: '1'}, {section: "B", id: '2'},
    {section: "C", id: '3'}, {section: "D", id: '4'}, {section: "E", id: '5'}];
    const [SelectYear1, set_Year1] = React.useState(newdate.getFullYear());
    const [SelectMonth1, set_Month1] = React.useState(newdate.getMonth()+1);

    const [isLoading, reset_isLoading]=React.useState(true);
    const [isLoadingFlatList, reset_isLoadingFlatList]=React.useState(true);
    const [isChecked, setChecked] = React.useState(false);
    const [FetchData, set_FetchData] = React.useState([]);

    const [SelectYear, set_Year] = React.useState(newdate.getFullYear());
    const [chevrondownYear, setchevrondownYear] = React.useState(true);
    const [YearLView, set_YearLView] = React.useState("none");

    const [SelectMonth, set_Month] = React.useState(newdate.getMonth()+1);
    const [chevrondownMonth, setchevrondownMonth] = React.useState(true);
    const [MonthLView, set_MonthLView] = React.useState("none");

    const [ClassAtt, set_ClassAtt] = React.useState('Select');
    const [chevrondownClass, setchevrondownClass] = React.useState(true);
    const [classLView, set_classLView] = React.useState("none");
    const [ClassID, set_ClassID] = React.useState("0");
    const [ClassForAtt, Set_ClassForAtt] = React.useState([]);

    const [chevrondownSection, setchevrondownSection] = React.useState(true);
    const [SectionLView, set_SectionLView] = React.useState("none");
    const [SectionID, set_SectionID] = React.useState('0.0');
    const [SectionAtt, set_SectionAtt] = React.useState('Select');

    const [BGColor, set_BGColor] = React.useState('#F8F7D8');
    const AttMonth = [{month:'All', id: "1"}, {month:'1', id: "1"}, {month:'2', id: "1"},
                        {month:'3', id: "1"}, {month:'4', id: "1"}, {month:'5', id: "1"},
                        {month:'6', id: "1"}, {month:'7', id: "1"}, 
                        {month:'8', id: "1"}, {month:'9', id: "1"}, {month:'10', id: "1"},
                        {month:'11', id: "1"}, {month:'12', id: "1"}];
    const AttYears = [{year: newdate.getFullYear()-1+" - "+newdate.getFullYear(), id: "1"},
                        {year: newdate.getFullYear()+" - "+`${newdate.getFullYear()+1}`, id: "1"}];
    const [StdID, set_StdID] = React.useState(false);


    FetchPersonal = async ()=>{
        try {
            let resultClass = await fetch(config.Url+'getclass', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
            })

            let responseClass = await resultClass.json();

            Set_ClassForAtt(responseClass);
            console.log("Class => ", responseClass);

        }catch(error) {
          console.error("FetchClass : ",error);
        }

        try{
            let respons1 = await fetch(config.Url+'F_S_Stud_Attendance.php', {
                method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                body: JSON.stringify({student_id: StdID, year: SelectYear, month: SelectMonth, student_session_id: "19"})
            })
      
            let responseJson = await respons1.json();
            
            console.log("responsJson : ",responseJson);
            
            console.log("Json :",(responseJson));
            set_FetchData(responseJson);
            console.log("DataS Length :", FetchData.length);
            console.log("DataS :",(FetchData));
            
            reset_isLoadingFlatList(true);
            reset_isLoading(false);
    
        }catch(err){
              console.error("Attendance : ",err);
        }    
    }

    React.useEffect(() => {
        AsyncStorage.getItem('StdID').then((value) => set_StdID(value));
        FetchPersonal();
        setTimeout(()=> FetchPersonal(), 2000);
    },[]);

    // const FetchMonthYearwise = ()=>{
    //     setTimeout(()=> {
    //     FetchPersonal()}, 2000);
    // }
  
    const ShowList = (Itms, Index) => {
        let workingdays=0;
        let presentdays=0;
        for(let ll = 1; ll<31; ll++){
            if(Itms[ll] == 'P' || Itms[ll] == 'L' || Itms[ll] == 'A'){
                workingdays++;
            }
            if(Itms[ll] == 'P'){
                presentdays++;
            }
        }
        return(
            <View style={{flexDirection: 'column'}}>
                <View style={{flexDirection: 'row', marginLeft: 10, marginTop: 5,}}>
                    <Text style={{width: DEVICEWIDTH * 0.50, color: "#000000"}}>
                        {(Itms.student_name)}</Text>
                    <Text style={{width: DEVICEWIDTH * 0.06, color: "#000000"}}>:</Text>
                    <View style={{backgroundColor: "green", width: presentdays*50/workingdays+"%", height: "2%"}}></View>
                    <Text>{presentdays*100/workingdays} %</Text>
                </View>
                {/* <FlatList contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                    data={Itms}
                    keyExtractor={(item, indexx) => indexx.toString()}
                    renderItem={({days, indexx}) => ShowPresentList(days, indexx)}
                /> */}
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

                <View style={{flexDirection: 'row', marginLeft: 10, marginTop: 5,}}>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/1/"+Itms.year).toLocaleString("en-us",
                            {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            1</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["1"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/2/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            2</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["2"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/3/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            3</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["3"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/4/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            4</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["4"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/5/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            5</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["5"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/6/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            6</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["6"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/7/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            7</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["7"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/8/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            8</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["8"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/9/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            9</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["9"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/1/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            1</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["10"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/11/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            11</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["11"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/12/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            12</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["12"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/13/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            13</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["13"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/14/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            14</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["14"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/15/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            15</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["15"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/16/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            16</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["16"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/17/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            17</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["17"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/18/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            18</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["18"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/19/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            19</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["19"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/20/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            20</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["20"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/21/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            21</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["21"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/22/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            22</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["22"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/23/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            23</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["23"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/24/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            24</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["24"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/25/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            25</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["25"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/26/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            26</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["26"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/27/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            27</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["27"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/28/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            28</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["28"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/29/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            29</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["29"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/30/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            30</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["30"])}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {new Date(Itms.month+"/31/"+Itms.year).toLocaleString("en-us", {weekday: "long"}).substring(0,1)}</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            31</Text>
                        <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                            {(Itms["31"])}</Text>
                    </View>
                </View>
            </ScrollView>


                    <View style={{width: DEVICEWIDTH * 0.948, height: 2, 
                        backgroundColor: "#F5EDF5", marginTop: 5}}></View>
            </View>
        );
    }
    const ShowPresentList = (day, Index) => {
        return(
            <View style={{flexDirection: 'row', marginLeft: 10, marginTop: 5,}}>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day)}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["2"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["3"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["4"])}</Text>
                    <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["5"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["6"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["7"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["8"])}</Text>
                    <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["9"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["10"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["11"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["12"])}</Text>
                    <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["13"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["14"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["15"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["16"])}</Text>
                    <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["17"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["18"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["19"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["20"])}</Text>
                    <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["21"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["22"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["23"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["24"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["25"])}</Text>
                <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["26"])}</Text>
                    <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["27"])}</Text>
                    <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["28"])}</Text>
                    <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["29"])}</Text>
                    <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["30"])}</Text>
                    <Text style={{width: DEVICEWIDTH * 0.04, color: "#000000"}}>
                    {(day["31"])}</Text>
            </View>
);
    }
    //-----------------------------------------------------Select Month
    const MonthList = () =>{
        set_YearLView("none");
        setchevrondownYear(true);
        set_classLView("none");
        setchevrondownClass(true);
        set_SectionLView("none");
        setchevrondownSection(true);
       
        setchevrondownMonth(!chevrondownMonth);
        console.log("Class List : ", chevrondownMonth);

        if(chevrondownMonth){
            set_MonthLView("flex");
        }else{
            set_MonthLView("none");
        }
    }

    const SelectedMonth = async (idd, Sclass) => {
        set_Month(Sclass);

        set_MonthLView("none");
        setchevrondownMonth(true);

        // if(SelectMonth !== 'Select' && SelectMonth !== 'Select'){
        //         reset_isLoadingFlatList(false);
        //         setchevrondownClass(true);
        //         console.log("SelectClass, class id : ", idd);
        //         console.log("Class Section id : ", SectionID);
        //         try {
        //             let result = await fetch('https://amritaaz.com/school/api/Webservice/classwisestudent', {
        //             method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
        //             body: JSON.stringify({class_id: idd, section_id : SectionID, session_id: "19"})
        //             })
        
        //             let response = await result.json();
        //             console.log("Class DataS : ", response);
                    
        //             setTimeout(() =>{
        //                 set_data(response);
        //                 set_data1(response.result_list)
                        
        //                 console.log("Class DataS1 : ",DataS1.length);
        //                 reset_isLoadingFlatList(true);
        //                 reset_isLoadingFlatList1(false);
        //                 setChecked(!isChecked);   //for refresh FlatList
        //             },1000);

        //         }catch(error) {
        //             console.error("CAtt -2 : ",error);
        //         }
        // }

    }

    const ShowMonthFlatList = (Itms) => {
        return(
            <TouchableOpacity onPress={() => SelectedMonth(Itms.id, Itms.month)} key={Itms.id}>
                <View style={{backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                            height: DEVICEHEIGHT * 0.05,}}>
                    <Text style={{width: DEVICEWIDTH * 0.2, color: "#000000", fontSize: 17}}>
                            {Itms.month}. </Text>
                    <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 1}}></View>                        
                </View>
            </TouchableOpacity>
        );
    }
    //-----------------------------------------------------Select Month
    const YearList = () =>{
        set_MonthLView("none");
        setchevrondownMonth(true);
        set_classLView("none");
        setchevrondownClass(true);
        set_SectionLView("none");
        setchevrondownSection(true);
       
        setchevrondownYear(!chevrondownYear);
        console.log("Class List : ", chevrondownYear);

        if(chevrondownYear){
            set_YearLView("flex");
        }else{
            set_YearLView("none");
        }
    }

    const selectedYear = async (idd, Sclass) => {
        set_Year(Sclass);

        set_YearLView("none");
        setchevrondownYear(true);

        // if(SelectMonth !== 'Select' && SelectMonth !== 'Select'){
        //         reset_isLoadingFlatList(false);
        //         setchevrondownClass(true);
        //         console.log("SelectClass, class id : ", idd);
        //         console.log("Class Section id : ", SectionID);
        //         try {
        //             let result = await fetch('https://amritaaz.com/school/api/Webservice/classwisestudent', {
        //             method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
        //             body: JSON.stringify({class_id: idd, section_id : SectionID, session_id: "19"})
        //             })
        
        //             let response = await result.json();
        //             console.log("Class DataS : ", response);
                    
        //             setTimeout(() =>{
        //                 set_data(response);
        //                 set_data1(response.result_list)
                        
        //                 console.log("Class DataS1 : ",DataS1.length);
        //                 reset_isLoadingFlatList(true);
        //                 reset_isLoadingFlatList1(false);
        //                 setChecked(!isChecked);   //for refresh FlatList
        //             },1000);

        //         }catch(error) {
        //             console.error("CAtt -2 : ",error);
        //         }
        // }

    }

    const ShowYearFlatList = (Itms) => {
        return(
            <TouchableOpacity onPress={() => selectedYear(Itms.id, Itms.year)} key={Itms.id}>
                <View style={{backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                            height: DEVICEHEIGHT * 0.05,}}>
                    <Text style={{width: DEVICEWIDTH * 0.27, color: "#000000", fontSize: 17}}>
                            {Itms.year}. </Text>
                    <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 1}}></View>                        
                </View>
            </TouchableOpacity>
        );
    }
    //-----------------------------------------------------Select Class
    const ClassList = () =>{
        set_MonthLView("none");
        setchevrondownMonth(true);
        set_YearLView("none");
        setchevrondownYear(true);
        set_SectionLView("none");
        setchevrondownSection(true);
        setchevrondownClass(!chevrondownClass);
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
                reset_isLoadingFlatList(false);
                setchevrondownClass(true);
                console.log("SelectClass, class id : ", idd);
                console.log("Class Section id : ", SectionID);
                try {
                    let result = await fetch(config.Url+'classwisestudent', {
                    method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                    body: JSON.stringify({class_id: idd, section_id : SectionID, session_id: "19"})
                    })
        
                    let response = await result.json();
                    console.log("Class DataS : ", response);
                    
                    setTimeout(() =>{
                        set_data(response);
                        set_data1(response.result_list)
                        
                        console.log("Class DataS1 : ",DataS1.length);
                        reset_isLoadingFlatList(true);
                        setChecked(!isChecked);   //for refresh FlatList
                    },1000);

                }catch(error) {
                    console.error("CAtt -2 : ",error);
                }
        }

        set_ClassID(idd);
        set_ClassAtt(Sclass);
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
        set_MonthLView("none");
        setchevrondownMonth(true);
        set_YearLView("none");
        setchevrondownYear(true);
        set_classLView("none");
        setchevrondownClass(true);

        setchevrondownSection(!chevrondownSection);
        setchevrondownClass(true);
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
                    let result = await fetch(config.Url+'classwisestudent', {
                    method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                    body: JSON.stringify({class_id: ClassID, section_id : idd, session_id: "19"})
                    })
        
                    let response = await result.json();
        
                    setTimeout(() =>{                        
                        set_data(response);
                        set_data1(response.result_list)
                        console.log("Class DataS1 : ",DataS1.length);
                        reset_isLoadingFlatList(true);
                        reset_isLoadingFlatList1(false);
                        setChecked(!isChecked);   //for refresh FlatList
                    },1000);

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
    //---------------------------------------------------------

  return (
    <SafeAreaView>
    <View style={styles.Mcontainer}>
                <View style={{padding: 10, alignItems: "center", height: DEVICEHEIGHT * 0.15}}>
                    <View style={styles.Row1}>
                        <View style={styles.Column1}>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Your Class Attendance</Text>
                            <Text style={{fontSize: 20, fontWeight: "700"}}>Status is here!</Text>
                        </View>
                            <View style={{width: DEVICEWIDTH * 0.27, flexDirection: "column", alignItems: "center"}}>
                                <Image source={require('../assets/status2_BN.png')} style={{width: 120, height: 100, 
                                    borderRadius: 20,}}/>
                            </View>
                        </View>
                    </View>

                <View>
                {
                    isLoading ? (
                        <ActivityIndicator/>
                    ):(
                        <View style={styles.Mcontainer}>
                        {/*
                            <SelectDropdown data={ClassForAtt} onSelect={(selectedClas, index)=>{
                                console.log(selectedClas, index)
                                set_ClassAtt(selectedClas)
                                }  } 
                                defaultButtonText={"Select Class"}
                                buttonTextAfterSelection={(selectedClas, index)=>{
                                    //FetchMonthYearwise();
                                    return selectedClas;  }
                                }
                                rowTextForSelection={(item, index)=>{ return item; }}
                                renderDropdownIcon={isOpened =>{
                                    return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'}
                                                        color={'#000000'} size={18} style={styles.DropDIcon}/>;
                                }}
                                buttonStyle={styles.dropdownBtnStyle}
                                buttonTextStyle={styles.dropdownBtnTextStyle}
                            />
                            */}
                            
                            <View style={styles.Row2}>
                                <Text style={{width: DEVICEWIDTH * 0.16,fontSize: 16, marginLeft: 2}}>Month : </Text>
                                <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: '20%',height: DEVICEHEIGHT * 0.03,
                                            borderRadius: 20, flexDirection: "row"}} onPress={() => MonthList()}>
                                    <Text style={{width: DEVICEWIDTH * 0.11, fontSize: 14, fontWeight: "bold",
                                                marginLeft: 10}}>{SelectMonth}</Text>
                                    <FontAwesome name={chevrondownMonth ? "chevron-down" : "chevron-up"}
                                                size={19} color="black"/>
                                </TouchableOpacity>

                                <Text style={{width: DEVICEWIDTH * 0.13, fontSize: 16, marginLeft: 30}}>Year :</Text>
                                <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: '37%', height: DEVICEHEIGHT * 0.03,
                                            borderRadius: 20, flexDirection: "row"}} onPress={() => YearList()}>
                                    <Text style={{width: DEVICEWIDTH * 0.28, fontSize: 14, fontWeight: "bold",
                                                marginLeft: 10}}>{SelectYear}</Text>
                                    <FontAwesome name={chevrondownYear ? "chevron-down" : "chevron-up"}
                                                size={19} color="black"/>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.Row2}>
                                <Text style={{width: DEVICEWIDTH * 0.13, fontSize: 14, fontWeight: "bold",
                                            marginLeft: 2}}>
                                    Class :</Text>
                                <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: '28%',height: DEVICEHEIGHT * 0.03,
                                            borderRadius: 20, flexDirection: "row"}} onPress={() => ClassList()}>
                                    <Text style={{width: DEVICEWIDTH * 0.175, fontSize: 14, fontWeight: "bold",
                                                marginLeft: 10}}>{ClassAtt}</Text>
                                    <FontAwesome name={chevrondownClass ? "chevron-down" : "chevron-up"}
                                                size={19} color="black"/>
                                </TouchableOpacity>

                                <Text style={{width: DEVICEWIDTH * 0.17, fontSize: 14, fontWeight: "bold", 
                                        marginLeft: DEVICEWIDTH * 0.07}}>Section :</Text>
                                <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: '28%',height: DEVICEHEIGHT * 0.03,
                                            borderRadius: 20, flexDirection: "row"}} onPress={() => SectionList()}>
                                    <Text style={{width: DEVICEWIDTH * 0.175, fontSize: 14, fontWeight: "bold",
                                                marginLeft: 10}}>{SectionAtt}</Text>
                                    <FontAwesome name={chevrondownSection ? "chevron-down" : "chevron-up"}
                                                    size={19} color="black"/>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.SContainer}>
                                <View style={styles.CardView2}>
                                    <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05, 
                                                backgroundColor: "#BAFAFF", borderTopLeftRadius: 15, 
                                                borderTopRightRadius: 15, justifyContent: "center"}}>
                                        <Text style={{color: "#000000", marginLeft: 10, fontWeight: "bold"}}>Status</Text>
                                    </View>
                                    {
                                        isLoadingFlatList ? (
                                    <FlatList contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                                        data={FetchData}
                                        keyExtractor={(item, indexx) => indexx.toString()}
                                        renderItem={({item, indexx}) => ShowList(item, indexx)}
                                    />
                                        ):(
                                            <ActivityIndicator/>
                                        )
                                    }
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                                                width: "100%", left: "5%"}}>
                                    <Text style={{color: "green", width: "33%"}}>P - Present</Text>
                                    <Text style={{color: "red", width: "33%"}}>A - Absent</Text>
                                    <Text style={{color: "blue", width: "33%"}}>L - Leave</Text>
                                </View>
                            </View>
                            </View>
                              )                    
                }
                </View>
        <FlatList contentContainerStyle={{ flexGrow: 1 }} 
            showsVerticalScrollIndicator={false}
            data={AttMonth} style={[styles.Monthdropdown, {display: MonthLView}]}
            keyExtractor={(item, indexx) => indexx.toString()}
            renderItem={({item, indexx}) => ShowMonthFlatList(item, indexx)}
        />
        <FlatList contentContainerStyle={{ flexGrow: 1 }} 
            showsVerticalScrollIndicator={false}
            data={AttYears} style={[styles.Yeardropdown, {display: YearLView}]}
            keyExtractor={(item, indexx) => indexx.toString()}
            renderItem={({item, indexx}) => ShowYearFlatList(item, indexx)}
        />
        <FlatList contentContainerStyle={{ flexGrow: 1 }} 
            showsVerticalScrollIndicator={false}
            data={ClassForAtt.data} style={[styles.dropdown, {display: classLView}]}
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
      height: DEVICEHEIGHT * 0.60,
      width: DEVICEWIDTH * 0.95,
      marginTop: DEVICEHEIGHT * 0.12,
      marginBottom: -DEVICEHEIGHT * 0.1,
  },
  Row1: {
      flexDirection: "row",
  },
  Row2: {
      flexDirection: "row",
      marginLeft: 10,
      marginTop: 10,
  },
  Column1: {
      flexDirection: "column",
      width: DEVICEWIDTH * 0.64,
  },
  Column2: {
      flexDirection: "column",
      width: DEVICEWIDTH,
      marginLeft: 10,
      marginTop: 35,
  },
  dropdownBtnStyle: {
      textAlign: "center",
      width: '55%',
      height: DEVICEHEIGHT * 0.04,
      backgroundColor: '#FFFFFF',
      borderRadius: 15,
      marginTop: DEVICEHEIGHT * 0.017,
      left: "1.6%",
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
  dropdownBtnStyleMonth: {
    textAlign: "center",
    width: '20%',
    height: DEVICEHEIGHT * 0.04,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    left: "1.6%",
},
dropdownBtnStyleYear: {
    textAlign: "center",
    width: '30%',
    height: DEVICEHEIGHT * 0.04,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    left: "1.6%",
},
Monthdropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '22%',
    height: DEVICEHEIGHT * 0.3,
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    elevation: 3,
    top: "20%",
    left: "19%",
  },
  Yeardropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '30%',
    height: DEVICEHEIGHT * 0.15,
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    elevation: 3,
    top: "20%",
    left: "60%",
  },
dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '25%',
    height: DEVICEHEIGHT * 0.3,
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    elevation: 3,
    top: "25%",
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
    top: "25%",
    left: "70%",
},

});