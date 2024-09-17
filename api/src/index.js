import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

app.get("/future-meals", async (req, res) => {
  try {
    const now = new Date().toISOString();
    const meals = await knex.raw("SELECT * FROM meal WHERE `when` > ?", [now]);
    res.json(meals[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
