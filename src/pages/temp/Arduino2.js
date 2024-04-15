import React, { useState } from 'react';
import { Form, Message, Segment } from 'semantic-ui-react';
import SerialHandler from '../Arduino/SerialHandler';
import StateTable from '../StateTable';

const SYSTEM_CLK = (32.768 * 122);
const FN_MASH_BLF = 529;

const Arduino2 = () => {
    const [isOpen, setOpen] = useState(false);
    const [error, setError] = useState(null);
    const [trigger, setTrigger] = useState(0);
    let serialHandler = new SerialHandler();

    const notSupportSerialApi = () => {
        return !navigator?.serial;
    }

    const checkSerialAvailable = () => {
        if (notSupportSerialApi()) {
            throw Error('瀏覽器不支援 Web Serial API')
        }
        return true;
    }

    const connect = async e => {
        e.preventDefault();
        try {
            if (checkSerialAvailable()) {
                setError(null);
                setOpen(true);
                await serialHandler.init();
            }
        } catch(error) {
            setError(error)
        }
    }

    const send = async() => {
        await serialHandler.writerStream('1,2|2,3')
        // await serialHandler.readLoop();
    }

    const disconnect = e => {
        e.preventDefault();
        setOpen(false)
    }

    const handleClick = () => {
        setTrigger(trigger => trigger + 1)
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
                    <Form.Button color='teal' onClick={connect} disabled={isOpen}>Connect</Form.Button>
                    <Form.Button color='teal' onClick={disconnect} disabled={!isOpen}>Disconnect</Form.Button>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Input fluid label="SYSTEM_CLK" value={SYSTEM_CLK} readOnly />
                    <Form.Input fluid label="FN_MASH_BLF" value={FN_MASH_BLF} readOnly />
                </Form.Group>
            </Form>
            <StateTable trigger={trigger} />
            <Form.Button onClick={send}>Send</Form.Button>
        </Segment>
    )
}

export default Arduino2;