"use client"
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Transition } from 'react-transition-group'

export default function Home() {
  const [coinList, setCoinList] = useState([])
  const [allCoins, setAllCoins] = useState([])
  const [prices, setPrices] = useState([])
  const [warning, setWarning] = useState([])
  const [timer, setTimer] = useState(0)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [live, setLive] = useState(true)
  const [blink, setBlink] = useState(true)
  const nodeRef = useRef(null);
  const duration = 500
  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
  }
  
  const transitionStyles = {
    entering: { opacity: 1 },
    entered:  { opacity: 1 },
    exiting:  { opacity: 0 },
    exited:  { opacity: 0 },
  };
  useEffect(()=>{
    //get list of user's favorite coins
    axios.get('/api/coins')
    .then(res=>{
      setCoinList(res.data.documents)
    })
    .catch(err=>{
      console.error(err.message)
      setWarning([...warning,'Unable to load favorites.'])
      setLive(false)
    })
    axios.get('/api/allcoins')
    .then(res=>{
      setAllCoins(res.data.data)
    })
    .catch(err=>{
      console.error(err.message)
      setWarning([...warning,'Unable to load available coins.'])
      setLive(false)
    })
  },[])

  useEffect(()=>{
    GetPrices(true)
  },[coinList])

  useEffect(()=>{
    GetPrices(false)
  },[timer])

  useEffect(()=>{
    setTimeout(()=>{
      setBlink(!blink)
    },1000) 

    setTimeout(()=>{
      setTimer(timer+1)
    },5000) 
  })

  function GetPrices(init) {
    //get all coin prices from list
    if(coinList.length > 0)
    {
      init ? setLoading(true) : setUpdating(true)
      let postObj = []
      coinList.forEach((item,id)=>postObj.push(item.name))
      axios.post('api/prices',{list: postObj})
      .then(res=>{
          setPrices(res.data)
          init ? setLoading(false) : setUpdating(false)
          setLive(true)
      })
      .catch(err=>{
        console.error(err.message)
        setWarning([...warning,'Unable to load price data.'])
        init ? setLoading(false) : setUpdating(false)
        setLive(false)
      })
    }
  }

  /* Display:
    Red when down, green when up
    Table of icon, name, abbreviation, price, %change (future: volume/market cap)
    (future: chart when selected)
  */
  /* Functionality:
    -------- Get all available in coinbase,
    Edit list (add, delete, reorder [favorite, price change, price], set alerts),
    Track % price change,
    Push to desktop,
    Alert at volume change?,
    Provide link to kucoin on alert
  */

  return (
    <>
    <main className="flex min-h-screen flex-col items-center bg-slate-800">
      <div className='bg-slate-600 w-full p-8 px-8 lg:px-12 flex items-center justify-center gap-8 lg:gap-20'>
        <div className='bg-gradient-to-r from-red-300 via-white to-green-200 bg-clip-text text-transparent w-max text-xl lg:text-3xl
          font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]'
        >
          Crypto Watcher
        </div>
        <select
          className="bg-slate-400 text-gray-900 text-white text-sm rounded-lg focus:ring-blue-500
            focus:border-blue-500 block px-3 py-2"
        >
          <option value="USD" selected>$ USD</option>
          <option value="USDT">USDT</option>
          <option value="EUR">€ EUR</option>
          <option value="GBP">&#163; GBP</option>
          <option value="CAD">C$ CAD</option>
        </select>
      </div>
      <div className='w-full lg:w-3/4 px-12 py-4 mt-12 border border-gray-500 rounded-lg bg-slate-600 flex flex-col gap-6'>
          <div className='flex justify-between items-center'>
            <div className='flex gap-3'>
              <button className='rounded-xl px-4 py-2 bg-slate-700 text-gray-50 drop-shadow-md'>Filter</button>
              <button className='rounded-xl px-4 py-2 bg-slate-700 text-gray-50 drop-shadow-md'>Sort</button>
            </div>
            { !live ? 
              <p className='text-red-400'>Disconnected</p>
              :
              <div className='text-green-400'>
                <Transition nodeRef={nodeRef} in={blink} timeout={duration}>
                    {state => (
                        <div ref={nodeRef} style={{
                        ...defaultStyle,
                        ...transitionStyles[state]
                        }}
                        >
                            Live
                        </div>
                    )}
                </Transition>
              </div>
            }
          </div>
          { loading ? 
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded-full dark:bg-gray-700 w-full my-6 px-3 py-1"></div>
              <div className="h-4 bg-gray-300 rounded-full dark:bg-gray-700 w-full my-6 px-3 py-1"></div>
              <div className="h-4 bg-gray-300 rounded-full dark:bg-gray-700 w-full my-6 px-3 py-1"></div>
            </div>
          :
          <>
            <table className='w-full'>
              <thead className='border border-0 border-b-4 border-gray-500'>
                <tr>
                    <th className='text-left px-3 py-1 text-white'>Coin</th>
                    <th className='text-left px-3 py-1 text-white'>Name</th>
                    <th className='text-left px-3 py-1 text-white'>Price</th>
                    <th className='text-left px-3 py-1 text-white'>% Change</th>
                </tr>
              </thead>
              <tbody className='divide-y-2 divide-gray-500'>
                { coinList.length > 0 && prices.length > 0 ?
                    coinList.map((item,id)=>(
                      <tr className='hover:bg-indigo-100 hover:bg-opacity-40'>
                        <td className='px-3 py-2 text-white font-light'>{item.name}</td>
                        <td className='px-3 py-2 text-white font-light'>{item.displayName}</td>
                        <td className='px-3 py-2 text-white font-light'>{prices[id].amount}</td>
                      </tr>

                    ))
                :
                  <></>
                }
              </tbody>
            </table>
          </>
          }
          
          <button className='rounded-xl px-4 py-2 bg-green-400 drop-shadow-lg w-max'>Add to List</button>
      </div>
    </main>
    </>
  )
}
