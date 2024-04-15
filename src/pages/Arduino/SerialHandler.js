const BAUDRATE = 115200;
const DATABITS = 8;

const options = {
    baudRate: BAUDRATE,
    dataBits: DATABITS,
    flowControl: 'none'
}

let port;
let reader;
let writer;
let keepReading = false;
let encoder = new TextEncoder();
let decoder = new TextDecoder();
var EOT = "\u0004";
class SerialHandler {
    async init() {
        if ('serial' in navigator) {
            try {
                port = await navigator.serial.requestPort();
                await port.open({
                    baudRate: BAUDRATE,
                    dataBits: DATABITS
                })

                if (port) {
                    console.log(port.getInfo());
                    await port.setSignals({break: false})
                    await this.getWeight();
                }
            } catch(err) {
                throw new Error(err)
            }
        } else {
            console.error('Web serial doesn\'t seem to be enabled in your browser. Check https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility for more info.')
        } 
    }

    async getWeight() {
        keepReading = true;
        if (port) {
            reader = port.readable.getReader();
            writer = port.writable.getWriter();

            while (port.readable && keepReading) {
                try {
                    while(true) {
                        let message = '';
                        const {value, done} = await reader.read();
                        if (done) {
                            break;
                        }
                        console.log(value)
                        console.log(done)
                        var weight = this.Unit8ArrayToString(value);
                        // console.log("weight",weight)
                        // if (weight.length > 0) {
                        //     message += weight
                        // }
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
        }
    }

    async open() {
        try {
            port = await navigator.serial.requestPort();
            await port.open(options);
            return port.getInfo();
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }

    async read() {
        if (port.readable) {
            reader = port.readable.getReader();
            let chunks = '';

            try {
                while (true) {
                    const {value, done} = await reader.read()
                    const decoded = decoder.decode(value);
                    // console.log(decoded)
                    // console.log(decoded.includes('\n'))
                    chunks += decoded;
                    if (done) {
                        console.log('Reading done.');
                        // reader.releaseLock();
                        break;
                    }
                    if (decoded.includes('\n')) {
                        console.log(chunks);
                        chunks = '';
                    }
                    // return chunks;
                }
            } catch (error) {
                console.error(error);
                throw new Error(error);
            } finally {
                reader.releaseLock();
            }
        }
    }

    async write(data) {
        writer = port.writable.getWriter()
        const encoded = encoder.encode(data);
        await writer.write(encoded)
        // writer.releaseLock();
    }

    writerStream(command) {
        writer.write(this.StringToUnit8Array(command + '\n'))
    }

    StringToUnit8Array(str) {
        const bug = new ArrayBuffer(8)
        var arr = [] 
        for (var i = 0 ; i < str.length ; i++) {
            arr.push(str.charCodeAt(i))
        }
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
        console.log("------------------")
        console.log(string)
        return string
    }

    async close() {
        if (port) {
            if (reader) {
                await reader.cancel();
                reader = null;
            }
            if (writer) {
                writer.close();
                writer = null;
            }
            await port.close();
            port = null;
        }
    }
}

export default SerialHandler;