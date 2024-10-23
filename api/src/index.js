import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";
import mealsRouter from "./routers/meals.js";
import reservationsRouter from "./routers/reservations.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/meals", mealsRouter);
app.use("/api/reservations", reservationsRouter);

const apiRouter = express.Router();

// Respond with all meals in the future (relative to the when datetime)
app.get("/future-meals", async (req, res, next) => {
  try {
    const now = new Date().toISOString();
    const futureMeals = await knex("meal").where("when", ">", now);
    res.json(futureMeals);
  } catch (error) {
    next(error);
  }
});

// Respond with all meals in the past (relative to the when datetime)
app.get("/past-meals", async (req, res, next) => {
  try {
    const now = new Date().toISOString();
    const pastMeals = await knex("meal").where("when", "<", now);
    res.json(pastMeals);
  } catch (error) {
    next(error);
  }
});

// Respond with all meals sorted by ID
app.get("/all-meals", async (req, res, next) => {
  try {
    const allMeals = await knex("meal").orderBy("id");
    res.json(allMeals);
  } catch (error) {
    next(error);
  }
});

// Respond with the first meal (meaning with the minimum id)
app.get("/meals/first-meal", async (req, res, next) => {
  try {
    const firstMeal = await knex("meal").orderBy("id").first();
    if (!firstMeal) {
      const error = new Error("No meals found");
      error.status = 404;
      return next(error);
    }
    res.json(firstMeal);
  } catch (error) {
    next(error);
  }
});

// Respond with the last meal (meaning with the maximum id)
app.get("/meals/last-meal", async (req, res, next) => {
  try {
    const lastMeal = await knex("meal").orderBy("id", "desc").first();
    if (!lastMeal) {
      const error = new Error("No meals found");
      error.status = 404;
      return next(error);
    }
    res.json(lastMeal);
  } catch (error) {
    next(error);
  }
});

// This nested router example can also be replaced with your own sub-router
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