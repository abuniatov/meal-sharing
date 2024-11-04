import express from "express";
import knex from "../database_client.js";

const router = express.Router();

// Return all reservations
router.get("/", async (req, res, next) => {
  try {
    const allReservations = await knex("reservation");
    res.json(allReservations);
  } catch (error) {
    next(error);
  }
});

// Insert new reservation
router.post("/", async (req, res, next) => {
  try {
    const newReservation = req.body;

    // Validation for required fields
    const [reservationId] = await knex("reservation").insert(newReservation);
    if (reservationId) {
      res
        .status(201)
        .json({ message: "Reservation created", id: reservationId });
    } else {
      res.status(400).json({ message: "Failed to create reservation" });
    }
  } catch (error) {
    next(error);
  }
});

// Return the reservation by id
router.get("/:id", async (req, res, next) => {
  try {
    const reservation = await knex("reservation")
      .where("id", req.params.id)
      .first();
    if (reservation) {
      res.json(reservation);
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    next(error);
  }
});

// Update the reservation by id
router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedReservation = req.body;

    // Validation for required fields
    const result = await knex("reservation")
      .where("id", id)
      .update(updatedReservation);

    if (result) {
      res.status(200).json({ message: "Reservation updated successfully" });
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    next(error);
  }
});

// Delete the reservation by id
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedReservation = await knex("reservation")
      .where("id", req.params.id)
      .del();
    if (!deletedReservation) {
      res.status(404).json({ message: "Reservation not found" });
    } else {
      res.status(200).json({ message: "Reservation deleted successfully" });
    }
  } catch (error) {
    next(error);
  }
});

export default router;