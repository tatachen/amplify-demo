import React, { useState } from 'react'

let writer;
let reader;
let encoder;
let decoder;

class SerialPort {

    async init() {
        if ('serial' in navigator) {
            try {
                const port = await navigator.serial.requestPort();
                await port.open({baudRate: 115200})
                decoder = new TextDecoderStream();
                port.readable.pipeTo(decoder.writable)
                // console.log(port.readable.tee())
                reader = decoder.readable.getReader()
                // console.log(decoder.readable.tee())
                encoder = new TextEncoderStream();
                
                writer = port.writable.getWriter();
            

                navigator.serial.addEventListener('connect', () => {
                    console.log("Connect")
                })

                navigator.serial.addEventListener('disconnect', () => {
                    console.log("disconnect")
                })
            }catch (err) {
                console.error('There was an error opening the serial port:', err);
            }
        } else {
            console.error('Web serial doesn\'t seem to be enabled in your browser. Check https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility for more info.')
        } 
    }

    async write(data) {
        const content = new TextEncoder().encode("1,2|2,3")
        await writer.write(content)
        // writer.releaseLock();
    }

    async read() {
        try {
            while (true) {
                const {value, done} = await reader.read();
                if (done) {
                    reader.releaseLock();
                    break;
                }
                console.log(value);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default SerialPort;