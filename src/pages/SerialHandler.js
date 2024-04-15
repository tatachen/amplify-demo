import React from 'react';
// import {TextEncoder, TextDecoder} from "text-encoding"
// const {TextEncoder, TextDecoder} = require("util")
let writer;
let reader;
let encoder;
let decoder;

class SerialHandler {

    constructor() {
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
    }

    async init() {
        if ('serial' in navigator) {
            try {
                const port = await navigator.serial.requestPort();
                await port.open({baudRate: 115200})
                console.log(port)
                writer = port.writable.getWriter();
                reader = port.readable.getReader();
                const signals = await port.getSignals();
                console.log(signals);
            } catch (err) {
                console.error('There was an error opening the serial port:', err);
            }
        } else {
            console.error('Web serial doesn\'t seem to be enabled in your browser. Check https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility for more info.')
        } 
    } 

    stringToUnit8Array = (str) => {
        console.log(parseInt(str, 2).toString(16).toUpperCase())
        const buf = new ArrayBuffer(8)
        var arr = [] 
        for (var i = 0 ; i < str.length ; i++) {
            console.log(str.charCodeAt(i))
            arr.push(str.charCodeAt(i))
        }
        console.log(arr)
        var tmpUint8Array = new Uint8Array(arr);
        return tmpUint8Array
    }

    async write(data) {
        const dataArrayBuffer = this.stringToUnit8Array(data);
        // console.log(dataArrayBuffer)
        return await writer.write(dataArrayBuffer)
    }

    async read() {
        try {
            // console.log(await reader.read())
            while (true) {
                console.log(await reader.read())
                const {value, done} = await reader.read();
                if (done) {
                    reader.releaseLock();
                    break;
                }
                console.log(this.decoder.decode(value))
                // return this.decoder.decode(readerData.value)
            }
        } catch(err) {
            const errorMessage = 'error reading data: ${err}'
            console.error(errorMessage)
            return errorMessage;
        }
    }

    async close() {
        this.reader.cancel();
        this.reader = null;
        this.writer.close();
        this.writer = null;
        await this.port.close();
        this.port = null;
    }
}

export default SerialHandler;