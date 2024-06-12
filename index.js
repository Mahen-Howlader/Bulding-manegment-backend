const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 8000
// const { Resend } = require('resend')
// const resend = new Resend(api_key)
// middleware
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    optionSuccessStatus: 200,
}
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.iagloem.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


// middleware 
app.use(cors(corsOptions))
app.use(express.json())

async function run() {
    const apartmentCollection = client.db("BUILDING_MANAGEMENT").collection("apartment");
    const usersCollection = client.db("BUILDING_MANAGEMENT").collection("user");
    const agreementCollection = client.db("BUILDING_MANAGEMENT").collection("agreement");
    const announcemenCollection = client.db("BUILDING_MANAGEMENT").collection("announcemen");
    const couponCodeCollection = client.db("BUILDING_MANAGEMENT").collection("coupon");

    try {
        // agreement data 
        app.post("/user", async (req, res) => {
            const data = req.body;
            const email = data.email;
            const query = { email: email }
            const resultQuery = await usersCollection.findOne(query)
            if (resultQuery) {
                return res.send(resultQuery)
            }
            const result = await usersCollection.insertOne(data)
            res.send(result)
        })
        app.patch("/changerole/:email", async (req, res) => {
            const email = req.params.email;
            const role = req.body.role;
            const query = { email: email }
            const updateDoc = {
                $set: {
                    role: role
                },
            };
            const result = await usersCollection.updateOne(query, updateDoc);
            res.send(result)
        })


        app.get("/user/:email", async (req, res) => {
            const email = req.params?.email;
            const query = { email: email };
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        // apartment data ?
        app.get("/apartment", async (req, res) => {
            const result = await apartmentCollection.find().toArray()
            res.send(result)
        })

        // agreement data 
        app.post("/agreement", async (req, res) => {
            const data = req.body;
            const email = { userEmail: data?.userEmail };
            console.log(email)
            const alredyExist = await agreementCollection.findOne(email)
            if (alredyExist) {
                return res.send({ message: "User alredy exist" })
            } else {
                const result = await agreementCollection.insertOne(data)
                res.send(result)
            }
        })


        // agreement
        app.get("/agreement", async (req, res) => {
            const query = {status : "Pending"}
            const result = await agreementCollection.find(query).toArray()
            res.send(result)
        })
        // profile agreement 
        app.get("/agreement/:email", async (req, res) => {
            const email = req.params?.email;
            const query = { userEmail: email }
            const result = await agreementCollection.findOne(query)
            res.send(result)
        })

        app.delete("/changerole/:email", async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email }
            const result = await agreementCollection.deleteOne(query)
            res.send(result)
        })


        // agreement get 
        app.delete("/agrementdelete/:email", async (req, res) => {
            const email = req.params.email;
            // console.log("agrement", email)
            const query = { userEmail: email };
            const result = await agreementCollection.deleteOne(query)
            res.send(result)
        })
        //agrementstatus
        app.patch("/agrementstatus/:email", async (req, res) => {
            const email = req.params.email;
            // console.log("agrement", email)
            const query = { userEmail: email };
            const status = req.body.status;
            const updateDoc = {
                $set: {
                    status: status,
                },
            };
            const result = await agreementCollection.updateOne(query, updateDoc)
            res.send(result)
        })

        // app.patch("/rejectstatus/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) };
        //     const status = req.body.status;
        //     const updateDoc = {
        //         $set: {
        //             status: status,
        //         },
        //     };
        //     const result = await agreementCollection.updateOne(query, updateDoc)
        //     res.send(result)
        // })




        // admin 
        app.get("/member", async (req, res) => {
            const query = { role: "member" }
            const result = await usersCollection.find(query).toArray()
            res.send(result)
        })
        
        app.patch("/rolechange/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const updateDoc = {
                $set: {
                    role: "user",
                },
            };
            const result = await usersCollection.updateOne(query, updateDoc)
            res.send(result)
        })

        // Announcemen
        app.post("/announcemen", async (req, res) => {
            const data = req.body;
            const result = await announcemenCollection.insertOne(data);
            res.send(result);
        })

        // couponCodeCollection
        app.post("/coupon", async (req,res) => {
            const data = req.body;
            const result  = await couponCodeCollection.insertOne(data)
            res.send(result)
        })









        // Connect the client to the server	(optional starting in v4.7)
        // Send a ping to confirm a successful connection
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})