import 'regenerator-runtime/runtime';
import React from 'react';
import PropTypes from 'prop-types';

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  
  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'NEAR ToDo List'
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <>
      <h1>NEAR Todos CRUD App</h1>
      { currentUser
          ? <div>
              <h2>
                Account ID: {currentUser.accountId}
                {" "}
                <button onClick={signOut}>Log out</button>
              </h2>
            </div>
          : 
          <div>
            Sign In To Use The App: 
            {" "}
            <button onClick={signIn}>Log in</button>
          </div>
        }
    </>
  );
}

App.propTypes = {
  contract: PropTypes.shape({
    create: PropTypes.func.isRequired,
    get: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
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


export default App;
