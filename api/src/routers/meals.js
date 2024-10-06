import express from "express";
import knex from "../database_client.js";

const router = express.Router();

// Returns all meals
router.get("/", async (req, res, next) => {
  try {
    const allMeals = await knex("meal");
    res.json(allMeals);
  } catch (error) {
    next(error);
  }
});

// Insert new meal
router.post("/", async (req, res, next) => {
  try {
    const newMeal = await knex("meal").insert(req.body);
    res.json(newMeal);
  } catch (error) {
    next(error);
  }
});

// Return the meal by id
router.get("/:id", async (req, res, next) => {
  try {
    const meal = await knex("meal").where("id", req.params.id).first();
    if (!meal) {
      const error = new Error("Meal not found");
      error.status = 404;
      return next(error);
    }
    res.json(meal);
  } catch (error) {
    next(error);
  }
});

// Update the meal by id
router.put("/:id", async (req, res, next) => {
  try {
    const updatedMeal = await knex("meal")
      .where("id", req.params.id)
      .update(req.body);
    if (!updatedMeal) {
      const error = new Error("Meal not found");
      error.status = 404;
      return next(error);
    }
    res.status(200).json({ message: "Meal updated successfully" });
  } catch (error) {
    next(error);
  }
});

// Delete the meal by id
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedMeal = await knex("meal").where("id", req.params.id).del();
    if (!deletedMeal) {
      const error = new Error("Meal not found");
      error.status = 404;
      return next(error);
    }
    res.status(200).json({ message: "Meal deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;