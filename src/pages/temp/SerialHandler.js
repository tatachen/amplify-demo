import LineBreakTransformer from './LineBreakTransformer';

let inputDone;
let inputStream;
let reader;
let outputDone;
let outputStream;
let port;
let writer;
let keepReading = false;

class SerialHandler {
    
    sleep(ms){
        new Promise(r => setTimeout(r, ms))
    }

    async init() {
        if ('serial' in navigator) {
            try {
                port = await navigator.serial.requestPort();
                
                await port.open({
                    baudRate: 115200,
                    dataBits: 8,
                    // stopBits: 1,
                    // parity: 'none',
                    // flowControl: 'none'
                })

                if (port) {
                    await port.setSignals({break: false})
                    await this.getWeight();
                }
                // let decoder = new TextDecoderStream();
                // inputDone = port.readable.pipeTo(decoder.writable);
                // inputStream = decoder.readable;

                // reader = inputStream.getReader();
                // this.readLoop();

                // const encoder = new TextEncoderStream();
                // outputDone = encoder.readable.pipeTo(port.writable);
                // outputStream = encoder.writable;
            } catch(err) {
                throw new Error(err);
            }
        }
    }

    async getWeight() {
        keepReading = true;
        if (port) {
            reader = port.readable.getReader();
            writer = port.writable.getWriter();
            
            // const [appReadable, devReadable] = port.readable.tee()
            // console.log(appReadable)
            while (port.readable && keepReading) {
                try {
                    while(true) {
                        
                        let message = '';
                        const {value, done} = await reader.read();
                        
                        console.log("done", value)
                        if (done) {
                            break;
                        }
                        var weight = this.Unit8ArrayToString(value);
                        console.log("weight",weight)
                        if (weight.length > 0) {
                            message += weight
                        }
                        console.log('接收到的數據:', message)
                        // if (message.includes('\n')) {
                        //     message = message.split('\n')[0]

                        //     if (message.indexOf('up') > -1) {
                        //         message = message.substring(message.indexOf("up"), message.length - 1)
                        //     }
                        //     console.log('接收到的數據:', message)

                        // }
                    }
                } catch(err) {
                    const errorMessage = 'error reading data: ${err}'
                    console.error(err)
                    return errorMessage;
                } finally {
                    reader.releaseLock();
                }
            }

            // const textDecoder = new TextDecoderStream();
            // const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            // const reader = textDecoder.readable
            // .pipeThrough(new TransformStream(new LineBreakTransformer()))
            // .getReader();
            // try {
            //     while (true) {
            //         const {value, done} = await reader.read();
            //         if (done) {
            //             reader.releaseLock();
            //             break;
            //         }
            //         console.log(value);
            //         this.sleep(12000);
            //     }
            // } catch (error) {
            //     console.log(error);
            // }
        }
    }

    StringToUnit8Array(str) {
        const bug = new ArrayBuffer(8)
        var arr = [] 
        for (var i = 0 ; i < str.length ; i++) {
            console.log(str.charCodeAt(i))
            arr.push(str.charCodeAt(i))
        }
        console.log(arr)
        var tmpUint8Array = new Uint8Array(arr);
        return tmpUint8Array
    }

    Unit8ArrayToString(unit8Array) {
        let string = '';
        let i = 0;
        while(i < unit8Array.length) {
            let byte1 = unit8Array[i]
            let charCode = 0;
            if (byte1 < 0x80) {
                charCode = byte1
                i += 1;
            } else if (byte1 < 0xE0) {
                let byte2 = unit8Array[i+1]
                charCode = ((byte1 & 0x1F) << 6) | (byte2 & 0x3F)
                i += 2;
            } else {
                let byte2 = unit8Array[i+1]
                let byte3 = unit8Array[i+2]
                charCode = 
                ((byte1 & 0x0F) << 12) |
                ((byte2 & 0x3F) << 6) |
                (byte3 & 0x3F)
                i += 3
            }
            string += String.fromCharCode(charCode)
        }
        return string
    }

    writerStream(command) {
        // const writer = outputStream.getWriter();
        writer.write(this.StringToUnit8Array(command + '\n'));
        // writer.releaseLock();
    }

    async readLoop() {
        console.log("---------readLoop-------------");
        let log;
        while(true) {
            console.log(reader.read())
            const { value, done } = await reader.read();
            console.log(value);
            // if (value) {
            //     log += value + '\n';
            // }
            // if (done) {
            //     console.log('[readloop] DONE', done);
            //     reader.releaseLock();
            //     break;
            // }
        }
    }

    async disconnect() {
        if (port) {
            if (reader) {
                await reader.cancel();
                await inputDone.catch(() => {});
                reader = null;
                inputDone = null;
            }
            if (outputStream) {
                await outputStream.getWriter.close();
                await outputDone;
                outputStream = null;
                outputDone = null;
            }
            await port.close();
            port = null;
        }
    }
}

export default SerialHandler;