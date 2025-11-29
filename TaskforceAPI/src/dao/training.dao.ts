/**
 * Training data access object (DAO) module.
 * Provides database operations for training record management and statistics.
 */
import { OkPacket } from 'mysql';
import { execute } from '../services/mysql.connector';
import { Training, TrainingView } from '../models/training.model';
import { trainingQueries } from '../queries/training.queries';

/** Fetch all training records. */
export const getAllTraining = async () => {
  return await execute<TrainingView[]>(trainingQueries.getAllTraining, []);
};

/** Fetch a training record by ID. */
export const getTrainingById = async (id: number) => {
  return await execute<TrainingView[]>(trainingQueries.getTrainingById, [id]);
};

/** Fetch all training records for a specific personnel member. */
export const getTrainingByPersonnelId = async (personnelId: number) => {
  return await execute<TrainingView[]>(trainingQueries.getTrainingByPersonnelId, [personnelId]);
};

/** Create a new training record. */
export const createTraining = async (training: Training) => {
  return await execute<OkPacket>(trainingQueries.createTraining, [
    training.personnel_id,
    training.phase,
    training.progress || 0,
    training.complete ? 1 : 0
  ]);
};

/** Update an existing training record. */
export const updateTraining = async (id: number, training: Training) => {
  return await execute<OkPacket>(trainingQueries.updateTraining, [
    training.personnel_id,
    training.phase,
    training.progress || 0,
    training.complete ? 1 : 0,
    id
  ]);
};

/** Delete a training record by ID. */
export const deleteTraining = async (id: number) => {
  return await execute<OkPacket>(trainingQueries.deleteTraining, [id]);
};

/** Fetch training completion statistics. */
export const getTrainingStats = async () => {
  return await execute<any[]>(trainingQueries.getTrainingStats, []);
};
