/**
 * Created by januslo on 2018/12/27.
 */

import React, {Component} from 'react';
import {ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    ScrollView,
    DeviceEventEmitter,
    NativeEventEmitter,
    Switch,
    TouchableOpacity,
    Dimensions,
    ToastAndroid} from 'react-native';
import {BluetoothEscposPrinter, BluetoothManager, BluetoothTscPrinter} from "react-native-bluetooth-escpos-printer";
var {height, width} = Dimensions.get('window');
export default class BluetoothConnectivity2
 extends Component {


    _listeners = [];

    constructor() {
        super();
        this.state = {
            devices: null,
            pairedDs:[],
            foundDs: [],
            bleOpend: false,
            loading: true,
            boundAddress: '',
            debugMsg: ''
        }
    }

    componentDidMount() {//alert(BluetoothManager)
        BluetoothManager.isBluetoothEnabled().then((enabled)=> {
            this.setState({
                bleOpend: Boolean(enabled),
                loading: false
            })
        }, (err)=> {
            err
        });

        if (Platform.OS === 'ios') {
            let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
            this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
                (rsp)=> {
                    this._deviceAlreadPaired(rsp)
                }));
            this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, (rsp)=> {
                this._deviceFoundEvent(rsp)
            }));
            this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, ()=> {
                this.setState({
                    name: '',
                    boundAddress: ''
                });
            }));
        } else if (Platform.OS === 'android') {
            this._listeners.push(DeviceEventEmitter.addListener(
                BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, (rsp)=> {
                    this._deviceAlreadPaired(rsp)
                }));
            this._listeners.push(DeviceEventEmitter.addListener(
                BluetoothManager.EVENT_DEVICE_FOUND, (rsp)=> {
                    this._deviceFoundEvent(rsp)
                }));
            this._listeners.push(DeviceEventEmitter.addListener(
                BluetoothManager.EVENT_CONNECTION_LOST, ()=> {
                    this.setState({
                        name: '',
                        boundAddress: ''
                    });
                }
            ));
            this._listeners.push(DeviceEventEmitter.addListener(
                BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, ()=> {
                    ToastAndroid.show("Device Not Support Bluetooth !", ToastAndroid.LONG);
                }
            ))
        }
    }

    componentWillUnmount() {
        //for (let ls in this._listeners) {
        //    this._listeners[ls].remove();
        //}
    }
    sampleBill = {
        store: { name: "Sample Store", address: "1234 Sample Street" },
        cashier: { username: "John Doe" },
        items: [
            { product: { name: "Product 1", price: 10.00 }, quantity: 2 },
            { product: { name: "Product 2", price: 15.00 }, quantity: 1 }
        ],
        totalAmount: 35.00,
        status: "PAID"
    };
    _deviceAlreadPaired(rsp) {
        var ds = null;
        if (typeof(rsp.devices) == 'object') {
            ds = rsp.devices;
        } else {
            try {
                ds = JSON.parse(rsp.devices);
            } catch (e) {
            }
        }
        if(ds && ds.length) {
            let pared = this.state.pairedDs;
            pared = pared.concat(ds||[]);
            this.setState({
                pairedDs:pared
            });
        }
    }

    _deviceFoundEvent(rsp) {//alert(JSON.stringify(rsp))
        var r = null;
        try {
            if (typeof(rsp.device) == "object") {
                r = rsp.device;
            } else {
                r = JSON.parse(rsp.device);
            }
        } catch (e) {//alert(e.message);
            //ignore
        }
        //alert('f')
        if (r) {
            let found = this.state.foundDs || [];
            if(found.findIndex) {
                let duplicated = found.findIndex(function (x) {
                    return x.address == r.address
                });
                //CHECK DEPLICATED HERE...
                if (duplicated == -1) {
                    found.push(r);
                    this.setState({
                        foundDs: found
                    });
                }
            }
        }
    }

    _renderRow(rows){
        let items = [];
        for(let i in rows){
            let row = rows[i];
            if(row.address) {
                items.push(
                    <TouchableOpacity key={new Date().getTime()+i} style={styles.wtf} onPress={()=>{
                    this.setState({
                        loading:true
                    });
                    BluetoothManager.connect(row.address)
                        .then((s)=>{
                            this.setState({
                                loading:false,
                                boundAddress:row.address,
                                name:row.name || "UNKNOWN"
                            });
                            // Log the details of the connected device
                            console.log(`Connected to device: ${row.name || "UNKNOWN"} - Address: ${row.address}`);
                        },(e)=>{
                            this.setState({
                                loading:false
                            });
                            alert(e);
                        })
    
                }}><Text style={styles.name}>{row.name || "UNKNOWN"}</Text><Text
                        style={styles.address}>{row.address}</Text></TouchableOpacity>
                );
            }
        }
        return items;
    }
    
    printReceipt = async () => {
        // Sample Bill Data
        const sampleBill = {
          cashier: "John Doe",
          items: [
            { product: { name: "Product 1", price: 10.00 }, quantity: 2 },
            { product: { name: "Product 2", price: 15.00 }, quantity: 1 }
          ],
          totalAmount: 35.00,
          status: "PAID"
        };
    
        let receipt = "";
        receipt += "Cashier: " + sampleBill.cashier + "\n";
        receipt += "--------------------------------\n";
        sampleBill.items.forEach((item) => {
          receipt += item.product.name + " x " + item.quantity + " = $" + (item.product.price * item.quantity).toFixed(2) + "\n";
        });
        receipt += "--------------------------------\n";
        receipt += "Total: $" + sampleBill.totalAmount.toFixed(2) + "\n";
        receipt += "Status: " + sampleBill.status + "\n";
        receipt += "Thank you for your purchase!\n";
    
        try {
            await BluetoothEscposPrinter.printBarCode(receipt, BluetoothEscposPrinter.BARCODETYPE.JAN13, 3, 120, 0, 2);
            await  BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {});
        } catch (e) {
          console.error(e);
        }
      };
      connectToPrinter = () => {
        const printerAddress = "00:19:5D:23:CB:26";
        BluetoothManager.connect(printerAddress)
            .then((connectResult) => {
                // Connection successful, update state or UI as needed
                console.log(`Connected to device: Bluetooth Printer - Address: ${printerAddress}`);
                // Update state here to reflect connection status if needed
                this.setState({
                    boundAddress: printerAddress,
                    name: "Bluetooth Printer",
                });
            })
            .catch((error) => {
                console.error(`Connection failed: ${error}`);
                // Handle connection error (e.g., update state or UI)
            });
    }
    
      _formatBill(bill) {
        let receipt = "";
        receipt += "Store: " + bill.store.name + "\n";
        receipt += "Address: " + bill.store.address + "\n";
        receipt += "Cashier: " + bill.cashier.username + "\n";
        receipt += "-----------------------------\n";
        bill.items.forEach((item) => {
            receipt += item.product.name + " x " + item.quantity + " = $" + (item.product.price * item.quantity).toFixed(2) + "\n";
        });
        receipt += "-----------------------------\n";
        receipt += "Total: $" + bill.totalAmount.toFixed(2) + "\n";
        receipt += "Status: " + bill.status + "\n";
        receipt += "Thank you for your purchase!\n";
        return receipt;
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                <Text>{this.state.debugMsg}</Text>
                <Text style={styles.title}>Blutooth Opended:{this.state.bleOpend?"true":"false"} <Text>Open BLE Before Scanning</Text> </Text>
                <View>
                <Switch value={this.state.bleOpend} onValueChange={(v)=>{
                this.setState({
                    loading:true
                })
                if(!v){
                    BluetoothManager.disableBluetooth().then(()=>{
                        this.setState({
                            bleOpend:false,
                            loading:false,
                            foundDs:[],
                            pairedDs:[]
                        });
                    },(err)=>{alert(err)});

                }else{
                    BluetoothManager.enableBluetooth().then((r)=>{
                        var paired = [];
                        if(r && r.length>0){
                            for(var i=0;i<r.length;i++){
                                try{
                                    paired.push(JSON.parse(r[i]));
                                }catch(e){
                                    //ignore
                                }
                            }
                        }
                        this.setState({
                            bleOpend:true,
                            loading:false,
                            pairedDs:paired
                        })
                    },(err)=>{
                        this.setState({
                            loading:false
                        })
                        alert(err)
                    });
                }
            }}/>
                    <Button disabled={this.state.loading || !this.state.bleOpend} onPress={()=>{
                        this._scan();
                    }} title="Scan"/>
                </View>
                <Text  style={styles.title}>Connected:<Text style={{color:"blue"}}>{!this.state.name ? 'No Devices' : this.state.name}</Text></Text>
                <Text  style={styles.title}>Found(tap to connect):</Text>
                {this.state.loading ? (<ActivityIndicator animating={true}/>) : null}
                <View style={{flex:1,flexDirection:"column"}}>
                {
                    this._renderRow(this.state.foundDs)
                }
                </View>
                <Text  style={styles.title}>Paired:</Text>
                {this.state.loading ? (<ActivityIndicator animating={true}/>) : null}
                <View style={{flex:1,flexDirection:"column"}}>
                {
                    this._renderRow(this.state.pairedDs)
                }
                </View>

                <View style={{flexDirection:"row",justifyContent:"space-around",paddingVertical:30}}>
                <Button disabled={this.state.loading || !(this.state.bleOpend && this.state.boundAddress.length > 0 )}
                        title="ESC/POS" onPress={()=>{
                    this.props.navigator.push({
                        component:EscPos,
                        passProps:{
                            name:this.state.name,
                            boundAddress:this.state.boundAddress
                        }
                    })
                }}/>
                <Button disabled={this.state.loading|| !(this.state.bleOpend && this.state.boundAddress.length > 0) }
                        title="TSC" onPress={()=>{
                   this.props.navigator.push({
                       component:Tsc,
                       passProps:{
                           name:this.state.name,
                           boundAddress:this.state.boundAddress
                       }
                   })
                }
                }/>
                </View>
                <View style={styles.btn}>
                <Button onPress={async () => {
                    await BluetoothEscposPrinter.printBarCode("Ejaaz", BluetoothEscposPrinter.BARCODETYPE.JAN13, 3, 120, 0, 2);
                    await  BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {});
                }} title="Print BarCode"/>
                <Button title="Print Receipt" onPress={this.printReceipt} disabled={this.state.loading || !(this.state.bleOpend && this.state.boundAddress.length > 0)} />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Connect to Bluetooth Printer"
                    onPress={this.connectToPrinter}
                    disabled={this.state.loading || !this.state.bleOpend}
                />
            </View>
            </ScrollView>
        );
    }



    _scan() {
        this.setState({
            loading: true
        })
        BluetoothManager.scanDevices()
            .then((s)=> {
                var ss = s;
                var found = ss.found;
                try {
                    found = JSON.parse(found);//@FIX_it: the parse action too weired..
                } catch (e) {
                    //ignore
                }
                var fds =  this.state.foundDs;
                if(found && found.length){
                    fds = found;
                }
                this.setState({
                    foundDs:fds,
                    loading: false
                });
            }, (er)=> {
                this.setState({
                    loading: false
                })
                alert('error' + JSON.stringify(er));
            });
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
    },

    title:{
        width:width,
        backgroundColor:"#eee",
        color:"#232323",
        paddingLeft:8,
        paddingVertical:4,
        textAlign:"left"
    },
    wtf:{
        flex:1,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    name:{
        flex:1,
        textAlign:"left"
    },
    address:{
        flex:1,
        textAlign:"right"
    }
});