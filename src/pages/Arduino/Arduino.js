import React from 'react';
import { Button, Form, Icon, Message, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const SYSTEM_CLK = (32.768 * 122);
const FN_MASH_BLF = 529;

const Arduino = () => {
    const [error, setError] = useState("");
    const [isConnected, setConnected] = useState(false);

    const connect = async e => {
        e.preventDefault();
        setConnected(true)
    }

    const disconnect = async e => {
        e.preventDefault();
        setConnected(false)
    }

    const sendCommand = async (command) => {
        console.log(command);
    }

    const download = () => {
        return <Link to="/files/Arduino_Web.rar" target="_blank" download></Link>;
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
            </Form>
        </Segment>
    )
}

export default Arduino;