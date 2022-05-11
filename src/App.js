import 'regenerator-runtime/runtime';
import React, { useEffect, useState } from "react";

import PropTypes from 'prop-types';

import { Nav, Navbar, Container, Row, Card, Alert } from "react-bootstrap";

export default function App ({ contract, currentUser, nearConfig, wallet }) {
  const [userHasNFT, setuserHasNFT] = useState(false);
  
  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  useEffect(() => {
    const receivedNFT = async () => {

      if (currentUser.accountId !== "") {

        console.log(await contract.nft_metadata());

        // setuserHasNFT(
        //   await window.contract.check_token({
        //     id: `${window.accountId}-go-team-token`,
        //   })
        // );

      }

    };

    receivedNFT();
  }, []);

  return (
    <React.Fragment>
      {" "}
      <Navbar bg='dark' variant='dark'>
        <Container>
          <Navbar.Brand href='#home'>
            NEAR Protocol
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className='me-auto'></Nav>
            <Nav>
              <Nav.Link
                onClick={() => wallet.isSignedIn() ? signOut() : signIn()}
              >
                {wallet.isSignedIn()
                  ? currentUser.accountId
                  : "Login"}
              </Nav.Link>{" "}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container style={{ marginTop: "3vh" }}>
        {" "}
        <Row>
          <Alert>
            Hello! We are going to mint an NFT and have it appear in your
            wallet! Sign in, mint your nft and head over to{" "}
            <a href='https://wallet.testnet.near.org/'>
              wallet.testnet.near.org
            </a>{" "}
            to see your new "Go Team" NFT!
          </Alert>
        </Row>
        <Row>
          {/* <InfoBubble /> */}
        </Row>
        <Row style={{ marginTop: "3vh" }}>
          {/* <MintingTool userNFTStatus={userHasNFT} /> */}
        </Row>
      </Container>
    </React.Fragment>
  );
}

App.propTypes = {
  contract: PropTypes.shape({
    nft_metadata: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};