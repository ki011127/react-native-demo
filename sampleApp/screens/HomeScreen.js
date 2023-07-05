import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function HomeScreen({navigation}) {
  const date = new Date();
  const year = date.getFullYear();
  const todayMonth = date.getMonth() + 1;
  const todayDate = date.getDate();
  const week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const dayOfWeek = week[date.getDay()];
  const string = year+'/'+todayMonth+'/'+todayDate+'/'+dayOfWeek;
  return (
    <View style={styles.container}>
      <View style = {styles.head}>
        <Text>{string}</Text>
      </View>
      <ScrollView>
        <View style={styles.touchable1}>
          <TouchableOpacity onPress={() => navigation.navigate('Exercise')}>
            <Text style={styles.textBtn}>To Do Exercise</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
            <Text style={styles.textBtn}>calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Timer')}>
            <Text style={styles.textBtn}>Timer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('BLE')}>
            <Text style={styles.textBtn}>BLE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3A3D40",
    paddingHorizontal: 20,
  },
  head: {
    marginTop : 20,
  },
  touchable1:{
    //flexDirection:"row",
    //justifyContent: "space-between",
    marginTop:50,
  },
  textBtn:{
    marginBottom: 30,
    paddingVertical:90,
    paddingHorizontal:12,
    backgroundColor:"#ABB8C3",
    alignItems:"center",
    fontSize : 20,
    fontWeight : "600",
    textAlign : "center",
  },
});
export default HomeScreen;