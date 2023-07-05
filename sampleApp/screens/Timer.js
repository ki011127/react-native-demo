import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet,TouchableOpacity } from "react-native";


function Timer() {
    const [timer,setTimer] = useState(false);
    const [input,setInput] = useState("");
    const [second,setSecond] = useState(0);
    const[minute,setMinute] = useState(0);
    const[hour,setHour] = useState(0);
    const onChangeText = (event) =>{
        setInput(event);
    };
    const timerOn = () => {
        setTimer(!timer);
    };
    const setTime = () =>{
        setTimer(false);
        const splitTime = input.split(":");
        if(!splitTime[1]){
            setSecond(parseInt(splitTime[0]));
            setMinute(0);
        }
        else if(!splitTime[2]){
            setHour(0);
            setMinute(parseInt(splitTime[0]));
            setSecond(parseInt(splitTime[1]));
        }
        else{
            setHour(parseInt(splitTime[0]));
            setMinute(parseInt(splitTime[1]));
            setSecond(parseInt(splitTime[2]));
        }
    }
    useEffect(()=>{
        if(!timer){
            return
        }
        else{
            const id=setInterval(()=>{
                if(second>0){
                    setSecond(second-1);
                }
                if(second===0){
                    if(minute===0){
                        if(hour===0){
                            clearInterval(id);
                            timerOn();
                            alert("Time out");
                        }
                        else if(hour>0){
                            setHour(hour-1);
                            setMinute(59);
                            setSecond(59);
                        }
                    }else{
                        setMinute(minute-1);
                        setSecond(59);
                    }
                }
            },1000);
            return() =>clearInterval(id);
        }
    },[,hour,minute,second,timer]);
  return (
    <View>
        <View style={styles.header}><TextInput
        onSubmitEditing={setTime}
        onChangeText={onChangeText}
        value = {input}
         placeholder={
          "Hours:Minutes:seconds"
          }
          style={styles.input}/>
          </View>
        <View>
            <TouchableOpacity onPress={timerOn}>
                <Text style={styles.start}>{timer?"Stop":"Start"}</Text>
            </TouchableOpacity>
        </View>
        <View>
            <Text style={styles.textStyle}>{hour}:{minute}:{second}</Text>
        </View>
    </View>
  );
}
const styles = StyleSheet.create({
    header:{
        //flexDirection:"row",
        //alignContent:"center",
        
    },
    input:{
        backgroundColor:"white",
        textAlign: "center",
        paddingVertical:20,
    },
    start:{
        marginTop:20,
        backgroundColor:"white",
        textAlign:"center",
        paddingVertical:20,

    },
    textStyle:{
        marginTop:50,
        fontSize:100,
        fontWeight:"400",
        textAlign:"center",
    },
});

export default Timer;