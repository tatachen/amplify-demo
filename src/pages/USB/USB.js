import React from 'react';
import { Form } from 'semantic-ui-react';

let interfaceNumber_;
let endpointOut_;
let endpointIn_;
const USB = () => {
  

    const connect = async () => {
      const filters = [
        { 'vendorId': 0x2341, 'productId': 0x8036 }, // Arduino Leonardo
        { 'vendorId': 0x2341, 'productId': 0x8037 }, // Arduino Micro
        { 'vendorId': 0x2341, 'productId': 0x804d }, // Arduino/Genuino Zero
        { 'vendorId': 0x2341, 'productId': 0x804e }, // Arduino/Genuino MKR1000
        { 'vendorId': 0x2341, 'productId': 0x804f }, // Arduino MKRZERO
        { 'vendorId': 0x2341, 'productId': 0x8050 }, // Arduino MKR FOX 1200
        { 'vendorId': 0x2341, 'productId': 0x8052 }, // Arduino MKR GSM 1400
        { 'vendorId': 0x2341, 'productId': 0x8053 }, // Arduino MKR WAN 1300
        { 'vendorId': 0x2341, 'productId': 0x8054 }, // Arduino MKR WiFi 1010
        { 'vendorId': 0x2341, 'productId': 0x8055 }, // Arduino MKR NB 1500
        { 'vendorId': 0x2341, 'productId': 0x8056 }, // Arduino MKR Vidor 4000
        { 'vendorId': 0x2341, 'productId': 0x8057 }, // Arduino NANO 33 IoT
        { 'vendorId': 0x239A }, // Adafruit Boards!
      ];
      let port = await navigator.usb.requestDevice({ 'filters': filters })
      console.log(port)

      let readLoop = () => {
        port.transferIn(endpointIn_, 64).then(result => {
          port.onReceive(result.data);
          readLoop();
        }, error => {
          port.onReceiveError(error);
        });
      };

      await port.open();
      if (port.configuration === null) await port.selectConfiguration(1);
      await port.claimInterface(1);
      // port.open()
      //   .then(() => {
      //     return port.selectConfiguration(1);
      //   })
      //   .then(() => {
      //     var configurationInterfaces = port.configuration.interfaces;
      //     configurationInterfaces.forEach(element => {
      //       console.log(element)
      //       element.alternates.forEach(elementalt => {
      //         if (elementalt.interfaceClass==0xff) {
      //           interfaceNumber_ = element.interfaceNumber;
      //           elementalt.endpoints.forEach(elementendpoint => {
      //             if (elementendpoint.direction == "out") {
      //               endpointOut_ = elementendpoint.endpointNumber;
      //             }
      //             if (elementendpoint.direction=="in") {
      //               endpointIn_ =elementendpoint.endpointNumber;
      //             }
      //           })
      //         }
      //       })
      //     })
      //   })
      //   .then(() => port.controlTransferOut({
      //     'requestType': 'class',
      //     'recipient': 'interface',
      //     'request': 0x22,
      //     'value': 0x01,
      //     'index': 2}))
      //   .then(() => {
      //     readLoop();
      //   });
    }
    return (
        <Form>
        <Form.Button color='teal' onClick={connect}>Connect</Form.Button>
                
        </Form>
    )
}

export default USB;