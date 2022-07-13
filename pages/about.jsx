import { useEffect, useState } from "react";
import PrimaryButton from '../components/primary-button'
import ABI from '../utils/Keyboards.json'
import { ethers } from "ethers";
import Keyboard from "../components/keyboard";
import { UserCircleIcon } from '@heroicons/react/solid'
const index = () => {
    const [ethereum,setEthereum] = useState()
    const [connectedAccount,setConnectedAccount] = useState();
    const [keyboards, setKeyboards] = useState([])
    const [newKeyboards, setNewKeyboard] = useState([]) // this is new!
    const contractAddress = '0x0d45FdFcf84bf979CdaC8A4Ad388e07e6BFdF559'
    const contractABI = ABI.abi;
    const handleAccounts = (accounts) =>{
        if(accounts.length >0){
            const account = accounts[0]; 
            console.log('We have an authorized account: ',account);
            setConnectedAccount(account)
        }else{
            console.log('No authorized accounts yet');
        }   
    }
   
    
    const getConnectedAccount = async () => {
        console.log('called');
        if(window.ethereum) {
            setEthereum(window.ethereum);
        }
        if(ethereum){
            const accounts = await ethereum.request({method:'eth_accounts'})
            handleAccounts(accounts)
        }
    }

    useEffect(()=>{console.log("hell"); getConnectedAccount()},[])
    
    const getKeyboards = async () => {
        if (ethereum && connectedAccount) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const keyboardsContract = new ethers.Contract(contractAddress, contractABI, signer);
    
          const keyboards = await keyboardsContract.getKeyboards();
          console.log('Retrieved keyboards...', keyboards)
          setNewKeyboard(keyboards)
        }
      }
      useEffect(() => getKeyboards(), [connectedAccount])
    


    const connectAccount = async () => {
        if (!ethereum) {
          alert('MetaMask is required to connect an account');
          return;
        }
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        handleAccounts(accounts);
      };
      if (!ethereum) {
        return <p>Please install MetaMask to connect to this site</p>
      }
      
        if (!connectedAccount) {
          return <PrimaryButton onClick={connectAccount}>Connect MetaMask Wallet</PrimaryButton>
        }
      
        if (newKeyboards.length > 0) {
          return (
            <div className="flex flex-col gap-4">
              <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
              {newKeyboards.map(
  ([kind, isPBT, filter, owner], i) => (
    <div key={i} className="relative">
      <Keyboard kind={kind} isPBT={isPBT} filter={filter} />
      <span className="absolute top-1 right-6">
        {addressesEqual(owner, connectedAccount) ?
          <UserCircleIcon className="h-5 w-5 text-indigo-100" /> :
          <button>Tip!</button>
        }
      </span>
    </div>
  )
)}
              </div>
            </div>
          )
        }
      
        // No keyboards yet
        return (
          <div className="flex flex-col gap-4">
            <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
            <p>No keyboards yet!</p>
          </div>
        )
      
  };
  
export default index;

export function addressesEqual(addr1, addr2) {
  if(!addr1 || !addr2) return false;
  return addr1.toUpperCase() === addr2.toUpperCase();
}