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
        res.json(newReservation);
    } catch (error) {
        next(error);
    }
});

