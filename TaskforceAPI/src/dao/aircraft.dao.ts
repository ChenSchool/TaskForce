import { OkPacket } from "mysql";
import { execute } from "../services/mysql.connector";
import { Aircraft } from "../models/aircraft.model";
import { aircraftQueries } from "../queries/aircraft.queries";

export const getAllAircraft = async () => {
  return await execute<Aircraft[]>(aircraftQueries.allAircraft, []);
};

export const getAircraftById = async (id: number) => {
  return await execute<Aircraft[]>(aircraftQueries.aircraftById, [id]);
};

export const createAircraft = async (aircraft: Aircraft) => {
  return await execute<OkPacket>(aircraftQueries.insertAircraft, [
    aircraft.tail_number,
  ]);
};

export const updateAircraft = async (id: number, aircraft: Aircraft) => {
  return await execute<OkPacket>(aircraftQueries.updateAircraft, [
    aircraft.tail_number,
    id,
  ]);
};

export const deleteAircraft = async (id: number) => {
  return await execute<OkPacket>(aircraftQueries.deleteAircraft, [id]);
};


