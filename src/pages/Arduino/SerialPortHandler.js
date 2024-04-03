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

class SerialPortHandler {
    async init() {
        if ('serial' in navigator) {
            await this.open();
            console.log(port);
            if (port) {
                await port.setSignals({break: false})
                await this.readLoop();
            }
        }  else {
            console.error('Web serial doesn\'t seem to be enabled in your browser. Check https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility for more info.')
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

    async readLoop() {
        console.log(port)
        keepReading = true;
        if (port.readable) {
            reader = port.readable.getReader();
            let chunks = '';
            console.log("read")
            while (keepReading) {
                console.log("keep")
                try {
                    while(true) {
                        const {value, done} = await reader.read();
                        const decoded = decoder.decode(value);
                        chunks += decoded;
                        if (done) {
                            reader.releaseLock();
                            keepReading = false;
                            break;
                        }
                        if (decoded.includes('\n')) {
                            console.log(chunks);
                            chunks = ''
                        }
                    }
                } catch (error) {
                    console.log(error);
                    throw new Error(error);
                }
            }
        }
    }

    async write(data) {
        console.log(port)
        if (port.writable) {
            if (!writer) {
                writer = port.writable.getWriter();
            }
            const encoded = encoder.encode(data);
            await writer.write(encoded);
        }
    }

    async close() {
        if (port) {
            if (reader) {
                await reader.cancel();
                reader = null;
            }
            if (writer) {
                // writer.releaseLock();
                await writer.close();
                writer = null;
            }
            await port.close();
            port = null;
        }
    }
}

export default SerialPortHandler;