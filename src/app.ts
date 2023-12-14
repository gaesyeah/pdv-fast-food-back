import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';
import { connectDb, disconnectDB, loadEnv } from './config';

loadEnv();

const app = express();
app.use(cors(), express.json());

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
