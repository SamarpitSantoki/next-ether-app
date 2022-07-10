import { useEffect, useState } from "react";
import PrimaryButton from '../components/primary-button'
import ABI from '../utils/Keyboards.json'
import { ethers } from "ethers";
const About = () => {
    const [ethereum,setEthereum] = useState()
    const [connectedAccount,setConnectedAccount] = useState();
    const [keyboards, setKeyboards] = useState([])
    const [newKeyboard, setNewKeyboard] = useState("") // this is new!
    const contractAddress = '0x4eF8c3Aaf9b8d4a6276113F943adC90D5BdcC8F0'
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
    const submitCreate = async (e) => {
        e.preventDefault();
    
        if (!ethereum) {
          console.error('Ethereum object is required to create a keyboard');
          return;
        }
    
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const keyboardsContract = new ethers.Contract(contractAddress, contractABI, signer);
    
        const createTxn = await keyboardsContract.create(newKeyboard);
        console.log('Create transaction started...', createTxn.hash);
    
        await createTxn.wait();
        console.log('Created keyboard!', createTxn.hash);
    
        await getKeyboards();
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
          setKeyboards(keyboards)
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

    if(!ethereum){
        return <p>Please install MetaMask to connect to this site</p>
    }
    if(!connectedAccount){
        return <PrimaryButton onClick={connectAccount}>Connect MetaMask</PrimaryButton>
    }
    return (
        <div className="flex flex-col gap-y-8">
          <form className="flex flex-col gap-y-2">
            <div>
              <label htmlFor="keyboard-description" className="block text-sm font-medium text-gray-700">
                Keyboard Description
              </label>
            </div>
            <input
              name="keyboard-type"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={newKeyboard}
              onChange={(e) => { setNewKeyboard(e.target.value) }}
            />
            <PrimaryButton type="submit" onClick={submitCreate}>
              Create Keyboard!
            </PrimaryButton>
          </form>
          <div>{keyboards.map((keyboard, i) => <p key={i}>{keyboard}</p>)}</div>
        </div>
      )
      
  };
  
  export default About;