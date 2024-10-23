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
    const newReservation = await knex("reservation").insert(req.body);
    const [reservationId] = newReservation;
    res.status(201).json({ message: "Reservation created", id: reservationId });
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
    const result = await knex("Reservation")
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
      const error = new Error("Reservation not found");
      error.status = 404;
      return next(error);
    }
    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
