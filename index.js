const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();

const uri = process.env.DB_PATH;

//database 

const MongoClient = require('mongodb').MongoClient;


app.post("/addHome", (req, res) => {
    const homes = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect((error) => {
      const collection = client.db("air-cnc").collection("homes");
      collection.insert(homes, (err, result) => {
        if (err) {
          console.log(err);
          console.log(error)
          res.status(500).send({ message: err });
        } else {
          res.send(result.ops[0]);
        }
      });
      client.close();
    });
  });

  app.get("/homes", (req, res) => {
    //const category = req.params.category;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect((error) => {
      const collection = client.db("air-cnc").collection("homes");
      collection.find().toArray((err, documents) => {
        if (err) {
          console.log(err);
          console.log(error)
          res.status(500).send({ message: err });
        } else {
          res.send(documents);
        }
      });
      client.close();
    });
  });

  app.get('/homes/:key', (req, res) =>{
    const key = req.params.key;    
    
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("air-cnc").collection("homes");
        collection.find({key}).toArray((err, documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents[0]);
            }
        });
        client.close();
      });
});

app.post('/getHomesByKey', (req, res) =>{
    const key = req.params.key;
    const productKeys = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("air-cnc").collection("homes");
        collection.find({key: { $in: productKeys }}).toArray((err, documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
        });
        client.close();
      });
});

  
  app.get("/", (req, res) => {
    res.send("<h1>air-cnc Server</h1>");
  });

const port = process.env.PORT || 4200;
app.listen(port, () => { console.log("Listening at port 4200");
});
