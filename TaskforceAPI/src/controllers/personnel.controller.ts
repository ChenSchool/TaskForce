/**
 * Personnel controller module.
 * Handles HTTP request logic for personnel CRUD operations.
 */
import {Request, RequestHandler, Response} from 'express';
import * as PersonnelDao from '../dao/personnel.dao';
import {Personnel} from '../models/personnel.model';
import {OkPacket} from 'mysql';

/**
 * Fetch all personnel records.
 */
export const getAll: RequestHandler = async (req: Request, res: Response) => {
  try {
    const personnel = await PersonnelDao.getAllPersonnel();
    res.status(200).json(personnel);
  } catch (error) {
    console.error('[personnel.controller][GetAllPersonnel][Error]', error);
    res.status(500).json({error: 'Failed to fetch personnel'});
  }
};

/**
 * Fetch all personnel for a specific shift.
 */
export const getByShift: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const shift = req.params.shift;
    const personnel = await PersonnelDao.getPersonnelByShift(shift);
    res.status(200).json(personnel);
  } catch (error) {
    console.error('[personnel.controller][GetPersonnelByShift][Error]', error);
    res.status(500).json({error: 'Failed to fetch personnel for shift'});
  }
};

/**
 * Fetch a single personnel record by ID.
 */
export const getById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const personnelId = Number(req.params.id);
    const [personnel] = await PersonnelDao.getPersonnelById(personnelId);

    if (!personnel) {
      res.status(404).json({error: 'Personnel not found'});
      return;
    }

    res.status(200).json(personnel);
  } catch (error) {
    console.error('[personnel.controller][GetPersonnelById][Error]', error);
    res.status(500).json({error: 'Failed to fetch personnel'});
  }
};

/**
 * Create a new personnel record.
 */
export const create: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const newPersonnel: Personnel = req.body;
    const result: OkPacket = await PersonnelDao.createPersonnel(newPersonnel);

    res.status(201).json({id: result.insertId});
  } catch (error) {
    console.error('[personnel.controller][CreatePersonnel][Error]', error);
    res.status(500).json({error: 'Failed to create personnel'});
  }
};

/**
 * Update an existing personnel record.
 */
export const update: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const personnelId = Number(req.params.id);
    const updatedPersonnel: Personnel = req.body;
    const result: OkPacket = await PersonnelDao.updatePersonnel(personnelId, updatedPersonnel);

    if (result.affectedRows === 0) {
      res.status(404).json({error: 'Personnel not found'});
      return;
    }

    res.status(200).json({message: 'Personnel updated successfully'});
  } catch (error) {
    console.error('[personnel.controller][UpdatePersonnel][Error]', error);
    res.status(500).json({error: 'Failed to update personnel'});
  }
};

/**
 * Delete a personnel record by ID.
 */
export const remove: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const personnelId = Number(req.params.id);
    const result: OkPacket = await PersonnelDao.deletePersonnel(personnelId);

    if (result.affectedRows === 0) {
      res.status(404).json({error: 'Personnel not found'});
      return;
    }

    res.status(200).json({message: 'Personnel deleted successfully'});
  } catch (error) {
    console.error('[personnel.controller][DeletePersonnel][Error]', error);
    res.status(500).json({error: 'Failed to delete personnel'});
  }
};
