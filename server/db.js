/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import { Pool } from 'pg';
import environment from './config/environments';

const pool = new Pool({
  connectionString: environment.dbUrl,
});

pool.on('connect', () => {
  console.log('Database successfully connected');
});

pool.on('error', (err) => {
  console.error('Error acquiring client', err.message);
});

const createTables = () => new Promise(async (resolve, reject) => {
  console.log('Creating tables');
  const queryText = `
    CREATE TABLE IF NOT EXISTS
    users(
      id SERIAL PRIMARY KEY,
      firstName VARCHAR(128) NOT NULL,
      lastName VARCHAR(128) NOT NULL,
      password VARCHAR(128) NOT NULL,
      email VARCHAR(128) UNIQUE NOT NULL
    );
    CREATE TABLE IF NOT EXISTS
    groups(
      id SERIAL PRIMARY KEY,
      name VARCHAR(128) NOT NULL,
      ownerId INTEGER REFERENCES users(id) 
    );
    CREATE TABLE IF NOT EXISTS
    group_members(
      id SERIAL PRIMARY KEY,
      groupId INTEGER REFERENCES groups(id),
      memberId INTEGER REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS
    messages(
      id SERIAL PRIMARY KEY,
      senderId INTEGER REFERENCES users(id),
      receiverId INTEGER REFERENCES users(id),
      parentMessageId INTEGER REFERENCES messages(id),
      subject VARCHAR(128) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(10) NOT NULL,
      createdOn TIMESTAMP
    );
  `;

  try {
    await pool.query(queryText);
    resolve();
  } catch (error) {
    reject(error);
  }
});

const dropTables = async () => new Promise(async (resolve, reject) => {
  console.log('Dropping tables');
  const queryText = `
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS messages CASCADE;
    DROP TABLE IF EXISTS groups CASCADE;
    DROP TABLE IF EXISTS group_members CASCADE;
  `;

  try {
    await pool.query(queryText);
    resolve();
  } catch (error) {
    reject(error);
  }
});

export { createTables, dropTables };
