import React, { useState, useEffect } from 'react';
import { Form, Button } from "react-bootstrap";
import * as nearAPI from 'near-api-js';

const data = {
    name: 'Legendary Skulls',
    symbol: "LSK",
    cid: 'QmeRGXZH4drhsGYiZmQS5nQbBxMmuugYiC2HBns3ChpMCC',
    count: 6,
    price: 1
}

export const AddNewCollection = (props) => {
    const {
        wallet,
        nearConfig,
    } = props;

    const [disabled, setDisabled] = useState(true);

    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [cid, setCID] = useState('');
    const [count, setCount] = useState(0);
    const [price, setPrice] = useState(0);

    const addNewCollection = async () => {
        const { utils } = nearAPI;

        const keyPair = nearAPI.KeyPair.fromRandom("ed25519");
        const publicKey = keyPair.publicKey.toString();

        const data = await fetch('wasm/non_fungible_token.wasm');
        const buf = await data.arrayBuffer();

        const amount = buf.byteLength / 1000 / 100 + 0.1;

        // const publicKey = 'ed25519:2NxXHhXdPam37tp6ACQk7gwyfrzezg324PxJUJKjtB8Y';
        // const account_id = `INO-${publicKey.slice(8, 14).toLowerCase()}.${nearConfig.contractName}`;
        // const account_id = 'daonation-2nxxhhxdpam37tp6acqk7gwyfrzezg324pxjujkjtb8y.testnet';
        const account_id = "daonation6.ninjadev.testnet";

        await wallet.account().createAndDeployContract(
            account_id,
            publicKey,
            new Uint8Array(buf),
            utils.format.parseNearAmount(amount.toString())
        ).then(res => {
            alert('success');
        }).catch(err => {
            console.log(err);
        });

        await wallet.account().functionCall(
            account_id,
            "new_default_meta",
            {
                owner_id: 'ninjadev.testnet'
            }
        ).then(res => {
            alert('success');
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        if(name && symbol && cid && count && price) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [name, symbol, cid, count, price]);

    return (
        <Form>
            <Form.Group className="mb-3" >
                <Form.Label>New Collection Name</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="CryptoKitties" 
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label>Symbol</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="CKS" 
                    onChange={(e) => {
                        setSymbol(e.target.value);
                    }}
                />
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label>Pinata CID</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="QmeRGXZH4drhsGYiZmQS5nQbBxMmuugYiC2HBns3ChpMCC" 
                    onChange={(e) => {
                        setCID(e.target.value);
                    }}
                />
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label>Total Count</Form.Label>
                <Form.Control 
                    type="number" 
                    placeholder="12" 
                    onChange={(e) => {
                        setCount(Number(e.target.value));
                    }}
                />
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label>Mint Price</Form.Label>
                <Form.Control 
                    type="number" 
                    placeholder="1" 
                    onChange={(e) => {
                        setPrice(Number(e.target.value));
                    }}
                />
            </Form.Group>

            <Button
                variant="primary"
                type="button"
                // disabled={disabled}
                onClick={() => addNewCollection()}
            >
                Submit
            </Button>
        </Form>
    )
}