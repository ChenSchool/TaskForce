import { Request, RequestHandler, Response } from "express";
import { Training } from "../models/training.model";
import * as TrainingDao from "../dao/training.dao";
import { OkPacket } from "mysql";

// Get all training records
export const getAll: RequestHandler = async (req: Request, res: Response) => {
  try {
    const training = await TrainingDao.getAllTraining();
    res.status(200).json(training);
  } catch (error) {
    console.error("[training.controller][GetAllTraining][Error]", error);
    res.status(500).json({ error: "Failed to fetch training records" });
  }
};

// Get training by ID
export const getById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const trainingId = Number(req.params.id);
    const [training] = await TrainingDao.getTrainingById(trainingId);

    if (!training) {
      res.status(404).json({ error: "Training record not found" });
      return;
    }

    res.status(200).json(training);
  } catch (error) {
    console.error("[training.controller][GetTrainingById][Error]", error);
    res.status(500).json({ error: "Failed to fetch training record" });
  }
};

// Get training by personnel ID
export const getByPersonnelId: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const personnelId = Number(req.params.personnelId);
    const training = await TrainingDao.getTrainingByPersonnelId(personnelId);

    res.status(200).json(training);
  } catch (error) {
    console.error("[training.controller][GetTrainingByPersonnelId][Error]", error);
    res.status(500).json({ error: "Failed to fetch training records for personnel" });
  }
};

// Create new training record
export const create: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const newTraining: Training = req.body;
    const result: OkPacket = await TrainingDao.createTraining(newTraining);

    res.status(201).json({ id: result.insertId, message: "Training record created successfully" });
  } catch (error) {
    console.error("[training.controller][CreateTraining][Error]", error);
    res.status(500).json({ error: "Failed to create training record" });
  }
};

// Update training record
export const update: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const trainingId = Number(req.params.id);
    const updatedTraining: Training = req.body;
    const result: OkPacket = await TrainingDao.updateTraining(trainingId, updatedTraining);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Training record not found" });
      return;
    }

    res.status(200).json({ message: "Training record updated successfully" });
  } catch (error) {
    console.error("[training.controller][UpdateTraining][Error]", error);
    res.status(500).json({ error: "Failed to update training record" });
  }
};

// Delete training record
export const remove: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const trainingId = Number(req.params.id);
    const result: OkPacket = await TrainingDao.deleteTraining(trainingId);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Training record not found" });
      return;
    }

    res.status(200).json({ message: 'Training record deleted successfully' });
  } catch (error) {
    console.error("[training.controller][DeleteTraining][Error]", error);
    res.status(500).json({ error: "Failed to delete training record" });
  }
};

// Get training statistics
export const getStats: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const [stats] = await TrainingDao.getTrainingStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("[training.controller][GetTrainingStats][Error]", error);
    res.status(500).json({ error: "Failed to fetch training statistics" });
  }
};
