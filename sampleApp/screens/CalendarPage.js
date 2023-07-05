import React, { useEffect, useState } from "react";
import {Calendar} from "react-native-calendars";
import { View, Text, StyleSheet } from "react-native";
import {format} from "date-fns";

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [markedDates, setMarkedDate] = useState([selectedDate]);
  const [markedSelectedDate, setMarkedSelectedDate] = useState({});
  const select = () => {
    const obj = {};
    Object.assign(obj,markedSelectedDate,{
      [selectedDate]: {
        selected: true,
        marked : true,
      }
    });
    setMarkedSelectedDate(obj);
  }
  const addDates =()=>{
    const obj = {}
    markedDates.forEach((item)=>{
      Object.assign(obj,{[item]:{
        marked: true,
      },})
    })
    setMarkedSelectedDate(obj);
  }
  useEffect(()=>{
    select();
    let newDates = [...markedDates];
    newDates.indexOf(selectedDate,0)===-1?newDates.push(selectedDate):null
    setMarkedDate(newDates);
  },[selectedDate]);

  return (
    <Calendar style = {styles.calendar} markedDates={markedSelectedDate}
    theme={{selectedDayBackgroundColor: "red",
            dotColor: 'blue'
    }}
    onDayPress={(day)=>{
      setSelectedDate(day.dateString);
      addDates();
    }}/>
  );
}
const styles = StyleSheet.create({
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  }
});
export default CalendarPage;