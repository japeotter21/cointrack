"use client"
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Home() {
  const [coinList, setCoinList] = useState([])
  const [prices, setPrices] = useState([])

  useEffect(()=>{
    //get list from mongodb
  },[])

  useEffect(()=>{
    //get all coin prices from list
  },[coinList])

  // functionality: get all available in coinbase, edit list, alert at % price change, alert at volume change? 

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
    </main>
  )
}
