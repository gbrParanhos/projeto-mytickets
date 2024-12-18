import app from "../src/app";
import { connectDb } from "./db";
import { Express } from 'express';

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}