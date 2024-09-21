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

// Respond with all meals in the future (relative to the when datetime)
app.get("/future-meals", async (req, res) => {
  try {
    const now = new Date().toISOString();
    const futureMeals = await knex("meal").where("when", ">", now);
    res.json(futureMeals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Respond with all meals in the past (relative to the when datetime)
app.get("/past-meals", async (req, res) => {
  try {
    const now = new Date().toISOString();
    const pastMeals = await knex("meal").where("when", "<", now);
    res.json(pastMeals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Respond with all meals sorted by ID
app.get("/all-meals", async (req, res) => {
  try {
    const allMeals = await knex("meal").orderBy("id");
    res.json(allMeals);
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
