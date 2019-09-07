// server.js 
// Auther: Brian
'use strict'
// Tools
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

// Express setup
const express = require('express');
const app = express();
app.use(express.static('static'));
app.use(bodyParser.json())

// Mongodb
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
let db;


// Express Router
// API
app.get('/api/counters', (req, res) => {
    db.collection('counters').find().toArray().then(counters => {
        res.json(counters)
    }).catch(err => {
        console.log(err);
        res.status(500).json({ message: `Internet Server Error: ${err}` });
    })
})

app.put('/api/counters', (req, res) => {
    let data = req.body
    let now = new Date(Date.now())
    data['created'] = now
    data['number'] = 0
    data['lastUpdate'] = now

    db.collection('counters').insertOne(data).then(result => 
        db.collection('counters').find({ _id: result.insertedId }).limit(1).next()
    ).then(newData => res.json(newData)
    ).catch(err => {
        console.log(err)
        res.status(500).json({ message: `Internet Server Error: ${err}` })
    })
})

app.get('/api/counter/:id', (req, res) => {
    let counterID;
    try {
        counterID = new ObjectId(req.params.id) 
    } catch (err) {
        res.status(422).json({ message: `Invalid ID format: ${err}` })
        return
    }
    db.collection('counters').find({ _id: counterID }).limit(1).next()
    .then(counter => {
        if (!counter) 
            res.status(404).json({ message: `Counter not find: ${counterID}` })
        else 
            res.json(counter)
    }).catch(err => {
        console.log(err)
        res.status(500).json({ message: `Internal Server Error: ${err}` })
    })
})

app.put('/api/counter/:id', (req, res) => {
    let counterID
    let data = req.body
    data['lastUpdate'] = new Date(Date.now())

    try {
        counterID = new ObjectId(req.params.id)
    } catch (err) {
        res.status(422).json({ message: `Invalid ID format: ${err}` })
        return
    }

    db.collection('counters').updateOne({ _id: counterID }, { $set: data })
    .then(() => db.collection('counters').find({ _id: counterID }).limit(1).next())
    .then(newData => res.json({ 
                                "_id": newData._id,
                                "title": newData.title, 
                                "number": newData.number, 
                                "lastUpdate": newData.lastUpdate 
                              })
    ).catch(err => {
        console.log(err);
        res.status(500).json({ message: `Server Error: ${err}` })
    })
})

app.delete('/api/counter/:id', (req, res) => {
    let counterID;
    try {
        counterID = new ObjectId(req.params.id)
    } catch (err) {
        res.status(422).json({ message: `Invalid ID format: ${err}` })
        return
    }

    db.collection('counters').deleteOne({ _id: counterID }).then(result => {
        if (result.deletedCount === 1)
            res.json({ status: 'OK' })
        else
            res.json({ status: 'Warning: Object Not Found' })
    }).catch(err => {
        console.log(err)
        res.status(500).json({ message: `Internal Server Error: ${err}` })
    })
})

// Default
app.get('/serviceworker.js', (req, res) => {
  res.sendFile(path.resolve('static/serviceworker.js'))
});
app.get('*', (req, res) => {
   res.sendFile(path.resolve('static/index.html'));
})


// Start server with mongodb
MongoClient.connect('mongodb://localhost', { useNewUrlParser: true })
.then(connection => {
    db = connection.db('bplus'); // select database

    var privateKey  = fs.readFileSync(__dirname + '/ssl/private.key');
    var certificate = fs.readFileSync(__dirname + '/ssl/certificate.crt');
    var credentials = { key: privateKey, cert: certificate };

    var httpsServer = https.createServer(credentials, app)
    httpsServer.listen(4430);

}).catch(err => {
    console.log('Error: ', err);
})
