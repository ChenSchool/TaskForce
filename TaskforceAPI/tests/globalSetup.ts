import * as dotenv from 'dotenv';
import * as path from 'path';
import { testDb } from './helpers/testDb';

export default async () => {
  // Load test environment variables before anything else
  dotenv.config({ path: path.resolve(__dirname, '../.env.test') });
  
  console.log('\n====================================');
  console.log('Loading Test Environment');
  console.log('====================================');
  console.log(`Database: ${process.env.MY_SQL_DB_DATABASE}`);
  console.log(`Host: ${process.env.MY_SQL_DB_HOST}:${process.env.MY_SQL_DB_PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log('====================================\n');
  
  // Connect and seed the database
  await testDb.connect();
  await testDb.seedTestData();
  await testDb.disconnect();
};
