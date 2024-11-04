import express from "express";
import knex from "../database_client.js";

const router = express.Router();

// Returns all meals with query parameters for filtering and sorting
router.get("/", async (req, res, next) => {
  try {
    let query = knex("meal");

    // Filtering by maxPrice
    if (req.query.maxPrice) {
      query = query.where("price", "<=", req.query.maxPrice);
    }

    // Filtering by availableReservations
    if (req.query.availableReservations) {
      const available = req.query.availableReservations === "true";
      if (available) {
        query = query.where("available_spots", ">", 0);
      } else {
        query = query.where("available_spots", "=", 0);
      }
    }

    // Filtering by title
    if (req.query.title) {
      query = query.where("title", "like", `%${req.query.title}%`);
    }

    // Filtering by dateAfter
    if (req.query.dateAfter) {
      query = query.where("when", ">", req.query.dateAfter);
    }

    // Filtering by dateBefore
    if (req.query.dateBefore) {
      query = query.where("when", "<", req.query.dateBefore);
    }

    // Sorting by sortKey and sortDir
    if (req.query.sortKey) {
      const sortDir = req.query.sortDir || "asc"; // Default to ascending
      query = query.orderBy(req.query.sortKey, sortDir);
    }

    // Limiting the number of meals
    if (req.query.limit) {
      query = query.limit(parseInt(req.query.limit));
    }

    const meals = await query;
    res.json(meals);
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