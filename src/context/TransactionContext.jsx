import React, { useEffect, useState, createContext } from "react";
import { contractABI, contractAddress } from "../../utils/constants";

import { ethers } from "ethers";

export const TransactionContext = createContext();

const { ethereum } = window;
const createEthereumContract = async () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const Contract = new ethers.Contract(contractAddress, contractABI, signer);

  return Contract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);
  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const contract = await createEthereumContract();
        const availableTransactions = await contract.getAllTransactions();

        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(transaction.timestampt * 1000).toLocaleString(),

            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount._hex) / 10 ** 18,
          })
        );

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("please insall metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        getAllTransactions();
        setCurrentAccount(accounts[0]);
      } else {
        console.log("no account was found");
      }
    } catch (error) {
      console, log(error);
      throw new Error("ethereum is not present ");
    }
  };
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const checkIfTransactionsExist = async () => {
    try {
      const transactionContract = createEthereumContract();
      const transactionCount = (
        await transactionContract
      ).getTransactionCount();
      window.localStorage.setItem("transactionCount", transactionCount);
    } catch (error) {
      console.log(error);
    }
  };
  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const Contract = await createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);
        // console.log((await Contract).functions)

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: addressTo,
              gas: "0x5208",
              value: parsedAmount._hex,
            },
          ],
        });

        const transactionHash = await Contract.addToBlockchain(
          addressTo,
          parsedAmount,
          message,
          keyword
        );

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash;
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount = await Contract.getTransactionCount();

        setTransactionCount(transactionsCount);
        window.location.reload();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, [transactionCount]);
  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        sendTransaction,
        handleChange,
        formData,
        transactions,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
