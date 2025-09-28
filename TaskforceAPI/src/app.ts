import express, { Request, Response } from 'express';
import dotenv from "dotenv";
import helmet from 'helmet';
import cors from 'cors';
import logger from './middleware/logger.middleware';
import { initializeMySqlConnector } from './services/mysql.connector';
import aircraftRouter from './routes/aircraft.routes'; // Import aircraftRouter
import personnelRouter from './routes/personnel.routes'; // Import personnelRouter
import tasksRouter from './routes/tasks.routes'; // Import tasksRouter
import assignmentRouter from './routes/assignment.routes'; // Import assignmentRouter

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize MySQL connection pool
initializeMySqlConnector();
console.log('connected to DB at ' + process.env.MY_SQL_DB_HOST);

if (process.env.NODE_ENV === 'development') {
 console.log(process.env.GREETING + ' in dev mode');
 app.use(logger);
}
app.get ('/', (req: Request, res: Response) => {
    res.send ('<h1>Welcome to TaskForce</h1>') 
});

app.use ('/aircraft', aircraftRouter); // Use aircraftRouter for /aircraft routes
app.use ('/personnel', personnelRouter); // Use personnelRouter for /personnel routes  
app.use ('/tasks', tasksRouter); // Use tasksRouter for /tasks routes
app.use ('/assignments', assignmentRouter); // Use assignmentRouter for /assignment routes

app.listen(port, () => {
 console.log(`Example app listening at http://localhost:${port}`)
});
