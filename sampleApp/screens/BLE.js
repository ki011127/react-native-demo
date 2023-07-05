import React, { useEffect, useState } from "react";
import { ScrollView,Alert, View, Text, TextInput, StyleSheet,TouchableOpacity,PermissionsAndroid, Platform, NativeModules, NativeEventEmitter,} from "react-native";
import {PERMISSIONS, RESULTS, requestMultiple} from 'react-native-permissions';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';
const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);


function BLE() {
    const [message,setMessage] = useState("");
    const [input,setInput] = useState(0);
    const [isScanning, setIsScanning] = useState(false);
    const [bluetoothDevices, setBluetoothDevices] = useState([]);
    const [scannedDevices, setScannedDevices] = useState([]);
    const [connected, setConnected] = useState(false);
    const peripherals = new Map()
    const [connectedID,setConnectedID] = useState("");
    const [displayData, setDisplayData] = useState("Display Read or write Data");
    const serviceUUID = "180D";
    const characteristicUUID = "2a37"
    const onChangeText = (event) =>{
      setInput(parseInt(event));
    };
    function intToByteArray(value, littleEndian = true) {
      const buffer = Buffer.allocUnsafe(4);
      if (littleEndian) {
        buffer.writeInt32LE(value, 0);
      } else {
        buffer.writeInt32BE(value, 0);
      }
      return Array.from(buffer);
    }
    function byteArrayToIntArray(byteArray) {
      const intArray = [];
      for (let i = 0; i < byteArray.length; i += 2) {
        const value = byteArray[i] | (byteArray[i + 1] << 8);
        intArray.push(value);
      }
      return intArray;
    }
    const requestBluetoothPermission = async () => {
        try {
          if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location Permission',
                message: 'This app requires access to your location to scan for Bluetooth devices.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
      
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('Location permission granted');
              BleManager.checkState()
                .then((state) => {
                  if (state === 'PoweredOff') {
                    setMessage('Bluetooth is disabled');
                    console.log('Bluetooth is disabled');
                  } else {
                    setMessage('Bluetooth is enabled');
                    console.log('Bluetooth is enabled');
                  }
                })
                .catch((error) => {
                  console.log('Failed to get Bluetooth state:', error);
                });
            } else {
                setMessage('Location permission denied');
              console.log('Location permission denied');
            }
            await requestMultiple([
              PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
              PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
            ])
          }
        } catch (error) {
          console.log('Failed to request location permission:', error);
        }
      };
    const startBLE = () => {
      BleManager.start().then(()=>{
        console.log("Module initialized");
      });
    };
    const startScan = () => {
      setConnected(false);
      if (!isScanning) {
        BleManager.scan([], 5)
          .then(() => {
            console.log("scan");
            setIsScanning(true);
          })
          .catch(error => {
            console.error(error);
          });
      }
    };
    const connectDevices = (peripheral) =>{
      if (peripheral && !connected) {
        BleManager.connect(peripheral.id)
         .then(() => {
           setConnectedID(peripheral.id);
           console.log('connect!');
           peripheral.connected = true;
           setConnected(true);
           Alert.alert(
            'Connected',
            'Bluetooth device connected.',
            [
              { text: 'OK'}
            ],
            { cancelable: false }
          );
          retrieveServices(peripheral);
          })
         .catch((error) => {
            console.log('fail connect:', error);
          });
      } else {
        console.log('can not find device');
      }
    }
    const disconnectDevice = (peripheral) => {
      if(connected && peripheral.id===connectedID){
        BleManager.disconnect(peripheral.id)
        .then(() => {
          peripheral.connected = false;
          setConnected(false);
          Alert.alert(
            'disconnected',
            'Bluetooth device disconnected.',
            [
              { text: 'OK'}
            ],
            { cancelable: false }
          );
        })
        .catch((error) => {
          console.log('fail disconnect:', error);
        });
      }
    }
    const dataRead = () => {
      BleManager.read(connectedID, serviceUUID, characteristicUUID)
        .then((readData)=> {
          const arr = byteArrayToIntArray(readData);
          if(arr[0]-arr[1]>=10){
            setDisplayData("Unbalance!");
          }
          else{
            setDisplayData("balance!");
          }
          //setDisplayData("Read data : "+byteArrayToIntArray(readData));
          console.log('Read data:', readData);
        })
        .catch((error) => {
          console.log('Read error:', error);
        });
    }
    const dataWrite = async () => {
      try {
        // 데이터 쓰기 작업
        await BleManager.write(connectedID, serviceUUID, characteristicUUID, intToByteArray(input));
        console.log('success');
      } catch (error) {
        console.log('fail:', error);
      }
    };
    const retrieveServices = async (peripheral) => {
      try{
        const services = await BleManager.retrieveServices(peripheral.id);
        console.log(services);
        const servicesArray = [services];
        console.log(servicesArray);
        servicesArray.forEach((service) => {
          service.services.forEach((services) => {
            console.log('Service UUID:', services.uuid);
          });
          //console.log('Service UUID:', service.uuid);
          service.characteristics.forEach((characteristics) => {
            console.log('Characteristic UUID:', characteristics.characteristic);
            console.log('Characteristic properties:', characteristics.properties);
          });
        })
      } catch (error) {
        console.log('Error retrieving services:', error);
      }
    }
    const RenderItem = ({peripheral}) => {
      const color = peripheral.connected ? 'green' : '#fff';
      return (
        <View>
          <Text
            style={{
              fontSize: 20,
              marginLeft: 10,
              marginBottom: 5,
            }}>
            Nearby Devices:
          </Text>
          <TouchableOpacity onPress={() => !connected ? connectDevices(peripheral):disconnectDevice(peripheral)}>
            <View
              style={{
                backgroundColor: color,
                borderRadius: 5,
                paddingVertical: 5,
                marginHorizontal: 10,
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  textTransform: 'capitalize',
                  color: peripheral.connected ? 'white' : 'black',
                }}>
                {peripheral.name ? peripheral.name: "None"}
              </Text>
              <View
                style={{
                  backgroundColor: color,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: peripheral.connected ? 'white' : 'black',
                  }}>
                  RSSI: {peripheral.rssi}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: peripheral.connected ? 'white' : 'black',
                  }}>
                  ID: {peripheral.id}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    };
    useEffect(()=>{
      requestBluetoothPermission();
      startBLE();
    },[]);
    useEffect(() => {
      let discoverPeripheralListener = BleManagerEmitter.addListener(
        "BleManagerDiscoverPeripheral",
        (peripheral) => {
          setScannedDevices((prevDevices) => {
            const updatedDevices = prevDevices.filter(
              (device) => device.id !== peripheral.id
            );
            updatedDevices.push(peripheral);
            return updatedDevices;
          }); 
        }
      );
      return () => {
        discoverPeripheralListener.remove();
      };
    },[]);

    useEffect(() => {
      let stopListener = BleManagerEmitter.addListener(
     'BleManagerStopScan',
      () => {
      setIsScanning(false);
      console.log('Scan is stopped');
     },
      );
      return () => {
        stopListener.remove();
      };
    }, []);
    return (
        <View style={{flex:1}}>
        <View>
          <TextInput style = {styles.textInput} placeholder = {"write data"}
            onSubmitEditing = {dataWrite}
            onChangeText={onChangeText}
            value = {input}
          />
        </View>
        <ScrollView style = {{flex:1}}>
          <View style = {{flex:1}}>
          {scannedDevices.map((device) => (
            <RenderItem key = {device.id} peripheral = {device} />
          ))}
          </View>
        </ScrollView>
        <View style = {{marginTop:30}}>
            <Text style={styles.text2}>{displayData}</Text>
        </View>
        <View style={{flexDirection:"row",}}>
            <TouchableOpacity style={styles.btn} onPress={startScan}>
                <Text style={styles.text}>Scan</Text>
            </TouchableOpacity>
        </View>
        <View style={{flexDirection:"row",}}>
            <TouchableOpacity style={styles.btn} onPress={dataRead}>
                <Text style={styles.text}>Read Data</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    btn:{
        //flexDirection:"row",
        flex:1,
        marginTop:50,
        //marginLeft:40,
        //paddingVertical:30,
        //width:10,
        borderRadius:50
    },
    text:{
        textAlign:"center",
        backgroundColor:"blue",
        color:"white",
        fontSize:20,
        borderRadius:30,
        fontWeight:"500"
    },
    textInput:{
      backgroundColor:"white",
      color : "black",
    },
    text2:{
      textAlign:"center",
      fontSize:30,
    },
});

export default BLE;