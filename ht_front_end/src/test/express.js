const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/get', function(req,res){
  console.log(req.query)
  res.send({'get': 0})
});

app.post('/post', function(req,res){
  console.log(req.body)
  res.send({'post': 0})
});

app.delete('/delete', function(req,res){
  console.log(req.query)
  res.send({'delete': 0})
});

app.put('/put', function(req,res){
  console.log(req.body)
  // res.send({'put': 0})
  res.sendStatus(403)
});

app.listen(8000)

module.exports = app
