const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./src/config/db');

require ('./src/models/association');

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected');

    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Tables created');

    return sequelize.getQueryInterface().showAllTables();
  })
  .then(tables => console.log('Tables in DB:', tables))
  .catch(err => console.log('Error: ' + err));
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

