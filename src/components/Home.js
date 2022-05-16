import { Alert } from "react-bootstrap";

export const Home = (props) => {
    const { isSignedIn } = props;

    return (
        isSignedIn 
        ? (<Alert variant="danger" style={{marginTop: 250, textAlign: 'center'}}>
            <h1>
                Welcome to Dao Nation NFT Launchpad!
            </h1>
            <h3>
                You could mint here.
            </h3>
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