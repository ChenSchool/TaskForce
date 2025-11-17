import express, { Request, Response } from 'express';
import dotenv from "dotenv";
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from './middleware/logger.middleware';
import { initializeMySqlConnector } from './services/mysql.connector';
import { initializeArchiveSchedules } from './services/archiveScheduler.service';
import aircraftRouter from './routes/aircraft.routes'; // Import aircraftRouter
import personnelRouter from './routes/personnel.routes'; // Import personnelRouter
import tasksRouter from './routes/tasks.routes'; // Import tasksRouter
import assignmentRouter from './routes/assignment.routes'; // Import assignmentRouter
import trainingRouter from './routes/training.routes'; // Import trainingRouter
import archivesRouter from './routes/archives.routes'; // Import archivesRouter
import archiveScheduleRouter from './routes/archiveSchedule.routes'; // Import archiveScheduleRouter
import authRouter from './routes/auth.routes'; // Import authRouter
import usersRouter from './routes/users.routes'; // Import usersRouter
import auditLogsRouter from './routes/auditLogs.routes'; // Import auditLogsRouter
import dashboardRouter from './routes/dashboard.routes'; // Import dashboardRouter

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to allow credentials
app.use(cors({
  origin: 'http://localhost:3000', // React app URL
  credentials: true
}));

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize MySQL connection pool
initializeMySqlConnector();
console.log('connected to DB at ' + process.env.MY_SQL_DB_HOST);

// Initialize archive scheduler (after DB connection)
initializeArchiveSchedules().then(() => {
  console.log('Archive scheduler initialized');
}).catch(err => {
  console.error('Failed to initialize archive scheduler:', err);
});

if (process.env.NODE_ENV === 'development') {
 console.log(process.env.GREETING + ' in dev mode');
 app.use(logger);
}
app.get ('/', (req: Request, res: Response) => {
    res.send ('<h1>Welcome to TaskForce</h1>') 
});

// Authentication routes (public)
app.use ('/auth', authRouter); // Use authRouter for /auth routes

// Protected routes
app.use ('/dashboard', dashboardRouter); // Use dashboardRouter for /dashboard routes
app.use ('/users', usersRouter); // Use usersRouter for /users routes
app.use ('/audit-logs', auditLogsRouter); // Use auditLogsRouter for /audit-logs routes
app.use ('/aircraft', aircraftRouter); // Use aircraftRouter for /aircraft routes
app.use ('/personnel', personnelRouter); // Use personnelRouter for /personnel routes  
app.use ('/tasks', tasksRouter); // Use tasksRouter for /tasks routes
app.use ('/assignments', assignmentRouter); // Use assignmentRouter for /assignment routes
app.use ('/training', trainingRouter); // Use trainingRouter for /training routes
app.use ('/archives', archivesRouter); // Use archivesRouter for /archives routes
app.use ('/archive-schedules', archiveScheduleRouter); // Use archiveScheduleRouter for /archive-schedules routes

// Only start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });
}

// Export app for testing
export default app;
