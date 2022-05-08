const express = require('express');
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { use } = require('express/lib/router');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//Middleware
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        console.log('decoded', decoded);
        req.decoded = decoded;
        next();
    })
}

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.ou2fz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () =>{
    try{

        await client.connect()
        const productCollection = client.db("productsCollection").collection("product")

        //auth
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        })

        // adding data to server

        app.post('/product', async(req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        })

        // get data from server

        app.get('/product',verifyJWT, async(req, res)=> {
            const decodedEmail = req.decoded.email;
            const email = req.query.email;
            if(email === decodedEmail){
                const query = {};
                const cursor = productCollection.find(query);
                const products = await cursor.toArray();
                res.send(products);

            }
            else{
                res.status(403).send({message: 'forbidden access'})
            }



        })


        // get product by id

        app.get('/product/:id',verifyJWT, async(req, res)=> {
            const email = req.query.email;
            if(email === decodedEmail){
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const product = await productCollection.findOne(query);
                res.send(product);

            }
            else{
                res.status(403).send({message: 'forbidden access'})
            }



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