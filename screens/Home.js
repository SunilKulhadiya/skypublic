import React from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView, TouchableOpacity, Image,
          SafeAreaView, StatusBar, Button, Alert, Modal, TextInput} from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const Home = ({navigation}) => {

  
  const ProductImgs = [{"SrNo": "1", "ItemN":"https://skand.tech/Bestow/eyed4.jpg"}, 
                      {"SrNo": "2", "ItemN":"https://skand.tech/Bestow/syrup2.jpeg"}, 
                      {"SrNo": "3", "ItemN":"https://skand.tech/Bestow/eyed1.jpeg"}, 
                      {"SrNo": "4", "ItemN":"https://skand.tech/Bestow/tablet2.jpeg"},
                      {"SrNo": "5", "ItemN":"https://skand.tech//Bestow/syrup5.jpeg"},
                      {"SrNo": "6", "ItemN":"https://skand.tech//Bestow/tablet5.jpeg"}]

  const [ItemSNo, set_ItemSNo] = React.useState(0);
  const [ItemImg, set_ItemImage] = React.useState("");
  const [ItemEdit, set_ItmEdit] = React.useState("");
  const [QtyEdit, set_QtyEdit] = React.useState("");
  const [LoginHome, set_HL] = React.useState(true);
  const [datas, set_datas] = React.useState([]);
  const [datasAvailable, set_Available] = React.useState(true);
  const [isEditDBoxVisival, set_EDBox] = React.useState(false);

  React.useEffect(function effectFunction() {
    fetch('https://skand.tech/Zluck.php', {
      method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
      body: JSON.stringify({Action: 'Fetch', smobileno: '', emailid: "", password: ''})
    }).then(response => response.json()).then(( responseJson ) => {
      set_HL(false);
      if(responseJson.length>0){
        set_datas((responseJson));
        set_Available(true)
      }else{
        set_datas([]);
        set_Available(false)
      }
      //console.log(responseJson);
    }).catch((error) => {
      if(datas.length>0){
        set_Available(true)
      }else{
        set_Available(false)
      }
      console.error(error);
    });   
  });

  const DelItem=(SrNO)=>{
    if(datas.length > 0){
      // set_HL(true);
      // fetch('https://skand.tech/Zluck.php', {
      //   method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
      //   body: JSON.stringify({Action: 'Remove', FilterSrNo: SrNO})
      // }).then(response => response.json()).then(( responseJson ) => {
      //     set_HL(false);
      //     if(datas.length>0){
      //       set_datas((responseJson));
      //       set_Available(true)
      //     }else{
      //       set_datas([]);
      //       set_Available(false)
      //     }
      //         //console.log(responseJson);
      // }).catch((error) => {
      //   if(datas.length>0){
      //     set_Available(true)
      //   }else{
      //     set_Available(false)
      //     set_datas([]);
      //   }
      //     console.error("Error-2 : ",error);
      // });   
    }
  }
  const EditItem=(SrNO, ImgUrl, EItem, EQty)=>{
    set_EDBox(true);
      set_ItemSNo(SrNO);
      set_ItemImage(ImgUrl);
      set_ItmEdit(EItem);
      set_QtyEdit(EQty);
      oqty=parseInt(EQty);
  }
  const toggleModalVisibility = () => {
    set_EDBox(!isEditDBoxVisival);
  }
  const SetImage=(item) => {
    set_ItemImage(item)
    console.log("2 : ", ItemImg)
  }
  const ChangeSave = () => {
    if(datas.length>0){}
    set_HL(true);
    set_EDBox(!isEditDBoxVisival);
      let qty=0;
      console.log('itemSno : ', ItemSNo);
      console.log('datas sno : ', datas.sr_no);
  
      fetch('https://skand.tech/Zluck.php', {
        method: 'POST', headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
        body: JSON.stringify({Action: 'Update', FilterSrNo: ItemSNo, ItemName: ItemEdit, OrderQty: QtyEdit,
                              ImgUrl: ItemImg})
      }).then(response => response.json()).then(( responseJson ) => {
        set_datas((responseJson));
        set_HL(false);
        //console.log(responseJson);
      }).catch((error) => {
        console.error(error);
      });   
  }
    const OrederQtyPlus=() =>{
        set_QtyEdit((parseInt(QtyEdit)+1).toString());
        console.log("Qty : "+oqty);
        console.log("orderQty : "+QtyEdit);
    }
    function OrederQtyMinus(){
      if(parseInt(QtyEdit)>1){
        set_QtyEdit((parseInt(QtyEdit)-1).toString());
      }
      console.log("- : "+QtyEdit);
    }
  
//console.log("5 : ",LoginHome);

  return (
    <SafeAreaView>
      <StatusBar barStyle={"dark-content"} backgroundColor="#ecf0f1" />
        <View style={styles.container}>
          {
            LoginHome ? (
                <ActivityIndicator style={styles.LoadingIndicator}/>
            ) : (
                <ScrollView>
                {
                  datasAvailable ? (
                    datas.map(filteredItem => {
                        return (
                          <View style={styles.Human}>
                              <View style={styles.DelIconSetup}>
                                <AntDesign name="delete" size={24} color="black" key={filteredItem.sr_no} 
                                        onPress={() => DelItem(filteredItem.sr_no)}/>
                              </View>
                            <View style={styles.HumanRow}>
                              <Image style={styles.HumanImg} source={{uri: filteredItem.URL}}/>
                              <View style={styles.HumanColumn}>
                                <Text style={styles.HumanTitle}>{filteredItem.Item}</Text>
                                  <View style={styles.HumanRow1}>
                                    <Text style={styles.HumanText}>Order Qty : {filteredItem.Qty}</Text>
                                  </View>
                                <Text style={styles.HumanText}>Sub Total : {filteredItem.Price*filteredItem.Qty}</Text>
                              </View>
                            </View>  
                              <View style={styles.DelIconSetup}>
                                <AntDesign name="edit" size={24} color="black" 
                                    onPress={() => EditItem(filteredItem.sr_no, filteredItem.URL,
                                          filteredItem.Item, filteredItem.Qty) }/>
                              </View>

                              <Modal animationType="slide" transparent visible={isEditDBoxVisival} 
                                    presentationStyle="overFullScreen" onDismiss={toggleModalVisibility}>
                                  <View style={styles.viewWrapper}>
                                    <View style={styles.modalView}>

                                    <View style={styles.HumanColumnImg}>
                                      <Image style={styles.ModelImg} source={{uri: ItemImg}}/>
                                      <Text>Image</Text>
                                    </View>
                                      <View style={styles.CaroUselcontainer}>
                                        <ScrollView horizontal={true} decelerationRate="fast" directionalLockEnabled={false}
                                          showsHorizontalScrollIndicator={false}>
                                          {
                                            ProductImgs.map(filteredImg => (
                                          <TouchableOpacity key={filteredImg.SrNo} onPress={() => SetImage(filteredImg.ItemN)}>
                                                <Image key={filteredImg.SrNo} style={styles.ImgSize} 
                                                  source={{uri: filteredImg.ItemN}}/>
                                              </TouchableOpacity>
                                            ))
                                          }
                                        </ScrollView>
                                        
                                      </View>

                                    <View style={styles.HumanRow}>
                                      <Text style={styles.ModelText}>Item : </Text>
                                      <TextInput placeholder="Item Name" value={ItemEdit} 
                                          style={styles.textInputIN} onChangeText={(valueI) => set_ItmEdit(valueI)} />
                                    </View>
                                    <View style={styles.HumanRow}>
                                      <Text style={styles.ModelText}>Quantity : </Text>
                                      <TextInput placeholder="Quantity" value={QtyEdit} 
                                          style={styles.textInputQty} onChangeText={(valueQ) => set_QtyEdit(valueQ)} />
                                      <AntDesign style={styles.IconMargin} name="plussquareo" size={30} color="black"
                                         onPress={OrederQtyPlus}/>
                                      <AntDesign style={styles.IconMargin} name="minussquareo" size={30} color="black"
                                         onPress={OrederQtyMinus}/>
                                    </View>
  
                                        {/** This button is responsible to close the modal */}
                                        <View style={styles.HumanRow2}>
                                          <View style={styles.ButMargenR}>
                                            <Button title="Cancel" onPress={toggleModalVisibility}/>
                                          </View>
                                          <View style={styles.ButMargenR}>
                                            <Button title="Save" onPress={ChangeSave}/>
                                          </View>
                                        </View>
                                    </View>
                                  </View>
                                </Modal>

                          </View>
                        );
                    })
                  ):(
                    <Text>No more data/item</Text>
                  )
                }
            </ScrollView>
                  )
          }
        </View>
    </SafeAreaView>
  );

}

export default Home;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: DEVICE_WIDTH,
  },
  DispCol: {
    flexDirection: 'column',
    marginTop: DEVICE_WIDTH*0.5,
  },
  DelIconSetup: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    textAlign: "center",
  },
  DispRow: {
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 2,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 7,
    padding: 5,
    marginBottom: 10,
    width: DEVICE_WIDTH*0.7,    
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
    width: DEVICE_WIDTH*0.7,
    
  },
  ModelText: {
    fontSize: 17,
    width: DEVICE_WIDTH * 0.23,
    marginTop: 10,
  },
  HumanRow1: {
    flexDirection: 'row',
    padding: 0,
  },
  margUD: {
    marginLeft: 10,
  },

  Bottn: {
    justifyContent: "flex-end",
    alignItems: "center",
    textAlign: "center",
    padding: 0,
    marginTop: 40,
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
  Human:{
    justifyContent: "space-between",
    marginTop: 5,
    padding: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    width: DEVICE_WIDTH*0.95,
    backgroundColor: "#FEF5E7",
  },
  HumanRow:{
    flexDirection: 'row',
    padding: 5,
  },
  HumanRow1: {
    flexDirection: 'row',
  },
  HumanRow2: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: DEVICE_WIDTH * 0.8,
    marginTop: 20,
  },
  HumanColumnImg:{
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  HumanColumn:{
    flexDirection: 'column',
    marginLeft: 30,
  },
  HumanTitle:{
    color: '#020CDF',
    fontSize: 22,
  },
  HumanText:{
    color: 'black',
  },
  HumanImg:{
    width: 100,
    height: 100,
    marginLeft: 20,
  },
  ModelImg:{
    marginTop: 20,
    width: 60,
    height: 60,
  },
  HumanButton: {
    marginTop: 15,
    marginLeft: 15,
    color: 'white',
    fontSize: 22,
    textAlign: "center",
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "#37E2F0",
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
},
modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "40%",
    left: "50%",
    elevation: 5,
    transform: [{ translateX: -(DEVICE_WIDTH * 0.4) }, 
                { translateY: -90 }],
    height: DEVICE_HEIGHT * 0.55,
    width: DEVICE_WIDTH * 0.8,
    backgroundColor: "#fff",
    borderRadius: 7,
},
textInputIN: {
    width: "52%",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 8,
},
textInputQty: {
  width: "30%",
  borderRadius: 5,
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderColor: "rgba(0, 0, 0, 0.2)",
  borderWidth: 1,
  marginBottom: 8,
},
ButMargenR: {
  width: 100,
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 20,
},
CaroUselcontainer: {
  flex: 1,
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  padding: 2,
  marginTop: 20,
  height: DEVICE_HEIGHT * 0.8,
  width:DEVICE_WIDTH * 0.7,
 },
 CaroUselArea: {
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  marginLeft:10,
  marginRight: 10,
  marginTop: 10,
  borderRadius: 8,
  borderColor: '#AD30D3',
  borderStyle: "solid",
  borderWidth: 3,
  padding: 8,
  height: 195,
  width: DEVICE_WIDTH*0.40,
},
ImgSize: {
  height: DEVICE_HEIGHT *0.1,
  width: DEVICE_WIDTH * 0.2,
},
IconMargin: {
  marginTop: 8,
  marginLeft: 8,
}

});
