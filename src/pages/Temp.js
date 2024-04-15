import React, { useState } from 'react';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
// import { ReadlineParser, SerialPort } from 'serialport';

// const port = new SerialPort("COM3", {baudRate: 115200})
// const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
// port.on("open", () => {
//   console.log('serial port open');
// });

const Arduino = () => {

  const [data, setData] = useState('');

//   parser.on('data', serialData => {
//     setData(serialData)
//   });
  console.log(navigator)

  if ("serial" in navigator) {
      console.log("Serial Port is supported")
  }

  const handleConnect = async() => {
    const port = await navigator.serial.requestPort();
    await port.open({baudRate: 115200})
    let decoder = new TextDecoderStream()
    port.readable.pipeTo(decoder.writable)
    const reader = decoder.readable.getReader()
    console.log(reader)
    let writer = port.writable.getWriter();
    const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
    await writer.write(data);


    // Allow the serial port to be closed later.
    writer.releaseLock();

    try {
      let buffer = '';
      const timerId = setInterval(async() => {
        const {value, done} = await reader.read()
        console.log(value)
        buffer += value;
        
      }, 1500)
      setData(buffer)
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <Grid>
      <Button
        type='submit'
        color='teal'
        fluid
        size='large'
        style={{ marginBottom: '32px' }}
        onClick={handleConnect}
      >
      Connect
      </Button>
      <Message>{data}</Message>
    </Grid>
  );
}

export default Arduino;