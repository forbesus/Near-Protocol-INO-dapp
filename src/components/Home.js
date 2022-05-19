import { Alert } from "react-bootstrap";
import * as nearAPI from 'near-api-js';

export const Home = (props) => {
    const { 
        isSignedIn,
        wallet
    } = props;

    console.log(wallet.getAccountId());

    const mint = async () => {
        const { utils } = nearAPI;

        await wallet.account().functionCall({
            contractId: "daonation5.ninjadev.testnet",
            methodName: "nft_mint",
            attachedDeposit: utils.format.parseNearAmount("1"),
            args: {
                receiver_id: wallet.getAccountId()
            }
        }).then(res => {
           alert('success');
        }).catch(err => {
            console.log(err);
        });

    }

    return (
        isSignedIn 
        ? (<Alert variant="danger" style={{marginTop: 250, textAlign: 'center'}}>
            <h1>
                Welcome to Dao Nation NFT Launchpad!
            </h1>
            <h3>
                You could mint here.
            </h3>
            <button
                onClick={() => mint()}
            >
                Mint
            </button>
        </Alert>)
        : (<Alert variant="primary" style={{marginTop: 250, textAlign: 'center'}}>
            <h1>
                Welcome to Dao Nation NFT Launchpad!
            </h1>
            <h3>
                Please login to mint.
            </h3>
        </Alert>)
    )
}