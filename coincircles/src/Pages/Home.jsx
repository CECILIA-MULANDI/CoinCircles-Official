import React from 'react'
import ConnectWallet from '../Components/ConnectWallet/Connect'
import { CreateChamas } from '../Components/CallContractFunctions/CallContract'

export default function Home() {
  return (
    <>
    <ConnectWallet/>
    <CreateChamas/>
    </>
    
  )
}
