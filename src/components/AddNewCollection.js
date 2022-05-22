import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from "react-bootstrap";
import * as nearAPI from 'near-api-js';

// const test_data = {
//     name: 'Legendary Skulls',
//     symbol: "LSK",
//     cid: 'QmeRGXZH4drhsGYiZmQS5nQbBxMmuugYiC2HBns3ChpMCC',
//     count: 6,
//     price: 1
// };

const near_ico = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 288 288'%3E%3Cg id='l' data-name='l'%3E%3Cpath d='M187.58,79.81l-30.1,44.69a3.2,3.2,0,0,0,4.75,4.2L191.86,103a1.2,1.2,0,0,1,2,.91v80.46a1.2,1.2,0,0,1-2.12.77L102.18,77.93A15.35,15.35,0,0,0,90.47,72.5H87.34A15.34,15.34,0,0,0,72,87.84V201.16A15.34,15.34,0,0,0,87.34,216.5h0a15.35,15.35,0,0,0,13.08-7.31l30.1-44.69a3.2,3.2,0,0,0-4.75-4.2L96.14,186a1.2,1.2,0,0,1-2-.91V104.61a1.2,1.2,0,0,1,2.12-.77l89.55,107.23a15.35,15.35,0,0,0,11.71,5.43h3.13A15.34,15.34,0,0,0,216,201.16V87.84A15.34,15.34,0,0,0,200.66,72.5h0A15.35,15.35,0,0,0,187.58,79.81Z'/%3E%3C/g%3E%3C/svg%3E";

export const AddNewCollection = (props) => {
    const {
        wallet,
        nearConfig,
    } = props;
    const [show, setShow] = useState(false);
    const [closable, setClosable] = useState(false);
    const [status, setStatus] = useState('');
    const [disabled, setDisabled] = useState(true);

    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [cid, setCID] = useState('');
    const [count, setCount] = useState(0);
    const [price, setPrice] = useState(0);

    const showModal = () => {
        setShow(true);
        setStatus("initialize");
        setTimeout( () => setStatus("update"), 1000 );
        setTimeout( () => {
            setStatus("Success");
            setTimeout( () => setShow(false), 2000 );
        }, 3000 );
    }

    const addNewCollection = async () => {
        setShow(true);
        setClosable(false);
        setStatus("Start Processing...");

        const { utils } = nearAPI;

        const keyPair = nearAPI.KeyPair.fromRandom("ed25519");
        const publicKey = keyPair.publicKey.toString();

        const data = await fetch('wasm/non_fungible_token.wasm');
        const buf = await data.arrayBuffer();

        const amount = buf.byteLength / 1000 / 100 + 0.1;

        const account_id = `daonation-ino-${publicKey.slice(8, 14).toLowerCase()}.${nearConfig.contractName}`;

        setStatus("Creating Account and Deploying NFT Mint smart contract.");

        const deploy_res = await wallet.account().createAndDeployContract(
            account_id,
            publicKey,
            new Uint8Array(buf),
            utils.format.parseNearAmount(amount.toString())
        ).then(res => {
            setStatus("Success - Create Account and Deploy NFT Mint smart contract.");
            return true;
        }).catch(err => {
            setStatus(err.toString());
            setClosable(true);
            return false;
        });

        if (!deploy_res) return;

        setStatus("Registering collection data.");

        const register_res = await wallet.account().functionCall({
            contractId: wallet.getAccountId(),
            methodName: "add_collection",
            attachedDeposit: utils.format.parseNearAmount("0.1"),
            args: {
                new_collection: {
                    name: name,
                    symbol: symbol,
                    url: "https://gateway.pinata.cloud/ipfs/" + cid,
                    total_count: count,
                    price: parseInt(price * 10 ** 8),
                    contract: account_id
                },
            },

        }).then(res => {
            setStatus("Success - Registering collection data.");
            return true;
        }).catch(err => {
            setStatus(err.toString());
            setClosable(true);
            return false;
        });

        if(!register_res) return;
        
        setStatus("Initializeing NFT mint smart contract.");

        const init_res = await wallet.account().functionCall({
            contractId: account_id,
            methodName: "new",
            args: {
                owner_id: wallet.getAccountId(),
                metadata: {
                    spec: "nft-1.0.0",
                    name: name,
                    symbol: symbol,
                    icon: near_ico,
                    base_uri: "https://gateway.pinata.cloud/ipfs/" + cid
                },
                count: count,
                price: parseInt(price * 10 ** 8)
            }
        }).then(res => {
            setStatus("Success - Initialized NFT mint smart contract.");
            return true;
        }).catch(err => {
            setStatus(err.toString());
            setClosable(true);
            return false;
        });

        if (!init_res) return;

        setStatus("Finalizing Config.");

        await wallet.account().functionCall({
            contractId: wallet.getAccountId(),
            methodName: "update_collection_status",
            args: {},

        }).then(res => {
            setStatus("Success - Added New Collection.");
            return true;
        }).catch(err => {
            setStatus(err.toString());
            return false;
        });

        setClosable(true);
    }

    useEffect(() => {
        if(name && symbol && cid && count && price) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [name, symbol, cid, count, price]);

    return (
        <>
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
                disabled={disabled}
                onClick={() => addNewCollection()}
            >
                Submit
            </Button>
        </Form>

        <Modal
            show={show}
            onHide={() => {
                if (closable) {
                    setShow(false);
                }
            }}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
            <Modal.Title> { closable ? 'Result' : 'Processing...' }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {status}
            </Modal.Body>
            <Modal.Footer>
                { 
                    closable ? 
                    (
                    <Button
                        variant="primary"
                        onClick={() => setShow(false)}>
                        Close
                    </Button>
                    )
                    :
                    <Button
                        variant="warning"
                        disabled
                        >
                        Do not close website.
                    </Button>
                }
            </Modal.Footer>
        </Modal>
      </>
    )
}