import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";
import mealsRouter from "./routers/meals.js";
import reservationsRouter from "./routers/reservations.js";
import reviewRouter from "./routers/reviews.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mount routers under /api
app.use("/api/meals", mealsRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/reviews", reviewRouter);

// API Router
const apiRouter = express.Router();

// Respond with all future meals
apiRouter.get("/future-meals", async (req, res, next) => {
  try {
    const now = new Date().toISOString();
    const futureMeals = await knex("meal").where("when", ">", now);
    res.json(futureMeals);
  } catch (error) {
    next(error);
  }
});

// Respond with all past meals
apiRouter.get("/past-meals", async (req, res, next) => {
  try {
    const now = new Date().toISOString();
    const pastMeals = await knex("meal").where("when", "<", now);
    res.json(pastMeals);
  } catch (error) {
    next(error);
  }
});

// Respond with all meals sorted by ID
apiRouter.get("/all-meals", async (req, res, next) => {
  try {
    const allMeals = await knex("meal").orderBy("id");
    res.json(allMeals);
  } catch (error) {
    next(error);
  }
});

// Respond with the first meal
apiRouter.get("/first-meal", async (req, res, next) => {
  try {
    const firstMeal = await knex("meal").orderBy("id").first();
    if (!firstMeal) {
      return res.status(404).json({ error: "No meals found" });
    }
    res.json(firstMeal);
  } catch (error) {
    next(error);
  }
});

// Respond with the last meal
apiRouter.get("/last-meal", async (req, res, next) => {
  try {
    const lastMeal = await knex("meal").orderBy("id", "desc").first();
    if (!lastMeal) {
      return res.status(404).json({ error: "No meals found" });
    }
    res.json(lastMeal);
  } catch (error) {
    next(error);
  }
});

// Nested router example
apiRouter.use("/nested", nestedRouter);
app.use("/api", apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.status === 404) {
    return res.status(404).json({ error: "Resource not found" });
  }

  res.status(err.status || 500).json({
    error: "An error occurred. Please try again later.",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});