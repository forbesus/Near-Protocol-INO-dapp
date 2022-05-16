import 'regenerator-runtime/runtime';
import React, { useEffect, useState } from "react";

import PropTypes from 'prop-types';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Header } from './components/Header';
import { Home } from './components/Home';
import { AddNewCollection } from './components/AddNewCollection';

import { Container, Row } from "react-bootstrap";

export default function App ({ contract, currentUser, nearConfig, wallet }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [contractId, setContractId] = useState("");
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    if (!contractId || !accountId) return;

    if(contractId === accountId) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [contractId, accountId]);
  
  useEffect(() => {
    if(wallet.isSignedIn()) {
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
    }
  }, [wallet]);

  useEffect(() => {
    setContractId(nearConfig.contractName);
  }, [nearConfig]);

  useEffect(() => {
    if (currentUser && currentUser.accountId !== "") {
      setAccountId(currentUser.accountId);
    } else {
      setAccountId("");
    }
  }, [currentUser]);
  
  useEffect(() => {
    (async () => {
      if (accountId === "") {
        return;
      }

      console.log(await contract.nft_metadata());

    })();
  }, [contract, accountId]);

  return (
    <BrowserRouter>
      <Header 
        isSignedIn = {isSignedIn}
        accountId = {accountId}
        wallet = {wallet}
        contractId = {contractId}
        isAdmin = {isAdmin}
      />
      
      <Container style={{ marginTop: "3vh" }}>
        <Routes>
          <Route 
            exact
            path="/" 
            element=
              {<Home 
                isSignedIn = {isSignedIn}
              />} 
          />
          <Route 
            path="/new" 
            element =
              {isAdmin ? 
                <AddNewCollection/>
                : <Navigate  to="/" />
              } 
          />
          <Route
            path="*"
            element={
              <Navigate  to="/" />
            }
          />
        </Routes>
      </Container>
    </BrowserRouter>
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