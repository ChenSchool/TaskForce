import { Request, RequestHandler, Response } from "express";
import * as AircraftDao from "../dao/aircraft.dao";
import { Aircraft } from "../models/aircraft.model";

// controller for aircraft
// This controller handles the CRUD operations for aircraft
export const getAll: RequestHandler = async (req: Request, res: Response) => { 
  try {
    const aircraft = await AircraftDao.getAllAircraft();

    res.status(200).json(aircraft);
  } catch (error) {
    console.error("[aircraft.controller][GetAircraft][Error]", error);
    res.status(500).json({ error: "Failed to fetch aircraft" });
  }
} // Get all aircraft

export const getById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const aircraftId = Number(req.params.id);
    const aircraft = await AircraftDao.getAircraftById(aircraftId);

    if (!aircraft) {
      res.status(404).json({ error: "Aircraft not found" });
      return;
    }

    res.status(200).json(aircraft);
  } catch (error) {
    console.error("[aircraft.controller][GetAircraftById][Error]", error);
    res.status(500).json({ error: "Failed to fetch aircraft" });
  }
} // Get aircraft by id

export const create: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const newAircraft: Aircraft = req.body;
    const createdAircraft = await AircraftDao.createAircraft(newAircraft);

    res.status(201).json(createdAircraft);
  } catch (error) {
    console.error("[aircraft.controller][CreateAircraft][Error]", error);
    res.status(500).json({ error: "Failed to create aircraft" });
  }
} // Create new aircraft

export const update: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const aircraftId = Number(req.params.id);
    const updatedAircraft: Aircraft = req.body;
    const result = await AircraftDao.updateAircraft(aircraftId, updatedAircraft);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Aircraft not found" });
      return;
    }

    res.status(200).json({ message: "Aircraft updated successfully" });
  } catch (error) {
    console.error("[aircraft.controller][UpdateAircraft][Error]", error);
    res.status(500).json({ error: "Failed to update aircraft" });
  }
} // Update aircraft by id

export const remove: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const aircraftId = Number(req.params.id);
    const result = await AircraftDao.deleteAircraft(aircraftId);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Aircraft not found" });
      return;
    }

    res.status(200).json({ message: "Aircraft deleted successfully" });
  } catch (error) {
    console.error("[aircraft.controller][DeleteAircraft][Error]", error);
    res.status(500).json({ error: "Failed to delete aircraft" });
  }
} // Delete aircraft by id