import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, ActivityIndicator, Image, 
        Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import { FontAwesome, FontAwesome5, AntDesign, Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';   
import * as Print from 'expo-print';        //npx expo install expo-print
import { shareAsync } from 'expo-sharing';      //npx expo install expo-sharing

import config from './app_config';

const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;
let ScreenNo = 0, FeesCalculate = 0;

export default function FeesReceive({navigation, route}) {

    const newdate = new Date();

  var a = [
    '',
    'One ',
    'Two ',
    'Three ',
    'Four ',
    'Five ',
    'Six ',
    'Seven ',
    'Eight ',
    'Nine ',
    'Ten ',
    'Eleven ',
    'Twelve ',
    'Thirteen ',
    'Fourteen ',
    'Fifteen ',
    'Sixteen ',
    'Seventeen ',
    'Eighteen ',
    'Nineteen '];
    var b = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety'];
    const [ServerUrl, set_ServerUrl] = React.useState("https://skygroupofeducaton.com/school/");

    const SectionForAtt = [{section: "Select", id: '0'}, {section: "A", id: '1'}, {section: "B", id: '2'},
                            {section: "C", id: '3'}, {section: "D", id: '4'}, {section: "E", id: '5'}];
    const [isSaving, reset_isSaving]=React.useState(false);
    const [TextSave, set_TextSave] = React.useState('Save');
    const [DataS, set_data] = React.useState([]);
    const [isFlatListShow, set_isFlatListShow]=React.useState(true);
    const [isLoadingFlatList, reset_isLoadingFlatList]=React.useState(true);
    const [isChecked, setChecked] = React.useState(true);

    const[NAMEStaff, set_NAMEStaff] = React.useState('');
    const[Role, set_Role] = React.useState('');

    const [Screen1Index, set_Screen1Index] = React.useState(0);

    const[CardTitle, set_CardTitle] = React.useState('Fees Detail');
    const[ReceiptNo, set_ReceiptNo] = React.useState('');

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
    const [SessionID, set_SessionID] = React.useState("NA");
    const [Student_ID, set_Student_ID] = React.useState('');
    const [Student_SID, set_Student_SID] = React.useState('');
    const [StudentNme, set_StudentNme] = React.useState('Select');
    const [StudentFather, set_StudentFather] = React.useState('');
    const [StdFeesStr, Set_StdFeesStr] = React.useState([]);
    const [FeesDetail, Set_FeesDetail] = React.useState([]);

    const [FGData, Set_FGData] = React.useState([]);
    const [FeeGroupID, set_FeeGroupID] = React.useState("NA");
    const [FeesGroupN, Set_FeesGroupN] = React.useState('Select');
    const [chevrondownFG, setchevrondownFG] = React.useState(true);
    const [FGroupLView, set_FGroupLView] = React.useState("none");

    const [FTData, Set_FTData] = React.useState([]);
    const [chevrondownFT, setchevrondownFT] = React.useState(true);
    const [FTypeLView, set_FTypeLView] = React.useState("none");
    const [FeesTypeN, Set_FeesTypeN] = React.useState('Select');

    const [TPaid, Set_TPaid] = React.useState('0.00');
    const [GTPaid, Set_GTPaid] = React.useState('0.00');

    const [TotalFees, Set_TotalFees] = React.useState('0.00');
    const [PaidFees, Set_PaidFees] = React.useState('0.00');
    const [BalFees, Set_BalFees] = React.useState('0.00');
    const [DiscFees, Set_DiscFees] = React.useState('0');
    const [Penalty, Set_Penalty] = React.useState('0');
    const [PayFees, Set_PayFees] = React.useState('0');
    const [ModeFees, Set_ModeFees] = React.useState('Cash');
    const [RemainingFees, Set_RemainingFees] = React.useState('0.00');
    const [Description, Set_Description] = React.useState('');

    const [SFMID, Set_SFMID] = React.useState('0');
    const [FeeType_ID, Set_FeeType_ID] = React.useState('0');
    const[NAME, set_NAME] = React.useState('');

    const [Fees_Session_G_id, Set_Fees_Session_G_id] = React.useState("0");
    const [TempArray, Set_TempArray] = React.useState([]);
    const [inwords, Set_inwords] = React.useState("");

    AsyncStorage.getItem('NAME').then((value) => set_NAME(value));

    var TFeesInst;
    let i =0, bfees=0, Tfees;

    let YDAY= `${newdate.getDate()}/${newdate.getMonth() + 1}/${newdate.getFullYear()}`;

    const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, 
            maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
            .table1 {
                border: 1px solid black;
                border-collapse: collapse;
                width:100%;
                margin-top: -10px;
            }
            .table2 {
                border: 1px solid black;
                border-collapse: collapse;
                width:100%;
            }
            .tr1 {
              border: 1px solid black;
              border-collapse: collapse;
            }
            .td1 {
                border: 1px solid black;
                border-collapse: collapse;
                padding-left: 20px;
                font-size: 13px;
            }
            .td2 {
                border: 1px solid black;
                border-collapse: collapse;
                padding-left: 40px;
                font-size: 13px;
            }
            .td3 {
                border: 1px solid black;
                border-collapse: collapse;
                padding-left: 10px;
                font-size: 13px;
            }
        </style>
  </head>
  <body style="text-align: flex-start;">
        <div style= "flex-direction: column; direction: flex; margin-top: -10px">
            <img src= "https://sewabhartidabra.in/School_Images/logoBn.png"
                style="width: 102px; height: 102px" />
            <h1 style="font-size: 35px; font-family: Helvetica Neue; font-weight: bold; 
                    margin-left: 140px; margin-top: -100px; text-decoration-line: underline;">
            Sky Public Hr. Sec. School
            </h1>
            <p style= "font-size: 14px; margin-left: 170px; margin-top: -22px">
                    Bal Gopal Colony, Bada Goan Chauraha, Lal Tipara Road,</p>
            <p style= "font-size: 14px; margin-left: 205px; margin-top: -10px">
                    Morar Gwalior-M.P., Mob.No. : 9755766915</p>
                <p style= "font-size: 17px; margin-left: 0px; margin-top: 25px">Receipt No. : `+ReceiptNo+`</p>
                <h1 style="font-size: 22px; font-family: Helvetica Neue; font-weight: bold; 
                    margin-left: 270px; margin-top: -50px; text-decoration-line: underline">
                Fees Receipt
                </h1>
                <p style= "font-size: 14px; text-align: right; margin-top: -40px">Date : `+YDAY+`</p>
            <p style= "font-size: 13px; margin-left: 0px; margin-top: 25px">Student Name: `+
                        StudentNme+", S/o. "+StudentFather+`</p>
            <p style= "font-size: 13px; margin-left: 0px; margin-top: -10px">Class : `+ClassAtt+" | Section : "+SectionAtt+`</p>

            <table class="table1">
            <tr class="tr1">
              <th class="tr1">Description</th>
              <th class="tr1">Amount</th>
            </tr>
            <tr class="tr1">
              <td class= "td1">Total Fees</td>
              <td class= "td2">`+TotalFees+`</td>
            </tr>
            <tr class="tr1">
              <td class= "td1">Paid Fees</td>
              <td class= "td2">`+PaidFees+".00"+`</td>
            </tr>
            <tr class="tr1">
              <td class= "td1">Discount</td>
              <td class= "td2">`+DiscFees+".00"+`</td>
            </tr>
            <tr class="tr1">
              <td class= "td1">Penalty</td>
              <td class= "td2">`+Penalty+".00"+`</td>
            </tr>
            <tr class="tr1">
              <td class= "td1">Pay Fees</td>
              <td class= "td2">`+PayFees+".00"+`</td>
            </tr>
            <tr class="tr1">
              <td class= "td1">Remaining/Balance Fees</td>
              <td class= "td2">`+RemainingFees+`</td>
            </tr>
        </table>
            <table class="table2">
            <tr class="table2">
                <td class= "td3">Pay by `+ModeFees+`</td>
            </tr>
            <tr class="tr1">
                <td class= "td3">in words (Rs.) : `+inwords+`</td>
            </tr>
            <tr class="tr1">
                <td class= "td3">Description : `+Description+`</td>
            </tr>
            </table>
            <p style= "font-size: 13px; margin-top: 40px; margin-left: 82%">`+NAME+`</p>
            <p style= "font-size: 13px; margin-top: -10px; margin-left: 80%">Authorise Signature</p>

        <div style = "margin-top: 60px">
        <img src="https://sewabhartidabra.in/School_Images/logoBn.png"
        style="width: 102px; height: 102px" />
    <h1 style="font-size: 35px; font-family: Helvetica Neue; font-weight: bold; 
            margin-left: 140px; margin-top: -100px; text-decoration-line: underline;">
    Sky Public Hr. Sec. School
    </h1>
    <p style= "font-size: 14px; margin-left: 170px; margin-top: -22px">
            Bal Gopal Colony, Bada Goan Chauraha, Lal Tipara Road,</p>
    <p style= "font-size: 14px; margin-left: 205px; margin-top: -10px">
            Morar Gwalior-M.P., Mob.No. : 9755766915</p>
        <p style= "font-size: 17px; margin-left: 0px; margin-top: 25px">Receipt No. : `+ReceiptNo+`</p>
        <h1 style="font-size: 22px; font-family: Helvetica Neue; font-weight: bold; 
            margin-left: 270px; margin-top: -50px; text-decoration-line: underline">
        Fees Receipt
        </h1>
        <p style= "font-size: 14px; text-align: right; margin-top: -40px">Date : `+YDAY+`</p>
    <p style= "font-size: 13px; margin-left: 0px; margin-top: 25px">Student Name: `+
                StudentNme+", S/o. "+StudentFather+`</p>
    <p style= "font-size: 13px; margin-left: 0px; margin-top: -10px">Class : `+ClassAtt+" | Section : "+SectionAtt+`</p>

    <table class="table1">
    <tr class="tr1">
      <th class="tr1">Description</th>
      <th class="tr1">Amount</th>
    </tr>
    <tr class="tr1">
      <td class= "td1">Total Fees</td>
      <td class= "td2">`+TotalFees+`</td>
    </tr>
    <tr class="tr1">
      <td class= "td1">Paid Fees</td>
      <td class= "td2">`+PaidFees+".00"+`</td>
    </tr>
    <tr class="tr1">
      <td class= "td1">Discount</td>
      <td class= "td2">`+DiscFees+".00"+`</td>
    </tr>
    <tr class="tr1">
      <td class= "td1">Penalty</td>
      <td class= "td2">`+Penalty+".00"+`</td>
    </tr>
    <tr class="tr1">
      <td class= "td1">Pay Fees</td>
      <td class= "td2">`+PayFees+".00"+`</td>
    </tr>
    <tr class="tr1">
      <td class= "td1">Remaining/Balance Fees</td>
      <td class= "td2">`+RemainingFees+`</td>
    </tr>
</table>
    <table class="table2">
    <tr class="table2">
        <td class= "td3">Pay by `+ModeFees+`</td>
    </tr>
    <tr class="tr1">
        <td class= "td3">in words (Rs.) : `+inwords+`</td>
    </tr>
    <tr class="tr1">
        <td class= "td3">Description : `+Description+`</td>
    </tr>
    </table>
    <p style= "font-size: 13px; margin-top: 40px; margin-left: 82%">`+NAME+`</p>
    <p style= "font-size: 13px; margin-top: -10px; margin-left: 80%">Authorise Signature</p>
</div>
        </div>
    </body>
</html>
`;
    //---------------------------------------------------------
    const FetchFirst = async ()=>{  
        ScreenNo = 0;
        AsyncStorage.getItem('CLASS').then((value) => set_Role(value));
        AsyncStorage.getItem('NAME').then((value) => set_NAMEStaff(value));
        AsyncStorage.getItem('SERVERURL').then(async (value) => {
            console.error("FeesReceive, Base URL : ", value);
            set_ServerUrl(value);
                try {
                    let resultClass = await fetch(config.Url+'getclass', {
                    method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
                    })

                    let responseClass = await resultClass.json();

                    Set_ClassForAtt(responseClass);

                }catch(error) {
                    console.error("FetchClass : ",error);
                }
                try {
                    let resultFG = await fetch(config.Url+'studentgetgroup', {
                    method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
                    })

                    let responseFG = await resultFG.json();
                    console.log("Group : ", responseFG);

                    Set_FGData(responseFG);

                }catch(error) {
                    console.error("Fetch Fee Group : ",error);
                }
                try {
                    let resultFT = await fetch(config.Url+'studentgettype', {
                    method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
                    })

                    let responseFT = await resultFT.json();

                    Set_FTData(responseFT);

                }catch(error) {
                    console.error("Fetch Fee Type : ",error);
                }
        });
    }

    React.useEffect(() => {
        FetchFirst();
    },[]);
    //-----------------------------------------
    function convertNumberToWords(num) {
        var ones = ["", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ", "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "];
        var tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
        //if ((num = num.toString()).length > 9) return "Overflow: Maximum 9 digits supported";
        n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return;
        var str = "";
        str += n[1] != 0 ? (ones[Number(n[1])] || tens[n[1][0]] + " " + ones[n[1][1]]) + "Crore " : "";
        str += n[2] != 0 ? (ones[Number(n[2])] || tens[n[2][0]] + " " + ones[n[2][1]]) + "Lakh " : "";
        str += n[3] != 0 ? (ones[Number(n[3])] || tens[n[3][0]] + " " + ones[n[3][1]]) + "Thousand " : "";
        str += n[4] != 0 ? (ones[Number(n[4])] || tens[n[4][0]] + " " + ones[n[4][1]]) + "Hundred " : "";
        //str += n[5] != 0 ? (str != "" ? "and " : "") + (ones[Number(n[5])] || tens[n[5][0]] + " " + ones[n[5][1]]) : "";
        str += n[5] != 0 ? (str != "" ? "" : "") + (ones[Number(n[5])] || tens[n[5][0]] + " " + ones[n[5][1]]) : "";
        return str+" only.";
    }
    
    //-------------------------print && pdf
    const print = async () => {
        //transform(PaidFees);
       Set_inwords(convertNumberToWords(PayFees));
       console.log("in words : ", convertNumberToWords(PayFees));
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        await Print.printAsync({
          html,
          //printerUrl: selectedPrinter?.url, // iOS only
        });
      };
    //-----------------------------
    const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    };
    //---------------------------------------------------------Submit to server
    const SubmitToServer=async ()=> {
        if(parseInt(PayFees)>0 && ClassAtt !== 'Select' && SectionAtt !== 'Select' && 
            StudentNme !== 'Select'){
            reset_isSaving(true);
            FeesCalculate = 0;
            
            let SDAY= `${newdate.getFullYear()}-${newdate.getMonth() + 1}-${newdate.getDate()}`
            let responseUpload;

            console.log("student_fees_master_id : ", SFMID);
            console.log("FeeType_ID : ", FeeType_ID);
            console.log("Role : ", Role);
            console.log("fee_groups_feetype_id : ", NAMEStaff);

            try {
                let resultClass = await fetch(config.Url+'mobliestudentfees', {
                method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                body: JSON.stringify({
                    student_fees_master_id: SFMID,
                    fee_groups_feetype_id: FeeType_ID,
                    amount: PayFees,
                    amount_discount: DiscFees,
                    amount_fine: Penalty,
                    date: SDAY,
                    description: Description,
                    payment_mode: ModeFees,
                    inv_no:1,
                    collected: Role+"("+NAMEStaff+")",
                    received_by:1
                })
            })
    
                responseUpload = await resultClass.json();
                console.log("SubmitToServer : ",responseUpload);
                set_ReceiptNo(responseUpload.receiptno);

                setTimeout(() => {
                    reset_isSaving(false)
                    //if(responseUpload.data == 'true'){
                        set_TextSave("Successfully Saved")
                        setTimeout(()=> {set_TextSave("Save")}, 1000);
                    //}
                }, 300);

            }catch(error) {
            console.error("SubmitToServer : ",error.message);
            }

        }else{
            Alert.alert("Please fill all necessary amount");
        }
    }
    //------------------------------------****************************
    const FetchStudents = async (CID, SID) =>{
        try {
            let result = await fetch(config.Url+'classwisestudent', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
            body: JSON.stringify({class_id: CID, section_id : SID, session_id: "19"})
            })

            let response = await result.json();

            set_data(response);
            
            console.log("Students : ",DataS);
            set_data(response);
            console.log("Students : ",DataS);

            reset_isLoadingFlatList(true);
            setChecked(!isChecked);   //for refresh FlatList

        }catch(error) {
            console.error("CAtt -2 : ",error);
        }
    }
    //------------------------------------****************************
    const FetchStudentFeesIDs = async (SID) =>{
        console.log("FetchStudentFeesIDs, SID : ", SID);
        try {
        let resultTft = await fetch(config.Url+'getStudentFees', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
            body: JSON.stringify({"student_id": SID})
        })

        let responseSFM = await resultTft.json();
        console.log("FetchStudentFeesIDs, SFMID : ", responseSFM.data[0].id);
        Set_SFMID(responseSFM.data[0].id);

    }catch(error) {
        console.error("Fetch Fee Group : ",error);
    }
}
    //------------------------------------****************************
    const FetchStudentFeesDetail = async (SID) =>{
        console.log("FetchStudentFeesIDs, SID : ", SID);
        set_isFlatListShow(false);
        Set_GTPaid(0);
        Set_TotalFees(0);
        FeesCalculate = 0;
        try {
        let resultTft = await fetch(config.Url+'getStudentFees', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
            body: JSON.stringify({"student_id": SID})
        })

        let responseSFM = await resultTft.json(), j=0, k = 0, paidFees=0, tf=0;
        Set_StdFeesStr(responseSFM.data);
        
        for(j = 0; j<responseSFM.data.length; j++){
            paidFees=0;
            tf = tf + parseInt(responseSFM.data[j].fees[0].amount);
            console.log("FetchStudentFeesIDs, responseSFM.data[j].fees[0].amount : ", responseSFM.data[j].fees[0].amount);
            const JSONString = responseSFM.data[j].fees[0].amount_detail;
            object = JSON.parse(JSONString);
            array = Object.keys(object).map(function(k) {
                return object[k];
            });
                for(k=0; k<array.length; k++){
                    paidFees = parseInt(paidFees) + parseInt(array[k].amount);
                    if(k>= array.length - 1){
                        Set_GTPaid(paidFees);
                    }
                }

            if(j => responseSFM.data.length-1)
                Set_TotalFees(tf);

                console.log("FetchStudentFeesIDs, TotalFees : ", tf, ", GTPaid : ", GTPaid);

        }

        setTimeout(()=> set_isFlatListShow(true), 300);
    }catch(error) {
        console.error("Fetch Fee Group : ",error);
    }
}
//---------------------------------------Class List for select
    const ClassList = () =>{
        set_SectionLView("none");
        set_StudentLView("none");
        set_FTypeLView("none");
        set_FGroupLView("none");
        setchevrondownClass(!chevrondownClass);
        setchevrondownStud(true)
        setchevrondownSection(true)
        setchevrondownFT(true);
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
                FetchStudents(idd, SectionID);
        }

        set_ClassID(idd);
        set_ClassAtt(Sclass);
    }

    const ShowClassFlatList = (Itms, Index) => {
        return(
            <View>
                <TouchableOpacity style={{backgroundColor: "#FFFFFF",
                        justifyContent: "center", alignItems: "center",
                        height: DEVICEHEIGHT * 0.05,}}
                        onPress={() => SelectClass(Itms.id, Itms.class)} key={Itms.id}>
                    <Text style={{width: DEVICEWIDTH * 0.2, color: "#000000",
                        fontSize: 17, marginBottom: 6}}>{Itms.class}</Text>
                </TouchableOpacity>
                <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 2}}></View>                        
            </View>
        );
    }
    //---------------------------------------Section List for select
    const SectionList = () =>{
        set_StudentLView("none");
        set_classLView("none");
        set_FTypeLView("none");
        set_FGroupLView("none");

        setchevrondownSection(!chevrondownSection);
        setchevrondownClass(true);
        setchevrondownStud(true)
        setchevrondownFT(true);
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
                FetchStudents(ClassID, idd);
        }

    }

    const ShowSectionFlatList = (Itmsection, Index) => {
        return(
            <View>
                <TouchableOpacity style={{backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                            height: DEVICEHEIGHT * 0.05,}}
                            onPress={() => SelectSection(Itmsection.id, Itmsection.section)} key={Itmsection.id}>
                    <Text style={{width: DEVICEWIDTH * 0.2, color: "#000000", fontSize: 17, marginBottom: 6}}>
                            {Itmsection.section}. </Text>
                </TouchableOpacity>
                    <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 2}}></View>                        
            </View>
        );
    }
    //---------------------------------------Students List for select
    const StudentList = () =>{
        set_classLView("none");
        set_SectionLView("none");
        set_FTypeLView("none")
        set_FGroupLView("none");

        setchevrondownClass(true);
        setchevrondownSection(true)
        setchevrondownStud(!chevrondownStud);
        console.log("Class List : ", chevrondownStud);

        if(chevrondownStud){
            set_StudentLView("flex");
        }else{
            set_StudentLView("none");
        }
        console.log("Class List : ", chevrondownStud);
        console.log("Class List V : ", classLView);
    }

    const SelectStudent = async (idd, SFN, SMN, SLN, SonOf, sessionidd, Std_id) => {
        set_Student_SID(idd);
        set_Student_ID(Std_id);
        set_SessionID(sessionidd);
        set_StudentNme(SFN+" "+SMN+" "+SLN);
        set_StudentFather(SonOf);
        
        set_StudentLView("none");
        setchevrondownStud(true);
        setchevrondownFT(true);
        console.log("Session ID : ", sessionidd);

        //FetchStudentFeesIDs(idd);
        FetchStudentFeesDetail(idd);
    }

    const ShowStudentFlatList = (stud, Index) => {
        return(
            <View>
                <TouchableOpacity onPress={() => SelectStudent(stud.id, stud.firstname, stud.middlename, stud.lastname,
                    stud.father_name, stud.session_id, stud.student_id)} key={stud.id}
                    style={{backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                    height: DEVICEHEIGHT * 0.064, width: "100%"}}>
                        <Text style={{width: "97%", color: "#000000", fontSize: 17, marginBottom: 7}}>
                                {stud.firstname} {stud.middlename} {stud.lastname}, S/o.- {stud.father_name} </Text>
                </TouchableOpacity>
                    <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 2}}></View>
            </View>
        );
    }
    //--------------------------------------
    const ExpendDetail = (indx) => {

        if(FeesDetail[indx].Expend == 1 || FeesDetail[indx].Expend == "1"){
            FeesDetail[indx].Expend = 0;
        }else{
            FeesDetail[indx].Expend = 1;
        }
        reset_isLoadingFlatList(!isLoadingFlatList);
    }
    //--------------------------------------
    const Screen1 = (item, Index) => {
        return(
            <View style={{flexDirection: 'column', alignItems: 'center',
                height: item.Expend == 1 ? DEVICEHEIGHT * 0.3 : DEVICEHEIGHT * 0.12}}>
                <View style={{backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                    height: item.Expend == 1 ? DEVICEHEIGHT * 0.05 : DEVICEHEIGHT * 0.05,
                    width: "100%", flexDirection: 'row'}}>
                    <Text style={{width: "15%", color: "#000000", fontSize: 14, marginBottom: 7,
                            marginLeft: 0}}>
                        {item.inv_no} </Text>
                    <Text style={{width: "40%", color: "#000000", fontSize: 14, marginBottom: 7,
                            marginLeft: 0}}>
                        {item.date} </Text>
                    <Text style={{width: "17%", color: "#000000", fontSize: 14, marginBottom: 2,
                            marginLeft: 7, textAlign: 'right'}}>
                        {item.amount} </Text>
                </View>
                <View style={{width: "100%", alignItems: 'center'}}>
                {
                    item.Expend == "1" || item.Expend == 1 ? (
                        <View style={{backgroundColor: "#C0C0C0", width: "97%",
                                alignItems: 'center', flexDirection: 'column',
                                borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                            <View style={{flexDirection: 'row', marginTop: 7}}>
                                <Text style={{width: "30%", color: "#000000", fontSize: 16,
                                        marginLeft: 0}}>
                                    Discount</Text>
                                <Text style={{width: "2%", color: "#000000", fontSize: 16,
                                        marginLeft: 0, fontWeight: 'bold'}}>
                                    :</Text>
                                <Text style={{width: "50%", color: "#000000", fontSize: 16,
                                    marginLeft: 7, textAlign: 'right'}}>
                                    {item.amount_discount} </Text>
                            </View>
                            <View style={{backgroundColor: "#FFFFFF", width: "100%",
                                height: 1, marginTop: 8}}></View>
                            <View style={{flexDirection: 'row', marginTop: 3}}>
                                <Text style={{width: "30%", color: "#000000", fontSize: 16,
                                        marginLeft: 0}}>
                                    Penalty</Text>
                                <Text style={{width: "2%", color: "#000000", fontSize: 16,
                                        marginLeft: 0, fontWeight: 'bold'}}>
                                    :</Text>
                                <Text style={{width: "50%", color: "#000000", fontSize: 16,
                                    marginLeft: 7, textAlign: 'right'}}>
                                    {item.amount_fine} </Text>
                            </View>
                            <View style={{backgroundColor: "#FFFFFF", width: "100%",
                                height: 1, marginTop: 8}}></View>
                            <View style={{flexDirection: 'row', marginTop: 3}}>
                                <Text style={{width: "30%", color: "#000000", fontSize: 16,
                                        marginLeft: 0}}>
                                    Description</Text>
                                <Text style={{width: "2%", color: "#000000", fontSize: 16,
                                        marginLeft: 0, fontWeight: 'bold'}}>
                                    :</Text>
                                <Text style={{width: "50%", color: "#000000", fontSize: 16,
                                        marginLeft: 7, textAlign: 'right'}}>
                                    {item.description} </Text>
                            </View>
                            <View style={{backgroundColor: "#FFFFFF", width: "100%",
                                height: 1, marginTop: 8}}></View>
                            <View style={{flexDirection: 'row', marginTop: 3}}>
                                <Text style={{width: "30%", color: "#000000", fontSize: 16,
                                        marginLeft: 0}}>
                                    Collected by</Text>
                                <Text style={{width: "2%", color: "#000000", fontSize: 16,
                                        marginLeft: 0, fontWeight: 'bold'}}>
                                    :</Text>
                                <Text style={{width: "50%", color: "#000000", fontSize: 16,
                                        marginLeft: 7, textAlign: 'right'}}>
                                    {item.collected_by} </Text>
                            </View>
                            
                            <AntDesign name="up" size={24} color="blue" onPress={()=> ExpendDetail(Index)}
                                style={{marginTop: 10}}/>
                        </View>
                    ):(
                        <View style={{backgroundColor: "#C0C0C0", width: "97%",
                            height: "46%",
                            alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                            <AntDesign name="down" size={24} color="blue" onPress={()=> ExpendDetail(Index)}/>
                        </View>
                    )
                }
                </View>
                <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 1,
                    marginTop: item.Expend == 1 ? 8 : 0}}/>
                <View style={{marginTop: Index == FeesDetail.length-1 ? DEVICEHEIGHT * 0.01 : 0}}/>
            </View>
        );
    }
    //--------------------------------------
    const PostToScreen1 = (item, inx) => {
        console.log("PostToScreen1, item : ", item);
        set_Screen1Index(inx);
        Set_SFMID(item.fees[0].id);
        Set_FeeType_ID(item.fees[0].fee_groups_feetype_id);
        Set_FeesDetail([]);
        let j =0, paidFees = 0, object, tp=0, ss=[], uu=[];
        const JSONString = item.fees[0].amount_detail;
        object = JSON.parse(JSONString);
        array = Object.keys(object).map(function(k) {
            tp = tp + + parseInt(object[k].amount);
            return object[k];
        });
        for(j=0; j<array.length; j++){
            array[j]["Expend"] = 0;
            if(j>=array.length-1){
                Set_FeesDetail(array);
            }
        }
        set_CardTitle(item.fees[0].type+", Fees : "+item.fees[0].amount);
        Set_TotalFees(item.fees[0].amount);
        Set_TPaid(tp);
        ScreenNo=1;
    }
    //--------------------------------------
    const BackToScreen1 = () => {
        console.log("BackToScreen1, StdFeesStr[Screen1Index] : ", StdFeesStr[Screen1Index]);
        set_CardTitle(StdFeesStr[Screen1Index].fees[0].type+", Fees : "+StdFeesStr[Screen1Index].fees[0].amount);
        ScreenNo=1;
    }
    //--------------------------------------
    const Screen0 = (item, Indx) => {
        let j =0, paidFees = 0, tf = 0;

        const JSONString = item.fees[0].amount_detail;
        object = JSON.parse(JSONString);
        array = Object.keys(object).map(function(k) {
            return object[k];
        });
            for(j=0; j<array.length; j++){
                paidFees = paidFees + parseInt(array[j].amount);
            }
        return(
            <View>
                <TouchableOpacity 
                    onPress={() => { PostToScreen1(item, Indx)}} key={item.id}
                    style={{alignItems: "center", marginLeft: 3,
                    height: DEVICEHEIGHT * 0.064, width: "98%", flexDirection: 'row'}}>
                        <Text style={{width: "33%", color: "blue", fontSize: 14, marginBottom: 7,
                                marginLeft: 0}}>
                            {item.fees[0].type} </Text>
                        <Text style={{width: "19%", color: "blue", fontSize: 14, marginBottom: 7,
                                marginLeft: 7, textAlign: 'right'}}>
                            {item.fees[0].amount} </Text>
                        <Text style={{width: "19%", color: "blue", fontSize: 14, marginBottom: 7,
                                marginLeft: 10, textAlign: 'right'}}>
                            {paidFees}.00</Text>
                        <Text style={{width: "19%", color: "blue", fontSize: 14, marginBottom: 7,
                                marginLeft: 10, textAlign: 'right'}}>
                            {parseInt(item.fees[0].amount) - parseInt(paidFees)}.00 </Text>
                </TouchableOpacity>
                    <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 1}}></View>
            </View>
        );
    }
    //--------------------------------------
    const PostToScreen2 = (item) => {
        ScreenNo = 2;
        set_CardTitle("Fees Receive");
    }
    //---------------------------------------Fees Group List for select
    const FeesGroupList = () =>{
        set_classLView("none");
        set_SectionLView("none");
        set_StudentLView("none");
        set_FTypeLView("none")
        setchevrondownFG(!chevrondownFG);
        setchevrondownClass(true);
        setchevrondownSection(true)
        setchevrondownStud(true)
        setchevrondownFT(true);

        if(chevrondownFG){
            set_FGroupLView("flex");
        }else{
            set_FGroupLView("none");
        }
    }

    const SelectFeesGroup = async (idd, GroupN) => {
        set_FeeGroupID(idd);
        Set_FeesGroupN(GroupN);
        set_FGroupLView("none");
        setchevrondownFG(true);

        console.log("FeesGroup, id : ", idd);
        // let TFamount=0;
        // for(i = 0; i<TempArray.length; i++){
        //     console.log("TempArray row-1 amount : ", TempArray[i].amount);
        //     TFamount = parseFloat(TFamount) + parseFloat(TempArray[i].amount);
        // }
        // if(i>=TempArray.length)
        //     Set_PaidFees(TFamount);
        //     console.log("TempArray Fees Data : ", TempArray);

        // try {
        //     let resultTft = await fetch('https://amritaaz.com/school/api/Webservice/getfeessessiongroups', {
        //     method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
        //     })

        //     let responseSFM = await resultTft.json();

        //     setTimeout(()=> {
        //         for(i = 0; i<responseSFM.data.length; i++){
        //             if(responseSFM.data[i].fee_groups_id == idd && responseSFM.data[i].session_id == SessionID){
        //                 Set_SFMID(responseSFM.data[i].id);
        //                 console.log("getfeessessiongroups,  id : "+idd+", =>", responseSFM.data[i].id);
        //                 //i = responseSFM.data.length+1;
        //             }
        //         }
        //     }, 1000);

        // }catch(error) {
        //     console.error("Fetch Fee Group : ",error);
        // }

        try {
            let resultTft = await fetch(config.Url+'feegroupsfeetype', {
            method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
            })

            let responseTft = await resultTft.json();

            setTimeout(()=> {

                console.log("Fees Group, session group id : "+idd+", session id : ", SessionID);
                for(i = 0; i<responseTft.data.length; i++){
                    if(responseTft.data[i].fee_groups_id == idd &&  responseTft.data[i].session_id == SessionID){
                        Set_TotalFees(responseTft.data[i].amount);
                        Tfees = responseTft.data[i].amount;

                        console.log("Fees Group, : "+i+", data", responseTft.data[i]);

                        //i=responseTft.data.length+1;
                    }
                }
                console.log("Fees Group, Total fees : ", TotalFees);
                bfees = Tfees - PaidFees;
                Set_BalFees(bfees+".00");
                Set_RemainingFees(parseFloat(bfees) - parseFloat(DiscFees) + parseFloat(Penalty));
            }, 500);

        }catch(error) {
            console.error("Fetch Fee Group : ",error);
        }

    }

    const ShowFeesGroupFlatList = (FeesG, Index) => {
        return(
            <View>
                <TouchableOpacity onPress={() => SelectFeesGroup(FeesG.id, FeesG.name)} key={FeesG.id}
                        style={{backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                        height: DEVICEHEIGHT * 0.064, width: "100%"}}>
                    <Text style={{width: "97%", color: "#000000", fontSize: 17, marginBottom: 7}}>
                                {FeesG.name} </Text>
                </TouchableOpacity>
                <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 1}}></View>                        
            </View>
        );
    }
    //---------------------------------------Fees Type List for select
    const FeesTypeList = () =>{
        set_classLView("none");
        set_SectionLView("none");
        set_StudentLView("none");
        set_FGroupLView('none');
        setchevrondownClass(true);
        setchevrondownSection(true)
        setchevrondownStud(true)
        setchevrondownFT(!chevrondownFT);

        if(chevrondownFT){
            set_FTypeLView("flex");
        }else{
            set_FTypeLView("none");
        }
    }

    const SelectFeesType = async (idd, nameft) => {
        if(((FeeGroupID == "14" || FeeGroupID == "15" || FeeGroupID == "17" || FeeGroupID == "19") && idd == "14") ||
            ((FeeGroupID !== "14" && FeeGroupID !== "15" && FeeGroupID !== "17" && FeeGroupID !== "19") && idd !== "14")){
            
            Set_FeesTypeN(nameft);
            set_FTypeLView("none");
            setchevrondownFT(true);

            console.log("fees type id : ", idd);

            try {
                let resultTft = await fetch(config.Url+'feegroupsfeetype', {
                method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
                })

                let responseSFM = await resultTft.json();

                setTimeout(()=> {
                    console.log("fees group id : ", FeeGroupID);
                    console.log("fees type id : ", idd);
                    for(i = 0; i<responseSFM.data.length; i++){
                        if(responseSFM.data[i].feetype_id == idd && responseSFM.data[i].fee_groups_id == FeeGroupID 
                            && responseSFM.data[i].session_id == SessionID){
                            Set_FeeType_ID(responseSFM.data[i].id);
                            console.log("fees type id-1 : ", responseSFM.data[i].id);
                            //i = responseSFM.data.length+1;
                        }
                    }
                }, 100);

            }catch(error) {
                console.error("Fetch Fee Group : ",error);
            }

            try {
                let resultTft = await fetch(config.Url+'getstudent_fees_master', {
                method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
                })

                let responseSFM = await resultTft.json();
                console.log("responseSFM : ", responseSFM);
                Set_Fees_Session_G_id("37");
                if(idd == 14)
                    Set_Fees_Session_G_id("31");

                    console.log("Session ID : ", SessionID);
                    console.log("Student Session ID : ", Student_SID);
                
                setTimeout(()=> {
                    for(i = 0; i<responseSFM.data.length; i++){
                        if(idd == 14){
                            if(responseSFM.data[i].student_session_id == Student_SID && 
                                responseSFM.data[i].fee_session_group_id == "31"){
                                Set_SFMID(responseSFM.data[i].id);
                                console.log("getstudent_fees_master, master id : "+Student_SID+", =>", responseSFM.data[i].id);
                                //i = responseSFM.data.length+1;
                            }
                        }else{
                            if(responseSFM.data[i].student_session_id == Student_SID && 
                                responseSFM.data[i].fee_session_group_id == "37"){
                                Set_SFMID(responseSFM.data[i].id);
                                console.log("getstudent_fees_master, master id : "+Student_SID+", =>", responseSFM.data[i].id);
                                //i = responseSFM.data.length+1;
                            }
                        }
                    }
                }, 1000);

            }catch(error) {
                console.error("Fetch Fee Group : ",error);
            }

            setTimeout(()=>{
            console.log("Fees Type, id : ", FeeType_ID)}, 500);
        }else{
            Alert.alert("Selected fees type & fees group are mismatch, please check...");
        }
    }

    const ShowFeesTypeFlatList = (feesT, Index) => {

        return(
            <View>
                <TouchableOpacity onPress={() => SelectFeesType(feesT.id, feesT.type )} key={feesT.id}
                            style={{backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
                            height: DEVICEHEIGHT * 0.064, width: "100%"}}>
                    <Text style={{width: "97%", color: "#000000", fontSize: 17, marginBottom: 7}}>
                                {feesT.type} </Text>
                </TouchableOpacity>
                <View style={{backgroundColor: "#C0C0C0", width: "100%", height: 1}}></View>                        
            </View>
        );
    }
    //---------------------------------------------------------
    const ModeExchange = () =>{
        if(ModeFees == 'Cash')
            Set_ModeFees('Cheque')
        if(ModeFees == 'Cheque')
            Set_ModeFees('UPI')
        if(ModeFees == 'UPI')
            Set_ModeFees('Cash')
    }
    //---------------------------------------------------------
    return (
        <View style={styles.Mcontainer}>
            
            <View style={{marginLeft: 15, alignItems: "center", top: "0%"}}>
                <View style={styles.Row1}>
                    <View style={styles.Column1}>
                        <Text style={{fontSize: 20, fontWeight: "700"}}>Fees Receipt</Text>
                        <Text style={{fontSize: 20, fontWeight: "700"}}>is here!</Text>
                        <Text style={{}}>Dt. : {YDAY}</Text>
                    </View>
                    {
                        ScreenNo == 2 ?(
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity style={{width: DEVICEWIDTH * 0.27,
                                    flexDirection: "column", alignItems: "center",
                                    marginTop: 25}} onPress={()=> printToFile()}>
                                    <FontAwesome name="share-alt" size={30} color="#928686" />
                                </TouchableOpacity>
                                <TouchableOpacity style={{width: DEVICEWIDTH * 0.27, flexDirection: "column",
                                            alignItems: "center", marginTop: 10,}} onPress={()=> print()}>
                                    <Image source={require('../assets/printer_text.png')} 
                                            style={{width: 80, height: 60, borderRadius: 20,}}/>
                                </TouchableOpacity>
                            </View>
                        ):(
                            
                            <View style={{width: DEVICEWIDTH * 0.4, marginTop: 10, marginLeft: 40, alignItems: 'flex-end'}}>
                                <Image source={require('../assets/Attendance2Bn.png')} 
                                    style={{width: 80, height: 60, borderRadius: 20,}}/>
                            </View>
                        )
                    }
                </View>
            </View>
            <View style={{top: "03%"}}>
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
                <Text style={{fontSize: 14,}}>Father    :    {StudentFather}</Text>
            </View>
            {/* <View style={[styles.Row2, {marginLeft: 10, marginTop: "-4%"}]}>
                    <Text style={{width: DEVICEWIDTH * 0.24, fontSize: 14, fontWeight: "bold", marginTop: 0}}>
                        Fees Group :</Text>
                    <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: '72%',height: DEVICEHEIGHT * 0.03,
                                borderRadius: 20, flexDirection: "row"}} onPress={() => FeesGroupList()}>
                        <Text style={{width: "84%", fontSize: 15, fontWeight: "bold",
                                    marginLeft: 10}}>{FeesGroupN}</Text>
                        <FontAwesome name={chevrondownFG ? "chevron-down" : "chevron-up"}
                                        size={19} color="black" style={{marginLeft: 8}}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.Row2, {marginLeft: 10,}]}>
                    <Text style={{width: DEVICEWIDTH * 0.24, fontSize: 14, fontWeight: "bold", marginTop: 4}}>
                        Fees Type   :</Text>
                    <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: '72%',height: DEVICEHEIGHT * 0.03,
                                borderRadius: 20, flexDirection: "row", marginTop: 3}}
                                onPress={() => FeesTypeList()}>
                        <Text style={{width: "84%", fontSize: 15, fontWeight: "bold",
                                    marginLeft: 10}}>{FeesTypeN}</Text>
                        <FontAwesome name={chevrondownFT ? "chevron-down" : "chevron-up"}
                                        size={19} color="black" style={{marginLeft: 8}}/>
                    </TouchableOpacity>
                </View> */}

                </View>
            
            <View style={{left: "1.4%", top: "5%"}}>
                <View >

                    <View style={{width: DEVICEWIDTH * 0.97, height: DEVICEHEIGHT * 0.05, 
                                    backgroundColor: "#BAFAFF", borderTopLeftRadius: 15, 
                                    borderTopRightRadius: 15, flexDirection: "row",
                                    alignItems: "center"}}>

                    {
                        ScreenNo == 0 ? (
                            <Text style={{fontSize: 22, fontWeight: 'bold', marginLeft: 10, marginTop: 5}}>
                                {CardTitle}</Text>
                        ):(
                            <View style={{marginLeft: 10, flexDirection: 'row', marginTop: 0}}>
                                <FontAwesome5 name="arrow-left" size={30} color="blue"
                                    onPress={()=> {
                                        if(ScreenNo == 2){
                                            BackToScreen1();
                                        }else{
                                            ScreenNo = 0;
                                            set_CardTitle("Fees Detail");
                                        }
                                        reset_isLoadingFlatList(!isLoadingFlatList);
                                    }}/>
                                <Text style={{fontSize: ScreenNo == 0 ? 22 : 16, fontWeight: 'bold', marginLeft: 10,
                                            marginTop: 5}}>
                                    {CardTitle}</Text>
                            </View>
                        )
                    }
                    </View>
                    {
                        ScreenNo == 0 ?(
                            !isFlatListShow ? (
                                <ActivityIndicator/>
                            ):(
                                <View>
                                    <View style={{flexDirection: 'row', marginLeft: 3}}>
                                        <Text style={{color: "#000000", fontSize: 14, width: "37%"}}>
                                            Description</Text>
                                        <Text style={{color: "#000000", fontSize: 14, width: "20%"}}>
                                            Total Fees</Text>
                                        <Text style={{color: "#000000", fontSize: 14, width: "20%",
                                                marginLeft: 10}}>
                                            Total Paid</Text>
                                        <Text style={{color: "#000000", fontSize: 14, width: "20%",
                                                marginLeft: 10}}>
                                            Balance</Text>
                                    </View>
                                    <FlatList contentContainerStyle={{ flexGrow: 1 }} 
                                        showsVerticalScrollIndicator={false}
                                        data={StdFeesStr}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({item, index}) => Screen0(item, index)}
                                        extraData = {isLoadingFlatList}
                                    />
                                </View>
                            )
                        ):(
                            ScreenNo == 1 ?(
                                <View>
                                    <View style={{flexDirection: 'row', marginLeft: 10}}>
                                        <Text style={{color: "#000000", fontSize: 14, width: "30%"}}>
                                            Receipt No.</Text>
                                        <Text style={{color: "#000000", fontSize: 14, width: "35%"}}>
                                            Date</Text>
                                        <Text style={{color: "#000000", fontSize: 14, width: "20%",
                                                marginLeft: 47}}>
                                            Paid</Text>
                                    </View>
                                    <View style={{height: "84%"}}>
                                        <FlatList contentContainerStyle={{ flexGrow: 1 }} 
                                            showsVerticalScrollIndicator={false}
                                            data={FeesDetail}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({item, index}) => Screen1(item, index)}
                                            extraData = {isLoadingFlatList}
                                        />
                                    </View>
                                    <View style={{flexDirection: 'row', left: "36%", marginTop: "-11%"}}>
                                        <Text style={{fontSize: 17, fontWeight: '700', width: "30%",
                                                color: "#000000"}}>
                                            Total Paid :</Text>
                                        <Text style={{fontSize: 17, fontWeight: '700', width: "30%"}}>
                                            {TPaid}</Text>
                                    </View>
                                </View>
                            ):(
                            <View style={{marginLeft: 10, marginTop: 5}}>
                                <View style={styles.Row1}>
                                    <Text style={styles.TextStyle1}>Total Amount</Text>
                                    <Text style={styles.TextStyle2}>:  {TotalFees}</Text>
                                </View>
                                <View style={styles.Row1}>
                                    <Text style={[styles.TextStyle1,{color: "#FF9F0B"}]}>Paid Amount</Text>
                                    <Text style={[styles.TextStyle2,{color: "#FF9F0B"}]}>:  {GTPaid}</Text>
                                </View>
                                <View style={styles.Row1}>
                                    <Text style={styles.TextStyle1}>Balance Amount</Text>
                                    <Text style={styles.TextStyle2}>:  {TotalFees - GTPaid}</Text>
                                </View>
                                <View style={styles.Row1}>
                                    <Text style={styles.TextStyle1}>Discount</Text>
                                    <Text style={styles.TextStyle2}>:  </Text>
                                    <TextInput placeholder="0.00" style={{fontSize: 18, backgroundColor: "#F9F7D8"}}
                                            onChangeText={(textDiscount) => {
                                                if(textDiscount == ""){
                                                    Set_DiscFees("0");
                                                    Set_RemainingFees(((TotalFees - GTPaid)
                                                    +parseFloat(Penalty)-0));
                                                }else{
                                                    Set_DiscFees(textDiscount);
                                                    Set_RemainingFees(((TotalFees - GTPaid)
                                                    +parseFloat(Penalty)-parseFloat(textDiscount))+".00");
                                                }
                                            }}
                                            inputMode='decimal'
                                    />
                                </View>
                                <View style={styles.Row1}>
                                    <Text style={styles.TextStyle1}>Penalty</Text>
                                    <Text style={styles.TextStyle2}>:  </Text>
                                    <TextInput placeholder="0.00" style={{fontSize: 18, backgroundColor: "#F9F7D8"}}
                                            onChangeText={(textPenalty) => {
                                                if(textPenalty == ""){
                                                    Set_Penalty("0");
                                                    Set_RemainingFees(((TotalFees - GTPaid)+0-parseFloat(DiscFees))+".00");
                                                }else{
                                                    Set_Penalty(textPenalty);
                                                    Set_RemainingFees(((TotalFees - GTPaid)+
                                                    parseFloat(textPenalty)-parseFloat(DiscFees))+".00");
                                                }
                                            }}
                                            inputMode='decimal'
                                    />
                                </View>
                                <View style={styles.Row1}>
                                    <Text style={styles.TextStyle1}>Pay Amount</Text>
                                    <Text style={styles.TextStyle2}>:  </Text>
                                    <TextInput placeholder="0.00" style={{fontSize: 18, backgroundColor: "#F9F7D8"}}
                                            onChangeText={(textT) => {
                                                if(textT == ""){
                                                    Set_PayFees("0")
                                                    Set_RemainingFees(((TotalFees - GTPaid)-0+
                                                                        parseFloat(Penalty)-DiscFees)+".00");
                                                }else{
                                                    Set_PayFees(textT)
                                                    Set_RemainingFees(((TotalFees - GTPaid)-parseFloat(textT)+
                                                                        parseFloat(Penalty)-DiscFees)+".00");
                                                }
                                            }}
                                            inputMode='decimal'
                                    />

                                </View>
                                <View style={styles.Row1}>
                                    <Text style={styles.TextStyle1}>Payment Mode</Text>
                                    <Text style={[styles.TextStyle2, {width: "25%"}]}>:  {ModeFees}</Text>
                                    <FontAwesome name="exchange" size={24} color="blue" style={{marginLeft: 10}}
                                            onPress={()=> ModeExchange()}/>
                                </View>
                                <View style={styles.Row1}>
                                    <Text style={styles.TextStyle1}>Remaining Amount</Text>
                                    <Text style={styles.TextStyle2}>:  {RemainingFees}</Text>
                                </View>
                                <Text style={[styles.TextStyle1, {marginTop: "3%"}]}>Description</Text>
                                <TextInput onChangeText={(textT) => Set_Description(textT)}
                                           style={{fontSize: 15, marginTop: "1%", 
                                           backgroundColor: "#F8F7D8", width: "98%", height: "15%"}}
                                           value={Description} numberOfLines={3} multiline={true}/>
                            </View>
                            )
                        )
                    }




                </View>
            </View>
        <View style={{alignItems: 'center', justifyContent: 'center', top: "0%"}}>
        {
            ScreenNo == 2 ? (
                <View style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05,
                    backgroundColor: "#BAFAFF", borderRadius: 8,
                    justifyContent: "center", alignItems: "center"}}>
                    {
                        isSaving ? (
                            <ActivityIndicator/>    
                        ) : (
                            <TouchableOpacity style={{width: DEVICEWIDTH * 0.95, height: DEVICEHEIGHT * 0.05,
                                backgroundColor: "#BAFAFF", borderRadius: 8,
                                justifyContent: "center", alignItems: "center",}}
                                onPress = {() => SubmitToServer()}>
                                <Text style={{color: "#000000", fontWeight: "bold", fontSize: 17,}}>
                                    {TextSave}</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            ):(
                ScreenNo == 1 && (TotalFees - TPaid) > 0 ?(
                    route.params.PERMISSION_RANGE == 11 ||
                    route.params.PERMISSION_RANGE == 30 ? (
                        <Entypo name="add-to-list" size={35} color="green"
                            onPress={()=> PostToScreen2()} style={{marginTop: "-60%"}}/>
                    ):(
                        <></>
                    )
                ):(
                    <View></View>
                )

            )
        }
        </View>

        <FlatList contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            data={ClassForAtt.data} style={[styles.dropdownClass, {display: classLView}]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => ShowClassFlatList(item, index)}
        />
        <FlatList contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            data={SectionForAtt} style={[styles.dropdownSection, {display: SectionLView}]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => ShowSectionFlatList(item, index)}
        />
        <FlatList contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={true}
            data={DataS.data} style={[styles.dropdownStud, {display: StudentLView}]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => ShowStudentFlatList(item, index)}
        />



        {/* <FlatList contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            data={FGData.data} style={[styles.dropdownFeesGroup, {display: FGroupLView}]}
            keyExtractor={(item, indexx) => indexx.toString()}
            renderItem={({item, indexx}) => ShowFeesGroupFlatList(item, indexx)}
        />
        <FlatList contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            data={FTData.data} style={[styles.dropdownFeesType, {display: FTypeLView}]}
            keyExtractor={(item, indexxFT) => indexxFT.toString()}
            renderItem={({item, indexxFT}) => ShowFeesTypeFlatList(item, indexxFT)}
        /> */}

    </View>
);
}

const styles = StyleSheet.create({
    Mcontainer: {
        flex: 1,
        width: DEVICEWIDTH,
        height: DEVICEHEIGHT,
    },
    SContainer: {
        marginTop: DEVICEHEIGHT * 0.01,
        left: "2.35%", 
        position: 'absolute',       
    },
    CardView2: {
        elevation: 5,
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        width: DEVICEWIDTH * 0.95,
        height: DEVICEHEIGHT * 0.60,
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
        width: DEVICEWIDTH * 0.46,
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
    shadowOpacity: 0.6,
    elevation: 15,
    top: "17%",
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
    top: "17%",
    left: "70%",
},
dropdownStud: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    width: '95%',
    height: DEVICEHEIGHT * 0.4,
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    elevation: 3,
    top: "23%",
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
    top: "28.5%",
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
    top: "43%",
    left: "2%",
},
TextStyle1: {
    fontSize: 18,
    padding: 2,
    width: "50%"
},
TextStyle2: {
    fontSize: 18,
    padding: 2,
},

  
  });





  /*
  https://amritaaz.com/school/api/Webservice/getfeessessiongroups
                            "data":[
                                {
                                "student_fees_master_id " : SFMID,
                                "fee_groups_feetype_id": FeeType_ID,
                                "amount_detail":"{ 1{ amount:"+PayFees+",date:"+SDAY+",description: "+Description+
                                                "Collected By: "+""+",amount_discount:"+DiscFees+",amount_fine: "+Penalty+
                                                ",payment_mode:"+ModeFees+",received_by:"+"1"+",inv_no:"+"1"+"}}",
                                "is_active":"no"
                                }
                            ]

  */