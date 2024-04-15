import React, { useRef, useState } from 'react';
import { Form } from 'semantic-ui-react';
import SerialHandler from './SerialHandler';
import SerialPort from './SerialPort';
import StateTable from './StateTable';
 // System_CLK*FN_MASH_BLF/64)/25.00684) +0.5
const System_CLK = (32.768 * 122)
const FN_MASH_BLF = 529


const Arduino_old = () => {
  const [isOpen, setOpen] = useState(false)
  const [port, setPort] = useState(null)
  const [stateValue, setStateValue] = useState("00000000 00100000")
  const [trigger, setTrigger] = useState(0);

  let serialHandler = new SerialHandler();
  let serialPort = new SerialPort();

  const notSupportSerialApi = () => {
    return !navigator?.serial;
  }

  const errorMsg = () => {
    if (this.notSupportSerialApi) {
      return '瀏覽器不支援 Web Serial API'
    }
    
    if (!this.port) {
      return '請選擇 COM Port'
    }
    return null
  }

  const checkSerialAvailable = () => {
    if (notSupportSerialApi()) {
      return '瀏覽器不支援 Web Serial API'
    }
    return true
  }

  const connect = async (e) => {
    console.log(e)
    e.preventDefault();
    await serialHandler.init();
  }

  const disconnect = async (e) => {
    await serialHandler.close();
  }

  const handleChange = e => {
    setStateValue(e.target.value)
  }

  const send = async () => {
    await serialHandler.write(stateValue)

    await serialHandler.read()
    // await serialHandler.read()
    // await serialHandler.read()
    // await serialHandler.read()
  }

  const getState = () => {
    console.log(stateValue)
    console.log(parseInt(stateValue, 2).toString(16).toUpperCase())
        
  }

  const handleClick = () => {
    setTrigger(trigger => trigger + 1)
  }

  // const connect = async () => {
  //   console.log("------------------------- Connect To Arduino ---------------------------")
  //   if (checkSerialAvailable()) {
  //     const [err, serialPort] = await navigator.serial.requestPort();
  //     console.log(err)
  //     console.log(serialPort)
  //     console.log(`${err}`.includes('No port selected by the user'))
  //     if (err) {
  //       // 使用者取消選擇不彈出錯誤提示
  //       if (`${err}`.includes('No port selected by the user')) {
  //         return;
  //       }this.$q.notify({
  //         type: 'negative',
  //         message: `選擇 COM Port 發生錯誤 : ${err}`,
  //       });
  //       console.error(`[ requestPort ] err : `, err);
  //       return;
  //     }
  //   }
  // }

  return (
    <Form>
      <Form.Group>
        <Form.Button onClick={connect} disabled={isOpen}>Connect</Form.Button>
        <Form.Button onClick={disconnect} disabled={!isOpen}>Disconnect</Form.Button>
      </Form.Group>
      <StateTable trigger={trigger}/>
      <Form.Group>
        {/* <Form.Input value={stateValue} onChange={handleChange}/> */}
        <Form.Button onClick={handleClick}>Send</Form.Button>
        {/* <Form.Button onClick={getState}>getState</Form.Button> */}
      </Form.Group>
    </Form>
  )
}

export default Arduino_old;