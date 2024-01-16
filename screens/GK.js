import React from 'react';
import PDFReader from 'rn-pdf-reader-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      SS: '0',
      Definition: 'Definition',
      isBoxVisival: true,
      Disp: 'flex',
    };

    try {
      AsyncStorage.getItem('SelfStudy').then((value) => this.state.SS = value);
    } catch (e) {
      console.error("GK Async : ", e);
    }
    console.log(this.state.isBoxVisival);
    console.log("SS : ", this.state.SS);
  }

  SSDef() {
    if(this.state.isBoxVisival){
      this.state.isBoxVisival = false;
      this.state.Disp = 'none';
    }else{
      this.state.isBoxVisival = true;
      this.state.Disp = 'flex';
    }
    console.log(this.state.isBoxVisival);
    console.log("SS : ", this.state.SS);
    console.log("Def : ", this.state.Definition);
  }

  // React.useEffect(() => {
  //   AsyncData();
  // }, []);

  render() {
    return (
              <PDFReader
                source={{uri: 'https://sewabhartidabra.in/Puzzle_Q_A/puzzles_q_a.pdf'}}
              />
    );
  }
}