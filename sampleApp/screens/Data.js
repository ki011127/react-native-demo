import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { dbService } from "./Firebase";
import { doc, updateDoc } from "firebase/firestore";

const Data = ({exerInformObj}) => {
    const [newSelected, setNewSelected] = useState(exerInformObj.selected);
    const [newWeight, setNewWeight] = useState(exerInformObj.weight);
    const [newRep, setNewRep] = useState(exerInformObj.rep);
    const changeSelect = ()=>{
      if(exerInformObj.selected){
        setNewRep(0);
        setNewWeight(0);
      }
      setNewSelected(!exerInformObj.selected);
    }
    const changeMinusWeight = ()=>{
      if(exerInformObj.weight>=2.5){
        setNewWeight(exerInformObj.weight-2.5);
      }
    }
    const changePlusWeight = ()=>{
      setNewWeight(exerInformObj.weight+2.5);
    }
    const changePlusRep = ()=>{
      setNewRep(exerInformObj.rep+1);
    }
    const changeMinusRep = ()=>{
      if(exerInformObj.rep>=1){
        setNewRep(exerInformObj.rep-1);
      }
    }
    useEffect(()=>{
        updateDoc(doc(dbService, "exer", exerInformObj.id),{selected: newSelected});
    },[newSelected]);
    useEffect(()=>{
      updateDoc(doc(dbService, "exer", exerInformObj.id),{weight: newWeight});
  },[newWeight]);
  useEffect(()=>{
    updateDoc(doc(dbService, "exer", exerInformObj.id),{rep: newRep});
},[newRep]);
    return(
    <View>
          <View style = {{flexDirection:'row',alignItems:"center",}}>
          <BouncyCheckbox onPress={changeSelect} isChecked={exerInformObj.selected}/>
          <Text style = {styles.exercise}>{exerInformObj.exerciseType}</Text>
          </View>
          <View style = {{flexDirection:'row',alignItems:"center", marginBottom:15,}}>
          <TouchableOpacity disabled={!exerInformObj.selected} onPress={changeMinusWeight} style = {styles.minusButton}>
            <Text style={styles.btnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.text}>weight : {exerInformObj.weight}</Text>
          <TouchableOpacity disabled={!exerInformObj.selected} onPress={changePlusWeight} style = {styles.plusButton}>
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={!exerInformObj.selected} onPress={changeMinusRep} style = {styles.minusButton}>
            <Text style={styles.btnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.text}>rep : {exerInformObj.rep}</Text>
          <TouchableOpacity disabled={!exerInformObj.selected} onPress={changePlusRep} style = {styles.plusButton}>
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
          </View>
          
    </View>
    );
};
const styles = StyleSheet.create({
    exercise:{
      paddingVertical:15,
      fontSize:20,
      fontWeight:"500",
    },
    minusButton:{
      marginLeft:40,
      width:20,
      backgroundColor:"white",
      height:20,
      borderRadius:100,
      alignItems:"center",
    },
    plusButton:{
      marginRight:10,
      width:20,
      backgroundColor:"white",
      height:20,
      borderRadius:100,
      alignItems:"center",
    },
    btnText:{
      fontSize:20,
      fontWeight:"bold"  
    },
    text:{
      textAlign:"center",
      width:80,
    },
  })
export default Data;