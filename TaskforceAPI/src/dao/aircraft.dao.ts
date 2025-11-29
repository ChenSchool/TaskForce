/**
 * Aircraft Data Access Object (DAO)
 * Handles database operations for aircraft records
 * Executes SQL queries defined in aircraft.queries
 */
import { OkPacket } from "mysql";
import { execute } from "../services/mysql.connector";
import { Aircraft } from "../models/aircraft.model";
import { aircraftQueries } from "../queries/aircraft.queries";

// Fetch all aircraft from database
export const getAllAircraft = async () => {
  return await execute<Aircraft[]>(aircraftQueries.allAircraft, []);
};

// Fetch single aircraft by ID
export const getAircraftById = async (id: number) => {
  return await execute<Aircraft[]>(aircraftQueries.aircraftById, [id]);
};

// Insert new aircraft record
export const createAircraft = async (aircraft: Aircraft) => {
  return await execute<OkPacket>(aircraftQueries.insertAircraft, [
    aircraft.tail_number,
  ]);
};

// Update existing aircraft record
export const updateAircraft = async (id: number, aircraft: Aircraft) => {
  return await execute<OkPacket>(aircraftQueries.updateAircraft, [
    aircraft.tail_number,
    id,
  ]);
};

// Delete aircraft record by ID
export const deleteAircraft = async (id: number) => {
  return await execute<OkPacket>(aircraftQueries.deleteAircraft, [id]);
};
