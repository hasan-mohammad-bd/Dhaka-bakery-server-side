const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { use } = require('express/lib/router');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

//Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.ou2fz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () =>{
    try{

        await client.connect()
        const productCollection = client.db("productsCollection").collection("product")

        // adding data to server

        app.post('/product', async(req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        })

        // get data from server

        app.get('/product', async(req, res)=> {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);

        })




    }
    finally{
        // client.close()
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('running my node server')
});

app.listen(port, () =>{
    console.log('the server is running');
})