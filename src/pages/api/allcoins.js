require('dotenv').config()
const axios = require('axios')
export const config = {
    api: {
      externalResolver: true,
    },
  }
export default function handler(req, res) {

    if (req.method === 'GET')
    {
        axios.get('https://api.coinbase.com/v2/currencies/crypto')
        .then(response => {
            res.status(200);
            res.send(JSON.stringify(response.data));
        })
        .catch(error => {
            res.status(400).json({data: 'request failed'})
        });
    }
    else
    {
        res.status(405).send({ message: `${req.method} not allowed` })
        return
    }
    
  }