const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { use } = require('express/lib/router');
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('running my node server')
});

app.listen(port, () =>{
    console.log('the server is running');
})