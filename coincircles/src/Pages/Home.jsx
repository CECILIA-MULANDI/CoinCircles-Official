import React from 'react'
import ConnectWallet from '../Components/ConnectWallet/Connect'
import CreateChama from '../Components/Chamas/CreateChama'
import ChamaList from '../Components/Chamas/ChamaList'


export default function Home() {
  return (
    <>
    <ConnectWallet/>
 <CreateChama/>
 <ChamaList/>
    </>
    
  )
}
