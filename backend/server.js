import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { sequelize } from './src/config/db.js';

import './src/models/association.js'; 

const app = express();

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