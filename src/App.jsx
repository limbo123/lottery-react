import React from "react";
import web3 from "./web3";
import lottery from "./lottery";
import { useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";

function App() {
  const [value, setValue] = useState("");
  const [balance, setBalance] = useState("");
  const [players, setPlayers] = useState([]);
  const [manager, setManager] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [winner, setWinner] = useState("");
  useEffect(() => {
    (async () => {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      setBalance(balance);
      setPlayers(players);
      setManager(manager);
    })();
  }, []);

  const enterGame = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();

    setIsLoading(true);
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });
    setIsLoading(false);
  };

  const pickWinner = async() => {
    const accounts = await web3.eth.getAccounts();
    setIsLoading(true);

    await lottery.methods.pickAWinner().send({
      from: accounts[0],
    })
    const currentWinner = await lottery.methods.lastWinner().call()
    setWinner(currentWinner);
    setIsLoading(false);

  }

  return (
    <>
      {isLoading && <div style={{position: "fixed", bottom: "20px", right: "20px"}}>
        <Audio color="#000" width="60" height="60" />
      </div> }
      <h2>Welcome to Lottery</h2>
      <p>
        a manager of game is <strong>{manager}</strong>.{" "}
        <strong>{players.length}</strong> players is entered. The prize will be{" "}
        <strong>{web3.utils.fromWei(balance, "ether")}</strong> ether!
      </p>
      <hr />
      <form onSubmit={enterGame}>
        <h3>Enter the game</h3>

        <label htmlFor="">write the amount of ether to enter</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">enter</button>
      </form>
      <hr />

      <h2>Pick a winner</h2>
      <button onClick={pickWinner}>pick a winner</button>
      <br />
      {winner !== "" && <h1>The winner was picked! Congradulations to {winner}</h1>}
    </>
  );
}
export default App;
