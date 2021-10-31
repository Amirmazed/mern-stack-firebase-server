const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()

const cors = require('cors')
const app = express();
const ObjectId = require('mongodb').ObjectId

const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yvwhn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        console.log('connected to db');
        const database = client.db('carMechanic2')
        const servicesCollection = database.collection('services');
        const orderCollection = database.collection('orders');

        //Get all data
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        //Get single service
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })

        //Post
        app.post('/services', async(req, res) => {     
        const service = req.body;
        console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)

            // res.send('post hitted')
        })

        // DELETE API
        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

        // ADD ORDER PRODUCT
        app.post("/addOrder", async(req, res) => {
            const item = (req.body)

            const buy = await orderCollection.insertOne(item);
            console.log(buy)
            res.json(buy)
        })

        //GET MY ORDER
        app.get("/myOrders/:email", async(req, res) => {
            // console.log(req.params.email);

            const mail = await orderCollection
            .find({email: req.params.email})
            .toArray();

        res.send(mail)
        })

        // Delete from my order
        app.delete("/remove/:id", async(req, res) => {
            // const id = req.params.id;
            // const query = { _id: ObjectId(id)};
            // const result = await orderCollection.deleteOne(query);
            // res.json(result);


            console.log(req.params.id)

        const result = await orderCollection.deleteOne({_id: req.params.id,
        });
        res.send(result);
        })
    }
    finally {
        
    }
}

run().catch(console.dir);

console.log(uri)


app.get('/', (req, res) => {
    res.send('Running genius server')
});


app.listen(port, () => {
    console.log('Running genius server on port', port);
})