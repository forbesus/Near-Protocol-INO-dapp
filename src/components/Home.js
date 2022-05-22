import React, { useState, useEffect } from 'react';
import { Alert, Card, Button, Col, Row } from "react-bootstrap";
import * as nearAPI from 'near-api-js';

export const Home = (props) => {
    const { 
        isSignedIn,
        wallet,
        contract
    } = props;

    const [collections, setCollections] = useState([]);

    useEffect(() => {
        (async() => {
            const result = await contract.get_collection();
            if(result.length === 2) {
                let data = result[0];
                data.forEach(d => d.minted = 0);
                setCollections(data);
            }
        })();
    }, [contract])

    // useEffect(() => {
    //     if(!isSignedIn || !collections.length) return;

    //     let tmp = collections;

    //     tmp.forEach(collection => {
    //         (async () => {
    //             const nft_contract = new nearAPI.Contract(
    //                 wallet.account(), // the account object that is connecting
    //                 collection.contract,
    //                 {
    //                   viewMethods: ["get_minted"], 
    //                   changeMethods: [""],
    //                   sender: wallet.account(),
    //                 }
    //             );

    //             let res;
                
    //             try {
    //                 res = await nft_contract.get_minted();
    //             } catch(err) {
    //                 res = 0;
    //             }
                
    //             collection.minted = res;
    //         })();
    //     });

    //     setCollections(tmp);

    // }, [isSignedIn, collections])

    const mint = async (contract, price) => {
        const { utils } = nearAPI;

        price = nearAPI.utils.format.formatNearAmount(price) * 10 ** 16 + 0.1;

        await wallet.account().functionCall({
            contractId: contract,
            methodName: "nft_mint",
            attachedDeposit: utils.format.parseNearAmount(price.toString()),
            args: {
                receiver_id: wallet.getAccountId()
            }
        }).then(res => {
           alert('success');
        }).catch(err => {
            alert(err);
        });

    }

    return (

            collections.length === 0 ? 
            (
                <Alert variant="danger" style={{marginTop: 250, textAlign: 'center'}}>
                    <h1>
                        Welcome to Dao Nation NFT Launchpad!
                    </h1>
                    <h3>
                        No collection to mint.
                    </h3>
                </Alert>
            )
            :  (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {collections.map((collection, id) => {

                    return (
                        <Col key={id}>
                            <Card>
                                <Card.Img variant="top" src={`${collection.url}/0.png`} />
                                <Card.Body>
                                <Card.Title>{collection.name}</Card.Title>
                                <Card.Text>
                                    Symbol: {collection.symbol} <br/>
                                    Supply: {collection.total_count} <br/>
                                    {/* Minted: {collection.minted} <br/> */}
                                    Price: {nearAPI.utils.format.formatNearAmount(collection.price) * 10 ** 16} Near
                                </Card.Text>
                                <Button
                                    variant="primary"
                                    disabled={!isSignedIn || collection.minted === collection.total_count}
                                    onClick={() => 
                                        mint(collection.contract, collection.price)
                                    }
                                >
                                        Mint
                                </Button>
                                </Card.Body>
                            </Card>
                        </Col>)
                })}
                </Row>
            )
    )
}