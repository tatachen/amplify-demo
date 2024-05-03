import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Dropdown, Form, FormField, FormSelect, Icon, Message, Segment } from 'semantic-ui-react';
import SerialHandler from './SerialHandler';
import SerialPortHandler from './SerialPortHandler';
import StateTable from './StateTable';

const SYSTEM_CLK = (32.768 * 122);
const FN_MASH_BLF = 529;

const types = [
    {
        key: "web",
        text: "web",
        value: "web"
    },
    {
        key: "25",
        text: "MPP 2.5",
        value: "25"
    },
    {
        key: "26",
        text: "MPP 2.6",
        value: "26"
    },
    {
        key: "usi",
        text: "USI",
        value: "usi"
    }
]

const Arduino = () => {
    const [error, setError] = useState("");
    const [isConnected, setConnected] = useState(false);
    const [type, setType] = useState("");

    const [states, setStates] = useState(new Array(16).fill(0))
    const [freqs, setFreqs] = useState(new Array(16).fill(0))
    const [divs, setDivs] = useState(new Array(16).fill(0));
    const [cycs, setCycs] = useState(new Array(16).fill(0))
    const [durations, setDurations] = useState(new Array(16).fill(0))


    let serialHandler = new SerialPortHandler();

    const connect = async e => {
        e.preventDefault();
        setConnected(true)
        await serialHandler.init();
        
    }

    const disconnect = async e => {
        e.preventDefault();
        setConnected(false)
        await serialHandler.close();
    }

    const sendCommand = async (command) => {
        console.log(command);
        await serialHandler.write(command)
        // const message = await serialHandler.read();
        // console.log(message);
    }

    const download = () => {
        return <Link to="/files/Arduino_MPP_USI_Web_Final.rar" target="_blank" download></Link>;
    }

    const handleChange = (e, value) => {
        setType(value)
    }

    const handleDivChange = (e) => {
        e.preventDefault();
        const div = e.target.value;
        const index = e.target.name
        console.log(index)
        const freq = (SYSTEM_CLK * FN_MASH_BLF / 64)/(div - 0.5)
        setFreqs(f => {
            let tmps = [...freqs]
            tmps[index] = freq
            return tmps
        })
        setDivs(d => {
            let tmps = [...divs]
            tmps[index] = div
            return tmps
        })
        // if (e.key === "Enter") {
        //     e.preventDefault();
        //     const div = e.target.value;
        //     const index = e.target.name
        //     const freq = (SYSTEM_CLK * FN_MASH_BLF / 64)/(div - 0.5)
        //     setFreqs(f => {
        //         let tmps = [...freqs]
        //         tmps[index] = freq
        //         return tmps
        //     })
        //     setDivs(d => {
        //         let tmps = [...divs]
        //         tmps[index] = div
        //         return tmps
        //     })
        // }
    }

    const handleCycChange = (e) => {
        e.preventDefault();
        const cyc = e.target.value;
        const index = e.target.name
        const duration = (cyc * 1000 / freqs[index])
        setDurations(d => {
            let tmps = [...durations]
            tmps[index] = duration
            return tmps
        })
        setCycs(c => {
            let tmps = [...cycs]
            tmps[index] = cyc
            return tmps
        })
        // if (e.key === "Enter") {
        //     e.preventDefault();
        //     const cyc = e.target.value;
        //     const index = e.target.name
        //     setCycs(c => {
        //         let tmps = [...cycs]
        //         tmps[index] = cyc
        //         return tmps
        //     })
        // }
    }

    const handleCheckboxChange = (e, data) => {
        e.preventDefault();
        const index = data.index
        setStates(s => {
            let tmps = [...states]
            tmps[index] = tmps[index] == 1 ? 0 : 1
            return tmps
        })
    }

    const send = () => {
        let results = type + ":";
        let init = true;
        // states.map((s, index) => {
        //     if (s == 1) {
        //         if (init) {
        //             results += index + "," + divs[index] + "," + cycs[index]
        //             init = false
        //         } else {
        //             results += "|" + index + "," + divs[index] + "," + cycs[index]
        //         }
        //     }
        // })
        states.map((s, index) => {
            if (checkData(s, index)) {
                if (init) {
                    results += s + "," + index + "," + divs[index] + "," + cycs[index]
                    init = false
                } else {
                    results += "|" + s + "," + index + "," + divs[index] + "," + cycs[index]
                }
            }
        })
        console.log(results)
        sendCommand(results);
    }

    const checkData = (s, index) => {
        if (s == 1) {
            if (divs[index] == 0 || cycs[index] == 0) {
                return false
            }
            return true;
        } else {
            if (divs[index] == 0 && cycs[index] == 0) {
                return false;
            } 
            return true;
        }
    }
    
    return (
        <Segment>
            {
                error &&
                <Message negative>
                    <Message.Content>{error.message}</Message.Content>
                </Message>
            }
            <Form>
                <Form.Group>
                    <Form.Button color='teal' onClick={connect} disabled={isConnected}>Connect</Form.Button>
                    <Form.Button color='teal' onClick={disconnect} disabled={!isConnected}>Disconnect</Form.Button>
                    <Button color='teal' animated="vertical" as={Link} to='/files/Arduino_Web.rar' target="_blank" download>
                        <Button.Content visible>Sketch</Button.Content>
                        <Button.Content hidden>
                            <Icon name="download" />
                        </Button.Content>
                    </Button>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Input fluid label="SYSTEM_CLK" value={SYSTEM_CLK} readOnly />
                    <Form.Input fluid label="FN_MASH_BLF" value={FN_MASH_BLF} readOnly />
                </Form.Group>
                <FormSelect fluid label="Protocol" options={types} onChange={(e, {value}) => handleChange(e, value)}></FormSelect>
                {/* <Dropdown fluid selection options={types} /> */}
                {
                    type === 'web' && 
                    <StateTable 
                        states={states}
                        freqs={freqs}
                        divs={divs}
                        durations={durations}
                        sendCommand = {sendCommand} 
                        handleDivChange={handleDivChange}
                        handleCheckboxChange={handleCheckboxChange}
                        handleCycChange={handleCycChange}
                    />
                }
                <Form.Button onClick={send}>Send</Form.Button>
            </Form>
        </Segment>
    )
}

export default Arduino;