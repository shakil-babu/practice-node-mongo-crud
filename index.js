// init express
const express = require('express');
const app = express();

// use  body parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())


//  database username and password
// const userName = 'organicUser', password='FrTaSagpJxKqeG4u';

// Mongodb driver code
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://organicUser:FrTaSagpJxKqeG4u@cluster0.wpciw.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// get
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


// monodb driver code
client.connect(err => {
  const collection = client.db("organicdb").collection("products");

  // create or insert data
  app.post('/addproduct', (req, res) => {
    const newProduct = req.body;
      collection.insertOne(newProduct)
      .then(result => {
          console.log('data added succesfully');
          res.send('success');
      })
  })


  // read data
  app.get('/products', (req, res) => {
    collection.find({})
    .toArray((error, documents) => {
      res.send(documents)
    })
  })

// delete data
app.delete('/delete/:id', (req, res) => {
   collection.deleteOne({_id:ObjectId(req.params.id)})
   .then(res => {
     console.log('deleted:'+res.deletedCount)
   })
})

// load data
app.get('/products/:id', (req,res) => {
  const id = req.params.id;
  collection.find({_id:ObjectId(id)})
  .toArray((error, documents) => {
    res.send(documents[0]);
  })
})

// update data
app.patch('update/:id' , (req, res) => {
  collection.updateOne({_id:ObjectId(req.params.id)}, {
    $get: {name: req.body.name, price:req.body.price, quantity:req.body.quantity}
  })
  .then(res => {
    console.log(res);
  })
})

});


// port listen
app.listen(4000, () => console.log('4000 port is ready.'));
