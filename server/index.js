const express = require('express')
const cors = require('cors'); 

const app = express()
app.use(cors());

const port = 3000

var path = require('path');

app.get('/', (req, res) => {
    res.header("Content-Type",'application/json');
    res.sendFile(path.resolve('data.json'));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



