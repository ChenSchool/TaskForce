/**
 * Archives Controller
 * 
 * Handles HTTP requests for archive management including retrieving, creating,
 * and deleting archive snapshots of tasks, assignments, and training data.
 */

import { Request, RequestHandler, Response } from "express";
import { Archive, ArchiveRequest } from "../models/archives.model";
import * as ArchiveDao from "../dao/archives.dao";
import { OkPacket } from "mysql";

/**
 * Get all archives
 * @route GET /api/archives
 */
export const getAll: RequestHandler = async (req: Request, res: Response) => {
  try {
    const archives = await ArchiveDao.getAllArchives();
    res.status(200).json(archives);
  } catch (error) {
    console.error("[archives.controller][GetAllArchives][Error]", error);
    res.status(500).json({ error: "Failed to fetch archives" });
  }
};

/**
 * Get archive by ID with parsed JSON data
 * @route GET /api/archives/:id
 */
export const getById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const archiveId = Number(req.params.id);
    const [archive] = await ArchiveDao.getArchiveById(archiveId);

    if (!archive) {
      res.status(404).json({ error: "Archive not found" });
      return;
    }

    // Parse JSON data if it exists
    if (archive.data_json && typeof archive.data_json === 'string') {
      archive.data_json = JSON.parse(archive.data_json);
    }

    res.status(200).json(archive);
  } catch (error) {
    console.error("[archives.controller][GetArchiveById][Error]", error);
    res.status(500).json({ error: "Failed to fetch archive" });
  }
};

/**
 * Create new archive (manual archive creation)
 * Archives completed tasks, assignments, and training for a specific shift
 * @route POST /api/archives
 */
export const create: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const archiveRequest: ArchiveRequest = req.body;
    const cutoffDate = archiveRequest.cutoff_date || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Shift is required for creating archives
    if (!archiveRequest.shift) {
      res.status(400).json({ error: "Shift is required for archive creation" });
      return;
    }

    // Fetch completed data for archiving - filtered by shift
    const tasks = await ArchiveDao.getCompletedTasksForArchive(cutoffDate, archiveRequest.shift);
    const assignments = await ArchiveDao.getAssignmentsForArchive(cutoffDate, archiveRequest.shift);
    const training = await ArchiveDao.getCompletedTrainingForArchive(archiveRequest.shift);

    const dataToArchive = {
      tasks,
      assignments,
      training
    };

    // Create archive record
    const archive: Archive = {
      snapshot_date: archiveRequest.snapshot_date,
      snapshot_time: new Date().toTimeString().split(' ')[0],
      shift: archiveRequest.shift,
      aircraft_tail: archiveRequest.aircraft_tail,
      data_json: dataToArchive
    };

    const result: OkPacket = await ArchiveDao.createArchive(archive);

    res.status(201).json({ 
      id: result.insertId, 
      message: `Archive created successfully for ${archiveRequest.shift} shift`,
      record_count: tasks.length + assignments.length + training.length
    });
  } catch (error) {
    console.error("[archives.controller][CreateArchive][Error]", error);
    res.status(500).json({ error: "Failed to create archive" });
  }
};

/**
 * Delete archive by ID
 * @route DELETE /api/archives/:id
 */
export const remove: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const archiveId = Number(req.params.id);
    const result: OkPacket = await ArchiveDao.deleteArchive(archiveId);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Archive not found" });
      return;
    }

    res.status(200).json({ message: 'Archive deleted successfully' });
  } catch (error) {
    console.error("[archives.controller][DeleteArchive][Error]", error);
    res.status(500).json({ error: "Failed to delete archive" });
  }
};
