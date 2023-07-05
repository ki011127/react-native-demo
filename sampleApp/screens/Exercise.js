import React, { useState, useEffect } from "react";
import { StyleSheet,View, Text,ScrollView, TextInput } from "react-native";
import {dbService, firebase} from './Firebase';
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { TouchableOpacity } from "react-native";
import Data from './Data';

function Exercise() {
  const [infor,setInfor] = useState([]);
  useEffect(()=>{
    onSnapshot(collection(dbService, "exer"), (snapshot) =>{
      const exerciseArray = snapshot.docs.map((doc)=>({
        id: doc.id,
        ...doc.data(),
      }));
      setInfor(exerciseArray);
    });
  },[]);
  return (
    <View>
    <ScrollView>
      <View>
       {infor.map((inform)=>(
        <Data key={inform.id} exerInformObj={inform}/>  
       ))} 
      </View>
    </ScrollView>
    </View>
  );
};



export default Exercise;