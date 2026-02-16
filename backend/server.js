import express from "express";
import cors from "cors";
import { router } from "./src/routes/index.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Api is running...");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
