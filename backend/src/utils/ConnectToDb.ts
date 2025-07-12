import postgres from 'postgres';
import config from 'config';

export default async function connectToDatabase() {
  const connectionString = config.get<string>('DATABASE_URL');
  try {
    console.log('Connecting to the database...');
    const sql = postgres(connectionString, {
      max: config.get<number>('db.maxConnections'),
      idle_timeout: config.get<number>('db.idleTimeout'),
    });
    await sql`SELECT 1`;
    console.log('Connected to the database successfully');
    return sql;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}