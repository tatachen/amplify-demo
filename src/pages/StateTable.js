import React, { useEffect, useState } from 'react';
import { Checkbox, HeaderContent, HeaderSubheader, Input, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react';
import SerialHandler from './SerialHandler';

const SYSTEM_CLK = (32.768 * 122)
const FN_MASH_BLF = 529

const StateTable = ({trigger}) => {
    const [state, setState] = useState(new Array(16).fill(0))
    const [freqs, setFreqs] = useState(new Array(16).fill(0))
    const [divs, setDivs] = useState(new Array(16).fill(0))

    let serialHandler = new SerialHandler();

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const send = async() => {
        let results = "";
        let init = true;
        state.map((s, index) => {
            if (s == 1) {
                if (init) {
                    console.log(index)
                    results += index + "," + divs[index]
                    init = false
                } else {
                    results += "|" + index + "," + divs[index]
                }
            }
        })
        console.log(results)
        await serialHandler.write(results)
        // await sleep(2000);
        await serialHandler.read()
    }

    useEffect(() => {
        if (trigger !== 0) {
            send();
        }
    }, [trigger])

    const handleChange = (e, data) => {
        console.log(e.target)
        const index = data.index
        setState(ste => {
            let state2 = [...state]
            state2[index] = state2[index] == 1 ? 0 : 1
            return state2
        })
    }


    const handleDivChange = (e, index) => {
        if (e.key === "Enter") {
            e.preventDefault()
            console.log(e.target.value)
            const div = e.target.value
            const index = e.target.name
            const freq = (SYSTEM_CLK * FN_MASH_BLF / 64)/(div - 0.5)
            setFreqs(fre => {
                let freqs2 = [...freqs]
                freqs2[index] = freq
                return freqs2
            })
            setDivs(d => {
                let divs2 = [...divs]
                divs2[index] = div
                return divs2
            })
        }
    }

    const getTableRow = (i) => {
        return (
            <TableRow key={i}>
                <TableCell><Checkbox onChange={(e, data) => handleChange(e, data)} index={i}></Checkbox></TableCell>
                <TableCell>State {i}</TableCell>
                <TableCell><Input name={i} onKeyPress={(e, index) => handleDivChange(e, index)} index={i}></Input></TableCell>
                <TableCell>{freqs[i]}</TableCell>
            </TableRow>
        )
    }

    const getTableContent = () => {
        const rows = []
        for(var i = 0 ; i < 16 ; i++) {
            rows.push(getTableRow(i))
        }
        return rows;
    }

    return (
    <Table celled selectable>
        <TableHeader>
            <TableRow>
                <TableHeaderCell></TableHeaderCell>
                <TableHeaderCell>State</TableHeaderCell>
                <TableHeaderCell>Div</TableHeaderCell>
                <TableHeaderCell>
                    <HeaderContent>Freq</HeaderContent>
                    <HeaderSubheader style={{color: 'gray', fontSize: 12}}>(System_CLK*FN_MASH_BLF/64)/(Div-0.5))</HeaderSubheader>
                </TableHeaderCell>
            </TableRow>
        </TableHeader>
        <TableBody>
            {getTableContent()}
        </TableBody>
    </Table>
    )
}

export default StateTable;