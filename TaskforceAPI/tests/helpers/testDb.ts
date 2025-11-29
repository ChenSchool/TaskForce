import mysql from 'mysql';
import { promisify } from 'util';
import * as bcrypt from 'bcrypt';

class TestDatabase {
  private connection: mysql.Connection | null = null;
  private queryAsync: any = null;
  private executeAsync: any = null;

  async connect() {
    try {
      this.connection = mysql.createConnection({
        host: process.env.MY_SQL_DB_HOST,
        user: process.env.MY_SQL_DB_USER,
        password: process.env.MY_SQL_DB_PASSWORD,
        database: process.env.MY_SQL_DB_DATABASE,
        port: Number(process.env.MY_SQL_DB_PORT),
        multipleStatements: true
      });

      // Promisify the query method
      this.queryAsync = promisify(this.connection.query).bind(this.connection);
      this.executeAsync = this.queryAsync;
      
      // Connect
      const connectAsync = promisify(this.connection.connect).bind(this.connection);
      await connectAsync();
      
      console.log('Connected to test database:', process.env.MY_SQL_DB_DATABASE);
    } catch (error) {
      console.error('Failed to connect to test database:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      const endAsync = promisify(this.connection.end).bind(this.connection);
      await endAsync();
      console.log('Disconnected from test database');
    }
  }

  async ensureArchiveTables() {
    if (!this.connection) throw new Error('Database not connected');

    try {
      // Check if assignments table has archive columns
      const columnsResult = await this.queryAsync(
        "SHOW COLUMNS FROM assignments LIKE 'archived'"
      );

      if (columnsResult.length === 0) {
        console.log('  Adding archive columns to assignments table...');
        await this.queryAsync(`
          ALTER TABLE assignments 
          ADD COLUMN archived BOOLEAN DEFAULT FALSE,
          ADD COLUMN archived_at TIMESTAMP NULL,
          ADD INDEX idx_archived (archived)
        `);
      }

      // Check if archive_schedules has created_by column
      const scheduleColumns = await this.queryAsync(
        "SHOW COLUMNS FROM archive_schedules LIKE 'created_by'"
      );

      if (scheduleColumns.length === 0) {
        console.log('  Adding created_by column to archive_schedules...');
        await this.queryAsync(`
          ALTER TABLE archive_schedules 
          ADD COLUMN created_by INT,
          ADD CONSTRAINT fk_archive_schedules_created_by 
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
        `);
      }

      // Check archived_assignments structure
      const archivedColumns = await this.queryAsync(
        "SHOW COLUMNS FROM archived_assignments"
      );
      
      const hasOriginalId = archivedColumns.some((c: any) => c.Field === 'original_assignment_id');
      
      if (!hasOriginalId) {
        console.log('  Recreating archived_assignments table with correct schema...');
        await this.queryAsync('DROP TABLE IF EXISTS archived_assignments');
        await this.queryAsync(`
          CREATE TABLE archived_assignments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            original_assignment_id INT NOT NULL,
            task_id INT,
            personnel_id INT,
            personnel_name VARCHAR(100),
            role VARCHAR(50),
            task_description TEXT,
            task_status VARCHAR(50),
            task_date DATE,
            task_shift ENUM('1st', '2nd', '3rd'),
            aircraft_tail VARCHAR(20),
            archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            archived_by_schedule BOOLEAN DEFAULT FALSE,
            INDEX idx_archived_at (archived_at),
            INDEX idx_task_shift (task_shift),
            INDEX idx_task_date (task_date)
          )
        `);
      }

      // Check archive_logs structure
      const logColumns = await this.queryAsync(
        "SHOW COLUMNS FROM archive_logs"
      );
      
      const hasArchiveType = logColumns.some((c: any) => c.Field === 'archive_type');
      
      if (!hasArchiveType) {
        console.log('  Recreating archive_logs table with correct schema...');
        await this.queryAsync('DROP TABLE IF EXISTS archive_logs');
        await this.queryAsync(`
          CREATE TABLE archive_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            archive_type ENUM('MANUAL', 'SCHEDULED') NOT NULL,
            shift ENUM('1st', '2nd', '3rd') NOT NULL,
            assignments_archived INT DEFAULT 0,
            archive_date TIMESTAMP NOT NULL,
            triggered_by INT,
            schedule_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (triggered_by) REFERENCES users(id) ON DELETE SET NULL,
            FOREIGN KEY (schedule_id) REFERENCES archive_schedules(id) ON DELETE SET NULL,
            INDEX idx_archive_date (archive_date),
            INDEX idx_shift (shift)
          )
        `);
      }

      console.log('  Archive tables validated');
    } catch (error) {
      console.error('  Error ensuring archive tables:', error);
      throw error;
    }
  }

  async seedTestData() {
    if (!this.connection) throw new Error('Database not connected');

    try {
      console.log('Seeding test data...');
      
      await this.ensureArchiveTables();
      await this.clearAllData();

      const hashedPassword1 = await bcrypt.hash('TestPass123!', 10);
      const hashedPassword2 = await bcrypt.hash('admin123', 10);
      
      await this.queryAsync(
        `INSERT INTO users (username, email, password, name, role, is_active) VALUES
        ('testadmin', 'admin@test.com', ?, 'Test Admin', 'Manager', true),
        ('testsupervisor', 'supervisor@test.com', ?, 'Test Supervisor', 'Supervisor', true),
        ('testuser', 'user@test.com', ?, 'Test User', 'Task Viewer', true),
        ('admin', 'admin@taskforce.com', ?, 'Admin User', 'Manager', true)`,
        [hashedPassword1, hashedPassword1, hashedPassword1, hashedPassword2]
      );

      console.log('  Users seeded');

      // Don't seed aircraft - tests will create their own
      // await this.queryAsync(
      //   `INSERT INTO aircraft (tail_number) VALUES
      //   ('TEST-001'),
      //   ('TEST-002'),
      //   ('TEST-003')`
      // );
      // console.log('  ✓ Aircraft seeded');

      await this.queryAsync(
        `INSERT INTO personnel (name, specialty, role, shift) VALUES
        ('John Doe', 'A&P', 'Captain', '1st'),
        ('Jane Smith', 'Avionics', 'Coordinator', '2nd'),
        ('Bob Johnson', 'Integration', 'Collaborator', '1st'),
        ('Alice Williams', 'AMT', 'Trainee', '3rd')`
      );

      console.log('  Personnel seeded');

      // Seed some aircraft for tasks
      await this.queryAsync(
        `INSERT INTO aircraft (tail_number) VALUES
        ('SEED-001'),
        ('SEED-002'),
        ('SEED-003')`
      );

      console.log('  Aircraft seeded');

      // Seed some tasks for archive testing
      await this.queryAsync(
        `INSERT INTO tasks (aircraft_id, shift, description, status, date) VALUES
        (1, '1st', 'Test task for 1st shift', 'Complete', CURDATE()),
        (2, '2nd', 'Test task for 2nd shift', 'Complete', CURDATE()),
        (3, '3rd', 'Test task for 3rd shift', 'In Progress', CURDATE())`
      );

      console.log('  Tasks seeded');

      // Seed some assignments for archive testing
      await this.queryAsync(
        `INSERT INTO assignments (task_id, personnel_id, role, archived) VALUES
        (1, 1, 'Captain', FALSE),
        (2, 2, 'Coordinator', FALSE),
        (3, 4, 'Trainee', FALSE)`
      );

      console.log('  Assignments seeded');
      console.log('Test data seeded successfully');
    } catch (error) {
      console.error('Error seeding test data:', error);
      throw error;
    }
  }

  async clearAllData() {
    if (!this.connection) throw new Error('Database not connected');

    try {
      await this.queryAsync('SET FOREIGN_KEY_CHECKS = 0');

      const tables = [
        'audit_logs',
        'archived_assignments',
        'archive_logs',
        'archive_schedules',
        'assignments',
        'training',
        'tasks',
        'personnel',
        'aircraft',
        'refresh_tokens',
        'users'
      ];

      for (const table of tables) {
        try {
          await this.queryAsync(`TRUNCATE TABLE ${table}`);
        } catch (err: any) {
          if (!err.message.includes("doesn't exist")) {
            console.warn(`Warning: Could not truncate ${table}:`, err.message);
          }
        }
      }

      await this.queryAsync('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  async clearTransactionalData() {
    if (!this.connection) throw new Error('Database not connected');

    const tables = ['assignments', 'tasks', 'training', 'audit_logs', 'archived_assignments', 'archive_logs'];
    
    for (const table of tables) {
      try {
        await this.queryAsync(`DELETE FROM ${table}`);
      } catch (err: any) {
        if (!err.message.includes("doesn't exist")) {
          console.warn(`Warning: Could not clear ${table}:`, err.message);
        }
      }
    }
  }

  async cleanup() {
    await this.clearAllData();
    console.log('Test database cleaned');
  }

  async getTestIds() {
    if (!this.connection) throw new Error('Database not connected');

    const users = await this.queryAsync('SELECT id, role FROM users');
    const aircraft = await this.queryAsync('SELECT id FROM aircraft LIMIT 1');
    const personnel = await this.queryAsync('SELECT id FROM personnel LIMIT 1');

    return {
      adminId: users.find((u: any) => u.role === 'Manager')?.id,
      supervisorId: users.find((u: any) => u.role === 'Supervisor')?.id,
      userId: users.find((u: any) => u.role === 'Task Viewer')?.id,
      aircraftId: aircraft[0]?.id,
      personnelId: personnel[0]?.id,
    };
  }
}

export const testDb = new TestDatabase();
