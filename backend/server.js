import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { router } from "./src/routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
