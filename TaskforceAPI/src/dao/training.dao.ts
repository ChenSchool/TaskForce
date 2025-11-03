import { OkPacket } from 'mysql';
import { execute } from '../services/mysql.connector';
import { Training, TrainingView } from '../models/training.model';
import { trainingQueries } from '../queries/training.queries';

export const getAllTraining = async () => {
  return await execute<TrainingView[]>(trainingQueries.getAllTraining, []);
};

export const getTrainingById = async (id: number) => {
  return await execute<TrainingView[]>(trainingQueries.getTrainingById, [id]);
};

export const getTrainingByPersonnelId = async (personnelId: number) => {
  return await execute<TrainingView[]>(trainingQueries.getTrainingByPersonnelId, [personnelId]);
};

export const createTraining = async (training: Training) => {
  return await execute<OkPacket>(trainingQueries.createTraining, [
    training.personnel_id,
    training.phase,
    training.progress || 0,
    training.complete ? 1 : 0
  ]);
};

export const updateTraining = async (id: number, training: Training) => {
  return await execute<OkPacket>(trainingQueries.updateTraining, [
    training.personnel_id,
    training.phase,
    training.progress || 0,
    training.complete ? 1 : 0,
    id
  ]);
};

export const deleteTraining = async (id: number) => {
  return await execute<OkPacket>(trainingQueries.deleteTraining, [id]);
};

export const getTrainingStats = async () => {
  return await execute<any[]>(trainingQueries.getTrainingStats, []);
};
