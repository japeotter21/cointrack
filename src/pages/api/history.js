require('dotenv').config()
const axios = require('axios')

export const config = {
    api: {
      externalResolver: true,
    },
}
export default function handler(req, res) {
    const timeNow = new Date().getTime()
    const postObj = {
        time: timeNow,
        data: req.body.data
    }
    if (req.method === 'POST')
    {
        const data = JSON.stringify({
            "collection": "prices",
            "database": "cointracker",
            "dataSource": "link0",
            "document": postObj
        });
        const config = {
            method: 'post',
            url: 'https://us-east-2.aws.data.mongodb-api.com/app/data-hdjhg/endpoint/data/v1/action/insertOne',
            headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': process.env.API_KEY,
            },
            data: data
        }; 
        axios(config)
        .then(function (response) {
            res.status(200);
            res.send(JSON.stringify(response.data));
        })
        .catch(function (error) {
            res.status(400).json({data: 'request failed'})
        });
    }
    else if (req.method === 'GET')
    {
        const data = JSON.stringify({
            "collection": "prices",
            "database": "cointracker",
            "dataSource": "link0"
        });
        const config = {
            method: 'post',
            url: 'https://us-east-2.aws.data.mongodb-api.com/app/data-hdjhg/endpoint/data/v1/action/find',
            headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': process.env.API_KEY,
            },
            data: data
        }; 
        axios(config)
        .then(function (response) {
            res.status(200);
            res.send(JSON.stringify(response.data));
        })
        .catch(function (error) {
            res.status(400).json({data: 'request failed'})
        });
    }
    else
    {
        res.status(405).send({ message: `${req.method} not allowed` })
        return
    }
    
  }