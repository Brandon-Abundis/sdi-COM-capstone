const db = require('./db/db');

const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.get('/', (req,res) => {
  return res.status(200).json({message: 'Welcome to the empty route traveler ♡(˶>⩊<˶)'})
});

app.listen(port, () => console.log(`Express server listening on port ${port}`));