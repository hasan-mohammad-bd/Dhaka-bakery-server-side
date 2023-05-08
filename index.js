const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { use } = require('express/lib/router');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//Middleware
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://user13:mau6Yvv72fD7X32T@cluster0.ou2fz.mongodb.net/?retryWrites=true&w=majority";
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


        // get product by id

        app.get('/product/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        // delete product by id 

        app.delete('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);

        })

        //update product quantity 
        app.put('/product/:id', async(req, res) =>{
            const id = req.params.id;
            const updateQuantity = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true};
            const updateDoc = {
                $set: {
                    productQuantity: Number(updateQuantity.productQuantityInput)
                }
            };
            const result = await productCollection.updateOne(filter, updateDoc, options);
            res.send(result);

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