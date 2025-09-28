import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const getProcessingTimeInMs = (time: [number, number]): string => {
    return `${(time[0] * 1000 + time[1]/ 1e6).toFixed(2)}ms`
} 

/***
 * Logger middleware for Express.js
 * This middleware logs the request and response details, including the processing time.
 * It generates a unique identifier for each request and logs the start and end times.
 * 
 * @param req Express.Request
 * @param res Express.Response
 * @param next Express.NextFunction
 */
export default function logger(req: Request, res: Response, next: NextFunction){
    // generate unique identifier
    const id = uuidv4();

    // get timestamp
    const now = new Date();
    const timestamp = [now.getFullYear(), '-', now.getMonth() + 1, '-', now.getDate(), ' ', now.getHours(), ':', now.getMinutes(), ':', now.getSeconds()].join(' ');

    //get api endpoint
    const { method, url } = req;

    //log start of the execution process
    const start = process.hrtime();
    const startText = `START:${getProcessingTimeInMs(start)}`;
    const idText = `[${id}]`;
    const timeStampText = `[${timestamp}]`;

    // all components are ready, show the entry
    console.log(`${idText}${timeStampText} ${method}:${url} ${startText}`);

    // trigger once a response is sent to the client
    res.once('finish', () => {
        // log end of the execution process
        const end = process.hrtime(start);
        const endText = `END:${getProcessingTimeInMs(end)}`;
        console.log(`${idText}${timeStampText} ${method}:${url} ${res.statusCode} ${endText}`);
    });

    // execute next middleware/event handler
    next();
};