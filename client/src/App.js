import React, { useEffect, useState } from "react";
import RockPaperScissors from "./contracts/RockPaperScissors.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const App = () => {
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const _web3 = await getWeb3();
        await setWeb3(_web3);
        const accounts = await _web3.eth.getAccounts();
        const networkId = await _web3.eth.net.getId();
        const deployedNetwork = RockPaperScissors.networks[networkId];
        const instance = new _web3.eth.Contract(
          RockPaperScissors.abi,
          deployedNetwork && deployedNetwork.address
        );
        console.log("networkId", networkId);
        console.log("accounts", accounts);
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    }
    init();
  }, []);

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <div className="App">
      <h1>Good to Go!</h1>
    </div>
  );
};

export default App;
