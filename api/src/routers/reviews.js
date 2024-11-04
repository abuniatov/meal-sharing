import express from "express";
import knex from "../database_client.js";

const reviewRouter = express.Router();

// Return all reviews
reviewRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await knex("review");
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

// Return all reviews for a specific meal
reviewRouter.get("/meals/:meal_id/reviews", async (req, res, next) => {
  try {
    const mealId = req.params.meal_id;
    const mealReviews = await knex("review").where({ meal_id: mealId });
    res.json(mealReviews);
  } catch (error) {
    next(error);
  }
});

// Add a new review to the database
reviewRouter.post("/", async (req, res, next) => {
  try {
    const data = req.body;

    // Basic validation for required fields
    if (
      !data.meal_id ||
      !data.stars ||
      !data.description ||
      isNaN(data.stars)
    ) {
      return res.status(400).json({ error: "Invalid data" });
    }

    await knex("review").insert(data);
    res.status(201).json({ message: "Review created successfully." });
  } catch (error) {
    next(error);
  }
});

// Return a review by id
reviewRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const getReviewById = await knex("review").where({ id }).first();
    if (!getReviewById) {
      return res.status(404).json({ error: "Review not found." });
    }
    res.json(getReviewById);
  } catch (error) {
    next(error);
  }
});

// Update the review by id
reviewRouter.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    await knex("review").where({ id }).update(updateData);
    res.json({ message: "Review updated successfully." });
  } catch (error) {
    next(error);
  }
});

// Delete the review by id
reviewRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleteReview = await knex("review").where({ id }).del();
    if (!deleteReview) {
      return res.status(404).json({ error: "Review not found" });
    } else {
      res.status(200).json({ message: "Review deleted successfully." });
    }
  } catch (error) {
    next(error);
  }
});

export default reviewRouter;
