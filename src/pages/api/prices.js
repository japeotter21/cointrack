require('dotenv').config()
const axios = require('axios')
export const config = {
    api: {
      externalResolver: true,
    },
  }
export default function handler(req, res) {

    if (req.method === 'POST')
    {
        const coinList = req.body.list
        let pairs = []
        let responseData = []
        coinList.forEach((item,id)=>pairs.push(`${item}-USD`))
        axios.all(pairs.map((pair)=>axios.get(`https://api.coinbase.com/v2/prices/${pair}/buy`)
        ))
        .then(responses=>{
            responses.forEach((res)=>{
                responseData.push(res.data.data)
            })
            console.log(responseData)
            res.status(200);
            res.send(JSON.stringify(responseData));
        })
    }
    else
    {
        res.status(404)
        return
    }
    
  }