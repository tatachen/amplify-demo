import React, { useState } from 'react';
import { Checkbox, Form, HeaderContent, Input, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react';
import HeaderSubHeader from 'semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader';
import {SYSTEM_CLK, FN_MASH_BLF} from './parameters';


const StateTable = ({sendCommand}) => {
    const [states, setStates] = useState(new Array(16).fill(0))
    const [freqs, setFreqs] = useState(new Array(16).fill(0))
    const [divs, setDivs] = useState(new Array(16).fill(0));
    const [cycs, setCycs] = useState(new Array(16).fill(0))
    const [durations, setDurations] = useState(new Array(16).fill(0))

    const send = () => {
        let results = "";
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

    const getTableRow = num => {
        return (
            <TableRow key={num}>
                <TableCell><Checkbox onChange={(e, data) => handleCheckboxChange(e, data)} index={num}></Checkbox></TableCell>
                <TableCell>State {num}</TableCell>
                <TableCell><Input name={num} onChange={handleDivChange} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}></Input></TableCell>
                <TableCell>{freqs[num]}</TableCell>
                <TableCell><Input name={num} onChange={handleCycChange} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}></Input></TableCell>
                <TableCell>{durations[num]}</TableCell>
            </TableRow>
        )
    }

    const getTableContent = () => {
        const rows = [];
        for (var i = 0 ; i < 16 ; i++) {
            rows.push(getTableRow(i));
        }
        return rows;
    }

    return (
        <>
            <Table celled selectable>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell></TableHeaderCell>
                        <TableHeaderCell>State</TableHeaderCell>
                        <TableHeaderCell>Div</TableHeaderCell>
                        <TableHeaderCell>
                            <HeaderContent>Freq.</HeaderContent>
                            <HeaderSubHeader style={{color: 'gray', fontSize: 12}}>(SYSTEM_CLK*FN_MASH_BLF/64)/(Div-0.5))</HeaderSubHeader>
                        </TableHeaderCell>
                        <TableHeaderCell>Cycle count</TableHeaderCell>
                        <TableHeaderCell>Duration(usec)</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {getTableContent()}
                </TableBody>
            </Table>
            <Form.Button onClick={send}>Send</Form.Button>
        </>
    )
}

export default StateTable;